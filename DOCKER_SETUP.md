# Docker Setup Guide for Personal Website

This guide will help you set up and run your Personal Website project using Docker and Docker Compose.

## Prerequisites

- **Docker**: Download and install from [docker.com](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Usually comes with Docker Desktop

### Verify Installation

```bash
docker --version
docker-compose --version
```

## Quick Start

### 1. Clone/Open Your Project

Navigate to your project directory:
```bash
cd "C:\Users\Johua\Desktop\Personal Website"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env` file is already created with default values. You can customize it:

```env
# Docker and Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_USER=website_user
DB_PASSWORD=website_password
DB_ROOT_PASSWORD=rootpassword
DB_NAME=personal_website
```

### 4. Build and Start Docker Containers

```bash
docker-compose up --build
```

This command will:
- Build the Node.js application Docker image
- Start a MySQL database container
- Start your application container
- Wait for the database to be ready
- Initialize the database with schema and default data

### 5. Access Your Application

- **Application**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

### 6. Database Access

To access the MySQL database directly:

```bash
docker-compose exec db mysql -u website_user -p personal_website
```

When prompted for password, enter: `website_password`

Or use a MySQL GUI client:
- Host: `localhost`
- Port: `3306`
- User: `website_user`
- Password: `website_password`
- Database: `personal_website`

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
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

### Access Database Shell

```bash
docker-compose exec db bash
```

## Project Structure

```
personal-website/
├── database/
│   ├── database.js          # MySQL connection pool
│   └── schema.sql           # Database schema
├── routes/
│   └── api.js               # API endpoints
├── php/                      # Legacy PHP files (optional)
├── public/                   # Static files
├── assets/                   # Images and static assets
├── Dockerfile               # Application container config
├── docker-compose.yml       # Multi-container orchestration
├── .env                     # Environment variables
├── .dockerignore            # Files to ignore in Docker build
├── package.json
└── server.js
```

## Database Schema

The application uses MySQL with three main tables:

### Projects Table
- `id`: Auto-increment primary key
- `title`: Project title
- `description`: Project description
- `link`: Project URL
- `image_url`: Image URL
- `technologies`: Technologies used
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Socials Table
- `id`: Auto-increment primary key
- `platform`: Social platform name (unique)
- `url`: Social media URL
- `icon`: Icon URL
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Profile Table
- `id`: Auto-increment primary key
- `name`: Profile name
- `title`: Professional title
- `bio`: Biography
- `education`: Education details
- `profile_image`: Profile image URL
- `interests`: JSON array of interests
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

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

## Troubleshooting

### Port Already in Use

If port 3000 or 3306 is already in use, change them in `.env`:
```env
PORT=3001
DB_PORT=3307
```

### Database Connection Failed

```bash
# Check if database container is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Application Can't Connect to Database

- Ensure database service name is `db` (not `localhost`)
- Check that `.env` has correct database credentials
- Verify health check passes: `docker-compose ps`

### Build Failures

```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up --build
```

## Performance Tips

1. **Volumes**: Database data persists in named volume `db_data`
2. **Health Checks**: Database includes health checks to ensure readiness
3. **Connection Pool**: Node.js uses connection pooling (max 10 connections)
4. **Image Size**: Using Alpine Linux for smaller image size

## Security Notes

- Change default passwords in `.env` for production
- Use environment variables for sensitive data (never hardcode)
- Database root user should have a strong password
- Implement authentication for API endpoints in production
- Use HTTPS in production

## Next Steps

1. Customize `.env` with your own values for production
2. Add authentication middleware to API routes
3. Configure CORS for your domain
4. Set up CI/CD pipeline with Docker
5. Deploy to production using Docker Swarm or Kubernetes

## Support

For Docker documentation: https://docs.docker.com/
For Docker Compose: https://docs.docker.com/compose/
For MySQL: https://dev.mysql.com/doc/
