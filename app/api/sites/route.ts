import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Site {
  _id?: string;
  id?: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  status: string;
  lastUpdated?: string;
  lastCheck?: string;
  signalStrength?: number;
  signal?: string;
  assignedPersonnel?: string;
  municipality?: string;
  description?: string;
}

// Helper function to convert ObjectIds to strings for JSON serialization
function serializeSite(site: any): any {
  if (!site) return site;
  return {
    ...site,
    _id: site._id ? site._id.toString() : site._id
  };
}

function serializeSites(sites: any[]): any[] {
  return sites.map(serializeSite);
}

// Helper function to log activity
async function logActivity(
  db: any,
  action: string,
  description: string,
  type: string,
  entity: string,
  entityId: string
) {
  try {
    const logsCollection = db.collection('activity_logs');
    await logsCollection.insertOne({
      action,
      description,
      type,
      entity,
      entityId,
      userId: 'system',
      details: {},
      timestamp: new Date()
    });
  } catch (error) {
    console.error('[API] Error logging activity:', error);
    // Don't throw - activity logging should not break the main operation
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const sitesCollection = db.collection('sites');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const municipality = searchParams.get('municipality');
    const id = searchParams.get('id');

    let filter: any = {};

    if (id) {
      filter._id = new ObjectId(id);
    }

    if (status) {
      filter.status = status;
    }

    if (municipality) {
      filter.municipality = { $regex: municipality, $options: 'i' };
    }

    const sites = await sitesCollection.find(filter).toArray();
    console.log('Fetched sites from database:', sites.length, 'sites found');

    return NextResponse.json({
      success: true,
      data: serializeSites(sites),
      total: sites.length
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/sites - Starting');
    
    const body = await request.json();
    console.log('[API] Request body:', body);
    
    // Validate required fields
    if (!body.name || !body.location) {
      console.log('[API] Validation failed - Missing name or location');
      return NextResponse.json(
        { success: false, error: 'Name and location are required' },
        { status: 400 }
      );
    }

    console.log('[API] Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('[API] Connected to MongoDB');
    
    const db = client.db('site1');
    console.log('[API] Using database: site1');
    
    const sitesCollection = db.collection('sites');
    console.log('[API] Using collection: sites');
    
    const newSite = {
      name: body.name,
      location: {
        type: "Point",
        coordinates: [body.lng || 0, body.lat || 0]
      },
      locationName: body.location,
      lat: body.lat || 0,
      lng: body.lng || 0,
      status: body.status || 'Active',
      signal: body.signal || 'Strong',
      assignedPersonnel: body.assignedPersonnel || '',
      lastCheck: body.lastCheck || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    console.log('[API] Inserting site:', newSite);
    const result = await sitesCollection.insertOne(newSite as any);
    console.log('[API] Insert result:', result);
    console.log('[API] Site created with ID:', result.insertedId);

    // Log activity
    await logActivity(
      db,
      'Site Created',
      `New site "${body.name}" was created`,
      'site',
      'site',
      result.insertedId.toString()
    );

    const responseData = {
      success: true,
      data: serializeSite({ ...newSite, _id: result.insertedId })
    };
    
    console.log('[API] Sending response:', responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[API] ERROR creating site:', error);
    
    // Handle MongoDB duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      const keyPattern = (error as any).keyPattern || {};
      const duplicateField = Object.keys(keyPattern)[0] || 'unknown field';
      
      return NextResponse.json(
        { 
          success: false, 
          error: `A site with this ${duplicateField} already exists`, 
          code: 'DUPLICATE_KEY'
        },
        { status: 409 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create site', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const sitesCollection = db.collection('sites');
    
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Site ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid site ID format' },
        { status: 400 }
      );
    }

    const updateData = {
      name: body.name,
      location: {
        type: "Point",
        coordinates: [body.lng, body.lat]
      },
      locationName: body.location,
      lat: body.lat,
      lng: body.lng,
      status: body.status,
      signal: body.signal,
      assignedPersonnel: body.assignedPersonnel,
      lastCheck: body.lastCheck,
      lastUpdated: new Date().toISOString()
    };

    const result = await sitesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    console.log('[API] Update result:', JSON.stringify(result, null, 2));

    // Handle different MongoDB driver return formats
    let updatedSite = result?.value || result;
    
    if (!updatedSite) {
      // Fallback: fetch the document to verify it was updated
      updatedSite = await sitesCollection.findOne({ _id: new ObjectId(id) });
      if (!updatedSite) {
        console.log('[API] Site not found with ID:', id);
        return NextResponse.json(
          { success: false, error: 'Site not found', code: 'SITE_NOT_FOUND' },
          { status: 404 }
        );
      }
    }
    
    // Log activity
    await logActivity(
      db,
      'Site Updated',
      `Site "${body.name}" was updated (Status: ${body.status})`,
      'site',
      'site',
      id
    );

    console.log('[API] Site updated successfully:', updatedSite._id);
    return NextResponse.json({
      success: true,
      data: serializeSite(updatedSite)
    });
  } catch (error) {
    console.error('Error updating site:', error);
    
    // Handle MongoDB duplicate key error
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      const keyPattern = (error as any).keyPattern || {};
      const duplicateField = Object.keys(keyPattern)[0] || 'unknown field';
      
      return NextResponse.json(
        { 
          success: false, 
          error: `A site with this ${duplicateField} already exists`, 
          code: 'DUPLICATE_KEY'
        },
        { status: 409 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const sitesCollection = db.collection('sites');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Site ID is required' },
        { status: 400 }
      );
    }

    const result = await sitesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Site not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity(
      db,
      'Site Deleted',
      `Site was deleted (ID: ${id})`,
      'site',
      'site',
      id
    );

    return NextResponse.json({
      success: true,
      message: 'Site deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}
