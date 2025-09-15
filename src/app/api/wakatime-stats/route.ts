import { NextResponse } from 'next/server';

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const WAKATIME_API_URL = 'https://wakatime.com/api/v1/users/current/all_time_since_today';

export async function GET() {
  try {
    // WakaTime uses Basic Auth with API key as username and empty password
    const encodedAuth = Buffer.from(`${WAKATIME_API_KEY}:`).toString('base64');
    
    const response = await fetch(WAKATIME_API_URL, {
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`WakaTime API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`WakaTime API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching WakaTime stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WakaTime stats' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 