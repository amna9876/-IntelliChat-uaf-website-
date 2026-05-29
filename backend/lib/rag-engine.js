const { UAF_KNOWLEDGE_BASE } = require('./uaf-knowledge-base');

// Common English stop words that should not influence KB scoring
const STOP_WORDS = new Set([
    'the','are','what','how','tell','about','me','is','in','at','for','of','and',
    'to','do','does','can','where','when','which','who','why','a','an','it','its',
    'be','have','has','was','were','will','my','your','our','their','this','that',
    'these','those','i','we','you','they','he','she','on','by','with','from','or',
    'not','but','if','so','as','up','all','any','get','did','had','him','her','his',
    'us','into','than','then','also','no','yes','want','need','please','give','some',
    'more','like','just','very','much','too','also','only','even','such','each','per'
]);

/**
 * FR02 — Retrieval-Augmented Generation engine
 * Retrieves the most relevant knowledge base entries for a user query.
 */
function retrieveContext(userQuery) {
    const query = userQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

    const scored = UAF_KNOWLEDGE_BASE.map(entry => {
        let score = 0;

        // +3 per matching keyword
        entry.keywords.forEach(kw => {
            if (query.includes(kw.toLowerCase())) score += 3;
        });

        // +5 if query words appear in the question
        const q = entry.question.toLowerCase();
        queryWords.forEach(word => {
            if (q.includes(word)) score += 5;
        });

        // +2 if query words appear in the answer
        const a = entry.answer.toLowerCase();
        queryWords.forEach(word => {
            if (a.includes(word)) score += 2;
        });

        return { entry, score };
    });

    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => s.entry);
}

/**
 * FR03 — Build a RAG-enhanced prompt for the LLM (OpenAI).
 * Returns null when no context is found (triggers FR04 escalation).
 */
function buildRAGPrompt(userQuery, retrievedContext, conversationHistory = []) {
    if (!retrievedContext || retrievedContext.length === 0) return null;

    const contextBlock = retrievedContext
        .map(e => `[${e.category}] Q: ${e.question}\nA: ${e.answer}`)
        .join('\n\n');

    const historyBlock = conversationHistory
        .slice(-4)
        .map(m => `${m.role === 'user' ? 'Student' : 'IntelliChat'}: ${m.content}`)
        .join('\n');

    return [
        {
            role: 'system',
            content: `You are UAF IntelliChat, the official AI chatbot for University of Agriculture Faisalabad (UAF), Pakistan.
Answer ONLY using the knowledge provided below. Be concise, friendly, and accurate.
Do NOT make up information not present in the knowledge base.
If the user's specific sub-question is not fully covered, say what you know and suggest contacting UAF directly.

KNOWLEDGE BASE:
${contextBlock}

${historyBlock ? `RECENT CONVERSATION:\n${historyBlock}` : ''}`
        },
        {
            role: 'user',
            content: userQuery
        }
    ];
}

/**
 * FR04 — Human Escalation check.
 * Returns true if no relevant UAF knowledge was found.
 */
function isLowConfidence(retrievedContext) {
    return !retrievedContext || retrievedContext.length === 0;
}

/**
 * Build a direct answer from the knowledge base (used when OpenAI is not available).
 * Returns the best matching entry's answer, or null if no match.
 */
function buildDirectAnswer(retrievedContext) {
    if (!retrievedContext || retrievedContext.length === 0) return null;
    const best = retrievedContext[0];
    const extras = retrievedContext.slice(1, 3);
    let answer = best.answer;
    if (extras.length > 0) {
        answer += '\n\n' + extras.map(e => `Also: ${e.answer}`).join('\n\n');
    }
    return answer;
}

module.exports = { retrieveContext, buildRAGPrompt, isLowConfidence, buildDirectAnswer };
