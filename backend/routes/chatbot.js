const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { getDB } = require('../database/db');
const { retrieveContext, retrieveContextScored, getTopScore, buildRAGPrompt, isLowConfidence, buildDirectAnswer, isGreeting, GREETING_RESPONSE } = require('../lib/rag-engine');
const { UAF_KNOWLEDGE_BASE } = require('../lib/uaf-knowledge-base');

// ── Tavily Web Search (live web-augmented RAG) ────────────────────────────────
async function searchWeb(query) {
    if (!process.env.TAVILY_API_KEY) return [];
    try {
        const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query: `UAF University of Agriculture Faisalabad ${query}`,
                search_depth: 'basic',
                max_results: 3,
                include_domains: ['uaf.edu.pk', 'nts.org.pk', 'hec.gov.pk', 'pmln.org.pk'],
                include_answer: true
            })
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || [];
    } catch (_) { return []; }
}

// In-memory session conversation history (last 10 messages per session)
const sessionHistory = new Map();

function getHistory(sessionId) {
    return sessionHistory.get(sessionId) || [];
}

function addToHistory(sessionId, role, content) {
    const history = getHistory(sessionId);
    history.push({ role, content });
    if (history.length > 10) history.splice(0, history.length - 10);
    sessionHistory.set(sessionId, history);
}

function tryGetUser(req) {
    try {
        const h = req.headers['authorization'];
        if (!h || !h.startsWith('Bearer ')) return null;
        return jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    } catch (_) { return null; }
}

// FR04 — Human escalation response
const ESCALATION_RESPONSE =
    "I don't have specific information about that in my knowledge base. " +
    "For accurate help, please contact UAF directly:\n" +
    "📞 +92-41-9200161  |  ✉️ info@uaf.edu.pk\n" +
    "Or visit the Registrar Office during working hours (Mon–Fri 8:30AM–4:30PM).\n" +
    "[Escalated to human support]";

// POST /api/chatbot  — main RAG chat endpoint
router.post('/', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, response: 'Message is required.' });
        }

        const user    = tryGetUser(req);
        const session = user ? `user_${user.id}` : (sessionId || 'anonymous');
        const history = getHistory(session);

        // ── Greeting shortcut: skip RAG for hi/hello/help queries ───────────
        if (isGreeting(message.trim())) {
            addToHistory(session, 'user', message.trim());
            addToHistory(session, 'assistant', GREETING_RESPONSE);
            return res.json({ success: true, response: GREETING_RESPONSE, escalated: false, context_used: [] });
        }

        // ── RAG: Retrieve relevant context with confidence score ─────────────
        const scored  = retrieveContextScored(message.trim());
        const context = scored.map(s => s.entry);
        const topScore = getTopScore(scored);

        // ── Web Search: trigger when KB match is weak or missing ─────────────
        // topScore < 6 means the KB didn't find a confident match
        const needsWeb = topScore < 6;
        const webContext = needsWeb ? await searchWeb(message.trim()) : [];

        let response;
        let escalated = false;

        if (isLowConfidence(context) && webContext.length === 0) {
            // FR04 — nothing in KB and no web results → escalate
            response  = ESCALATION_RESPONSE;
            escalated = true;
        } else if (process.env.OPENAI_API_KEY) {
            // FR01 — Hybrid RAG: KB + optional web results → GPT-4o
            const messages = buildRAGPrompt(message.trim(), context, history, webContext);
            try {
                const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: process.env.OPENAI_MODEL || 'gpt-4o',
                        messages,
                        max_tokens: 1500,
                        temperature: 0.3
                    })
                });
                const oaiData = await oaiRes.json();
                response = oaiData.choices?.[0]?.message?.content || buildDirectAnswer(context);
            } catch (_) {
                response = buildDirectAnswer(context);
            }
        } else {
            // FR02 — no OpenAI key: direct KB answer only
            response = buildDirectAnswer(context);
        }

        // FR03 — store conversation history in session
        addToHistory(session, 'user', message.trim());
        addToHistory(session, 'assistant', response);

        // Persist to DB (non-critical)
        try {
            const db = getDB();
            await db.execute(
                'INSERT INTO chat_logs (session_id, user_message, bot_response) VALUES (?, ?, ?)',
                [session, message.slice(0, 500), response.slice(0, 2000)]
            );
            // If escalated, also log to student_queries for admin visibility
            if (escalated) {
                await db.execute(
                    'INSERT INTO student_queries (student_name, student_email, query_text, menu_path, is_resolved) VALUES (?, ?, ?, ?, ?)',
                    ['Anonymous', 'N/A', message.slice(0, 500), 'RAG-Escalated', 0]
                );
            }
        } catch (_) { /* non-critical */ }

        res.json({
            success: true,
            response,
            escalated,
            context_used: context.map(c => ({ id: c.id, category: c.category })),
            web_used: webContext.length > 0,
            kb_confidence: topScore
        });
    } catch (err) {
        console.error('[Chatbot RAG]:', err);
        res.status(500).json({ success: false, response: 'Sorry, I encountered an error. Please try again.' });
    }
});

// GET /api/chatbot/history — last 20 messages for logged-in user
router.get('/history', async (req, res) => {
    const user = tryGetUser(req);
    if (!user) return res.status(401).json({ success: false, message: 'Please log in to view chat history.' });
    try {
        const db   = getDB();
        const logs = await db.query(
            'SELECT user_message, bot_response, created_at FROM chat_logs WHERE session_id = ? ORDER BY created_at DESC LIMIT 20',
            [`user_${user.id}`]
        );
        res.json({ success: true, history: logs.reverse() });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// GET /api/chatbot/knowledge-base — returns KB entries for admin viewer
router.get('/knowledge-base', (req, res) => {
    const entries = UAF_KNOWLEDGE_BASE.map(e => ({
        id: e.id,
        category: e.category,
        question: e.question,
        keywords: e.keywords
    }));
    res.json({ success: true, entries, total: entries.length });
});

module.exports = router;
