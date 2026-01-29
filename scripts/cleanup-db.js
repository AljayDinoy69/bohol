const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const uri = envContent.match(/MONGODB_URI=(.+)/)?.[1];
const dbName = 'site1';
const allowedCollections = ['sites', 'personnel', 'reports'];

async function cleanupDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Found ${collections.length} collection(s):\n`);
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Identify collections to drop
    const collectionsToDrops = collections
      .map(col => col.name)
      .filter(name => !allowedCollections.includes(name));

    if (collectionsToDrops.length === 0) {
      console.log('\n✅ Database is clean! Only necessary collections exist.');
      return;
    }

    console.log(`\n🗑️  Collections to be dropped:\n`);
    collectionsToDrops.forEach(name => console.log(`  - ${name}`));

    // Drop unnecessary collections
    console.log('\n⏳ Dropping unnecessary collections...\n');
    for (const collectionName of collectionsToDrops) {
      await db.collection(collectionName).drop();
      console.log(`  ✓ Dropped: ${collectionName}`);
    }

    // Verify remaining collections
    const remainingCollections = await db.listCollections().toArray();
    console.log(`\n✅ Cleanup complete! Remaining collections:\n`);
    remainingCollections.forEach(col => console.log(`  - ${col.name}`));

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

cleanupDatabase();
