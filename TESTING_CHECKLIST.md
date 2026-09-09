# Testing Checklist

Use this checklist to verify the TypeScript full-stack setup is working correctly.

## Pre-Startup Checks

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Dependencies installed (`npm install` completed)
- [ ] `.env` file exists
- [ ] Port 3000 is available
- [ ] Port 3001 is available

## Startup Verification

```bash
npm run dev
```

During startup, verify:

- [ ] Next.js dev server starts
- [ ] Express backend starts
- [ ] Database initializes
- [ ] No port conflict errors
- [ ] No missing dependency errors

## Frontend Tests

- [ ] Visit `http://localhost:3000` in browser
- [ ] Homepage loads without errors
- [ ] Navigation links work (Home, About, Socials, Projects)
- [ ] About page loads profile data
- [ ] Projects page loads projects
- [ ] Socials page loads social links
- [ ] No 404 errors in browser console
- [ ] API calls return data (check Network tab)

## API Tests

### Health Check

```bash
curl http://localhost:3001/health

```curl
- [ ] Returns 200 status
- [ ] Response includes `success: true`

### Profile
```bash
curl http://localhost:3001/api/profile

```bash
- [ ] Returns 200 status
- [ ] Response includes profile data (name, title, bio, etc.)

### Projects
```bash
curl http://localhost:3001/api/projects

```curl
- [ ] Returns 200 status
- [ ] Response includes array of projects

### Socials
```bash
curl http://localhost:3001/api/socials

```bash
- [ ] Returns 200 status
- [ ] Response includes social links

## Database Tests

- [ ] SQLite database file created at `backend/database.db`
- [ ] Profile table has 1 row (default profile)
- [ ] Socials table has 3 rows (default socials)
- [ ] Projects table exists

## Build Verification

```bash
npm run build
npm run build:backend
npm run typecheck
```

- [ ] Next.js build succeeds
- [ ] Backend TypeScript compiles without errors
- [ ] TypeScript typecheck passes

## Error Recovery

- [ ] Restarting servers preserves data
- [ ] Frontend reconnects to backend after restart
- [ ] Database persists across restarts

## Summary

- [ ] All startup checks passed
- [ ] Frontend loads correctly
- [ ] All API endpoints working
- [ ] Database initialized
- [ ] Build succeeds
- [ ] Ready for development
