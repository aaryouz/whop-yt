import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

interface ShortVideo {
  id: string;
  title: string;
  viewCount: number;
  publishedAt: string;
  thumbnail: string;
  url: string;
  transcript?: string;
}

/**
 * Extract channel ID from various YouTube URL formats
 * Returns ONLY actual channel IDs (starting with UC), not handles
 */
export function extractChannelId(url: string): string | null {
  // Only match actual channel IDs (UC format)
  const channelIdPattern = /youtube\.com\/channel\/(UC[^\/\?]+)/;
  const match = url.match(channelIdPattern);

  if (match) {
    console.log('extractChannelId: Found channel ID:', match[1]);
    return match[1];
  }

  console.log('extractChannelId: No channel ID found in URL');
  return null;
}

/**
 * Get channel ID from username or handle
 */
export async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  try {
    // Remove @ if present
    const cleanHandle = handle.replace('@', '');

    const response = await youtube.search.list({
      part: ['snippet'],
      q: cleanHandle,
      type: ['channel'],
      maxResults: 1,
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].snippet?.channelId || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting channel ID from handle:', error);
    return null;
  }
}

/**
 * Get the uploads playlist ID from a channel ID
 * Channel IDs start with UC, uploads playlist IDs start with UU
 */
function getUploadsPlaylistId(channelId: string): string {
  if (channelId.startsWith('UC')) {
    return 'UU' + channelId.slice(2);
  }
  return channelId;
}

/**
 * Fetch all shorts from a YouTube channel using uploads playlist
 * This is more reliable than search.list
 */
export async function fetchChannelShorts(channelId: string): Promise<ShortVideo[]> {
  try {
    console.log('fetchChannelShorts: Starting for channel:', channelId);
    const shorts: ShortVideo[] = [];
    let pageToken: string | undefined;
    let totalFetched = 0;

    // Convert channel ID to uploads playlist ID
    const uploadsPlaylistId = getUploadsPlaylistId(channelId);
    console.log('Using uploads playlist ID:', uploadsPlaylistId);

    // Fetch videos from the channel's uploads playlist
    do {
      console.log(`Fetching page... Total fetched so far: ${totalFetched}, Shorts found: ${shorts.length}`);

      // Get videos from uploads playlist
      const playlistResponse = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: pageToken,
      });

      console.log('Playlist response received, items:', playlistResponse.data.items?.length || 0);

      if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
        console.log('No more items found');
        break;
      }

      const videoIds = playlistResponse.data.items
        .map(item => item.contentDetails?.videoId)
        .filter((id): id is string => !!id);

      console.log('Video IDs extracted:', videoIds.length);

      if (videoIds.length === 0) break;

      totalFetched += videoIds.length;

      // Get detailed video statistics in batches
      console.log('Fetching video details for', videoIds.length, 'videos');
      const statsResponse = await youtube.videos.list({
        part: ['statistics', 'snippet', 'contentDetails'],
        id: videoIds,
      });

      console.log('Stats response received, items:', statsResponse.data.items?.length || 0);

      if (statsResponse.data.items) {
        for (const video of statsResponse.data.items) {
          // Filter for actual Shorts (60 seconds or less)
          const duration = video.contentDetails?.duration || '';
          const isShort = isShortDuration(duration);

          if (isShort && video.statistics?.viewCount) {
            shorts.push({
              id: video.id || '',
              title: video.snippet?.title || '',
              viewCount: parseInt(video.statistics.viewCount),
              publishedAt: video.snippet?.publishedAt || '',
              thumbnail: video.snippet?.thumbnails?.high?.url || '',
              url: `https://www.youtube.com/shorts/${video.id}`,
            });
            console.log(`✅ Found short: ${video.snippet?.title} (${duration}, ${video.statistics.viewCount} views)`);
          }
        }
      }

      pageToken = playlistResponse.data.nextPageToken || undefined;
      console.log('Page token for next:', pageToken ? 'exists' : 'none');

      // Limit to prevent excessive API calls
      // Fetch up to 500 videos or until we have 100+ shorts
      if (totalFetched >= 500 || shorts.length >= 100) {
        console.log(`Stopping: totalFetched=${totalFetched}, shorts found=${shorts.length}`);
        break;
      }

    } while (pageToken);

    console.log(`fetchChannelShorts: Completed. Found ${shorts.length} shorts out of ${totalFetched} videos`);
    return shorts;
  } catch (error) {
    console.error('Error fetching channel shorts:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as any;
      console.error('API Error details:', apiError.response?.data);
    }
    throw error;
  }
}

/**
 * Check if video duration represents a Short (60 seconds or less)
 */
function isShortDuration(duration: string): boolean {
  // Duration format: PT1M30S (1 minute 30 seconds)
  const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;

  const minutes = parseInt(match[1] || '0');
  const seconds = parseInt(match[2] || '0');
  const totalSeconds = minutes * 60 + seconds;

  return totalSeconds <= 60;
}

/**
 * Get top N most viral shorts
 */
export function getTopViralShorts(shorts: ShortVideo[], count: number = 25): ShortVideo[] {
  return shorts
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, count);
}

/**
 * Fetch transcript for a video using TranscriptAPI.com
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  try {
    console.log(`Attempting to fetch transcript for video: ${videoId}`);

    const apiKey = process.env.TRANSCRIPT_API_KEY;
    if (!apiKey) {
      console.error('TRANSCRIPT_API_KEY not found in environment');
      return 'Transcript API not configured';
    }

    const response = await fetch(
      `https://transcriptapi.com/api/v2/youtube/transcript?video_url=${videoId}&format=text`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 404) {
        console.log(`❌ No transcript available for ${videoId} (404)`);
        return 'Transcript not available (may be disabled by creator)';
      } else if (status === 402) {
        console.error(`❌ TranscriptAPI credits exhausted (402)`);
        return 'Transcript service credits exhausted';
      } else if (status === 429) {
        console.error(`❌ TranscriptAPI rate limit exceeded (429)`);
        return 'Transcript service rate limited';
      } else {
        console.error(`❌ TranscriptAPI error ${status} for ${videoId}`);
        return `Transcript service error (${status})`;
      }
    }

    const data = await response.json();
    const transcript = data.transcript;

    if (!transcript || transcript.trim().length === 0) {
      console.log(`No transcript content for ${videoId}`);
      return 'No transcript available for this video';
    }

    console.log(`✅ Successfully fetched transcript for ${videoId} (${transcript.length} chars)`);
    return transcript;

  } catch (error: any) {
    console.error(`❌ Error fetching transcript for ${videoId}:`, error.message || error);
    return 'Error fetching transcript';
  }
}

/**
 * Fetch transcripts for multiple videos
 */
export async function fetchTranscriptsForShorts(shorts: ShortVideo[]): Promise<ShortVideo[]> {
  const shortsWithTranscripts = await Promise.all(
    shorts.map(async (short) => {
      const transcript = await fetchTranscript(short.id);
      return { ...short, transcript };
    })
  );

  return shortsWithTranscripts;
}
