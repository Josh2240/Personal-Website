import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { initDatabase } from './db'
import authRoutes from './routes/auth'
import apiRoutes from './routes/api'
import { env } from './config/env'

const app = express()

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Personal Website API is running', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api', apiRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

// Initialize database and start server
async function start() {
  try {
    await initDatabase()

    app.listen(env.API_PORT, () => {
      console.log(`Backend API server running on http://localhost:${env.API_PORT}`)
      console.log(`API available at http://localhost:${env.API_PORT}/api`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
