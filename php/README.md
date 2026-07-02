# PHP Backend for XAMPP

This folder contains the PHP backend API for the personal website.

## Installation

1. **Copy to XAMPP htdocs:**
   - Copy this entire `php` folder to `C:\xampp\htdocs\`
   - You can rename it to `api` for cleaner URLs

2. **Directory Structure in XAMPP:**
   ```
   C:\xampp\htdocs\
   ├── api\                    (or php\)
   │   ├── api\
   │   │   ├── profile.php
   │   │   ├── projects.php
   │   │   └── socials.php
   │   ├── config\
   │   │   └── database.php
   │   └── .htaccess
   ```

3. **Access URLs:**
   - Profile: `http://localhost/api/api/profile.php`
   - Projects: `http://localhost/api/api/projects.php`
   - Socials: `http://localhost/api/api/socials.php`

## Database Setup

1. Start MySQL in XAMPP
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Import `database/schema.sql` from the project root
4. Or manually create database `personal_website` and run the SQL

## Configuration

Edit `config/database.php` if your MySQL credentials differ from XAMPP defaults:
- Host: `localhost`
- User: `root`
- Password: `` (empty)
- Database: `personal_website`

## Features

- ✅ RESTful API endpoints
- ✅ CORS enabled for Next.js frontend
- ✅ Auto-initializes database tables
- ✅ Prepared statements (SQL injection protection)
- ✅ JSON responses
- ✅ Error handling

## API Endpoints

All endpoints return JSON with `{success: boolean, data: object, error?: string}` format.

### Profile
- `GET /api/api/profile.php` - Get profile
- `PUT /api/api/profile.php` - Update profile

### Projects
- `GET /api/api/projects.php` - Get all projects
- `GET /api/api/projects.php?id=1` - Get single project
- `POST /api/api/projects.php` - Create project
- `PUT /api/api/projects.php?id=1` - Update project
- `DELETE /api/api/projects.php?id=1` - Delete project

### Socials
- `GET /api/api/socials.php` - Get all socials
- `POST /api/api/socials.php` - Create/Update social (upsert)
- `DELETE /api/api/socials.php?id=1` - Delete social

## Testing

Test the API using curl or Postman:
```bash
curl http://localhost/api/api/profile.php
```

Or open in browser (should show JSON response).

