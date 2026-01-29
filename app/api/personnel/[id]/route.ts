import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('site1');
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('personnel').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Personnel not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity(
      db,
      'Personnel Updated',
      `Personnel "${body.name || 'Unknown'}" was updated`,
      'personnel',
      'personnel',
      id
    );
    
    return NextResponse.json({
      success: true,
      data: { _id: id, ...body, updatedAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Error updating personnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update personnel' },
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
    
    const result = await db.collection('personnel').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Personnel not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity(
      db,
      'Personnel Deleted',
      `Personnel was deleted (ID: ${id})`,
      'personnel',
      'personnel',
      id
    );
    
    return NextResponse.json({
      success: true,
      message: 'Personnel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting personnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete personnel' },
      { status: 500 }
    );
  }
}
