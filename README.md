# YouTube Shorts Transcript Extractor

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Whop](https://img.shields.io/badge/Whop-Integrated-4F6AFF?style=flat-square)](https://whop.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

A powerful Next.js application that extracts transcripts from the most viral YouTube Shorts on any channel. Built with the Whop SDK for authentication and access control, featuring both standalone and embedded deployment modes.

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API Reference](#api-reference) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The YouTube Shorts Transcript Extractor helps content creators, marketers, and researchers analyze viral YouTube Shorts by automatically extracting transcripts from multiple videos. The app ranks shorts by view count and provides bulk export capabilities in JSON and Excel formats.

### Why This Tool?

- **Content Research**: Analyze what makes shorts go viral
- **Competitor Analysis**: Study successful content strategies
- **Script Writing**: Get inspiration from top-performing shorts
- **SEO & Marketing**: Extract keywords and phrases from viral content
- **Time Savings**: Batch process up to 100 shorts at once

---

## ✨ Features

### Core Functionality

- 🎬 **Bulk Transcript Extraction**: Extract transcripts from 5-100 shorts per request
- 📊 **View-Based Ranking**: Automatically sorts shorts by view count (most viral first)
- 📥 **Multiple Export Formats**:
  - JSON with full metadata (title, views, URL, timestamp)
  - Excel (XLSX) with shorts links and transcripts
- 🎨 **Dark Theme UI**: Native Whop design system integration
- 🔄 **Real-time Processing**: Live progress indicators with transparent transcript availability info
- 📋 **One-Click Copy**: Copy individual transcripts to clipboard instantly

### Dual Deployment Modes

#### 🌐 Standalone Mode
- Direct access via Vercel URL (e.g., `https://your-app.vercel.app`)
- No authentication required
- Perfect for public use or sharing with teams
- Works independently of Whop platform

#### 🔐 Whop Embedded Mode
- Full Whop SDK integration
- User authentication and authorization
- Access control per experience/company
- Seamless integration with Whop marketplace

### Technical Highlights

- ⚡ Built on **Next.js 15.3** with App Router
- 🎨 **Tailwind CSS 4** with custom Whop design tokens
- 🔒 Server-side API routes for secure key management
- 📱 Fully responsive design
- 🚀 Edge-ready with Vercel deployment
- 🛡️ TypeScript for type safety
- ♿ Accessible UI components

---

## 🎥 Demo

### Standalone Access
Visit the app directly at your deployed URL (e.g., `https://whop-yt.vercel.app`)

### Whop Integration
Install from [Whop Marketplace](https://whop.com/apps/) and access through your Whop hub

---

## 🏗️ Architecture

```
whop-yt/
├── app/
│   ├── api/
│   │   ├── extract-shorts/      # Main extraction API endpoint
│   │   ├── test-youtube/        # YouTube API health check
│   │   └── webhooks/            # Whop webhook handler
│   ├── dashboard/[companyId]/   # Whop company dashboard view
│   ├── experiences/[experienceId]/ # Whop-authenticated app view
│   │   ├── page.tsx            # Experience page with auth
│   │   └── extract-form.tsx    # Main UI component
│   ├── discover/                # App discovery page
│   ├── page.tsx                 # Standalone mode (root)
│   ├── layout.tsx               # Root layout with WhopApp wrapper
│   └── globals.css              # Whop dark theme + Tailwind
├── lib/
│   └── whop-sdk.ts              # Whop SDK configuration
├── .env.example                 # Environment variable template
└── next.config.ts               # Next.js + Whop config
```

### Key Components

- **ExtractForm**: Main UI component handling form state, API calls, and results display
- **API Routes**: Server-side endpoints that securely use API keys
- **Whop SDK Integration**: Authentication, authorization, and user management
- **Dark Theme**: CSS variables matching Whop's design system

---

## 📦 Prerequisites

- **Node.js**: 18.x or higher
- **npm/pnpm/yarn**: Latest version
- **Whop Developer Account**: For embedded mode (optional)
- **API Keys**:
  - YouTube Data API v3 key ([Get one here](https://console.cloud.google.com))
  - Transcript API key ([Get from TranscriptAPI](https://transcriptapi.com))
  - Whop API credentials (for embedded mode only)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aaryouz/whop-yt.git
cd whop-yt
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# ====================
# WHOP CONFIGURATION (Required for embedded mode only)
# ====================
WHOP_API_KEY=your_whop_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
NEXT_PUBLIC_WHOP_APP_ID=your_app_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id

# ====================
# YOUTUBE API (Required)
# ====================
YOUTUBE_API_KEY=your_youtube_api_key

# ====================
# TRANSCRIPT API (Required)
# ====================
TRANSCRIPT_API_KEY=your_transcript_api_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

For Whop development mode:
1. Click the translucent settings icon in the top-right
2. Select "localhost" mode
3. The app will connect to your local server

---

## ⚙️ Configuration

### YouTube Data API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Add key to `.env.local`

### Transcript API Setup

1. Visit [TranscriptAPI](https://transcriptapi.com)
2. Sign up for an account
3. Generate an API key
4. Add key to `.env.local`

### Whop App Setup (For Embedded Mode)

1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. Create a new app
3. Configure app settings:
   - **Base URL**: Your deployed domain (e.g., `https://whop-yt.vercel.app`)
   - **App Path**: `/experiences/[experienceId]`
   - **Dashboard Path**: `/dashboard/[companyId]`
   - **Discover Path**: `/discover`
4. Copy environment variables to `.env.local`
5. Install app into your Whop company

---

## 💻 Usage

### Standalone Mode

1. Visit your deployed app URL or `http://localhost:3000`
2. Enter a YouTube channel URL (e.g., `https://youtube.com/@channelname`)
3. Select how many shorts to extract (5-100)
4. Click "Extract Top [N] Shorts"
5. Wait for processing (typically 30-60 seconds)
6. View results with transcripts
7. Export as JSON or Excel

### Whop Embedded Mode

1. Install app from Whop marketplace
2. Access through your Whop hub
3. Same extraction flow as standalone mode
4. Access controlled by Whop memberships

### Features & Tips

- **Transcript Availability**: Most channels have 80-100% transcript availability, but some creators disable captions
- **API Credits**: Higher limits (50-100) consume more API credits and take longer
- **Copy Functionality**: Click "Copy" on any transcript to copy to clipboard
- **Excel Export**: Perfect for sharing with teams or importing to other tools
- **JSON Export**: Includes full metadata for programmatic use

---

## 🔌 API Reference

### POST `/api/extract-shorts`

Extracts transcripts from YouTube Shorts on a given channel.

**Request Body:**
```json
{
  "channelUrl": "https://youtube.com/@channelname",
  "limit": 25
}
```

**Response:**
```json
{
  "success": true,
  "channelId": "UCxxxxx",
  "totalShorts": 150,
  "shorts": [
    {
      "id": "video_id",
      "title": "Video Title",
      "viewCount": 1500000,
      "publishedAt": "2025-10-15T10:30:00Z",
      "thumbnail": "https://i.ytimg.com/...",
      "url": "https://youtube.com/shorts/...",
      "transcript": "Full transcript text..."
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Invalid channel URL format"
}
```

### POST `/api/webhooks`

Handles Whop webhook events.

**Headers:**
- `x-whop-signature`: Webhook signature for verification

**Body:**
```json
{
  "event": "membership.went_valid",
  "data": { ... }
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Via Vercel Dashboard

1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `WHOP_API_KEY`
   - `WHOP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
   - `NEXT_PUBLIC_WHOP_APP_ID`
   - `NEXT_PUBLIC_WHOP_COMPANY_ID`
   - `YOUTUBE_API_KEY`
   - `TRANSCRIPT_API_KEY`
5. Click "Deploy"

#### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add YOUTUBE_API_KEY production
vercel env add TRANSCRIPT_API_KEY production
# ... add all other variables

# Redeploy with environment variables
vercel --prod
```

### Post-Deployment Configuration

#### For Whop Integration:
1. Copy your Vercel deployment URL (e.g., `https://whop-yt.vercel.app`)
2. Go to Whop Developer Dashboard
3. Update **Base URL** to your Vercel URL
4. Save changes
5. Test the app through Whop platform

#### For Standalone Use:
Your app is immediately accessible at your Vercel URL - no additional configuration needed!

---

## 🛠️ Development

### Project Structure

```
whop-yt/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── experiences/       # Whop experience views
│   ├── dashboard/         # Whop dashboard views
│   └── page.tsx           # Standalone homepage
├── lib/                   # Utilities and SDK setup
├── public/                # Static assets
└── node_modules/          # Dependencies
```

### Key Technologies

- **Framework**: Next.js 15.3 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4 + CSS Variables
- **UI Components**: Radix UI primitives
- **State Management**: React hooks (useState)
- **API Integration**:
  - YouTube Data API v3 (googleapis)
  - TranscriptAPI
  - Whop SDK (@whop/api, @whop/react)
- **Export**: XLSX (xlsx package)
- **Deployment**: Vercel with Edge Functions

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Development Workflow

1. Make changes to source files
2. Test locally with `npm run dev`
3. Build with `npm run build` to check for errors
4. Commit changes with descriptive messages
5. Push to GitHub
6. Vercel auto-deploys from main branch

---

## 🐛 Troubleshooting

### Common Issues

#### "App Base URL not set" error on Whop
**Solution**: Ensure Base URL is set in Whop Developer Dashboard to your Vercel URL.

#### Environment variables not loading
**Solution**:
- Verify `.env.local` exists and has correct format
- Rebuild app after adding new variables: `npm run build`
- In Vercel, add variables in project settings → Environment Variables → Redeploy

#### YouTube API quota exceeded
**Solution**:
- YouTube Data API has a daily quota limit
- Wait 24 hours for quota reset
- Or create additional Google Cloud projects for more quota

#### Transcripts not available
**Solution**:
- This is expected behavior when creators disable captions
- Try different channels - most have 80-100% availability
- The app clearly indicates when transcripts are unavailable

#### App not loading in Whop iframe
**Solution**:
- Check that App Path is set to `/experiences/[experienceId]`
- Verify Base URL matches your deployment
- Clear browser cache and retry

#### TypeScript errors during build
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Getting Help

- 📖 [Whop Documentation](https://dev.whop.com)
- 🐛 [Report Issues](https://github.com/aaryouz/whop-yt/issues)
- 💬 [Next.js Discord](https://discord.gg/nextjs)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing formatting (prettier/biome)
- Add comments for complex logic
- Update README if adding new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Aaryan Sonawane**
- GitHub: [@aaryouz](https://github.com/aaryouz)

---

## 🙏 Acknowledgments

- [Whop](https://whop.com) - Platform and SDK
- [Next.js](https://nextjs.org) - React framework
- [Vercel](https://vercel.com) - Hosting platform
- [Google](https://developers.google.com/youtube/v3) - YouTube Data API
- [TranscriptAPI](https://transcriptapi.com) - Transcript extraction service

---

<div align="center">

**[⬆ Back to Top](#youtube-shorts-transcript-extractor)**

Made with ❤️ using Next.js and Whop

</div>
