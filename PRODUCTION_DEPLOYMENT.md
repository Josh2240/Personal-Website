# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests in TESTING_CHECKLIST.md pass
- [ ] `.env.example` is documented and current
- [ ] No hardcoded secrets in code
- [ ] Docker build succeeds without errors
- [ ] All environment variables configured
- [ ] Application logs configured
- [ ] CORS settings reviewed
- [ ] HTTPS requirements understood
- [ ] Monitoring plan in place

## Security Hardening

### 1. Update Environment Variables

Create a secure `.env` for production:

```env
NODE_ENV=production
PORT=3000
API_PORT=3001
JWT_SECRET=your_strong_jwt_secret_here
ADMIN_PASSWORD=your_strong_admin_password_here
```

### 2. Generate Strong Secrets

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
- Set `restart: always`
- Remove volume mappings if not needed
- Set resource limits

## Deployment Options

### Option 1: Single Server Deployment

**Requirements:**
- Linux server (Ubuntu 20.04+ recommended)
- Docker & Docker Compose installed
- SSH access to server
- Domain name configured

**Steps:**

1. **Set up server**
```bash
ssh user@your-domain.com
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

2. **Deploy application**
```bash
git clone your-repo-url personal-website
cd personal-website
cp .env.example .env
# Edit .env with production values
docker-compose up -d --build
```

3. **Set up Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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

4. **Set up SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d your-domain.com
```

## Monitoring & Logging

### Container Logs

```bash
docker-compose logs -f app
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Backup Strategy

The SQLite database is stored in a Docker volume. To backup:

```bash
# Find the volume path
docker volume inspect personal_website_db_data

# Copy database file from volume
docker run --rm -v personal_website_db_data:/data -v $(pwd):/backup alpine tar cvf /backup/db-backup.tar /data
```

## CI/CD Pipeline

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
      - uses: actions/checkout@v4

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

## Maintenance Tasks

**Daily:**
- Check application logs
- Monitor disk space
- Verify backups completed

**Weekly:**
- Review error logs
- Check database size
- Verify SSL certificate expiration

**Monthly:**
- Update base images
- Update dependencies
- Test disaster recovery

## Disaster Recovery

### Recovery Procedures

**Database corruption:**
```bash
# Restore from backup
docker-compose down
# Restore volume from backup
docker-compose up -d
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

## Production Checklist

Before going live:
- [ ] SSL certificate installed
- [ ] Backups automated and tested
- [ ] Monitoring active
- [ ] Logging configured
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Rate limiting considered
- [ ] Error handling tested
- [ ] Disaster recovery plan ready
- [ ] Health checks working
- [ ] Automated tests passing
