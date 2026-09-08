import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import { prepare } from '../db'
import { authMiddleware, AuthRequest, JWT_SECRET, JWT_EXPIRES_IN } from '../middleware/auth'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password, token }: { username?: string; password?: string; token?: string } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' })
  }

  const user = prepare('SELECT * FROM users WHERE username = ?').get(username) as unknown as {
    id: number
    username: string
    password_hash: string
    totp_secret?: string
    is_2fa_enabled: number
  } | undefined

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid username or password' })
  }

  const passwordMatches = bcrypt.compareSync(password, user.password_hash)
  if (!passwordMatches) {
    return res.status(401).json({ success: false, error: 'Invalid username or password' })
  }

  if (user.is_2fa_enabled) {
    if (!token) {
      return res.status(200).json({ success: true, requires2fa: true, message: '2FA code required' })
    }

    const valid2fa = speakeasy.totp.verify({
      secret: user.totp_secret || '',
      encoding: 'base32',
      token: token,
      window: 1,
    })

    if (!valid2fa) {
      return res.status(401).json({ success: false, error: 'Invalid 2FA code' })
    }
  }

  const jwtToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

  return res.json({ success: true, token: jwtToken })
})

router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  return res.json({ success: true, data: { id: req.user!.id, username: req.user!.username } })
})

export default router
