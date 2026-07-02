<<<<<<< HEAD
# Personal Website - Full Stack with Next.js, Tailwind CSS & PHP/MySQL

A modern full stack personal website built with Next.js, Tailwind CSS frontend and PHP/MySQL backend for XAMPP.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **React** - UI library

### Backend
- **PHP** - Server-side scripting
- **MySQL** - Relational database
- **XAMPP** - Local development environment

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/              # About page
│   ├── projects/           # Projects page
│   └── socials/            # Socials page
├── components/             # React components
│   ├── Header.tsx          # Header component
│   └── Navigation.tsx       # Navigation component
├── php/                    # PHP backend (for XAMPP)
│   ├── api/                # API endpoints
│   │   ├── profile.php
│   │   ├── projects.php
│   │   └── socials.php
│   └── config/
│       └── database.php     # Database configuration
├── database/
│   └── schema.sql           # MySQL schema
├── public/
│   └── assets/             # Static assets
└── next.config.js          # Next.js configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- XAMPP installed and running
- Git (optional)

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup XAMPP Backend

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Copy PHP Files to XAMPP**
   - Copy the `php` folder to `C:\xampp\htdocs\`
   - Rename it to `api` or keep as `php`
   - Update the API URLs in Next.js components if needed

3. **Create Database**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Import the `database/schema.sql` file, OR
   - Run the SQL commands from `database/schema.sql` manually

4. **Configure Database** (if needed)
   - Edit `php/config/database.php` if your MySQL credentials are different
   - Default XAMPP credentials:
     - Host: `localhost`
     - User: `root`
     - Password: `` (empty)
     - Database: `personal_website`

### 3. Run the Development Server

```bash
# Frontend (Next.js) - Development mode
npm run dev

# Backend (XAMPP)
# Make sure Apache and MySQL are running in XAMPP
```

### 4. Build and Run Production

```bash
# Build the Next.js application for production
npm run build

# Start the production server
npm start
```

The frontend will be available at: `http://localhost:3000`
The backend API will be available at: `http://localhost/api/` (or `http://localhost/php/api/`)

## 🔧 Configuration

### API Endpoints

The Next.js app is configured to call the PHP API at `http://localhost/api/`. If you placed the PHP files in a different location, update the fetch URLs in:

- `app/page.tsx`
- `app/about/page.tsx`
- `app/projects/page.tsx`
- `app/socials/page.tsx`

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` with custom colors and animations matching your original design.

### Next.js Configuration

The `next.config.js` includes API rewrites for development. Adjust as needed for your setup.

## 📡 API Endpoints

### Profile
- `GET /api/profile.php` - Get profile information
- `PUT /api/profile.php` - Update profile

### Projects
- `GET /api/projects.php` - Get all projects
- `GET /api/projects.php?id=1` - Get single project
- `POST /api/projects.php` - Create project
- `PUT /api/projects.php?id=1` - Update project
- `DELETE /api/projects.php?id=1` - Delete project

### Socials
- `GET /api/socials.php` - Get all social links
- `GET /api/socials.php?id=1` - Get single social
- `POST /api/socials.php` - Create/Update social (upsert by platform)
- `DELETE /api/socials.php?id=1` - Delete social

## 🎨 Features

- ✅ Modern Next.js 14 with App Router
- ✅ Tailwind CSS for styling
- ✅ TypeScript for type safety
- ✅ PHP/MySQL backend for XAMPP
- ✅ RESTful API endpoints
- ✅ Responsive design
- ✅ Dynamic content loading
- ✅ Server-side rendering ready

## 📝 Development

### Development Mode
```bash
npm run dev
```
Starts the Next.js development server with hot-reloading at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
Creates an optimized production build of your Next.js application.

### Start Production Server
```bash
npm start
```
Starts the Next.js production server. **Note:** You must run `npm run build` first!

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server (requires build first)
- `npm run lint` - Run ESLint to check for code issues

### Database Management

- Use phpMyAdmin at `http://localhost/phpmyadmin`
- Or use MySQL command line
- Database auto-initializes on first API call

## 🔒 Security Notes

For production:
- Change database credentials
- Add authentication/authorization
- Validate and sanitize all inputs
- Use prepared statements (already implemented)
- Enable HTTPS
- Restrict CORS origins

## 📦 Deployment

### Frontend
- Deploy to Vercel, Netlify, or any Node.js hosting
- Update API URLs to production backend

### Backend
- Deploy PHP files to web server (Apache/Nginx)
- Ensure MySQL database is accessible
- Update database credentials in production

## 🐛 Troubleshooting

**CORS Errors:**
- Make sure `.htaccess` is in the PHP directory
- Check Apache mod_headers is enabled

**Database Connection Issues:**
- Verify MySQL is running in XAMPP
- Check database credentials in `php/config/database.php`
- Ensure database exists (run schema.sql)

**API Not Found:**
- Verify PHP files are in correct XAMPP htdocs location
- Check Apache is running
- Verify file permissions

## 📄 License

Personal project - use as you wish!
