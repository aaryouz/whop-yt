# Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
Ensure all environment variables are set in your deployment platform (Vercel, etc.):

```env
WHOP_API_KEY=hSY9Wucv-2z3XnIPC0um7_DgNJqkR_ggkZhtXiIYnu8
NEXT_PUBLIC_WHOP_APP_ID=app_nJYlDNkveGqrUL
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_NPusWs7BnfFlu
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_q1t1AYmgQ2gbYX
YOUTUBE_API_KEY=AIzaSyAdH1dUFHdysoTx_ceMzoywHsFdLaKHw8c
TRANSCRIPT_API_KEY=sk_Xa-8XMRvJLvR64aUcqiP1QZde2QlHnqbe5TwbWa0Gfc
```

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

1. **Connect Repository**
   ```bash
   # Push code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Update Whop Settings**
   - Navigate to Whop Developer Dashboard
   - Update Base URL to your Vercel URL
   - Save changes

4. **Test the App**
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
