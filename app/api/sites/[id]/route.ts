import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
    
    const updateData: any = {
      lastUpdated: new Date().toISOString()
    };
    
    // Only include fields that are provided in the request
    if (body.name !== undefined) updateData.name = body.name;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.lat !== undefined) updateData.lat = body.lat;
    if (body.lng !== undefined) updateData.lng = body.lng;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.signal !== undefined) updateData.signal = body.signal;
    if (body.assignedPersonnel !== undefined) updateData.assignedPersonnel = body.assignedPersonnel;
    if (body.lastCheck !== undefined) updateData.lastCheck = body.lastCheck;
    
    const result = await sitesCollection.updateOne(
      { _id: new ObjectId(id) },
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
    
    const result = await sitesCollection.deleteOne({ _id: new ObjectId(id) });
    
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
