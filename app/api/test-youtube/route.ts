import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    console.log('=== TESTING YOUTUBE API ===');

    const apiKey = process.env.YOUTUBE_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key prefix:', apiKey?.substring(0, 10));

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 500 });
    }

    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    // Test 1: Simple search
    console.log('Test 1: Simple search for "test"');
    try {
      const searchResult = await youtube.search.list({
        part: ['snippet'],
        q: 'test',
        maxResults: 1,
        type: ['video'],
      });
      console.log('✅ Test 1 passed - Simple search works');
      console.log('Found videos:', searchResult.data.items?.length);
    } catch (error: any) {
      console.log('❌ Test 1 failed:', error.message);
      return NextResponse.json({
        error: 'Test 1 failed',
        message: error.message,
        details: error.response?.data
      }, { status: 400 });
    }

    // Test 2: Search by channel ID with order
    console.log('Test 2: Search by channel with order=viewCount');
    try {
      const channelSearchResult = await youtube.search.list({
        part: ['snippet'],
        channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // PewDiePie
        maxResults: 5,
        order: 'viewCount',
        type: ['video'],
      });
      console.log('✅ Test 2 passed - Channel search with order works');
      console.log('Found videos:', channelSearchResult.data.items?.length);
    } catch (error: any) {
      console.log('❌ Test 2 failed:', error.message);
      return NextResponse.json({
        error: 'Test 2 failed',
        message: error.message,
        details: error.response?.data
      }, { status: 400 });
    }

    // Test 3: Videos.list for details
    console.log('Test 3: Get video details');
    try {
      const videoResult = await youtube.videos.list({
        part: ['contentDetails', 'statistics', 'snippet'],
        id: ['dQw4w9WgXcQ'], // Rick Astley
      });
      console.log('✅ Test 3 passed - Video details works');
      console.log('Duration:', videoResult.data.items?.[0]?.contentDetails?.duration);
    } catch (error: any) {
      console.log('❌ Test 3 failed:', error.message);
      return NextResponse.json({
        error: 'Test 3 failed',
        message: error.message,
        details: error.response?.data
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'All YouTube API tests passed!',
      apiKey: apiKey.substring(0, 10) + '...'
    });

  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
