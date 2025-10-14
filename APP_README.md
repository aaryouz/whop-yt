# YouTube Shorts Transcript Extractor - Whop App

A Whop app that extracts transcripts from the top 25 most viral YouTube Shorts from any channel.

## Features

- Extract YouTube Shorts from any channel by URL
- Automatically identifies the top 25 most viral shorts by view count
- Fetches transcripts for each short
- Beautiful UI with video thumbnails and statistics
- Download all transcripts as JSON
- Copy individual transcripts with one click
- Access control integration with Whop

## Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Styling**: Tailwind CSS
- **APIs**:
  - Whop SDK (@whop/api) - Authentication & access control
  - Google YouTube Data API v3 - Fetching shorts data
  - TranscriptAPI.com - Professional transcript extraction (paid service)

## Setup Instructions

### 1. Get Required API Keys

#### Whop App Credentials
1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. Create a new app or select existing
3. Configure hosting paths:
   - Base URL: Your deployment URL
   - App path: `/experiences/[experienceId]`
   - Dashboard path: `/dashboard/[companyId]`
   - Discover path: `/discover`
4. Copy your API credentials

#### YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

#### TranscriptAPI Key
1. Go to [TranscriptAPI.com](https://transcriptapi.com/)
2. Sign up for an account
3. Choose a plan (credits required: 1 credit per transcript)
4. Navigate to Dashboard > API Keys
5. Create a new API key and copy it

### 2. Environment Variables

The `.env.local` file is already configured with:

```env
WHOP_API_KEY=your_whop_api_key
NEXT_PUBLIC_WHOP_APP_ID=your_app_id
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_user_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id
YOUTUBE_API_KEY=your_youtube_api_key
TRANSCRIPT_API_KEY=your_transcriptapi_key
```

### 3. Run the App

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Testing Locally with Whop

1. Install the app on a Whop from your developer dashboard
2. Navigate to the experience view
3. In the top right, find the settings icon
4. Select "localhost" to test locally
5. Default port 3000 should work automatically

## How to Use

1. **Access the App**: Users need to have access to your Whop to use the app
2. **Enter Channel URL**: Paste any YouTube channel URL (formats supported):
   - `https://youtube.com/@channelname`
   - `https://youtube.com/channel/UC...`
   - `https://youtube.com/c/channelname`
   - `https://youtube.com/user/username`
3. **Click Extract**: The app will:
   - Fetch all shorts from the channel
   - Identify the top 25 by view count
   - Extract transcripts for each
   - Display results with thumbnails and stats
4. **View Results**:
   - Scroll through the ranked list
   - Copy individual transcripts
   - Download all transcripts as JSON

## Project Structure

```
yt-shorts-extractor/
├── app/
│   ├── api/
│   │   └── extract-shorts/
│   │       └── route.ts          # API endpoint for extraction
│   ├── experiences/
│   │   └── [experienceId]/
│   │       ├── page.tsx           # Main experience view
│   │       └── extract-form.tsx   # Client component with UI
│   ├── dashboard/
│   └── discover/
├── lib/
│   ├── whop-sdk.ts               # Whop SDK configuration
│   └── youtube.ts                # YouTube API functions
├── .env.local                    # Environment variables
└── package.json
```

## Key Functions

### lib/youtube.ts

- `extractChannelId()` - Extract channel ID from various URL formats (UC... format)
- `getChannelIdFromHandle()` - Convert @handle to channel ID via YouTube search
- `getUploadsPlaylistId()` - Convert channel ID (UC...) to uploads playlist ID (UU...)
- `fetchChannelShorts()` - Fetch all shorts from uploads playlist (up to 500 videos)
- `isShortDuration()` - Check if video duration is ≤60 seconds (PT1M format)
- `getTopViralShorts()` - Sort and get top N shorts by views
- `fetchTranscript()` - Get transcript using TranscriptAPI.com with error handling
- `fetchTranscriptsForShorts()` - Batch fetch transcripts with parallel requests

## API Endpoints

### POST /api/extract-shorts

**Request Body:**
```json
{
  "channelUrl": "https://youtube.com/@channelname"
}
```

**Response:**
```json
{
  "success": true,
  "channelId": "UC...",
  "totalShorts": 150,
  "shorts": [
    {
      "id": "videoId",
      "title": "Video Title",
      "viewCount": 1000000,
      "publishedAt": "2024-01-01T00:00:00Z",
      "thumbnail": "https://...",
      "url": "https://youtube.com/shorts/...",
      "transcript": "Full transcript text..."
    }
  ]
}
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.local`
4. Deploy

### Update Whop Dashboard

1. Go to app settings
2. Update Base URL to your Vercel domain
3. Update webhook URLs if needed

## Monetization

The app includes access control. You can monetize by:

1. Creating an access pass in Whop dashboard
2. Setting pricing (one-time, subscription, per-seat)
3. Users must purchase to access the experience view

## Limitations & Costs

### YouTube API
- **Quota**: 10,000 units/day
- **Cost**: Free (within quota limits)
- **Usage**: ~10-20 units per extraction

### TranscriptAPI
- **Cost**: 1 credit per successful transcript (charged only on HTTP 200)
- **Rate Limit**: 200 requests/minute, 2 concurrent max
- **Cost per Extraction**: 25 credits (25 shorts × 1 credit each)
- **Failed Requests**: 0 credits (HTTP 404, 429, 500, etc. are not charged)

### Success Rates
- **Transcript Availability**: 80-100% depending on creator settings
- **MKBHD**: 100% (all shorts have transcripts)
- **MrBeast**: ~80% (some shorts have transcripts disabled)
- **Note**: Creators can disable transcripts - this cannot be bypassed by any service

### Other Limits
- Shorts identified as videos ≤60 seconds
- Maximum 25 shorts returned per extraction (top by view count)
- Scans up to 500 videos per channel to find shorts

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**App not loading in Whop:**
- Verify hosting paths in developer dashboard
- Check that localhost is selected in app settings
- Ensure .env.local has correct values

**No transcripts found:**
- Some videos don't have transcripts
- Auto-generated captions must be enabled
- Check video privacy settings

## Support

For issues or questions:
- Check [Whop Documentation](https://docs.whop.com)
- Visit Whop Developers community
- Check YouTube API documentation

## License

MIT
