import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Personnel {
  _id?: ObjectId | string;
  name: string;
  role: string;
  email: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
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
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const personnel = await db.collection('personnel').find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: personnel.map(p => ({ ...p, _id: p._id?.toString() }))
    });
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch personnel' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('site1');
    
    const newPersonnel: Omit<Personnel, '_id' | 'createdAt' | 'updatedAt'> = {
      name: body.name,
      role: body.role,
      email: body.email,
      status: body.status
    };
    
    const documentToInsert = {
      ...newPersonnel,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('personnel').insertOne(documentToInsert);
    
    // Log activity
    await logActivity(
      db,
      'Personnel Created',
      `New personnel "${body.name}" was added as ${body.role}`,
      'personnel',
      'personnel',
      result.insertedId.toString()
    );
    
    return NextResponse.json({
      success: true,
      data: { ...newPersonnel, _id: result.insertedId.toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Error creating personnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create personnel' },
      { status: 500 }
    );
  }
}
