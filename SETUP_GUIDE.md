# Complete Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` if needed. Default values work for local development.

### 3. Run Development Servers

```bash
npm run dev
```

This starts both the Next.js frontend and Express backend:

- **Frontend** at `http://localhost:3000`
- **Backend API** at `http://localhost:3001`

### 4. Verify Setup

- Open `http://localhost:3000` in your browser
- Test API: `http://localhost:3001/api/profile`
- Should return JSON with profile data

## 📁 Project Structure

```structure
.
├── app/                    # Next.js App Router pages
├── components/             # React components
├── backend/
│   └── src/
│       ├── index.ts        # Express server
│       ├── config/env.ts   # Environment config
│       ├── db/index.ts     # SQLite setup
│       ├── types/          # TypeScript interfaces
│       ├── middleware/     # Auth middleware
│       └── routes/         # API routes
├── public/
│   └── assets/             # Static assets
├── database/
│   └── schema.sql          # Legacy MySQL schema (reference)
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured
- [ ] Backend running at `http://localhost:3001`
- [ ] Frontend running at `http://localhost:3000`
- [ ] API test: `http://localhost:3001/api/profile` returns JSON
- [ ] Homepage loads profile data correctly

## 🐛 Troubleshooting

### Port Already in Use

- Frontend defaults to port 3000
- Backend defaults to port 3001
- Change `PORT` and `API_PORT` in `.env`

### Database Errors

- The SQLite database is auto-created at `backend/database.db`
- Delete the file to reset the database
- Seed data is inserted on first run

### CORS Errors

- Backend has CORS enabled for all origins in development
- In production, update `cors` options in `backend/src/index.ts`

## 🎯 Next Steps

1. Customize profile in `backend/src/db/index.ts` seed data
2. Add projects via the API or directly in the database
3. Update styles in `tailwind.config.js` and `app/globals.css`
4. Deploy to production when ready
