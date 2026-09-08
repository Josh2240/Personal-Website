# Quick Start Guide

## TL;DR

```bash
npm install
cp .env.example .env
npm run dev
# Visit http://localhost:3000
```

## What You Need

- Node.js 20+ installed
- npm or yarn

## The Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if needed. Defaults work for local development.

### 3. Start Development Servers

```bash
npm run dev
```

This starts:
- **Frontend (Next.js)** at `http://localhost:3000`
- **Backend (Express API)** at `http://localhost:3001`

### 4. Verify

- Visit `http://localhost:3000`
- Test API: `curl http://localhost:3001/api/profile`

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start only Next.js |
| `npm run dev:backend` | Start only Express API |
| `npm run build` | Build Next.js for production |
| `npm start` | Start production (frontend + backend) |

## Testing API

```bash
# Get profile
curl http://localhost:3001/api/profile

# Get all projects
curl http://localhost:3001/api/projects

# Get all socials
curl http://localhost:3001/api/socials

# Health check
curl http://localhost:3001/health
```

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `ChangeThisAdmin@123`
- **2FA**: Enabled (see backend logs for TOTP secret)

## For More Info

- **Full Setup**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **README**: [README.md](README.md)
