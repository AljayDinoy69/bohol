const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const uri = envContent.match(/MONGODB_URI=(.+)/)?.[1];

async function addTestActivityLogs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('site1');
    const logsCollection = db.collection('activity_logs');

    const testLogs = [
      {
        action: 'Site Created',
        description: 'New site "Site Alpha" was created',
        type: 'site',
        entity: 'site',
        entityId: 'site-001',
        userId: 'admin',
        details: { siteName: 'Site Alpha', location: 'Tagbilaran' },
        timestamp: new Date()
      },
      {
        action: 'Personnel Created',
        description: 'New personnel "John Doe" was added',
        type: 'personnel',
        entity: 'personnel',
        entityId: 'person-001',
        userId: 'admin',
        details: { name: 'John Doe', role: 'Technician' },
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        action: 'Site Updated',
        description: 'Site "Site Alpha" status changed to Active',
        type: 'site',
        entity: 'site',
        entityId: 'site-001',
        userId: 'admin',
        details: { siteName: 'Site Alpha', newStatus: 'Active' },
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        action: 'Personnel Assigned',
        description: 'Personnel "John Doe" assigned to "Site Alpha"',
        type: 'site',
        entity: 'site',
        entityId: 'site-001',
        userId: 'admin',
        details: { personnel: 'John Doe', site: 'Site Alpha' },
        timestamp: new Date(Date.now() - 10800000)
      },
      {
        action: 'Site Updated',
        description: 'Site "Site Alpha" signal strength updated to 85%',
        type: 'site',
        entity: 'site',
        entityId: 'site-001',
        userId: 'system',
        details: { siteName: 'Site Alpha', signalStrength: 85 },
        timestamp: new Date(Date.now() - 14400000)
      },
      {
        action: 'System Event',
        description: 'Database backup completed successfully',
        type: 'system',
        entity: 'system',
        userId: 'system',
        details: { backupSize: '2.3GB', duration: '45 seconds' },
        timestamp: new Date(Date.now() - 18000000)
      }
    ];

    console.log('\n📋 Adding test activity logs...\n');
    
    // Clear existing logs first
    await logsCollection.deleteMany({});
    
    const result = await logsCollection.insertMany(testLogs);
    const insertedIds = Object.values(result.insertedIds);
    console.log(`✅ Added ${insertedIds.length} test activity logs`);
    console.log('\nActivity logs added:');
    testLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. [${log.type.toUpperCase()}] ${log.action} - ${log.description}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addTestActivityLogs();
