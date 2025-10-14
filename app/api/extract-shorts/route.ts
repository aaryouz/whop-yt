import { NextRequest, NextResponse } from 'next/server';
import {
  extractChannelId,
  getChannelIdFromHandle,
  fetchChannelShorts,
  getTopViralShorts,
  fetchTranscriptsForShorts,
} from '@/lib/youtube';

export async function POST(request: NextRequest) {
  console.log('=== EXTRACT SHORTS API CALLED ===');

  try {
    const { channelUrl } = await request.json();
    console.log('Channel URL received:', channelUrl);

    if (!channelUrl) {
      console.log('ERROR: No channel URL provided');
      return NextResponse.json(
        { error: 'Channel URL is required', debug: 'No channelUrl in request body' },
        { status: 400 }
      );
    }

    // Check if YouTube API key exists
    if (!process.env.YOUTUBE_API_KEY) {
      console.log('ERROR: YouTube API key not found in environment');
      return NextResponse.json(
        { error: 'YouTube API key not configured', debug: 'YOUTUBE_API_KEY missing from .env.local' },
        { status: 500 }
      );
    }

    console.log('YouTube API key found:', process.env.YOUTUBE_API_KEY.substring(0, 10) + '...');

    // Extract channel ID from URL
    console.log('Attempting to extract channel ID...');
    let channelId = extractChannelId(channelUrl);
    console.log('Channel ID from URL:', channelId);

    // If not found, try to get it from handle
    if (!channelId) {
      console.log('Channel ID not found in URL, trying handle...');
      const handle = channelUrl.split('/').pop() || channelUrl;
      console.log('Handle extracted:', handle);
      channelId = await getChannelIdFromHandle(handle);
      console.log('Channel ID from handle:', channelId);
    }

    if (!channelId) {
      console.log('ERROR: Could not extract channel ID');
      return NextResponse.json(
        {
          error: 'Could not extract channel ID from the provided URL',
          debug: `Tried URL patterns and handle search for: ${channelUrl}`
        },
        { status: 400 }
      );
    }

    console.log('Successfully got channel ID:', channelId);
    console.log('Fetching shorts from channel...');

    // Fetch all shorts from the channel
    const allShorts = await fetchChannelShorts(channelId);
    console.log('Found shorts count:', allShorts.length);

    if (allShorts.length === 0) {
      console.log('ERROR: No shorts found');
      return NextResponse.json(
        {
          error: 'No shorts found for this channel',
          debug: `Channel ID ${channelId} returned 0 shorts. This could mean: 1) No shorts exist, 2) API quota exceeded, 3) Private channel`
        },
        { status: 404 }
      );
    }

    // Get top 25 most viral shorts
    console.log('Getting top 25 shorts...');
    const topShorts = getTopViralShorts(allShorts, 25);
    console.log('Top shorts selected:', topShorts.length);

    // Fetch transcripts for the top shorts
    console.log('Fetching transcripts...');
    const shortsWithTranscripts = await fetchTranscriptsForShorts(topShorts);
    console.log('Transcripts fetched successfully');

    return NextResponse.json({
      success: true,
      channelId,
      totalShorts: allShorts.length,
      shorts: shortsWithTranscripts,
    });

  } catch (error) {
    console.error('=== ERROR IN EXTRACT SHORTS ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        error: 'Failed to extract shorts',
        debug: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
