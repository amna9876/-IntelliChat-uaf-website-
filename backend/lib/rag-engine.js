const { UAF_KNOWLEDGE_BASE } = require('./uaf-knowledge-base');

// Common English stop words that should not influence KB scoring
const STOP_WORDS = new Set([
    'the','are','what','how','tell','about','me','is','in','at','for','of','and',
    'to','do','does','can','where','when','which','who','why','a','an','it','its',
    'be','have','has','was','were','will','my','your','our','their','this','that',
    'these','those','i','we','you','they','he','she','on','by','with','from','or',
    'not','but','if','so','as','up','all','any','get','did','had','him','her','his',
    'us','into','than','then','also','no','yes','want','need','please','give','some',
    'more','like','just','very','much','too','also','only','even','such','each','per',
    'available','provide','provided','offers','offered','there','ok','am','pm','go'
]);

// Greeting/intro detection
const GREETING_SET = new Set([
    'hi','hello','hey','salam','salaam','aoa','assalam','assalamualaikum',
    'hola','greetings','howdy','yo','sup'
]);

const HELP_PATTERNS = [
    /^(what|how) can (you|i)/i,
    /what do you (know|cover|offer|help)/i,
    /what (topics|things|questions|info|information)/i,
    /help me$/i,
    /^help$/i,
    /capabilities/i,
    /^(menu|options)$/i,
    /how are you/i,
    /good (morning|afternoon|evening|day)/i,
];

const GREETING_RESPONSE =
    "Hello! I'm UAF IntelliChat — your AI assistant for the University of Agriculture Faisalabad. 👋\n\n" +
    "I can help you with:\n" +
    "• **Admissions** — programs, entry tests, merit criteria\n" +
    "• **Fees** — semester fees, vouchers, scholarships\n" +
    "• **Hostels** — how to apply, facilities, warden contacts\n" +
    "• **Departments** — faculties, contacts, programs offered\n" +
    "• **Exams** — date sheets, results, rechecking\n" +
    "• **Scholarships** — Honhaar, HDF, need-based aid\n" +
    "• **Facilities** — library, health center, sports, cafeteria, WiFi\n" +
    "• **Transport** — campus bus routes and passes\n" +
    "• **Events & Societies** — Jashn-e-Bahara, Gur Mela, clubs\n\n" +
    "Just ask me anything about UAF! 🌿";

function isGreeting(query) {
    const q = query.toLowerCase().trim().replace(/[!.,?]+$/, '');
    if (GREETING_SET.has(q)) return true;
    // starts with a greeting word
    for (const g of GREETING_SET) {
        if (q.startsWith(g + ' ') || q.startsWith(g + ',')) return true;
    }
    for (const pat of HELP_PATTERNS) {
        if (pat.test(q)) return true;
    }
    return false;
}

/**
 * FR02 — Retrieval-Augmented Generation engine
 * Retrieves the most relevant knowledge base entries for a user query.
 * Returns entries with scores so callers can judge confidence.
 */
function retrieveContextScored(userQuery) {
    const query = userQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
    if (queryWords.length === 0) return [];

    return UAF_KNOWLEDGE_BASE.map(entry => {
        let score = 0;

        entry.keywords.forEach(kw => {
            const kwLower = kw.toLowerCase();
            if (query.includes(kwLower)) {
                score += 3;
            } else {
                queryWords.forEach(word => {
                    if (word.length > 2 && kwLower.includes(word)) score += 1;
                });
            }
        });

        const q = entry.question.toLowerCase();
        queryWords.forEach(word => { if (q.includes(word)) score += 5; });

        const a = entry.answer.toLowerCase();
        queryWords.forEach(word => { if (a.includes(word)) score += 2; });

        return { entry, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function retrieveContext(userQuery) {
    return retrieveContextScored(userQuery).map(s => s.entry);
}

function getTopScore(scoredResults) {
    return scoredResults.length > 0 ? scoredResults[0].score : 0;
}

/**
 * FR03 — Build a RAG-enhanced prompt for the LLM (OpenAI).
 * Accepts optional webContext (array of Tavily result objects) for hybrid RAG.
 */
function buildRAGPrompt(userQuery, retrievedContext, conversationHistory = [], webContext = []) {
    const hasKB  = retrievedContext && retrievedContext.length > 0;
    const hasWeb = webContext && webContext.length > 0;
    if (!hasKB && !hasWeb) return null;

    const kbBlock = hasKB
        ? `UAF KNOWLEDGE BASE (curated, always trust this first):\n` +
          retrievedContext.map(e => `[${e.category}] Q: ${e.question}\nA: ${e.answer}`).join('\n\n')
        : '';

    const webBlock = hasWeb
        ? `\nLIVE WEB RESULTS (use only to supplement KB, or when KB has no answer):\n` +
          webContext.map(r => `[Source: ${r.url}]\n${(r.content || r.snippet || '').slice(0, 600)}`).join('\n\n')
        : '';

    const historyBlock = conversationHistory
        .slice(-4)
        .map(m => `${m.role === 'user' ? 'Student' : 'IntelliChat'}: ${m.content}`)
        .join('\n');

    return [
        {
            role: 'system',
            content: `You are IntelliChat — the official AI assistant for the University of Agriculture Faisalabad (UAF), Pakistan.

You answer questions about UAF using the context provided below. You have two context sources:
1. UAF Knowledge Base — curated, highly accurate UAF-specific data. Always prefer this.
2. Live Web Results — real-time search results. Use only when KB doesn't have the answer.

STRICT RULES:
1. Answer ONLY about UAF. Never give generic university answers.
2. Prefer KB context over web results. Use web results only to fill gaps.
3. If both KB and web have no relevant info, say: "I don't have that information. Please contact UAF directly at +92-41-9200161 or visit uaf.edu.pk"
4. NEVER say "Generally universities offer..." — you are ONLY about UAF.
5. Always cite UAF-specific names, departments, contacts from the context.
6. Keep answers concise. Use bullet points for multiple items.
7. If using a web source, briefly mention it (e.g. "According to uaf.edu.pk...").

${kbBlock}${webBlock}
${historyBlock ? `\nRECENT CONVERSATION:\n${historyBlock}` : ''}

Student Question: ${userQuery}`
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
    let answer = `**${best.question}**\n\n${best.answer}`;
    const seen = new Set([best.category + best.question]);
    for (let i = 1; i < retrievedContext.length; i++) {
        const entry = retrievedContext[i];
        const key = entry.category + entry.question;
        if (!seen.has(key)) {
            seen.add(key);
            answer += `\n\n---\n**${entry.question}**\n\n${entry.answer}`;
        }
    }
    return answer;
}

module.exports = { retrieveContext, retrieveContextScored, getTopScore, buildRAGPrompt, isLowConfidence, buildDirectAnswer, isGreeting, GREETING_RESPONSE };
