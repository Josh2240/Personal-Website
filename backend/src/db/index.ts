import initSqlJs from 'sql.js'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import { Profile, Social } from '../types'

type DbInstance = any
type DbStatement = {
  run(...params: unknown[]): { changes: number; lastInsertRowid: number }
  get(...params: unknown[]): Record<string, unknown> | undefined
  all(...params: unknown[]): Record<string, unknown>[]
}

let db: DbInstance | null = null
const dbPath = path.join(__dirname, '../../database.db')

function saveDatabase(database: DbInstance): void {
  try {
    const data = (database as any).export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  } catch (error) {
    console.error('Failed to save database:', error)
  }
}

function getDb(): DbInstance {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

export async function initDatabase(): Promise<DbInstance> {
  const SQL = await initSqlJs()
  
  let database: DbInstance
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath)
    database = new (SQL as any).Database(fileBuffer) as DbInstance
  } else {
    database = new (SQL as any).Database() as DbInstance
  }
  
  db = database

  exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      link TEXT,
      image_url TEXT,
      technologies TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  exec(`
    CREATE TABLE IF NOT EXISTS socials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT,
      bio TEXT,
      education TEXT,
      profile_image TEXT,
      interests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      totp_secret TEXT,
      is_2fa_enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Insert default profile if it doesn't exist
  const profileCount = prepare('SELECT COUNT(*) as count FROM profile').get() as { count: number } | undefined
  if (!profileCount || profileCount.count === 0) {
    prepare(`
      INSERT INTO profile (name, title, bio, education, profile_image, interests)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'josh cabradilla',
      'aspiring front end engineer, fresh grad BSIT student',
      'aspiring front end engineer, fresh grad BSIT student',
      'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)',
      'assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg',
      JSON.stringify(['music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym'])
    )
  }

  // Insert default socials if they don't exist
  const socialsCount = prepare('SELECT COUNT(*) as count FROM socials').get() as { count: number } | undefined
  if (!socialsCount || socialsCount.count === 0) {
    prepare('INSERT INTO socials (platform, url, icon) VALUES (?, ?, ?)').run('github', 'https://github.com/Josh2240', 'assets/github.png')
    prepare('INSERT INTO socials (platform, url, icon) VALUES (?, ?, ?)').run('instagram', 'https://www.instagram.com/enji_adachi/', 'assets/instagram.png')
    prepare('INSERT INTO socials (platform, url, icon) VALUES (?, ?, ?)').run('facebook', 'https://www.facebook.com/joshua.cabradilla.946/', 'assets/facebook.png')
  }

  // Seed default admin user
  const adminCount = prepare('SELECT COUNT(*) as count FROM users WHERE username = ?').get('admin') as { count: number } | undefined
  if (!adminCount || adminCount.count === 0) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisAdmin@123'
    const passwordHash = bcrypt.hashSync(adminPassword, 10)
    const totpSecret = process.env.ADMIN_TOTP_SECRET || speakeasy.generateSecret({ length: 20 }).base32

    prepare(`
      INSERT INTO users (username, password_hash, totp_secret, is_2fa_enabled)
      VALUES (?, ?, ?, ?)
    `).run('admin', passwordHash, totpSecret, 1)

    console.log('Seeded default admin user.')
    console.log(`  Admin username: admin`)
    console.log(`  Admin password: ${adminPassword}`)
    console.log(`  2FA secret: ${totpSecret}`)
    console.log('Set ADMIN_PASSWORD, ADMIN_TOTP_SECRET, and JWT_SECRET in .env for production deployments.')
  }

  console.log('Database initialized successfully')
  return database
}

export function exec(sql: string): void {
  const database = getDb()
  database.run(sql)
  saveDatabase(database)
}

export function prepare(sql: string): DbStatement {
  return {
    run(...params: unknown[]): { changes: number; lastInsertRowid: number } {
      const database = getDb()
      const stmt = database.prepare(sql)
      stmt.bind(params as any)
      stmt.step()
      stmt.free()
      const changes = database.getRowsModified()
      let lastInsertRowid = 0
      try {
        const result = database.exec('SELECT last_insert_rowid()')
        if (result.length > 0 && result[0].values.length > 0) {
          lastInsertRowid = result[0].values[0][0] as number
        }
      } catch {
        // last_insert_rowid might fail if no insert happened
      }
      saveDatabase(database)
      return { changes, lastInsertRowid }
    },
    get(...params: unknown[]): Record<string, unknown> | undefined {
      const database = getDb()
      const stmt = database.prepare(sql)
      stmt.bind(params as any)
      if (stmt.step()) {
        const row = stmt.getAsObject() as Record<string, unknown>
        stmt.free()
        return row
      }
      stmt.free()
      return undefined
    },
    all(...params: unknown[]): Record<string, unknown>[] {
      const database = getDb()
      const stmt = database.prepare(sql)
      stmt.bind(params as any)
      const results: Record<string, unknown>[] = []
      while (stmt.step()) {
        results.push(stmt.getAsObject() as Record<string, unknown>)
      }
      stmt.free()
      return results
    },
  }
}
