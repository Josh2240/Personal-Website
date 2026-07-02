# XAMPP Setup Instructions

## Quick Setup Guide

### Step 1: Install XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install it (default location: `C:\xampp\`)

### Step 2: Copy PHP Backend Files
1. Copy the entire `php` folder from this project
2. Paste it into `C:\xampp\htdocs\`
3. Rename it to `api` (or keep it as `php`)

**Result:** Your PHP files should be at:
- `C:\xampp\htdocs\api\config\database.php`
- `C:\xampp\htdocs\api\api\profile.php`
- `C:\xampp\htdocs\api\api\projects.php`
- `C:\xampp\htdocs\api\api\socials.php`

### Step 3: Copy Assets
1. Copy the `assets` folder from this project
2. Paste it into `C:\xampp\htdocs\` (or `C:\xampp\htdocs\api\`)

**Result:** Your assets should be accessible at:
- `http://localhost/assets/...`

### Step 4: Start XAMPP Services
1. Open XAMPP Control Panel
2. Click "Start" for **Apache**
3. Click "Start" for **MySQL**
4. Both should show green "Running" status

### Step 5: Create Database
1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. Click on "New" in the left sidebar
4. Database name: `personal_website`
5. Click "Create"
6. Click on "Import" tab
7. Choose file: `database/schema.sql` from this project
8. Click "Go"

**OR** manually run the SQL:
1. Click on `personal_website` database
2. Click "SQL" tab
3. Copy and paste contents of `database/schema.sql`
4. Click "Go"

### Step 6: Verify Setup
1. Test API: `http://localhost/api/api/profile.php`
   - Should return JSON with profile data
2. Test Assets: `http://localhost/assets/r.ico`
   - Should show the favicon

### Step 7: Update Next.js API URLs (if needed)
If your PHP files are at `C:\xampp\htdocs\api\`, update the fetch URLs in:
- `app/page.tsx`
- `app/about/page.tsx`
- `app/projects/page.tsx`
- `app/socials/page.tsx`

Change from: `http://localhost/api/profile.php`
To: `http://localhost/api/api/profile.php` (if you kept the folder structure)

## Troubleshooting

### Apache won't start
- Check if port 80 is already in use
- Change Apache port in XAMPP Config (usually to 8080)
- Update API URLs to use the new port

### MySQL won't start
- Check if port 3306 is already in use
- Check MySQL error logs in XAMPP

### Database connection error
- Verify MySQL is running
- Check credentials in `php/config/database.php`
- Default XAMPP credentials:
  - Host: `localhost`
  - User: `root`
  - Password: `` (empty)

### CORS errors
- Make sure `.htaccess` file is in your PHP directory
- Enable mod_headers in Apache (usually enabled by default)

### API returns 404
- Verify file paths are correct
- Check Apache is running
- Verify `.htaccess` is in place
- Check Apache error logs

## Default XAMPP Paths
- Apache: `C:\xampp\apache\`
- MySQL: `C:\xampp\mysql\`
- htdocs: `C:\xampp\htdocs\`
- phpMyAdmin: `http://localhost/phpmyadmin`

## Next Steps
1. Start Next.js frontend: `npm run dev`
2. Access at: `http://localhost:3000`
3. Backend API at: `http://localhost/api/...`

