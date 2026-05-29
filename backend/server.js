require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

const authRoutes    = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const chatbotRoutes = require('./routes/chatbot');
const mapsRoutes    = require('./routes/maps');
const menuRoutes    = require('./routes/menu');
const eventsRoutes  = require('./routes/events');
const adminRoutes   = require('./routes/admin');
const { initDB }    = require('./database/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Database ──────────────────────────────────────────────────────────────────
initDB().catch(err => console.error('[DB] Init error:', err));

// ── Security & Core Middleware ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests. Please wait a few minutes.' }
}));
app.use('/api/auth/login', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many login attempts. Please try again later.' }
}));
app.use('/api/auth/signup', rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many signup attempts. Please try again in an hour.' }
}));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/maps',    mapsRoutes);
app.use('/api/menu',    menuRoutes);
app.use('/api/events',  eventsRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/api/health', (_req, res) => res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
}));

// ── Frontend static files ─────────────────────────────────────────────────────
const FRONTEND = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND));

// ── Catch-all: serve index.html for any non-API route ────────────────────────
app.get('*', (_req, res) => {
    res.sendFile(path.join(FRONTEND, 'index.html'));
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[Server] Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n  UAF Campus Portal  →  http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`  Database:    ${process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'Local JSON file'}\n`);
    });
}

module.exports = app;
