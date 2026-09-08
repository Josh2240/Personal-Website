# Complete Setup Guide

## 🚀 Quick Start

### Part 1: Frontend (Next.js)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set your API URL:

   ```edit
   NEXT_PUBLIC_API_URL=http://localhost/api
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

- Frontend will be at: `http://localhost:3000`

### Part 2: Backend (XAMPP)

1. **Install XAMPP** (if not installed)
   - Download from: <https://www.apachefriends.org/>

   - Install to default location: `C:\xampp\`

2. **Copy PHP files to XAMPP:**
   - Copy the `php` folder to `C:\xampp\htdocs\`
   - Rename it to `api` (optional, but recommended)
   - Result: `C:\xampp\htdocs\api\`

3. **Copy assets:**
   - Copy the `assets` folder to `C:\xampp\htdocs\`
   - Result: `C:\xampp\htdocs\assets\`

4. **Start XAMPP services:**
   - Open XAMPP Control Panel
   - Start **Apache**
   - Start **MySQL**

5. **Create database:**
   - Open: `http://localhost/phpmyadmin`
   - Click "New" → Database name: `personal_website` → Create
   - Click on `personal_website` → Click "Import" tab
   - Choose file: `database/schema.sql` from project root
   - Click "Go"

6. **Verify API:**
   - Test: `http://localhost/api/api/profile.php`
   - Should return JSON

### Part 3: Configuration

**If your PHP files are at `C:\xampp\htdocs\api\`:**

- API URLs will be: `http://localhost/api/api/profile.php`
- Update `.env.local`:

  ```update
  NEXT_PUBLIC_API_URL=http://localhost/api/api
  ```

**If you want cleaner URLs:**

1. Move files from `php/api/` to `php/` directly
2. Update `.env.local`.

  ```file
  NEXT_PUBLIC_API_URL=http://localhost/api
  ```

## 📁 Final Directory Structure

- This final directory structure is to finalize the structure I made 2 months ago.

### Project Root

```project root
.
├── app/                    # Next.js pages
├── components/             # React components
├── php/                    # PHP backend
│   ├── api/               # API endpoints
│   └── config/            # Database config
├── database/              # SQL schema
├── public/                # Next.js public assets
└── assets/                # Static assets (copy to XAMPP)
```

### XAMPP htdocs

```htdocs
C:\xampp\htdocs\
├── api/                    # PHP backend
│   ├── api/
│   │   ├── profile.php
│   │   ├── projects.php
│   │   └── socials.php
│   └── config/
│       └── database.php
└── assets/                 # Static assets
```

## ✅ Verification Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `personal_website` exists
- [ ] PHP files copied to `C:\xampp\htdocs\api\`
- [ ] Assets copied to `C:\xampp\htdocs\assets\`
- [ ] API test: `http://localhost/api/api/profile.php` returns JSON
- [ ] Next.js dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] Next.js dev server running (`npm run dev`)
- [ ] Frontend accessible at `http://localhost:3000`

## 🐛 Troubleshooting

### CORS Errors

- Make sure `.htaccess` is in `C:\xampp\htdocs\api\`
- Enable mod_headers in Apache (usually enabled)

### Database Connection

- Verify MySQL is running
- Check credentials in `php/config/database.php`
- Default: user=`root`, password=``

### API 404

- Check file paths match
- Verify Apache is running
- Check Apache error logs

### Frontend Can't Connect

- Verify API URL in `.env.local`
- Check browser console for errors
- Test API directly in browser

## 🎯 Next Steps

1. Customize content in database
2. Add more projects via API
3. Update profile information
4. Deploy to production when ready

For detailed XAMPP setup, see `XAMPP_SETUP.md`
