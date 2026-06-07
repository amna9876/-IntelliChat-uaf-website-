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
 */
function retrieveContext(userQuery) {
    const query = userQuery.toLowerCase().trim();
    // Allow 2-char words so abbreviations like "CS", "VC", "BS" are kept
    const queryWords = query.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));

    if (queryWords.length === 0) return [];

    const scored = UAF_KNOWLEDGE_BASE.map(entry => {
        let score = 0;

        // +3 per matching keyword (query contains the keyword phrase)
        // +1 if a query word appears inside a keyword (partial / stem match)
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

        // +5 if query words appear in the question text
        const q = entry.question.toLowerCase();
        queryWords.forEach(word => {
            if (q.includes(word)) score += 5;
        });

        // +2 if query words appear in the answer text
        const a = entry.answer.toLowerCase();
        queryWords.forEach(word => {
            if (a.includes(word)) score += 2;
        });

        return { entry, score };
    });

    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
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
            content: `You are IntelliChat — the official AI assistant for the University of Agriculture Faisalabad (UAF), Pakistan.

Your ONLY knowledge source is the UAF knowledge base context provided below. You must NEVER give generic answers. You must NEVER answer from general internet knowledge.

STRICT RULES:
1. Answer ONLY from the retrieved context chunks provided. If context contains the answer, give it precisely.
2. If context does NOT contain the answer, say exactly: 'I don't have specific information about that in my UAF knowledge base. Please contact the relevant UAF department or visit uaf.edu.pk'
3. NEVER say 'Generally universities offer...' or 'Most universities have...' — you are ONLY about UAF.
4. Always use UAF-specific names, departments, offices, and contacts from the context.
5. Keep answers concise but complete. Use bullet points for multiple items.

Retrieved UAF Context:
${contextBlock}
${historyBlock ? `\nRECENT CONVERSATION:\n${historyBlock}` : ''}

User Question: ${userQuery}`
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

module.exports = { retrieveContext, buildRAGPrompt, isLowConfidence, buildDirectAnswer, isGreeting, GREETING_RESPONSE };
