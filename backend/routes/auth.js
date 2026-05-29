const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDB } = require('../database/db');
const auth    = require('../middleware/authMiddleware');

const sign = (id, email, user_type) =>
    jwt.sign({ id, email, user_type }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/signup
router.post('/signup', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
        const { name, email, password } = req.body;
        const db = getDB();

        if (await db.queryOne('SELECT id FROM users WHERE email = ?', [email])) {
            return res.status(409).json({ success: false, message: 'This email is already registered.' });
        }

        const hashed = await bcrypt.hash(password, 12);
        const { lastId } = await db.execute(
            'INSERT INTO users (full_name, email, password, user_type, is_active) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashed, 'user', 1]
        );

        const token = sign(lastId, email, 'user');
        res.status(201).json({
            success: true,
            message: 'Account created! Welcome to UAF Portal.',
            token,
            user: { id: lastId, name, email, user_type: 'user' }
        });
    } catch (err) {
        console.error('[Auth] Signup:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// POST /api/auth/login
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
        const { email, password } = req.body;
        const db = getDB();

        const user = await db.queryOne('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        await db.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const token = sign(user.id, user.email, user.user_type);
        res.json({
            success: true,
            message: `Welcome back, ${user.full_name}!`,
            token,
            user: { id: user.id, name: user.full_name, email: user.email, user_type: user.user_type }
        });
    } catch (err) {
        console.error('[Auth] Login:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// GET /api/auth/me  – returns who is logged in (verify token is still valid)
router.get('/me', auth, async (req, res) => {
    try {
        const db   = getDB();
        const user = await db.queryOne(
            'SELECT id, full_name, email, user_type, created_at, last_login FROM users WHERE id = ?',
            [req.user.id]
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({
            success: true,
            user: { id: user.id, name: user.full_name, email: user.email, user_type: user.user_type, joinedAt: user.created_at, lastLogin: user.last_login }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// PUT /api/auth/profile  – update name or change password
router.put('/profile', auth, [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    try {
        const db = getDB();
        const { name, newPassword, currentPassword } = req.body;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: 'Current password is required to set a new one.' });
            }
            const row = await db.queryOne('SELECT password FROM users WHERE id = ?', [req.user.id]);
            if (!(await bcrypt.compare(currentPassword, row.password))) {
                return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
            }
            const hashed = await bcrypt.hash(newPassword, 12);
            await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
        }

        if (name) await db.execute('UPDATE users SET full_name = ? WHERE id = ?', [name, req.user.id]);

        res.json({ success: true, message: 'Profile updated successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
