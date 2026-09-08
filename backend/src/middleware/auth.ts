import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'ChangeThisJWTSecret'
const JWT_EXPIRES_IN = '1h'

export interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    res.status(401).json({ success: false, error: 'Authorization token required' })
    return
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; username: string }
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export { JWT_SECRET, JWT_EXPIRES_IN }
