# Docker Production Deployment Guide

This guide walks you through deploying your Personal Website to production using Docker.

## 🎯 Pre-Deployment Checklist

- [ ] All tests in TESTING_CHECKLIST.md pass
- [ ] .env.example is documented and current
- [ ] No hardcoded secrets in code
- [ ] Docker build succeeds without errors
- [ ] All environment variables configured
- [ ] Database backups working
- [ ] Application logs configured
- [ ] CORS settings reviewed
- [ ] HTTPS requirements understood
- [ ] Monitoring plan in place

## 🔐 Security Hardening

### 1. Update Environment Variables

**Create a secure `.env` for production:**

```env
# Application
NODE_ENV=production
PORT=3000

# Database - CHANGE THESE!
DB_HOST=db
DB_PORT=3306
DB_USER=prod_website_user
DB_PASSWORD=STRONG_PASSWORD_HERE_MIN_32_CHARS
DB_ROOT_PASSWORD=STRONG_ROOT_PASSWORD_MIN_32_CHARS
DB_NAME=personal_website

# Optional: Email/Notifications
# SMTP_HOST=mail.example.com
# SMTP_PORT=587
# SMTP_USER=noreply@example.com
# SMTP_PASSWORD=email_password
```

### 2. Generate Strong Passwords

Use this command to generate secure passwords:

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 3. Secure Docker Configuration

Update `docker-compose.yml` for production:

```yaml
# Remove volumes mapping (no live file syncing in production)
# Set restart policy to always
# Set resource limits
# Enable logging driver
```

## 🚀 Deployment Options

### Option 1: Single Server Deployment (Simplest)

**Requirements:**
- Linux server (Ubuntu 20.04+ recommended)
- Docker & Docker Compose installed
- SSH access to server
- Domain name configured

**Steps:**

1. **Set up server**
```bash
# SSH into your server
ssh user@your-domain.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

2. **Deploy application**
```bash
# Clone your repository
git clone your-repo-url personal-website
cd personal-website

# Copy production .env
# Make sure .env has production values
# NEVER commit .env to git!

# Start containers
docker-compose up -d --build
```

3. **Set up Nginx reverse proxy**
```bash
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/personal-website
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/personal-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Set up SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d your-domain.com
```

5. **Enable automatic updates**
```bash
# Create systemd service to auto-pull and restart
sudo nano /etc/systemd/system/personal-website-update.service
```

### Option 2: Docker Swarm (Medium Scale)

For managing multiple servers:

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml personal-website

# Scale services
docker service scale personal_website_app=3
```

### Option 3: Kubernetes (Large Scale)

Create deployment manifests:

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: personal-website
spec:
  replicas: 3
  selector:
    matchLabels:
      app: personal-website
  template:
    metadata:
      labels:
        app: personal-website
    spec:
      containers:
      - name: app
        image: your-registry/personal-website:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: db_host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db_password
```

## 📊 Monitoring & Logging

### 1. Container Logs

```bash
# View logs
docker-compose logs -f app
docker-compose logs -f db

# Save logs
docker-compose logs > app.log
```

### 2. Database Monitoring

```bash
# Check database size
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD -e "
  SELECT table_name, ROUND(data_length + index_length) AS size 
  FROM information_schema.tables 
  WHERE table_schema = '$DB_NAME';
"

