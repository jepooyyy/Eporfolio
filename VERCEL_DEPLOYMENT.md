# Vercel Deployment Guide

## Overview
This guide covers deploying the E-Portfolio (React frontend + Django backend) to Vercel.

## Architecture
- **Frontend**: React/Vite - deploys to Vercel CDN
- **Backend**: Django/YOLOv8 - runs as Vercel Serverless Functions

## Prerequisites
1. Vercel account (free tier available)
2. GitHub repository (for easy deployment)
3. Git installed locally

## Step 1: Prepare for Deployment

### 1.1 Update API Endpoint Configuration
The app is configured to use environment variables for the API URL:
- Development: `http://localhost:8000`
- Production: `https://your-project.vercel.app/api`

### 1.2 Install Dependencies (Optional - Vercel does this automatically)
```bash
npm install
```

## Step 2: Deploy Frontend & Backend to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to your GitHub account
   - Select the repository
   - Accept default settings (or customize)
   - Deployment begins automatically

### Option B: Deploy via GitHub (GitHub Integration)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite setup
   - Click "Deploy"

## Step 3: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Settings > Environment Variables**
4. **Add variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-project.vercel.app` (replace with your actual Vercel URL)
   - Environments: Production, Preview, Development

5. **Redeploy** after setting environment variables

## Step 4: Test the Deployment

1. **Open your Vercel URL** in browser
2. **Click "Enter Portfolio"**
3. **Test image upload**:
   - Upload a test image
   - The simulator should show bird detections with overlays

## Important Notes

### Model Loading
- The YOLOv8 model (~6.2MB) is downloaded on first use
- **Cold start times**: First request may take 30-60 seconds (model loading)
- Subsequent requests are faster due to model caching

### Serverless Function Limitations
- Maximum execution time: 60 seconds (Pro) / 10 seconds (Free)
- Memory limit: 3008 MB (varies by plan)
- If model loading exceeds limits, consider:
  - Using a dedicated backend service (Railway, Render, etc.)
  - Pre-downloading model to reduce startup time
  - Using a model compression technique

### Recommended Alternative Backend Services

If Vercel serverless has limitations, consider:

#### Railway.app (Recommended)
```bash
# Deploy Django backend to Railway
railway link
railway up
```

#### Render.com
- Deploy in Services dashboard
- Better for long-running processes
- Free tier available

#### PythonAnywhere
- Python hosting specifically
- Easy Django deployment
- Free tier available

## Troubleshooting

### "Cannot connect to backend"
1. Check Vercel environment variables are set
2. Verify `VITE_API_URL` matches your Vercel domain
3. Check browser console for CORS errors
4. Ensure serverless function deployed successfully

### "Model loading timeout"
1. Cold start took too long
2. Retry the request (model should be cached)
3. Consider moving backend to dedicated service

### Build failures
1. Check build logs in Vercel Dashboard
2. Verify all dependencies in `package.json`
3. Ensure `npm run build` works locally first

## Deployment Status

- Frontend: ✅ Ready for Vercel
- Backend: ✅ Serverless functions configured
- Database: SQLite (local only - not suitable for production)
- Model: YOLOv8n (auto-downloads on first use)

## Next Steps

1. For production-grade deployment:
   - Add PostgreSQL database (via Vercel/Railway/AWS)
   - Configure error logging (Sentry)
   - Add CDN for model files (AWS S3)
   - Use background jobs for heavy processing

2. Monitor deployment:
   - Check Vercel Analytics
   - Set up alerts for failed deployments
   - Monitor serverless function execution times

## Support

For issues or questions:
- Check Vercel docs: https://vercel.com/docs
- Django deployment guide: https://docs.djangoproject.com/en/stable/howto/deployment/
- YOLOv8 guide: https://docs.ultralytics.com/
