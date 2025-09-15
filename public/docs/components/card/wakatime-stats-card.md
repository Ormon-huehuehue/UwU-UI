# WakaTime Stats Card

> A card showing WakaTime stats.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [wakatime-stats-card/route.ts](#wakatime-stats-cardroutets)
  - [WakaTime Stats Card Example](#wakatime-stats-card-example)
- [Understanding the component](#understanding-the-component)
- [Credits](#credits)
- [Other requirements](#other-requirements)

Example:

```tsx
'use client';

import React, { useState, useEffect } from 'react';

interface WakaTimeData {
  data: {
    daily_average: number;
    decimal: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
    range: {
      end: string;
      end_date: string;
      end_text: string;
      start: string;
      start_date: string;
      start_text: string;
      timezone: string;
    };
    text: string;
    timeout: number;
    total_seconds: number;
  };
}

function WakaTimeStatsCard() {
  const [stats, setStats] = useState<WakaTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/wakatime-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-start mt-8">
        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Loading stats</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex justify-start mt-8">
        <div className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-600">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Stats unavailable</span>
        </div>
      </div>
    );
  }

  const formatDailyAverage = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="flex flex-col items-start mt-8 w-full max-w-2xl gap-4">
      {/* Main card */}
      <div className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 w-full hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100/20 dark:via-zinc-800/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stats.data.is_up_to_date ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {stats.data.is_up_to_date ? 'Live' : 'Syncing'}
              </span>
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {stats.data.text}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Total coding time
              </div>
            </div>

            <div className="flex gap-8 text-right">
              <div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatDailyAverage(stats.data.daily_average)}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Daily avg
                </div>
              </div>
              
              <div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {stats.data.digital}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Digital
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="ml-2 flex justify-between w-full">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Tracking time since {stats.data.range.start_text}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Stats from WakaTime
        </p>
      </div>
    </div>
  );
}

export default WakaTimeStatsCard; 
```

## Installation

{/* Coming soon */}

## Usage

### wakatime-stats-card/route.ts

```tsx
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
```

### WakaTime Stats Card Example

```tsx
import WakaTimeStatsCard from "@/components/wakatime-stats-card";

export default function Example() {
  return <WakaTimeStatsCard />;
}
```

## Understanding the component

The card shows the total coding time, daily average, and digital coding time.

## Credits

By Sarthak Kapila.

## Other requirements

- WakaTime API key
- WakaTime API key is used to fetch the stats
- WakaTime Stats endpoint `/api/wakatime-stats` to fetch the stats

---

*This documentation is also available in [interactive format](https://uwuui.com/docs/components/components/card/wakatime-stats-card).*