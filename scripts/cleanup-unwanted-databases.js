/**
 * Clean Up Unwanted Databases
 * Drops all databases and collections except site1 and its collections
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

async function cleanupDatabases() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const admin = client.db('admin').admin();

    // Get list of all databases
    const databases = await admin.listDatabases();
    console.log('📊 Found Databases:\n');
    
    const SYSTEM_DBS = ['admin', 'local']; // MongoDB system databases - cannot be dropped
    const dbsToKeep = ['site1']; // Only keep site1
    const dbsToDrop = [];

    // Identify databases to drop (excluding system databases)
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
      if (!dbsToKeep.includes(db.name) && !SYSTEM_DBS.includes(db.name)) {
        dbsToDrop.push(db.name);
      }
    });

    if (dbsToDrop.length === 0) {
      console.log('\n✅ No databases to drop. Only site1 exists or no other databases found.');
      return;
    }

    console.log(`\n⚠️  The following databases will be DROPPED:\n`);
    dbsToDrop.forEach(dbName => {
      console.log(`  - ${dbName}`);
    });

    console.log(`\n📌 System Databases (protected, will not be dropped):\n`);
    SYSTEM_DBS.forEach(dbName => {
      console.log(`  - ${dbName}`);
    });

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This action cannot be undone!');
    console.log('To proceed, please modify the script to set CONFIRM = true\n');
    
    const CONFIRM = false; // Change to true to actually drop databases
    
    if (!CONFIRM) {
      console.log('❌ Cancelled. No databases were dropped.');
      console.log('\n📝 To proceed with dropping databases:');
      console.log('   1. Open this script: scripts/cleanup-unwanted-databases.js');
      console.log('   2. Change "const CONFIRM = false;" to "const CONFIRM = true;"');
      console.log('   3. Run: node scripts/cleanup-unwanted-databases.js');
      return;
    }

    // Drop databases
    console.log('\n🗑️  Dropping databases...\n');
    
    for (const dbName of dbsToDrop) {
      try {
        await client.db(dbName).dropDatabase();
        console.log(`  ✅ Dropped: ${dbName}`);
      } catch (error) {
        console.log(`  ❌ Failed to drop ${dbName}: ${error.message}`);
      }
    }

    // Verify remaining databases
    console.log('\n📊 Remaining Databases:\n');
    const remainingDbs = await admin.listDatabases();
    remainingDbs.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });

    console.log('\n✅ Cleanup complete!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

cleanupDatabases();
