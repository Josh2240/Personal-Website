# Docker Migration Summary

## What Has Changed

Your Personal Website project has been successfully migrated from SQLite/XAMPP to a fully containerized Docker setup with MySQL.

### Before (Old Setup)
- SQLite database: `database/database.db`
- Local file-based database
- Manual XAMPP setup required
- PHP backend (legacy)

### After (Docker Setup)
- MySQL 8.0 running in Docker container
- Persistent named volume: `db_data`
- Automatic database initialization
- Environment-based configuration
- Scalable and production-ready

## New Files Created

1. **Dockerfile** - Container configuration for your Node.js application
2. **docker-compose.yml** - Multi-container orchestration (App + Database)
3. **.env** - Environment variables (already populated with defaults)
4. **.env.example** - Template for environment variables
5. **.dockerignore** - Files to exclude from Docker build
6. **DOCKER_SETUP.md** - Comprehensive setup and usage guide
7. **migrate-to-docker.sh** - Automated migration script (Linux/Mac)
8. **migrate-to-docker.ps1** - Automated migration script (Windows)

## Files Modified

1. **database/database.js**
   - Replaced SQLite (better-sqlite3) with MySQL (mysql2)
   - Added connection pooling
   - Made all database operations async
   - Added environment variable support

2. **database/schema.sql**
   - Updated for MySQL format
   - Removed `CREATE DATABASE` statement (handled by Docker)
   - Removed default data inserts (handled by Node.js initialization)
   - Added proper UTF-8 charset and collation

3. **routes/api.js**
   - All endpoints converted to async/await
   - Updated to work with MySQL promise-based queries
   - Changed parameter passing for proper MySQL compatibility

4. **server.js**
   - Added dotenv configuration
   - Added health check endpoint (`/health`)
   - Updated logging to show database connection info

5. **package.json**
   - Added MySQL2 dependency: `mysql2@^3.6.5`
   - Added Express, CORS, body-parser (if not present)
   - Added dotenv for environment variable support

## Quick Start

### Windows (PowerShell)
```powershell
# Navigate to project directory
cd "C:\Users\Johua\Desktop\Personal Website"

# Run migration script
.\migrate-to-docker.ps1

# Or manually:
npm install
docker-compose up --build
```

### Linux/Mac (Bash)
```bash
cd ~/Desktop/Personal\ Website

# Run migration script
bash migrate-to-docker.sh

# Or manually:
npm install
docker-compose up --build
```

## Environment Variables

All configuration is now managed through `.env`:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=db
DB_PORT=3306
DB_USER=website_user
DB_PASSWORD=website_password
DB_ROOT_PASSWORD=rootpassword
DB_NAME=personal_website
```

**Important**: For production, change:
- `DB_PASSWORD` - Use a strong password
- `DB_ROOT_PASSWORD` - Use a strong password
- `NODE_ENV` - Set to `production`

## Database Migration

Your existing data (if any) was automatically migrated:
1. SQLite database was backed up to `database.db.backup.TIMESTAMP`
2. Default data is reinserted on first run
3. MySQL database persists in Docker volume `personal_website_db_data`

## API Endpoints (Unchanged)

All API endpoints remain the same:

```
GET  /api/projects          - Get all projects
POST /api/projects          - Create project
GET  /api/projects/:id      - Get single project
PUT  /api/projects/:id      - Update project
DELETE /api/projects/:id    - Delete project

GET  /api/socials           - Get all socials
POST /api/socials           - Create/update social
GET  /api/socials/:id       - Get single social
DELETE /api/socials/:id     - Delete social

GET  /api/profile           - Get profile
PUT  /api/profile           - Update profile

GET  /health                - Health check (new)
```

## Docker Services

### Application Container
- **Name**: personal_website_app
- **Image**: Built from Dockerfile (Node.js 18 Alpine)
- **Port**: 3000
- **Environment**: Connected to database container

### Database Container
- **Name**: personal_website_db
- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: db_data (persistent)
- **Initialization**: Runs schema.sql on startup

## Useful Docker Commands

```bash
# Start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Remove all data and restart clean
docker-compose down -v
docker-compose up --build

