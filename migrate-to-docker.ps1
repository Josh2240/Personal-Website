# Migration script from SQLite/XAMPP to Docker MySQL (Windows PowerShell)
# This script helps backup your existing data and set up Docker

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "Personal Website - Database Migration to Docker"
    Write-Host ""
    Write-Host "Usage: .\migrate-to-docker.ps1"
    Write-Host ""
    Write-Host "This script will:"
    Write-Host "  1. Check if Docker is installed"
    Write-Host "  2. Backup your existing SQLite database"
    Write-Host "  3. Create .env file from .env.example"
    Write-Host "  4. Build and start Docker containers"
    Write-Host "  5. Initialize the database with schema"
    exit 0
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Personal Website - Database Migration to Docker" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Docker is not installed" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
}

# Check if Docker Compose is installed
try {
    $composeVersion = docker-compose --version
    Write-Host "✓ Docker Compose is installed: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Docker Compose is not installed" -ForegroundColor Red
    Write-Host "Please install Docker Desktop which includes Docker Compose"
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Backup Information" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Backup SQLite database if it exists
$dbPath = "database\database.db"
if (Test-Path $dbPath) {
    Write-Host "Found existing SQLite database" -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "database.db.backup.$timestamp"
    Copy-Item $dbPath -Destination $backupPath
    Write-Host "✓ Backed up to: $backupPath" -ForegroundColor Green
}

Write-Host ""

# Create .env file if it doesn't exist
$envPath = ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file from .env.example" -ForegroundColor Yellow
    Copy-Item ".env.example" -Destination $envPath
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Starting Docker Services" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Start Docker containers
Write-Host "Building and starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker containers started" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to start Docker containers" -ForegroundColor Red
    Write-Host "Try running: docker-compose logs"
    exit 1
}

Write-Host ""
Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check database connection
$dbHealthCheck = & {
    docker-compose exec -T db mysql -u website_user -pwebsite_password personal_website -e "SELECT 1" 2>$null
    $?
}

if ($dbHealthCheck) {
    Write-Host "✓ Database connection successful" -ForegroundColor Green
} else {
    Write-Host "✗ Database connection failed" -ForegroundColor Red
    Write-Host "Try running: docker-compose logs db"
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Migration Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your application is now running on Docker!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application:"
Write-Host "  - Web: http://localhost:3000"
Write-Host "  - API: http://localhost:3000/api"
Write-Host "  - Health: http://localhost:3000/health"
Write-Host ""
Write-Host "Database Connection:"
Write-Host "  - Host: localhost"
Write-Host "  - Port: 3306"
Write-Host "  - User: website_user"
Write-Host "  - Password: website_password"
Write-Host "  - Database: personal_website"
Write-Host ""
Write-Host "Useful Commands:"
Write-Host "  - View logs: docker-compose logs -f"
Write-Host "  - Stop: docker-compose down"
Write-Host "  - Restart: docker-compose up -d"
Write-Host "  - Clean reset: docker-compose down -v && docker-compose up --build"
Write-Host ""
