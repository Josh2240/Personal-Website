# Personal Website - Full Stack TypeScript + React + Express + SQLite

A modern full stack personal website built with Next.js, React, TypeScript, Tailwind CSS, Express, and SQLite.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Express** - Node.js web framework
- **TypeScript** - Type-safe backend
- **SQLite** - Embedded database via better-sqlite3
- **JWT** - Authentication with 2FA support
- **Zod** - Runtime schema validation

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
│   └── Navigation.tsx      # Navigation component
├── backend/
│   └── src/
│       ├── index.ts        # Express server entry
│       ├── config/
│       │   └── env.ts      # Environment config
│       ├── db/
│       │   └── index.ts    # SQLite setup & seed data
│       ├── types/
│       │   └── index.ts    # TypeScript interfaces
│       ├── middleware/
│       │   └── auth.ts     # JWT auth middleware
│       └── routes/
│           ├── api.ts      # Projects, socials, profile routes
│           └── auth.ts     # Login, 2FA, JWT
├── public/
│   └── assets/             # Static assets
├── database/
│   └── schema.sql          # Legacy MySQL schema (reference)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+ installed
- Git (optional)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and adjust values if needed:

```bash
cp .env.example .env
```

Default values work for local development.

### 3. Run Development Servers

```bash
# Start both frontend and backend in development mode
npm run dev
```

This starts:
- **Frontend** at `http://localhost:3000`
- **Backend API** at `http://localhost:3001`

### 4. Build for Production

```bash
# Build Next.js frontend and TypeScript backend
npm run build

# Start production server (both frontend and backend)
npm start
```

## 📡 API Endpoints

All endpoints return JSON with `{success: boolean, data?: object, error?: string}` format.

### Profile
- `GET /api/profile` - Get profile information
- `PUT /api/profile` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Socials
- `GET /api/socials` - Get all social links
- `GET /api/socials/:id` - Get single social
- `POST /api/socials` - Create/Update social (auth required)
- `DELETE /api/socials/:id` - Delete social (auth required)

### Authentication
- `POST /api/auth/login` - Login with username/password (2FA supported)
- `GET /api/auth/me` - Get current user (auth required)

## 🎨 Features

- ✅ Next.js 14 with App Router and TypeScript
- ✅ Tailwind CSS for styling
- ✅ Express TypeScript backend with SQLite
- ✅ JWT authentication with 2FA support
- ✅ RESTful API endpoints
- ✅ Responsive design
- ✅ Dynamic content loading
- ✅ Runtime validation with Zod
- ✅ Hot reloading in development

## 📝 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in dev mode
- `npm run dev:frontend` - Start only Next.js dev server
- `npm run dev:backend` - Start only Express API server
- `npm run build` - Build Next.js for production
- `npm run build:backend` - Compile TypeScript backend
- `npm start` - Start production server (frontend + backend)
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

### Database

The SQLite database is auto-initialized when the backend starts. It creates:
- `projects` table
- `socials` table
- `profile` table
- `users` table (for auth)

Default seed data includes:
- Profile for Josh Cabradilla
- Social links (GitHub, Instagram, Facebook)
- Admin user (username: `admin`)

## 🔒 Security Notes

For production:
- Change `JWT_SECRET` and `ADMIN_PASSWORD` in `.env`
- Set strong secrets via environment variables
- Enable HTTPS
- Restrict CORS origins in production

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker compose up --build

# Stop
docker compose down
```

The database persists via Docker volume.

## 📦 Deployment

### Frontend
- Deploy to Vercel, Netlify, or any Node.js hosting
- Ensure the backend API is accessible

### Backend
- Deploy the Express API to any Node.js hosting (Railway, Render, Fly.io, etc.)
- The SQLite database file persists on disk

## 📄 License

Personal project - use as you wish!
