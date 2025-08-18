# React Medical Dashboard - Vercel Deployment Guide

This is a comprehensive React medical dashboard application built with TypeScript, React Router, and Vite. The app is configured to work with the URL structure `/react/template/dashboard` as the default landing page.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 📦 Project Structure

- **Framework**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router v7
- **Styling**: Bootstrap 5 + Custom SCSS
- **Base Path**: `/react/template/`
- **Landing Page**: `/react/template/dashboard`

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Vercel Deployment

### Method 1: Auto Deploy from Git

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect the configuration from `vercel.json`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Configuration Files

The project includes pre-configured files for seamless deployment:

- `vercel.json` - Vercel configuration with SPA routing support
- `vite.config.ts` - Vite build configuration with correct base path
- `public/_redirects` - Fallback routing for SPA

## 🗂️ URL Structure

The application maintains the following URL structure:

- **Base URL**: `https://yourapp.vercel.app/react/template/`
- **Dashboard**: `https://yourapp.vercel.app/react/template/dashboard` (Default)
- **Doctor Dashboard**: `https://yourapp.vercel.app/react/template/doctor/doctor-dashboard`
- **Patient Dashboard**: `https://yourapp.vercel.app/react/template/patient/patient-dashboard`

All other routes follow the pattern: `https://yourapp.vercel.app/react/template/{route}`

## ✨ Features

- 📱 Responsive medical dashboard
- 👨‍⚕️ Doctor management system
- 🏥 Patient management
- 📅 Appointment scheduling
- 💰 Finance & billing
- 👥 HRM modules
- 📊 Reports and analytics
- ⚙️ Comprehensive settings
- 🎨 Multiple UI components

## 🔧 Environment Variables

No environment variables are required for basic deployment. The app uses local configuration files.

## 📋 Deployment Checklist

- [x] Vercel configuration (`vercel.json`)
- [x] Vite build setup with correct base path
- [x] SPA routing fallbacks
- [x] Asset path configuration
- [x] Root route redirects to dashboard
- [x] Build optimization
- [x] TypeScript compilation

## 🆘 Troubleshooting

### Route Not Found (404)
- Ensure `vercel.json` rewrites are configured
- Check that base path is set to `/react/template/` in `vite.config.ts`

### Assets Not Loading
- Verify the base path in `vite.config.ts`
- Check asset imports use relative paths

### Build Errors
- Run `npm run build` locally to check for TypeScript errors
- Ensure all dependencies are in `package.json`

## 📞 Support

For deployment issues or questions, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
