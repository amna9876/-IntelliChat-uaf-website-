const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getDB } = require('../database/db');

// POST /api/contact
router.post('/', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const { name, email, subject, message } = req.body;
        const db = getDB();

        await db.execute(
            'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || 'General Inquiry', message]
        );

        res.json({
            success: true,
            message: 'Your message has been received! We will respond within 24 hours.'
        });
    } catch (err) {
        console.error('[Contact] Error:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// GET /api/contact/announcements  (public)
const FALLBACK_ANNOUNCEMENTS = [
    { id: 1, title: 'Postgraduate Admissions Open 2025-26', body: 'Applications for MSc, MPhil and PhD programs for the academic year 2025-26 are now open. Visit uaf.edu.pk/admissions for details and apply before the deadline.', category: 'admissions', created_at: '2025-11-01T00:00:00.000Z', date: 'Nov 2025', url: 'https://web.uaf.edu.pk' },
    { id: 2, title: 'Chief Minister Punjab Laptop Program Phase-II', body: 'CM Punjab Laptop Program Phase-II applications are open for eligible UAF students. Required: CGPA 2.5+, Punjab domicile, no backlogs. Apply at cmgp.punjab.gov.pk.', category: 'general', created_at: '2026-02-01T00:00:00.000Z', date: 'Feb 2026', url: 'https://web.uaf.edu.pk' },
    { id: 3, title: 'Non-Boarder Proforma 2026 Available', body: 'Students living off-campus must submit the Non-Boarder Proforma for 2026 enrollment. Forms available at the Registrar Office and online at appserver1.uaf.edu.pk.', category: 'general', created_at: '2026-01-15T00:00:00.000Z', date: 'Jan 2026', url: 'https://web.uaf.edu.pk' },
    { id: 4, title: '29th Convocation 2025 Rescheduled', body: 'The 29th Convocation of UAF for batch 2021-2025 has been rescheduled. New date to be announced soon. Graduates should check uaf.edu.pk for updates and keep their email active.', category: 'events', created_at: '2026-03-01T00:00:00.000Z', date: 'Mar 2026', url: 'https://web.uaf.edu.pk' },
    { id: 5, title: 'B.Ed Program 2026 Admissions Open', body: 'Applications for the B.Ed (Bachelor of Education) program for 2026 are now open. Eligibility: BA/BSc with 45% marks. Apply through the Education Department, UAF.', category: 'admissions', created_at: '2026-02-15T00:00:00.000Z', date: 'Feb 2026', url: 'https://web.uaf.edu.pk' },
    { id: 6, title: 'Inter Hall Sports 2025-2026', body: 'Inter Hall Sports competition 2025-26 has begun. All hostel blocks are competing in cricket, football, volleyball, and badminton. Finals will be held at the Sports Complex.', category: 'events', created_at: '2025-10-01T00:00:00.000Z', date: 'Oct 2025', url: 'https://web.uaf.edu.pk' },
];

router.get('/announcements', async (req, res) => {
    try {
        const db = getDB();
        const rows = await db.query(
            'SELECT id, title, body, category, created_at FROM announcements WHERE is_active = 1 ORDER BY created_at DESC LIMIT 10',
            []
        );
        if (rows && rows.length > 0) {
            return res.json({ success: true, announcements: rows, isLive: true });
        }
        res.json({ success: true, announcements: FALLBACK_ANNOUNCEMENTS, isLive: false });
    } catch (err) {
        res.json({ success: true, announcements: FALLBACK_ANNOUNCEMENTS, isLive: false });
    }
});

module.exports = router;
