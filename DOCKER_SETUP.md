# Docker Setup Guide

## Prerequisites

- **Docker**: Download from [docker.com](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Usually comes with Docker Desktop

### Verify Installation

```bash
docker --version
docker-compose --version
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` if needed. Defaults work for local development.

### 3. Build and Start

```bash
docker-compose up --build
```

This will:
- Build the Node.js application Docker image
- Start the application on port 3000
- The SQLite database is auto-initialized on first run

### 4. Access Your Application

- **Application**: http://localhost:3000
- **API**: http://localhost:3000/api (proxied to backend)
- **Health Check**: http://localhost:3000/health

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# App logs only
docker-compose logs -f app
```

### Stop Containers

```bash
docker-compose down
```

### Remove All Data and Restart Clean

```bash
docker-compose down -v
docker-compose up --build
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### Access Application Shell

```bash
docker-compose exec app sh
```

## Project Structure

```
personal-website/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── backend/
│   └── src/                # Express TypeScript backend
├── public/                 # Static files
├── assets/                 # Images and static assets
├── Dockerfile              # Application container config
├── docker-compose.yml      # Multi-container orchestration
├── .env                    # Environment variables
├── .dockerignore           # Files to ignore in Docker build
├── package.json
└── tsconfig.json
```

## Database

The application uses **SQLite** via `better-sqlite3`. The database file persists in a Docker volume.

Tables:
- `profile` - User profile data
- `projects` - Portfolio projects
- `socials` - Social media links
- `users` - Authentication users

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Socials
- `GET /api/socials` - Get all socials
- `GET /api/socials/:id` - Get single social
- `POST /api/socials` - Create/update social
- `DELETE /api/socials/:id` - Delete social

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile

### Auth
- `POST /api/auth/login` - Login with 2FA
- `GET /api/auth/me` - Get current user

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:
```env
PORT=3001
```

### Database Issues

The SQLite database is stored in a Docker volume. To reset:
```bash
docker-compose down -v
docker-compose up --build
```

### Build Failures

```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up --build
```

## Security Notes

- Change default passwords in `.env` for production
- Use environment variables for sensitive data
- Implement authentication for API endpoints in production
- Use HTTPS in production

## Next Steps

1. Customize `.env` with your own values for production
2. Add authentication middleware to protected API routes
3. Configure CORS for your domain
4. Deploy to production using Docker

## Support

For Docker documentation: https://docs.docker.com/
For Docker Compose: https://docs.docker.com/compose/
