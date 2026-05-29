const express = require('express');
const router  = express.Router();
const { getDB } = require('../database/db');
const auth    = require('../middleware/authMiddleware');

router.use(auth);
router.use((req, res, next) => {
    if (req.user?.user_type !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    next();
});

router.get('/stats', async (req, res) => {
    const db    = getDB();
    const today = new Date().toISOString().split('T')[0];
    const logs    = await db.query('SELECT created_at FROM chat_logs', []);
    const queries = await db.query('SELECT is_resolved FROM student_queries', []);
    const events  = await db.query('SELECT date, is_active FROM events', []);
    res.json({
        students_served_today:   logs.filter(l => l.created_at?.startsWith?.(today) || String(l.created_at).startsWith(today)).length,
        total_menu_interactions: logs.length,
        unresolved_queries:      queries.filter(q => !q.is_resolved).length,
        upcoming_events:         events.filter(e => e.is_active && e.date >= today).length,
    });
});

router.get('/chart/daily', async (req, res) => {
    const db   = getDB();
    const logs = await db.query('SELECT created_at FROM chat_logs', []);
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
    res.json(days.map(day => ({
        date: day.slice(5),
        interactions: logs.filter(l => String(l.created_at).startsWith(day)).length,
    })));
});

router.get('/menu-items', async (req, res) => {
    const db = getDB();
    res.json(await db.query('SELECT * FROM menu_items', []));
});

router.post('/menu-items', async (req, res) => {
    const { title, icon, display_order, parent_id, answer_text } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required.' });
    const db = getDB();
    const { lastId } = await db.execute(
        'INSERT INTO menu_items (title, icon, parent_id, display_order, answer_text) VALUES (?, ?, ?, ?, ?)',
        [title, icon || '', parent_id || null, display_order || 0, answer_text || '']
    );
    const all  = await db.query('SELECT * FROM menu_items', []);
    res.status(201).json(all.find(i => String(i.id) === String(lastId)));
});

router.delete('/menu-items/:id', async (req, res) => {
    const db = getDB();
    await db.execute('DELETE FROM menu_items WHERE id = ?', [parseInt(req.params.id)]);
    res.json({ success: true });
});

router.get('/answers', async (req, res) => {
    const db  = getDB();
    const all = await db.query('SELECT * FROM menu_items', []);
    res.json(all.filter(i => i.answer_text !== null && i.answer_text !== undefined));
});

router.put('/answers/:id', async (req, res) => {
    const db = getDB();
    await db.execute('UPDATE menu_items SET answer_text = ? WHERE id = ?', [req.body.answer_text, parseInt(req.params.id)]);
    res.json({ success: true });
});

router.get('/queries', async (req, res) => {
    const db  = getDB();
    const all = await db.query('SELECT * FROM student_queries', []);
    res.json(all.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))));
});

router.put('/queries/:id/resolve', async (req, res) => {
    const db = getDB();
    await db.execute('UPDATE student_queries SET is_resolved = ? WHERE id = ?', [1, parseInt(req.params.id)]);
    res.json({ success: true });
});

router.get('/events', async (req, res) => {
    const db  = getDB();
    const all = await db.query('SELECT * FROM events', []);
    res.json(all.sort((a, b) => a.date > b.date ? 1 : -1));
});

router.post('/events', async (req, res) => {
    const { title, description, date, location, category } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Title and date required.' });
    const db = getDB();
    const { lastId } = await db.execute(
        'INSERT INTO events (title, description, date, location, category, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description || '', date, location || '', category || '', 1]
    );
    const all = await db.query('SELECT * FROM events', []);
    res.status(201).json(all.find(e => String(e.id) === String(lastId)));
});

router.put('/events/:id', async (req, res) => {
    const { title, description, date, location, category } = req.body;
    const db = getDB();
    await db.execute(
        'UPDATE events SET title = ?, description = ?, date = ?, location = ?, category = ? WHERE id = ?',
        [title, description || '', date, location || '', category || '', parseInt(req.params.id)]
    );
    const all = await db.query('SELECT * FROM events', []);
    res.json(all.find(e => String(e.id) === String(req.params.id)));
});

router.delete('/events/:id', async (req, res) => {
    const db = getDB();
    await db.execute('DELETE FROM events WHERE id = ?', [parseInt(req.params.id)]);
    res.json({ success: true });
});

router.get('/export', async (req, res) => {
    const db      = getDB();
    const queries = await db.query('SELECT * FROM student_queries', []);
    const header  = 'ID,Name,Email,Menu Path,Query,Resolved,Date';
    const rows    = queries.map(q => [
        q.id, `"${q.student_name}"`, `"${q.student_email}"`, `"${q.menu_path}"`,
        `"${(q.query_text || '').replace(/"/g, '""')}"`,
        q.is_resolved ? 'Yes' : 'No',
        String(q.created_at).split('T')[0],
    ].join(','));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="uaf_queries.csv"');
    res.send([header, ...rows].join('\n'));
});

module.exports = router;