# Check connections
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD -e "SHOW PROCESSLIST;"
```

### 3. Application Monitoring

Set up monitoring tools:
- **PM2** - Process management
- **New Relic** - APM monitoring
- **DataDog** - Infrastructure monitoring
- **CloudWatch** - AWS monitoring

### 4. Alert System

```bash
# Simple monitoring script
#!/bin/bash
while true; do
    HEALTH=$(curl -s http://localhost:3000/health | jq -r '.status')
    if [ "$HEALTH" != "ok" ]; then
        # Send alert (email, Slack, etc.)
        curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
             -d '{"text":"Health check failed!"}'
    fi
    sleep 300  # Every 5 minutes
done
```

## 💾 Backup Strategy

### Automated Database Backups

**Create backup script:**

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backups/mysql"
DB_NAME="personal_website"
DB_USER="website_user"
DB_PASSWORD="password"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup
docker-compose exec -T db mysqldump \
    -u $DB_USER -p$DB_PASSWORD \
    $DB_NAME > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to cloud (optional)
# aws s3 cp $BACKUP_FILE.gz s3://your-bucket/backups/
```

**Schedule with cron:**

```bash
# Run daily at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

### Backup Verification

```bash
# Restore to test database
docker-compose exec -T db mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE test_restore;"
docker-compose exec -T db mysql -u $DB_USER -p$DB_PASSWORD test_restore < backup_*.sql
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t your-registry/personal-website:${{ github.sha }} .
      
      - name: Push to registry
        run: docker push your-registry/personal-website:${{ github.sha }}
      
      - name: Deploy to server
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          SERVER_HOST: ${{ secrets.SERVER_HOST }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -i ~/.ssh/id_rsa user@$SERVER_HOST 'cd personal-website && git pull && docker-compose up -d --build'
```

## 🧹 Maintenance Tasks

### Regular Tasks

**Daily:**
- [ ] Check application logs
- [ ] Monitor disk space
- [ ] Verify backups completed

**Weekly:**
- [ ] Review error logs
- [ ] Check database size
- [ ] Verify SSL certificate expiration

**Monthly:**
- [ ] Update base images
- [ ] Update dependencies
- [ ] Test disaster recovery
- [ ] Review access logs

**Quarterly:**
- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning
- [ ] Update documentation

### Database Maintenance

```bash
# Optimize tables
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
  OPTIMIZE TABLE projects, socials, profile;
"

# Check table integrity
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
  CHECK TABLE projects, socials, profile;
"

# View database statistics
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD -e "
  SELECT * FROM information_schema.tables 
  WHERE table_schema = '$DB_NAME';
"
```

## 🚨 Disaster Recovery

### Recovery Procedures

**Database corruption:**
```bash
# Restore from backup
docker-compose exec -T db mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup.sql
```

**Lost volume data:**
```bash
# Restore volume from backup
docker-compose down
docker volume rm personal_website_db_data
docker-compose up -d
docker-compose exec -T db mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup.sql
```

**Complete server failure:**
```bash
# On new server:
# 1. Install Docker
# 2. Clone repository
# 3. Configure .env
# 4. docker-compose up -d
# 5. Restore database from backup
```

## 📈 Scaling

### Horizontal Scaling (Multiple App Instances)

```yaml
version: '3.8'
services:
  app:
    build: .
    deploy:
      replicas: 3
    environment:
      - DB_HOST=db
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    volumes:
      - db_data:/var/lib/mysql
```

### Load Balancing

Use Nginx, HAProxy, or cloud load balancer:

```nginx
upstream backend {
    server app:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

## 🔍 Troubleshooting Production Issues

### High CPU Usage
```bash
# Check process resources
docker stats
# Check slow queries
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD -e "SET GLOBAL slow_query_log = 'ON';"
```

### High Memory Usage
```bash
# Check memory leaks
docker stats
# Restart app container
docker-compose restart app
```

### Slow Queries
```bash
# Check query logs
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
  SELECT * FROM mysql.slow_log LIMIT 10;
"
# Add indexes if needed
docker-compose exec db mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
  CREATE INDEX idx_created ON projects(created_at);
"
```

### Network Issues
```bash
# Check container networking
docker network ls
docker network inspect personal_website_default
# Restart network
docker-compose down
docker-compose up -d
```

## 📋 Production Checklist

Before going live:
- [ ] SSL certificate installed
- [ ] Backups automated and tested
- [ ] Monitoring active
- [ ] Logging configured
- [ ] Database optimized
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error handling tested
- [ ] Disaster recovery plan ready
- [ ] Team trained on procedures
- [ ] Documentation updated
- [ ] Health checks working
- [ ] Automated tests passing
- [ ] Performance baseline established

## 📞 Production Support

**During incidents:**
1. Check logs: `docker-compose logs -f`
2. Check health: `curl http://localhost:3000/health`
3. Check resources: `docker stats`
4. Restart if needed: `docker-compose restart app`
5. Restore from backup if necessary

**On-call rotation:**
- Set up alerting
- Document escalation procedures
- Train team on incident response
- Practice disaster recovery

---

**Ready for production?** ✅

You now have a containerized, monitored, and backed-up personal website!

For help, refer to official Docker documentation:
- https://docs.docker.com/
- https://docs.docker.com/compose/
- https://dev.mysql.com/doc/
