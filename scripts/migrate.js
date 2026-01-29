#!/usr/bin/env node

/**
 * Database Migration Script
 * Creates necessary indexes for activity logs collection
 * Run with: npm run migrate
 */

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Error: MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function migrate() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔄 Starting database migration...');
    await client.connect();
    
    const db = client.db('site1');

    // Ensure activity_logs collection exists and has proper indexes
    const logsCollection = db.collection('activity_logs');

    // Create indexes for better query performance
    console.log('📝 Creating indexes for activity_logs collection...');
    
    await logsCollection.createIndex({ timestamp: -1 });
    console.log('✓ Created timestamp index');

    await logsCollection.createIndex({ type: 1 });
    console.log('✓ Created type index');

    await logsCollection.createIndex({ entity: 1 });
    console.log('✓ Created entity index');

    await logsCollection.createIndex({ entityId: 1 });
    console.log('✓ Created entityId index');

    await logsCollection.createIndex({ userId: 1 });
    console.log('✓ Created userId index');

    // Create compound indexes for common queries
    await logsCollection.createIndex({ type: 1, timestamp: -1 });
    console.log('✓ Created type+timestamp compound index');

    await logsCollection.createIndex({ entity: 1, timestamp: -1 });
    console.log('✓ Created entity+timestamp compound index');

    // TTL index: automatically delete logs older than 90 days
    await logsCollection.createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 7776000 } // 90 days in seconds
    );
    console.log('✓ Created TTL index (90 days)');

    // Check sites collection indexes
    const sitesCollection = db.collection('sites');
    await sitesCollection.createIndex({ 'location': '2dsphere' });
    console.log('✓ Created geospatial index on sites');

    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
