const express = require('express');
const router  = express.Router();
const { getDB } = require('../database/db');

router.get('/main', async (req, res) => {
    try {
        const db    = getDB();
        const all   = await db.query('SELECT * FROM menu_items', []);
        const items = all.filter(i => i.parent_id == null).sort((a, b) => a.display_order - b.display_order);
        res.json(items);
    } catch (err) { res.status(500).json([]); }
});

router.get('/sub/:id', async (req, res) => {
    try {
        const db    = getDB();
        const all   = await db.query('SELECT * FROM menu_items', []);
        const items = all.filter(i => String(i.parent_id) === String(req.params.id)).sort((a, b) => a.display_order - b.display_order);
        res.json(items);
    } catch (err) { res.status(500).json([]); }
});

router.get('/answer/:id', async (req, res) => {
    try {
        const db   = getDB();
        const all  = await db.query('SELECT * FROM menu_items', []);
        const item = all.find(i => String(i.id) === String(req.params.id));
        if (!item) return res.status(404).json({ answer_text: 'Information not available.' });
        res.json({ answer_text: item.answer_text || 'No detailed information available for this topic yet.' });
    } catch (err) { res.status(500).json({ answer_text: 'Error loading information.' }); }
});

router.post('/escalate', async (req, res) => {
    const { student_name, student_email, query_text, menu_path } = req.body;
    if (!student_name || !student_email || !query_text)
        return res.status(400).json({ success: false, message: 'All fields required.' });
    try {
        const db = getDB();
        await db.execute(
            'INSERT INTO student_queries (student_name, student_email, query_text, menu_path, is_resolved) VALUES (?, ?, ?, ?, ?)',
            [student_name.trim(), student_email.trim(), query_text.trim(), menu_path || '', 0]
        );
        res.json({ success: true, message: 'Query submitted. Admin will respond shortly.' });
    } catch (err) {
        console.error('[Menu] Escalate error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
