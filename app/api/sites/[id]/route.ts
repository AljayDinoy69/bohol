import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    const client = await clientPromise;
    const db = client.db('site1');
    const sitesCollection = db.collection('sites');
    
    const updateData = {
      name: body.name,
      location: body.location,
      lat: body.lat,
      lng: body.lng,
      status: body.status,
      signal: body.signal,
      assignedPersonnel: body.assignedPersonnel,
      lastCheck: body.lastCheck,
      lastUpdated: new Date().toISOString()
    };
    
    const result = await sitesCollection.updateOne(
      { id: id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Site not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Site ${id} updated successfully`,
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const client = await clientPromise;
    const db = client.db('site1');
    const sitesCollection = db.collection('sites');
    
    const result = await sitesCollection.deleteOne({ id: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Site not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Site ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}
