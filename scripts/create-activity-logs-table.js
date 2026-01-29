/**
 * Create Activity Logs Collection
 * This script creates the activity_logs collection in MongoDB with proper indexes and schema validation
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');

let uri;
try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  uri = envContent.match(/MONGODB_URI=(.+)/)?.[1]?.trim();
  
  if (!uri) {
    throw new Error('MONGODB_URI not found in .env.local');
  }
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
  process.exit(1);
}

async function createActivityLogsTable() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('site1');

    // Check if activity_logs collection already exists
    const collections = await db.listCollections().toArray();
    const hasActivityLogs = collections.some(col => col.name === 'activity_logs');

    if (hasActivityLogs) {
      console.log('ℹ️  activity_logs collection already exists');
      
      // Get current indexes
      const collection = db.collection('activity_logs');
      const indexes = await collection.listIndexes().toArray();
      console.log('\n📊 Current indexes:');
      indexes.forEach(index => {
        console.log(`  - ${index.name}:`, JSON.stringify(index.key));
      });
      
      return;
    }

    // Create activity_logs collection with JSON schema validation
    console.log('\n📝 Creating activity_logs collection...\n');

    await db.createCollection('activity_logs', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['action', 'description', 'type', 'timestamp'],
          properties: {
            _id: {
              bsonType: 'objectId',
              description: 'Unique identifier'
            },
            action: {
              bsonType: 'string',
              description: 'Action performed (e.g., Created, Updated, Deleted)'
            },
            description: {
              bsonType: 'string',
              description: 'Human-readable description of the action'
            },
            type: {
              enum: ['site', 'personnel', 'system', 'other', 'report'],
              description: 'Type of activity log'
            },
            userId: {
              bsonType: 'string',
              description: 'ID of the user who performed the action'
            },
            entity: {
              bsonType: 'string',
              description: 'Entity type (e.g., Site, Personnel)'
            },
            entityId: {
              bsonType: 'string',
              description: 'ID of the entity being modified'
            },
            timestamp: {
              bsonType: 'date',
              description: 'When the action occurred'
            },
            details: {
              bsonType: 'object',
              description: 'Additional metadata and context'
            },
            status: {
              bsonType: 'string',
              description: 'Status information (optional)'
            }
          },
          additionalProperties: true
        }
      }
    });

    console.log('✅ Collection created successfully');

    // Create indexes for better query performance
    console.log('\n🔧 Creating indexes...\n');

    const collection = db.collection('activity_logs');

    // Index on timestamp for sorting and time-range queries
    await collection.createIndex({ timestamp: -1 });
    console.log('  ✅ Index on timestamp created');

    // Index on type for filtering by activity type
    await collection.createIndex({ type: 1 });
    console.log('  ✅ Index on type created');

    // Index on entityId for finding activities related to a specific entity
    await collection.createIndex({ entityId: 1 });
    console.log('  ✅ Index on entityId created');

    // Index on userId for finding activities by user
    await collection.createIndex({ userId: 1 });
    console.log('  ✅ Index on userId created');

    // Compound index for common queries (type + timestamp)
    await collection.createIndex({ type: 1, timestamp: -1 });
    console.log('  ✅ Compound index on (type, timestamp) created');

    // Compound index for entity activities (entity + entityId + timestamp)
    await collection.createIndex({ entity: 1, entityId: 1, timestamp: -1 });
    console.log('  ✅ Compound index on (entity, entityId, timestamp) created');

    // Text index on action and description for search functionality
    await collection.createIndex({ action: 'text', description: 'text' });
    console.log('  ✅ Text index on (action, description) created');

    console.log('\n✅ All indexes created successfully!');

    // Verify collection and indexes
    console.log('\n📊 Collection verification:\n');
    const stats = await db.collection('activity_logs').stats();
    console.log(`  - Collection: ${stats.ns}`);
    console.log(`  - Status: Active`);
    console.log(`  - Document count: ${stats.count}`);

    const indexes = await collection.listIndexes().toArray();
    console.log(`\n📍 Active indexes (${indexes.length} total):`);
    indexes.forEach(index => {
      console.log(`  - ${index.name}`);
    });

    console.log('\n✅ Activity logs table created successfully!');

  } catch (error) {
    console.error('❌ Error creating activity logs table:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

createActivityLogsTable();