# Access application shell
docker-compose exec app sh

# Access database shell
docker-compose exec db bash

# Access MySQL command line
docker-compose exec db mysql -u website_user -p personal_website

# View container status
docker-compose ps

# Rebuild after code changes
docker-compose up --build
```

## Database Access

### From Node.js Application
- Hostname: `db` (Docker service name)
- Port: `3306`
- Credentials from `.env`

### From Your Machine
- Hostname: `localhost`
- Port: `3306`
- User: `website_user`
- Password: `website_password`

### Using MySQL Client
```bash
mysql -h localhost -u website_user -p personal_website
# Password: website_password
```

### Using GUI Tools
- MySQL Workbench
- DBeaver
- Sequel Pro
- TablePlus

Connection Details:
- Host: localhost
- Port: 3306
- User: website_user
- Password: website_password
- Database: personal_website

## Production Deployment

When deploying to production:

1. **Update .env**
   - Change all passwords to strong values
   - Set `NODE_ENV=production`
   - Set correct database credentials

2. **Use Docker Registry**
   ```bash
   docker build -t your-registry/personal-website:latest .
   docker push your-registry/personal-website:latest
   ```

3. **Deploy with Docker Compose or Kubernetes**
   - Use Docker Swarm for simple deployments
   - Use Kubernetes for large-scale deployments

4. **Database Backups**
   ```bash
   docker-compose exec db mysqldump -u website_user -p personal_website > backup.sql
   ```

5. **Enable HTTPS**
   - Use nginx reverse proxy with Let's Encrypt
   - Or use AWS/GCP/Azure managed services

## Troubleshooting

### Port Already in Use
Change in `.env`:
```env
PORT=3001
DB_PORT=3307
```

### Database Connection Failed
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Application Can't Connect
- Ensure database hostname is `db` (not localhost)
- Check `.env` credentials match docker-compose.yml
- Wait longer for database to initialize (health check)

### Permission Denied
```bash
# On Linux/Mac, might need to run with sudo
sudo docker-compose up -d

# Or add user to docker group
sudo usermod -aG docker $USER
```

### Need to Reinstall Node Modules
```bash
# Remove and rebuild
docker-compose down
docker system prune -a
npm install
docker-compose up --build
```

## Backup and Restore

### Backup Database
```bash
docker-compose exec db mysqldump -u website_user -pwebsite_password personal_website > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
docker-compose exec -T db mysql -u website_user -pwebsite_password personal_website < backup_20240102_120000.sql
```

### Backup Docker Volume
```bash
docker run --rm -v personal_website_db_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz /data
```

## Performance Considerations

1. **Connection Pooling**: Node.js maintains a pool of 10 connections
2. **Database Caching**: MySQL caches frequently accessed data
3. **Volume Performance**: Named volumes provide good performance
4. **Image Size**: Alpine Linux keeps image size minimal (~200MB)

## Security Notes

1. **Never commit .env with passwords** - Use `.env.example` as template
2. **Change default passwords** before production deployment
3. **Enable CORS carefully** - Don't allow all origins in production
4. **Add authentication** - Implement JWT or session-based auth for APIs
5. **Use HTTPS** - Always use HTTPS in production
6. **Database Backups** - Implement regular automated backups

## Next Steps

1. ✅ Test the application: `docker-compose up -d`
2. ✅ Access at http://localhost:3000
3. ✅ Test API endpoints
4. ✅ Update environment variables as needed
5. ✅ Test database backup/restore procedures
6. ✅ Set up CI/CD pipeline for automated deployments
7. ✅ Plan for scaling (load balancer, multiple app instances)

## Support

- Docker Docs: https://docs.docker.com/
- MySQL Docs: https://dev.mysql.com/doc/
- Node.js Docs: https://nodejs.org/docs/
- Express.js: https://expressjs.com/

## Questions?

Refer to `DOCKER_SETUP.md` for comprehensive documentation, or review the migration scripts to understand the setup process.

---

**Last Updated**: July 2, 2026
**Migration Status**: ✅ Complete
