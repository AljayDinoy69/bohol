const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const uri = envContent.match(/MONGODB_URI=(.+)/)?.[1];

async function migrateToActivityLogs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('site1');

    // Check if reports collection exists
    const collections = await db.listCollections().toArray();
    const hasReports = collections.some(col => col.name === 'reports');

    if (!hasReports) {
      console.log('✅ Reports collection does not exist. Creating activity_logs collection...\n');
      await db.createCollection('activity_logs');
      console.log('✅ activity_logs collection created');
      return;
    }

    // Rename collection from reports to activity_logs
    console.log('\n📋 Migrating reports → activity_logs...\n');
    
    const reportsData = await db.collection('reports').find({}).toArray();
    console.log(`Found ${reportsData.length} reports to migrate`);

    if (reportsData.length > 0) {
      // Convert reports to activity logs format
      const activityLogs = reportsData.map(report => ({
        action: `Report - ${report.status}`,
        description: report.description || `Site ${report.site} reported as ${report.status.toLowerCase()}`,
        site: report.site,
        status: report.status,
        timestamp: report.timestamp || new Date(),
        type: 'report'
      }));

      // Insert into activity_logs
      const result = await db.collection('activity_logs').insertMany(activityLogs);
      console.log(`✅ Migrated ${result.insertedIds.length} records to activity_logs`);
    }

    // Drop old reports collection
    await db.collection('reports').drop();
    console.log('✅ Dropped old reports collection\n');

    // Verify
    const remainingCollections = await db.listCollections().toArray();
    console.log('📊 Final collections:');
    remainingCollections.forEach(col => console.log(`  - ${col.name}`));

  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrateToActivityLogs();
