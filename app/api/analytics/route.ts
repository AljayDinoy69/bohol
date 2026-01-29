import { NextRequest, NextResponse } from 'next/server';

export interface Analytics {
  totalSites: number;
  activeSites: number;
  unstableSites: number;
  unavailableSites: number;
  averageSignalStrength: number;
  lastUpdated: string;
  trends: {
    date: string;
    active: number;
    unstable: number;
    unavailable: number;
  }[];
}

// Mock analytics data - replace with real database queries
function generateMockAnalytics(): Analytics {
  const now = new Date();
  const trends = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    trends.push({
      date: date.toISOString().split('T')[0],
      active: Math.floor(Math.random() * 10) + 15,
      unstable: Math.floor(Math.random() * 5) + 2,
      unavailable: Math.floor(Math.random() * 3) + 1
    });
  }

  return {
    totalSites: 25,
    activeSites: 18,
    unstableSites: 5,
    unavailableSites: 2,
    averageSignalStrength: 78.5,
    lastUpdated: now.toISOString(),
    trends
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';

    const analytics = generateMockAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics,
      period
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
