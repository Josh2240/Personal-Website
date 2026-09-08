import { Router } from 'express'
import { prepare } from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { Project, Social, Profile, ApiResponse } from '../types'

const router = Router()

// ============ PROJECTS ROUTES ============

router.get('/projects', (req, res) => {
  try {
    const projects = prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as unknown as Project[]
    res.json({ success: true, data: projects } as ApiResponse<Project[]>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.get('/projects/:id', (req, res) => {
  try {
    const project = prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as unknown as Project | undefined
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' } as ApiResponse)
    }
    res.json({ success: true, data: project } as ApiResponse<Project>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.post('/projects', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { title, description, link, image_url, technologies }: Pick<Project, 'title' | 'description' | 'link' | 'image_url' | 'technologies'> = req.body
    const result = prepare(`
      INSERT INTO projects (title, description, link, image_url, technologies)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description, link, image_url, technologies)

    const project = prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid) as unknown as Project
    res.status(201).json({ success: true, data: project } as ApiResponse<Project>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.put('/projects/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { title, description, link, image_url, technologies }: Pick<Project, 'title' | 'description' | 'link' | 'image_url' | 'technologies'> = req.body
    const result = prepare(`
      UPDATE projects
      SET title = ?, description = ?, link = ?, image_url = ?, technologies = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, link, image_url, technologies, req.params.id)

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' } as ApiResponse)
    }

    const project = prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as unknown as Project
    res.json({ success: true, data: project } as ApiResponse<Project>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.delete('/projects/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const result = prepare('DELETE FROM projects WHERE id = ?').run(req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' } as ApiResponse)
    }
    res.json({ success: true, message: 'Project deleted successfully' } as ApiResponse)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

// ============ SOCIALS ROUTES ============

router.get('/socials', (req, res) => {
  try {
    const socials = prepare('SELECT * FROM socials ORDER BY platform').all() as unknown as Social[]
    res.json({ success: true, data: socials } as ApiResponse<Social[]>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.get('/socials/:id', (req, res) => {
  try {
    const social = prepare('SELECT * FROM socials WHERE id = ?').get(req.params.id) as unknown as Social | undefined
    if (!social) {
      return res.status(404).json({ success: false, error: 'Social not found' } as ApiResponse)
    }
    res.json({ success: true, data: social } as ApiResponse<Social>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.post('/socials', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { platform, url, icon }: Pick<Social, 'platform' | 'url' | 'icon'> = req.body
    const existing = prepare('SELECT * FROM socials WHERE platform = ?').get(platform) as unknown as Social | undefined

    if (existing) {
      prepare(`
        UPDATE socials
        SET url = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
        WHERE platform = ?
      `).run(url, icon, platform)
      const updated = prepare('SELECT * FROM socials WHERE platform = ?').get(platform) as unknown as Social
      return res.json({ success: true, data: updated } as ApiResponse<Social>)
    } else {
      const result = prepare(`
        INSERT INTO socials (platform, url, icon)
        VALUES (?, ?, ?)
      `).run(platform, url, icon)
      const social = prepare('SELECT * FROM socials WHERE id = ?').get(result.lastInsertRowid) as unknown as Social
      return res.status(201).json({ success: true, data: social } as ApiResponse<Social>)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.delete('/socials/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const result = prepare('DELETE FROM socials WHERE id = ?').run(req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Social not found' } as ApiResponse)
    }
    res.json({ success: true, message: 'Social deleted successfully' } as ApiResponse)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

// ============ PROFILE ROUTES ============

router.get('/profile', (req, res) => {
  try {
    const profile = prepare('SELECT * FROM profile ORDER BY id DESC LIMIT 1').get() as unknown as Profile | undefined
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' } as ApiResponse)
    }
    if (profile.interests) {
        profile.interests = JSON.parse(profile.interests as unknown as string)
    }
    res.json({ success: true, data: profile } as ApiResponse<Profile>)
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

router.put('/profile', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { name, title, bio, education, profile_image, interests }: Omit<Profile, 'id' | 'created_at' | 'updated_at'> = req.body
    const interestsJson = Array.isArray(interests) ? JSON.stringify(interests) : interests

    const existing = prepare('SELECT * FROM profile ORDER BY id DESC LIMIT 1').get() as unknown as Profile | undefined

    if (existing) {
      prepare(`
        UPDATE profile
        SET name = ?, title = ?, bio = ?, education = ?, profile_image = ?, interests = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(name, title, bio, education, profile_image, interestsJson, existing.id)
      const updated = prepare('SELECT * FROM profile WHERE id = ?').get(existing.id) as unknown as Profile
      if (updated.interests) {
        updated.interests = JSON.parse(updated.interests as unknown as string)
      }
      return res.json({ success: true, data: updated } as ApiResponse<Profile>)
    } else {
      const result = prepare(`
        INSERT INTO profile (name, title, bio, education, profile_image, interests)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, title, bio, education, profile_image, interestsJson)
      const profile = prepare('SELECT * FROM profile WHERE id = ?').get(result.lastInsertRowid) as unknown as Profile
      if (profile.interests) {
      profile.interests = JSON.parse(profile.interests as unknown as string)
      }
      return res.status(201).json({ success: true, data: profile } as ApiResponse<Profile>)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message } as ApiResponse)
  }
})

export default router
