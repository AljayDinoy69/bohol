import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface ActivityLog {
  _id?: ObjectId | string;
  id?: string;
  action: string;
  description: string;
  type: 'site' | 'personnel' | 'system' | 'other';
  userId?: string;
  entity?: string;
  entityId?: string;
  timestamp?: Date;
  details?: Record<string, any>;
}

function serializeActivityLog(log: any): ActivityLog {
  return {
    _id: log._id?.toString(),
    id: log._id?.toString() || log.id,
    action: log.action,
    description: log.description,
    type: log.type,
    userId: log.userId,
    entity: log.entity,
    entityId: log.entityId,
    timestamp: log.timestamp,
    details: log.details
  };
}

function serializeActivityLogs(logs: any[]): ActivityLog[] {
  return logs.map(serializeActivityLog);
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const logsCollection = db.collection('activity_logs');

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const entity = searchParams.get('entity');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Build filter
    const filter: any = {};
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (entity && entity !== 'all') {
      filter.entity = entity;
    }

    // Fetch logs sorted by timestamp descending
    const logs = await logsCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    console.log(`Fetched activity logs: ${logs.length} logs found`);

    return NextResponse.json({
      success: true,
      data: serializeActivityLogs(logs)
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const logsCollection = db.collection('activity_logs');

    const body = await request.json();
    const { action, description, type, entity, entityId, userId, details } = body;

    // Validate required fields
    if (!action || !description || !type) {
      return NextResponse.json(
        { success: false, error: 'action, description, and type are required' },
        { status: 400 }
      );
    }

    // Validate type enum
    if (!['site', 'personnel', 'system', 'other'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be site, personnel, system, or other' },
        { status: 400 }
      );
    }

    const log = {
      action,
      description,
      type,
      entity: entity || '',
      entityId: entityId || '',
      userId: userId || '',
      details: details || {},
      timestamp: new Date()
    };

    const result = await logsCollection.insertOne(log);

    console.log(`[API] Activity log created: ${result.insertedId}`);

    return NextResponse.json({
      success: true,
      data: serializeActivityLog({ ...log, _id: result.insertedId }),
      message: 'Activity logged successfully'
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('site1');
    const logsCollection = db.collection('activity_logs');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate id
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Log ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid log ID format' },
        { status: 400 }
      );
    }

    const result = await logsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Log not found' },
        { status: 404 }
      );
    }

    console.log(`[API] Activity log deleted: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Activity log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete activity log' },
      { status: 500 }
    );
  }
}
