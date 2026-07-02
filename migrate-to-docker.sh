#!/bin/bash

# Migration script from SQLite/XAMPP to Docker MySQL
# This script helps backup your existing data and set up Docker

set -e

echo "================================================"
echo "Personal Website - Database Migration to Docker"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Desktop which includes Docker Compose"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
fi

echo ""
echo "================================================"
echo "Backup Information"
echo "================================================"
echo ""

# Backup SQLite database if it exists
if [ -f database/database.db ]; then
    echo -e "${YELLOW}Found existing SQLite database${NC}"
    BACKUP_NAME="database.db.backup.$(date +%Y%m%d_%H%M%S)"
    cp database/database.db "$BACKUP_NAME"
    echo -e "${GREEN}✓ Backed up to: $BACKUP_NAME${NC}"
fi

echo ""
echo "================================================"
echo "Starting Docker Services"
echo "================================================"
echo ""

# Start Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
docker-compose up -d --build

echo -e "${GREEN}✓ Docker containers started${NC}"
echo ""

# Wait for database to be healthy
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Check database connection
if docker-compose exec -T db mysql -u website_user -pwebsite_password personal_website -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
else
    echo -e "${RED}✗ Database connection failed${NC}"
    echo "Try running: docker-compose logs db"
    exit 1
fi

echo ""
echo "================================================"
echo "Migration Complete!"
echo "================================================"
echo ""
echo -e "${GREEN}Your application is now running on Docker!${NC}"
echo ""
echo "Access your application:"
echo "  - Web: http://localhost:3000"
echo "  - API: http://localhost:3000/api"
echo "  - Health: http://localhost:3000/health"
echo ""
echo "Database Connection:"
echo "  - Host: localhost"
echo "  - Port: 3306"
echo "  - User: website_user"
echo "  - Password: website_password"
echo "  - Database: personal_website"
echo ""
echo "Useful Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down"
echo "  - Restart: docker-compose up -d"
echo "  - Clean reset: docker-compose down -v && docker-compose up --build"
echo ""
