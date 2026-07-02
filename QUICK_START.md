# Quick Start Guide - Personal Website with Docker

## TL;DR (The Quickest Start)

```powershell
# Windows PowerShell
npm install
docker-compose up --build
# Visit http://localhost:3000
```

```bash
# Linux/Mac
npm install
docker-compose up --build
# Visit http://localhost:3000
```

## What You Need

- Docker Desktop installed: https://www.docker.com/products/docker-desktop
- Node.js installed (for npm): https://nodejs.org/

## The Steps

### 1. Install Node Modules
```bash
npm install
```

### 2. Start Docker Containers
```bash
docker-compose up --build
```

This will:
- Build your application image
- Start MySQL database container
- Initialize database with tables and default data
- Start your application on port 3000

### 3. Access Your App
- **Website**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

### 4. View Logs
```bash
# All logs
docker-compose logs -f

# Just app logs
docker-compose logs -f app

# Just database logs
docker-compose logs -f db
```

### 5. Stop When Done
```bash
docker-compose down
```

## Common Issues

**Q: "Port 3000 already in use"**
A: Change in `.env`: `PORT=3001`

**Q: "Docker not found"**
A: Install Docker Desktop for your OS

**Q: "Database connection failed"**
A: Wait 10 seconds and try again, database is initializing

**Q: "npm install fails"**
A: Run `npm install` before `docker-compose up`

## Useful Commands

| Command | What it does |
|---------|-------------|
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop all containers |
| `docker-compose down -v` | Stop and delete data |
| `docker-compose logs -f` | View live logs |
| `docker-compose ps` | Show container status |
| `docker-compose restart` | Restart containers |

## Database Info

```
Host: localhost
Port: 3306
User: website_user
Password: website_password
Database: personal_website
```

## Testing API

```bash
# Get profile
curl http://localhost:3000/api/profile

# Get all projects
curl http://localhost:3000/api/projects

# Get all socials
curl http://localhost:3000/api/socials

# Health check
curl http://localhost:3000/health
```

## For More Info

See these files:
- **Full Setup Guide**: [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **Migration Details**: [DOCKER_MIGRATION_COMPLETE.md](DOCKER_MIGRATION_COMPLETE.md)
- **Docker Compose Config**: [docker-compose.yml](docker-compose.yml)
- **Environment Variables**: [.env](.env)

---

**That's it!** Your app is now running on Docker! 🎉
