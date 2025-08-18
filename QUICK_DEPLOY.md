# 🚀 Quick Deploy to Vercel

## One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## Manual Deployment

### 1. Push to Git Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy with Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy
```

### 3. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

## Expected URL Structure

After deployment, your app will be accessible at:
- **Production URL**: `https://your-app-name.vercel.app/react/template/dashboard`
- **All routes**: `https://your-app-name.vercel.app/react/template/{route}`

## Configuration Files Included

✅ `vercel.json` - Vercel deployment configuration  
✅ `vite.config.ts` - Vite build configuration with correct base path  
✅ `public/_redirects` - SPA routing fallbacks  
✅ `.vercelignore` - Optimized upload exclusions  

## Build Commands

- `npm run build` - Full build with TypeScript checks
- `npm run build:fast` - Fast build without TypeScript checks
- `npm run deploy` - Build and deploy to production
- `npm run deploy:preview` - Build and deploy to preview

## Troubleshooting

**Build taking too long?**
Use `npm run build:fast` for quicker builds during development.

**Routes not working?**
The `vercel.json` configuration handles SPA routing automatically.

**Assets not loading?**
The base path `/react/template/` is configured in `vite.config.ts`.
