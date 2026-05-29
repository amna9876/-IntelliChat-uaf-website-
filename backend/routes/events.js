const express = require('express');
const router  = express.Router();
const { getDB } = require('../database/db');

router.get('/', async (req, res) => {
    try {
        const db     = getDB();
        const all    = await db.query('SELECT * FROM events', []);
        const events = all.filter(e => e.is_active).sort((a, b) => a.date > b.date ? 1 : -1);
        res.json(events);
    } catch (err) {
        console.error('[Events]', err);
        res.status(500).json([]);
    }
});

module.exports = router;
