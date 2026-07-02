# Docker Setup Testing Checklist

Use this checklist to verify your Docker setup is working correctly.

## Pre-Startup Checks

- [ ] Docker Desktop is installed and running
- [ ] Docker Compose is available (`docker-compose --version`)
- [ ] Node modules are installed (`npm install` completed)
- [ ] `.env` file exists with correct values
- [ ] Port 3000 is available (or changed in `.env`)
- [ ] Port 3306 is available (or changed in `.env`)

## Container Startup

```bash
npm install
docker-compose up --build
```

During startup, verify:
- [ ] Docker images are building without errors
- [ ] "personal_website_db" container starts
- [ ] "personal_website_app" container starts
- [ ] Database initialization completes (check logs)
- [ ] No port conflict errors

Check status:
```bash
docker-compose ps
```

Expected output:
```
NAME                        STATUS           PORTS
personal_website_db         Up (healthy)     0.0.0.0:3306->3306/tcp
personal_website_app        Up               0.0.0.0:3000->3000/tcp
```

## Connectivity Tests

### Health Check
```bash
curl http://localhost:3000/health
```
Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

### API Endpoints
```bash
# Get profile
curl http://localhost:3000/api/profile

# Get projects
curl http://localhost:3000/api/projects

# Get socials
curl http://localhost:3000/api/socials
```

### Web Access
- [ ] Visit http://localhost:3000 in browser
- [ ] Homepage loads
- [ ] Navigation works
- [ ] No 404 errors in console
- [ ] API calls are successful

## Database Tests

### Connection from Host
```bash
mysql -h localhost -u website_user -p personal_website
# Password: website_password
```

Once connected:
```sql
SHOW TABLES;
SELECT COUNT(*) FROM profile;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM socials;
```

Expected:
- [ ] 3 tables exist: profile, projects, socials
- [ ] profile has 1 row
- [ ] socials has 3 rows
- [ ] projects table exists (may be empty)

### Connection from Container
```bash
docker-compose exec db mysql -u website_user -pwebsite_password personal_website -e "SELECT COUNT(*) FROM profile;"
```

Expected output:
```
COUNT(*)
1
```

### Database Health
```bash
docker-compose exec db mysql -u website_user -pwebsite_password -e "SELECT VERSION();"
```

## API CRUD Operations

### Create Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Test Description",
    "link": "https://example.com",
    "technologies": "Docker, Node.js"
  }'
```

Expected: 201 status with project data

- [ ] Response status: 201
- [ ] Response includes id and created_at

### Read Projects
```bash
curl http://localhost:3000/api/projects
```

Expected: 200 status with array of projects
- [ ] Array includes created test project
- [ ] All fields present

### Update Project
```bash
curl -X PUT http://localhost:3000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated Description",
    "link": "https://updated.com",
    "technologies": "Docker, Node.js, MySQL"
  }'
```

Expected: 200 status with updated project
- [ ] updated_at timestamp changed
- [ ] New values reflected

### Delete Project
```bash
curl -X DELETE http://localhost:3000/api/projects/1
```

Expected: 200 status
- [ ] Project is removed
- [ ] GET /api/projects doesn't include it

### Profile Operations
```bash
# Get profile
curl http://localhost:3000/api/profile

# Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Name",
    "title": "Test Title",
    "bio": "Test Bio",
    "education": "Test Education",
    "profile_image": "image.jpg",
    "interests": ["test1", "test2"]
  }'
```

Expected:
- [ ] Get returns profile data
- [ ] Update returns 200 with updated data
- [ ] interests array properly stored

## Log Verification

### Application Logs
```bash
docker-compose logs app
```

Check for:
- [ ] "Server is running on http://localhost:3000"
- [ ] "Database initialized successfully"
- [ ] No error messages
- [ ] No connection errors

### Database Logs
```bash
docker-compose logs db
```

Check for:
- [ ] "Version" info at startup
- [ ] "ready for connections"
- [ ] No error messages

## Performance Checks

```bash
# Check memory usage
docker stats

# Check CPU usage
docker-compose logs -f app | head -20
```

Expected:
- [ ] App memory < 200MB
- [ ] DB memory < 300MB
- [ ] No memory leaks over time

## Restart Test

```bash
docker-compose down
docker-compose up -d
```

Verify:
- [ ] Containers restart cleanly
- [ ] Database data persists
- [ ] No lost data
- [ ] All services healthy

## Backup/Restore Test

### Backup Database
```bash
docker-compose exec db mysqldump -u website_user -pwebsite_password personal_website > test_backup.sql
```

Check:
- [ ] test_backup.sql created
- [ ] File size > 1KB
- [ ] Contains SQL statements

### Restore Test
```bash
# Optional: test restoration on clean database
# docker-compose down -v
# docker-compose up -d
# docker-compose exec -T db mysql -u website_user -pwebsite_password personal_website < test_backup.sql
```

## Error Recovery

### Simulate Database Crash
```bash
docker-compose restart db
```

Verify:
- [ ] App reconnects automatically
- [ ] Data still accessible
- [ ] No corruption

### Simulate App Crash
```bash
docker-compose restart app
```

Verify:
- [ ] App restarts
- [ ] Can access endpoints
- [ ] Database still intact

## Environment Variable Tests

### Custom Port
Edit `.env` to change `PORT=3001` and restart:
```bash
docker-compose up --build
```

Verify:
- [ ] App runs on new port: http://localhost:3001
- [ ] Update .env back to 3000

### Custom Database Password
Edit `.env` database credentials and restart:
```bash
docker-compose down -v
docker-compose up --build
```

Verify:
- [ ] Database starts with new password
- [ ] App connects successfully
- [ ] Old password doesn't work

## Production Readiness

- [ ] All tests above passed
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured
- [ ] Database backups working
- [ ] Logs are clear and helpful
- [ ] Error handling works correctly
- [ ] Rate limiting considered
- [ ] CORS configured appropriately

## Cleanup

After testing, clean up test data:
```bash
# Optional: Start fresh
docker-compose down -v
docker-compose up --build
```

## Summary

- [ ] All startup checks passed
- [ ] All connectivity tests passed
- [ ] All CRUD operations working
- [ ] Database operations verified
- [ ] Logs are healthy
- [ ] Performance acceptable
- [ ] Restart resilience confirmed
- [ ] Backup/restore working
- [ ] Error recovery functional
- [ ] Environment config flexible
- [ ] Production ready

**Status**: ✅ Ready for Development / ❌ Issues Found

If any test failed, check [DOCKER_SETUP.md](DOCKER_SETUP.md#troubleshooting) for troubleshooting steps.
