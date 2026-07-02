const express = require('express');
const router = express.Router();
const db = require('../database/database');

// ============ PROJECTS ROUTES ============

// Get all projects
router.get('/projects', (req, res) => {
    try {
        const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single project
router.get('/projects/:id', (req, res) => {
    try {
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create project
router.post('/projects', (req, res) => {
    try {
        const { title, description, link, image_url, technologies } = req.body;
        const result = db.prepare(`
            INSERT INTO projects (title, description, link, image_url, technologies)
            VALUES (?, ?, ?, ?, ?)
        `).run(title, description, link, image_url, technologies);
        
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update project
router.put('/projects/:id', (req, res) => {
    try {
        const { title, description, link, image_url, technologies } = req.body;
        const result = db.prepare(`
            UPDATE projects 
            SET title = ?, description = ?, link = ?, image_url = ?, technologies = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(title, description, link, image_url, technologies, req.params.id);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        res.json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete project
router.delete('/projects/:id', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ SOCIALS ROUTES ============

// Get all socials
router.get('/socials', (req, res) => {
    try {
        const socials = db.prepare('SELECT * FROM socials ORDER BY platform').all();
        res.json({ success: true, data: socials });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single social
router.get('/socials/:id', (req, res) => {
    try {
        const social = db.prepare('SELECT * FROM socials WHERE id = ?').get(req.params.id);
        if (!social) {
            return res.status(404).json({ success: false, error: 'Social not found' });
        }
        res.json({ success: true, data: social });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create/Update social (upsert by platform)
router.post('/socials', (req, res) => {
    try {
        const { platform, url, icon } = req.body;
        const existing = db.prepare('SELECT * FROM socials WHERE platform = ?').get(platform);
        
        if (existing) {
            // Update existing
            db.prepare(`
                UPDATE socials 
                SET url = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
                WHERE platform = ?
            `).run(url, icon, platform);
            const updated = db.prepare('SELECT * FROM socials WHERE platform = ?').get(platform);
            return res.json({ success: true, data: updated });
        } else {
            // Create new
            const result = db.prepare(`
                INSERT INTO socials (platform, url, icon)
                VALUES (?, ?, ?)
            `).run(platform, url, icon);
            const social = db.prepare('SELECT * FROM socials WHERE id = ?').get(result.lastInsertRowid);
            return res.status(201).json({ success: true, data: social });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete social
router.delete('/socials/:id', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM socials WHERE id = ?').run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Social not found' });
        }
        res.json({ success: true, message: 'Social deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ PROFILE ROUTES ============

// Get profile
router.get('/profile', (req, res) => {
    try {
        const profile = db.prepare('SELECT * FROM profile ORDER BY id DESC LIMIT 1').get();
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }
        // Parse interests JSON
        if (profile.interests) {
            profile.interests = JSON.parse(profile.interests);
        }
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update profile
router.put('/profile', (req, res) => {
    try {
        const { name, title, bio, education, profile_image, interests } = req.body;
        const interestsJson = Array.isArray(interests) ? JSON.stringify(interests) : interests;
        
        const existing = db.prepare('SELECT * FROM profile ORDER BY id DESC LIMIT 1').get();
        
        if (existing) {
            // Update existing
            db.prepare(`
                UPDATE profile 
                SET name = ?, title = ?, bio = ?, education = ?, profile_image = ?, interests = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(name, title, bio, education, profile_image, interestsJson, existing.id);
            const updated = db.prepare('SELECT * FROM profile WHERE id = ?').get(existing.id);
            if (updated.interests) {
                updated.interests = JSON.parse(updated.interests);
            }
            return res.json({ success: true, data: updated });
        } else {
            // Create new
            const result = db.prepare(`
                INSERT INTO profile (name, title, bio, education, profile_image, interests)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(name, title, bio, education, profile_image, interestsJson);
            const profile = db.prepare('SELECT * FROM profile WHERE id = ?').get(result.lastInsertRowid);
            if (profile.interests) {
                profile.interests = JSON.parse(profile.interests);
            }
            return res.status(201).json({ success: true, data: profile });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

