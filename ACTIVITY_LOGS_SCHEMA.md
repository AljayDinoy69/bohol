# Activity Logs Table Documentation

## Overview
The `activity_logs` collection in MongoDB stores all system activities and user actions for audit trails, analytics, and monitoring purposes.

## Database Details
- **Database**: `site1`
- **Collection**: `activity_logs`
- **Type**: MongoDB Collection
- **Document Format**: BSON/JSON

## Collection Schema

### Document Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB auto-generated unique identifier |
| `action` | String | Yes | Action performed (e.g., "Created", "Updated", "Deleted") |
| `description` | String | Yes | Human-readable description of the action |
| `type` | String (Enum) | Yes | Activity type: `site`, `personnel`, `system`, `other`, `report` |
| `timestamp` | Date | Yes | ISO 8601 datetime when the action occurred |
| `userId` | String | No | ID of the user who performed the action |
| `entity` | String | No | Entity type (e.g., "Site", "Personnel") |
| `entityId` | String | No | ID of the affected entity |
| `status` | String | No | Status information or state change |
| `details` | Object | No | Additional metadata and context as key-value pairs |

## Indexes

The following indexes are created for optimal query performance:

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `_id_` | `_id` | Default MongoDB index on primary key |
| `timestamp_desc` | `timestamp: -1` | Sort activities by date (newest first) |
| `type_asc` | `type: 1` | Filter activities by type |
| `entityId_asc` | `entityId: 1` | Find all activities for a specific entity |
| `userId_asc` | `userId: 1` | Find all activities by a specific user |
| `type_timestamp` | `type: 1, timestamp: -1` | Filter by type and sort by date |
| `entity_entityId_timestamp` | `entity: 1, entityId: 1, timestamp: -1` | Get activities for a specific entity |
| `text_search` | `action: text, description: text` | Full-text search on action and description |

## Example Documents

### Site Creation Log
```json
{
  "_id": ObjectId("..."),
  "action": "Created",
  "description": "Created new site: North Branch",
  "type": "site",
  "entity": "Site",
  "entityId": "60d5ec49c1234567890abcd1",
  "userId": "user_123",
  "timestamp": ISODate("2026-01-29T10:30:00Z"),
  "details": {
    "location": "North Branch, Bohol",
    "coordinates": { "lat": 9.65, "lng": 124.44 }
  }
}
```

### Personnel Assignment Log
```json
{
  "_id": ObjectId("..."),
  "action": "Assigned",
  "description": "Assigned site North Branch to Officer Juan Santos",
  "type": "personnel",
  "entity": "Personnel",
  "entityId": "60d5ec49c1234567890abcd2",
  "userId": "admin_001",
  "timestamp": ISODate("2026-01-29T11:00:00Z"),
  "details": {
    "assignedTo": "Officer Juan Santos",
    "siteId": "60d5ec49c1234567890abcd1",
    "role": "Field Officer"
  }
}
```

### System Event Log
```json
{
  "_id": ObjectId("..."),
  "action": "System Initialized",
  "description": "System started up and initialized all services",
  "type": "system",
  "timestamp": ISODate("2026-01-29T09:00:00Z"),
  "details": {
    "version": "1.0.0",
    "environment": "production",
    "services": ["auth", "database", "logging"]
  }
}
```

## Queries

### Common Query Patterns

#### Get Recent Activities
```javascript
db.collection('activity_logs').find({})
  .sort({ timestamp: -1 })
  .limit(50)
```

#### Filter by Type
```javascript
db.collection('activity_logs').find({ type: 'site' })
  .sort({ timestamp: -1 })
```

#### Get Activities for Specific Entity
```javascript
db.collection('activity_logs').find({
  entity: 'Site',
  entityId: 'site_123'
}).sort({ timestamp: -1 })
```

#### Activities by User
```javascript
db.collection('activity_logs').find({ userId: 'user_456' })
  .sort({ timestamp: -1 })
```

#### Date Range Query
```javascript
db.collection('activity_logs').find({
  timestamp: {
    $gte: ISODate('2026-01-01'),
    $lte: ISODate('2026-01-31')
  }
}).sort({ timestamp: -1 })
```

#### Full-Text Search
```javascript
db.collection('activity_logs').find({
  $text: { $search: 'deleted site' }
}).sort({ score: { $meta: 'textScore' } })
```

#### Complex Query with Multiple Conditions
```javascript
db.collection('activity_logs').find({
  type: { $in: ['site', 'personnel'] },
  timestamp: { $gte: ISODate('2026-01-20') },
  userId: { $exists: true }
}).sort({ timestamp: -1 }).limit(100)
```

## Size Estimation

Based on average document size:
- **Average document size**: ~500 bytes (with details)
- **100k documents**: ~50 MB
- **1M documents**: ~500 MB
- **10M documents**: ~5 GB

## Related Scripts

- **Create Collection**: `scripts/create-activity-logs-table.js`
- **Create Indexes**: `scripts/create-activity-logs-indexes.js`
- **Migrate Data**: `scripts/migrate-to-activity-logs.js`

## Usage in Application

### Logging an Activity
```typescript
import { logActivity } from '@/lib/activityLogger';

await logActivity({
  action: 'Created',
  description: 'Created new site: North Branch',
  type: 'site',
  entity: 'Site',
  entityId: 'site_123',
  userId: 'user_456',
  details: { location: 'Bohol' }
});
```

### Retrieving Activity Logs
```typescript
import clientPromise from '@/lib/mongodb';

const client = await clientPromise;
const db = client.db('site1');
const logs = await db.collection('activity_logs')
  .find({ type: 'site' })
  .sort({ timestamp: -1 })
  .toArray();
```

## Performance Tips

1. **Use Indexes**: Always filter by indexed fields when possible (type, entityId, userId, timestamp)
2. **Limit Results**: Use pagination with `limit()` and `skip()` for large result sets
3. **Time-based Queries**: Use timestamp indexes for date-range queries
4. **Full-Text Search**: Use text index for searching action and description fields
5. **Archive Old Data**: Consider archiving logs older than 1-2 years to maintain performance

## Maintenance

### Cleanup Script
To remove old logs older than 30 days:
```javascript
db.collection('activity_logs').deleteMany({
  timestamp: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
})
```

### Monitor Collection Size
```javascript
db.collection('activity_logs').stats()
```

## Security Considerations

1. **Access Control**: Limit database access to authenticated application users
2. **Data Retention**: Define and enforce data retention policies
3. **Sensitive Data**: Do not log sensitive information (passwords, tokens)
4. **Audit Trail**: Keep logs immutable for compliance and auditing purposes

## Future Enhancements

- [ ] Add TTL (Time To Live) index for automatic cleanup
- [ ] Implement sharding for very large datasets
- [ ] Add change streams for real-time activity monitoring
- [ ] Archive historical data to separate collection
- [ ] Add geo-spatial indexes for location-based queries
