const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const db = require('../database/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ChangeThisJWTSecret';
const JWT_EXPIRES_IN = '1h';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, error: 'Authorization token required' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
}

router.post('/login', (req, res) => {
    const { username, password, token } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatches) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    if (user.is_2fa_enabled) {
        if (!token) {
            return res.status(200).json({ success: true, requires2fa: true, message: '2FA code required' });
        }

        const valid2fa = speakeasy.totp.verify({
            secret: user.totp_secret,
            encoding: 'base32',
            token: token,
            window: 1,
        });

        if (!valid2fa) {
            return res.status(401).json({ success: false, error: 'Invalid 2FA code' });
        }
    }

    const jwtToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({ success: true, token: jwtToken });
});

router.get('/me', authMiddleware, (req, res) => {
    return res.json({ success: true, data: { id: req.user.id, username: req.user.username } });
});

module.exports = {
    router,
    authMiddleware,
};
