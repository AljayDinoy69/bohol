import { NextRequest, NextResponse } from 'next/server';

export interface AppConfig {
  site: {
    title: string;
    description: string;
    logo: string;
    version: string;
  };
  contact: {
    email: string;
    phone: string;
    office: string;
    social: {
      facebook: string;
      youtube: string;
      instagram: string;
    };
  };
  about: {
    mission: string;
    dataSources: string;
    team: string;
  };
  map: {
    defaultCenter: [number, number];
    defaultZoom: number;
    tileUrl: string;
  };
}

// Mock config - replace with database or environment variables
const mockConfig: AppConfig = {
  site: {
    title: "Bohol Site Monitoring",
    description: "A monitoring dashboard that visualizes signal status across key areas of Bohol for faster situational awareness.",
    logo: "/wifi.jpg",
    version: "2.0.0"
  },
  contact: {
    email: "support@boholsignalmap.local",
    phone: "+63 900 000 0000",
    office: "Tagbilaran City, Bohol",
    social: {
      facebook: "https://facebook.com/boholmonitoring",
      youtube: "https://youtube.com/@boholmonitoring",
      instagram: "https://instagram.com/boholmonitoring"
    }
  },
  about: {
    mission: "Improve coverage visibility and response.",
    dataSources: "Sites, sensors, and field reports.",
    team: "Built by the local monitoring group."
  },
  map: {
    defaultCenter: [9.80, 124.20],
    defaultZoom: 9,
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  }
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockConfig
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real app, update the configuration in database
    Object.assign(mockConfig, body);

    return NextResponse.json({
      success: true,
      data: mockConfig
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
