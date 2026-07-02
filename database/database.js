const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initDatabase() {
    // Projects table
    db.exec(`
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
    `);

    // Socials table
    db.exec(`
        CREATE TABLE IF NOT EXISTS socials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL UNIQUE,
            url TEXT NOT NULL,
            icon TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Profile table
    db.exec(`
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
    `);

    // Insert default profile if it doesn't exist
    const profileExists = db.prepare('SELECT COUNT(*) as count FROM profile').get();
    if (profileExists.count === 0) {
        db.prepare(`
            INSERT INTO profile (name, title, bio, education, profile_image, interests)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            'josh cabradilla',
            'aspiring front end engineer, fresh grad BSIT student',
            'aspiring front end engineer, fresh grad BSIT student',
            'Graduated as BSIT - Bachelor of Science in Information Technology at PCLU (Polytechnic College of La Union)',
            'assets/a7c37f61-b29a-4304-920a-ce40bda43034.jpg',
            JSON.stringify(['music', 'photography', 'gaming (valorant)', 'coding', 'physical activities like going to gym'])
        );
    }

    // Insert default socials if they don't exist
    const socialsExist = db.prepare('SELECT COUNT(*) as count FROM socials').get();
    if (socialsExist.count === 0) {
        const insertSocial = db.prepare(`
            INSERT INTO socials (platform, url, icon)
            VALUES (?, ?, ?)
        `);
        
        insertSocial.run('github', 'https://github.com/Josh2240', 'assets/github.png');
        insertSocial.run('instagram', 'https://www.instagram.com/enji_adachi/', 'assets/instagram.png');
        insertSocial.run('facebook', 'https://www.facebook.com/joshua.cabradilla.946/', 'assets/facebook.png');
    }

    console.log('Database initialized successfully');
}

// Initialize database on module load
initDatabase();

module.exports = db;

