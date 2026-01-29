/**
 * Create Indexes for Activity Logs Collection
 * Adds performance indexes to the existing activity_logs collection
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

async function createActivityLogsIndexes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('site1');
    const collection = db.collection('activity_logs');

    // Get existing indexes
    const existingIndexes = await collection.listIndexes().toArray();
    const indexNames = existingIndexes.map(idx => idx.name);
    
    console.log('📊 Existing indexes:');
    existingIndexes.forEach(idx => {
      console.log(`  - ${idx.name}`);
    });

    console.log('\n🔧 Creating performance indexes...\n');

    const indexesToCreate = [
      {
        name: 'timestamp_desc',
        spec: { timestamp: -1 },
        description: 'Index on timestamp for sorting and time-range queries'
      },
      {
        name: 'type_asc',
        spec: { type: 1 },
        description: 'Index on type for filtering by activity type'
      },
      {
        name: 'entityId_asc',
        spec: { entityId: 1 },
        description: 'Index on entityId for finding activities related to a specific entity'
      },
      {
        name: 'userId_asc',
        spec: { userId: 1 },
        description: 'Index on userId for finding activities by user'
      },
      {
        name: 'type_timestamp',
        spec: { type: 1, timestamp: -1 },
        description: 'Compound index for common queries (type + timestamp)'
      },
      {
        name: 'entity_entityId_timestamp',
        spec: { entity: 1, entityId: 1, timestamp: -1 },
        description: 'Compound index for entity activities'
      },
      {
        name: 'text_search',
        spec: { action: 'text', description: 'text' },
        description: 'Text index on (action, description) for search functionality'
      }
    ];

    let createdCount = 0;

    for (const idx of indexesToCreate) {
      if (!indexNames.includes(idx.name)) {
        try {
          await collection.createIndex(idx.spec, { name: idx.name });
          console.log(`  ✅ Created: ${idx.name}`);
          console.log(`     ${idx.description}`);
          createdCount++;
        } catch (error) {
          console.log(`  ⚠️  Skipped: ${idx.name} - ${error.message}`);
        }
      } else {
        console.log(`  ℹ️  Already exists: ${idx.name}`);
      }
    }

    console.log(`\n✅ Index creation complete! Created ${createdCount} new indexes.\n`);

    // Verify final indexes
    const finalIndexes = await collection.listIndexes().toArray();
    console.log(`📍 Final indexes (${finalIndexes.length} total):`);
    finalIndexes.forEach(idx => {
      console.log(`  - ${idx.name}`);
    });

    console.log('\n✅ Activity logs table is ready for use!');

  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

createActivityLogsIndexes();
