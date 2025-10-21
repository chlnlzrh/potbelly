# 🚀 Deployment Guide

Quick deployment guide for the Potbelly Build Management System.

## ⚡ Quick Deploy

```bash
# Install dependencies
npm install

# Run deployment script (includes all checks)
npm run deploy
```

## 📋 Manual Deployment Steps

### 1. Prerequisites Check
```bash
# Verify all required files exist
npm run validate

# Type checking
npm run typecheck

# Linting
npm run lint
```

### 2. Build & Test
```bash
# Create production build
npm run build

# Test locally
npm run start
```

### 3. Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🌐 Environment Setup

### Required Environment Variables
```bash
# In Vercel dashboard or .env.local
NEXT_PUBLIC_APP_NAME="Potbelly Build Management"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### Optional Variables
```bash
# For analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=""

# For file storage (future)
BLOB_READ_WRITE_TOKEN=""
```

## 📱 PWA Installation

### For Pooja (iPhone 17 Pro Max)
1. Open Safari and navigate to deployed URL
2. Tap Share button → "Add to Home Screen"
3. Confirm installation
4. App will appear on home screen like native app

### For Arushi (Desktop)
1. Open Chrome/Edge and navigate to deployed URL
2. Look for install icon in address bar
3. Click "Install" to add to desktop
4. Access full Command Center features

## ✅ Post-Deployment Checklist

- [ ] Mobile PWA installs correctly on iOS
- [ ] Desktop Command Center loads without errors
- [ ] Task data loads from markdown file
- [ ] Photo upload functionality works
- [ ] AI insights generate properly
- [ ] One-tap calling works on mobile
- [ ] All responsive breakpoints work correctly

## 🔧 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Deployment Issues
```bash
# Check Vercel status
vercel --version

# Re-link project
vercel link

# Force redeploy
vercel --prod --force
```

### PWA Installation Issues
- Ensure HTTPS is enabled (automatic on Vercel)
- Check manifest.json is accessible
- Verify service worker registration
- Test on actual mobile device, not emulator

## 📊 Performance Optimization

### Already Implemented
- ✅ Mobile-first responsive design
- ✅ Image optimization ready
- ✅ Bundle size optimization
- ✅ React Query caching
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier

### Monitoring
- Vercel Analytics (automatic)
- Real User Monitoring available
- Bundle analyzer included

## 🎯 Success Metrics

After deployment, verify:
- **Mobile (Pooja)**: < 2s load time, smooth task management, photo upload works
- **Desktop (Arushi)**: < 1s navigation, all dashboard panels load, comprehensive data view
- **Both**: Real-time data sync, AI insights update, contractor contact integration

## 🔗 URLs

After deployment, you'll have:
- **Production**: `https://your-domain.vercel.app`
- **Preview**: `https://your-branch.vercel.app` (for testing)
- **Mobile PWA**: Add to home screen from production URL
- **Desktop**: Bookmark production URL

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review build output for errors
3. Test locally with `npm run build && npm run start`
4. Verify environment variables are set correctly

---

🎉 **Ready to launch!** The system is designed for immediate use by Pooja and Arushi.