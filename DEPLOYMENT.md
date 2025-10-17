# Deployment Checklist

## ✅ Build Status
- ✅ Local build tested and passing (with and without env vars)
- ✅ Package manager configured for npm
- ✅ vercel.json configuration added
- ✅ Whop SDK initialization fixed for build-time
- ✅ Layout component handles missing env vars gracefully
- ✅ Build passes without environment variables (Vercel-ready)

## Pre-Deployment

### 1. Environment Variables
⚠️ **CRITICAL**: Copy your actual environment variables from `.env.local` and add them to Vercel:

**Required Environment Variables:**
```env
WHOP_API_KEY=your_actual_key_here
NEXT_PUBLIC_WHOP_APP_ID=your_actual_app_id_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_actual_user_id_here
NEXT_PUBLIC_WHOP_COMPANY_ID=your_actual_company_id_here
YOUTUBE_API_KEY=your_actual_youtube_key_here
TRANSCRIPT_API_KEY=your_actual_transcript_key_here
```

**How to add them in Vercel:**
1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable above with your actual values from `.env.local`
4. ⚠️ **Important**: Add them for all environments (Production, Preview, Development)
5. After adding variables, trigger a new deployment

### 2. Whop App Configuration
Update your Whop app settings in the [Developer Dashboard](https://whop.com/dashboard/developer/):

1. **Base URL**: Set to your deployment URL (e.g., `https://your-app.vercel.app`)
2. **Paths**:
   - Experience: `/experiences/[experienceId]`
   - Dashboard: `/dashboard/[companyId]`
   - Discover: `/discover`

### 3. Security Check
- ⚠️ The `/test` route is accessible without authentication
- Consider restricting it to development only or adding password protection for production
- Alternatively, remove it entirely for production deployment

## Deployment Steps (Vercel)

1. **Verify Local Build**
   ```bash
   # Test the build locally first
   npm run build
   # Should complete without errors
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `npm run build` (auto-configured via vercel.json)
   - **Install Command**: `npm install` (auto-configured via vercel.json)
   - Add all 6 environment variables (see section 1 above)
   - Click Deploy

4. **Update Whop Settings**
   - Navigate to Whop Developer Dashboard
   - Update Base URL to your Vercel URL
   - Save changes

5. **Test the App**
   - Access your app through Whop
   - Test with a channel (e.g., `@mkbhd`)
   - Verify transcripts are fetching correctly
   - Check that authentication is working

## Post-Deployment

### 1. Monitor API Usage
- **YouTube API**: Check quota usage in Google Cloud Console
- **TranscriptAPI**: Monitor credit usage at transcriptapi.com/dashboard

### 2. Cost Monitoring
- Each extraction costs 25 TranscriptAPI credits (25 shorts × 1 credit)
- Budget accordingly based on expected usage
- Consider implementing usage limits if needed

### 3. Performance
- Typical extraction time: 10-15 seconds
- 88 shorts found for channels like MKBHD
- 80-100% transcript success rate

## Testing in Production

### Test with These Channels:
1. **@mkbhd** - 88 shorts, 100% transcripts
2. **@mrbeast** - 100+ shorts, ~80% transcripts
3. **Your target channel** - Verify functionality

### Expected Results:
- ✅ Top 25 shorts by view count
- ✅ Full transcripts (when available)
- ✅ Download as JSON works
- ✅ Copy to clipboard works
- ✅ Proper messaging for unavailable transcripts

## Common Build Issues & Solutions

### Build Fails with "Package Manager" Error
✅ **Fixed**: Removed pnpm configuration from package.json. Now uses npm.

### Build Fails with Missing Dependencies
- Run `npm install` locally first
- Make sure package-lock.json is committed to git
- Vercel will use the same dependencies

### Build Fails with TypeScript Errors
- Run `npm run build` locally to catch errors early
- Fix all TypeScript errors before deploying
- Check tsconfig.json is properly configured

### Environment Variables Not Working
- Ensure all 6 required variables are added in Vercel
- Variables must be added for Production, Preview, AND Development
- After adding/changing variables, redeploy the project
- Check variable names match exactly (case-sensitive)

## Troubleshooting

### If Transcripts Fail:
1. Check TRANSCRIPT_API_KEY is set correctly
2. Verify credits available at transcriptapi.com
3. Check API rate limits (200 req/min)

### If Shorts Not Found:
1. Verify YOUTUBE_API_KEY is set correctly
2. Check YouTube API quota in Google Cloud Console
3. Verify channel has actual Shorts (≤60 seconds)

### If Authentication Fails:
1. Verify WHOP_API_KEY is correct
2. Check Whop app paths are configured correctly
3. Ensure Base URL matches deployment URL

## Production URLs

After deployment, your app will be available at:
- Experience View: `https://your-domain.com/experiences/[experienceId]`
- Dashboard: `https://your-domain.com/dashboard/[companyId]`
- Discover: `https://your-domain.com/discover`

## Support

For issues:
- Whop: [docs.whop.com](https://docs.whop.com)
- YouTube API: [Google Cloud Console](https://console.cloud.google.com)
- TranscriptAPI: [transcriptapi.com/dashboard](https://transcriptapi.com/dashboard)
