# Activity Logs - Quick Reference Guide

## Database Details
- **Database**: `site1`
- **Collection**: `activity_logs`
- **Type**: MongoDB
- **Status**: ✅ Ready to use
- **Indexes**: 8 (all created and active)

## Field Reference

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `action` | String | ✅ Yes | "Created", "Updated", "Deleted" |
| `description` | String | ✅ Yes | "Created new site: North Branch" |
| `type` | String | ✅ Yes | "site", "personnel", "system" |
| `timestamp` | Date | ✅ Yes | 2026-01-29T10:30:00Z |
| `userId` | String | No | "user_123" |
| `entity` | String | No | "Site", "Personnel" |
| `entityId` | String | No | "site_123" |
| `status` | String | No | "active", "completed" |
| `details` | Object | No | `{ location: "Bohol" }` |

## Quick Examples

### 1️⃣ Log a New Activity
```typescript
import { logActivity } from '@/lib/activityLogger';

await logActivity({
  action: 'Created',
  description: 'Created new site: North Branch',
  type: 'site',
  entity: 'Site',
  entityId: 'site_123',
  userId: 'user_456'
});
```

### 2️⃣ Get Recent Activities
```bash
GET /api/activity-logs?limit=50
```

### 3️⃣ Filter by Type
```bash
GET /api/activity-logs?type=site&limit=100
```

### 4️⃣ Get Activities for Specific Entity
```bash
GET /api/activity-logs?entity=Site&entityId=site_123
```

### 5️⃣ Search Activities
```bash
GET /api/activity-logs?search=deleted
```

## Activity Types

- **`site`** - Site-related activities (create, update, delete)
- **`personnel`** - Personnel/user activities
- **`system`** - System events and maintenance
- **`report`** - Report submissions and updates
- **`other`** - Miscellaneous activities

## Index Performance

| Index | Query Type | Speed |
|-------|-----------|-------|
| `timestamp_desc` | Sort by date | ⚡ Fast |
| `type_asc` | Filter by activity type | ⚡ Fast |
| `entityId_asc` | Find entity activities | ⚡ Fast |
| `type_timestamp` | Filter + sort (common case) | ⚡⚡ Very Fast |
| `text_search` | Full-text search | ⚡ Fast |

## Common Patterns

### 📊 Get Dashboard Summary
```typescript
const recentLogs = await fetch(
  '/api/activity-logs?limit=10&sortBy=timestamp'
).then(r => r.json());
```

### 🔍 Find User's Activities
```typescript
const userLogs = await fetch(
  `/api/activity-logs?userId=user_123&limit=50`
).then(r => r.json());
```

### 📍 Track Site Changes
```typescript
const siteChanges = await fetch(
  `/api/activity-logs?type=site&entityId=site_123`
).then(r => r.json());
```

### 📅 Get Activities from Last 24 Hours
```typescript
// Use the query with timestamp filtering
const logs = await db.collection('activity_logs')
  .find({
    timestamp: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  })
  .toArray();
```

## Related Files

📁 **Database & Setup**
- `lib/mongodb.ts` - MongoDB connection
- `scripts/create-activity-logs-indexes.js` - Create indexes
- `ACTIVITY_LOGS_SCHEMA.md` - Full documentation

📁 **Application Code**
- `app/lib/activityLogger.ts` - Main logging utility
- `app/lib/activityLogSchema.ts` - TypeScript types
- `app/api/activity-logs/route.ts` - API endpoints
- `app/hooks/useActivityLogs.ts` - React hook

📁 **UI Components**
- `app/components/ActivitySummary.tsx` - Display component
- `app/activity-logs/page.tsx` - Activity logs page

## Verify Setup

```bash
# Run this to verify all indexes exist
node scripts/create-activity-logs-indexes.js
```

Expected: All 8 indexes should show as "Already exists"

## API Response Format

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "action": "Created",
      "description": "Created new site: North Branch",
      "type": "site",
      "entity": "Site",
      "entityId": "site_123",
      "userId": "user_456",
      "timestamp": "2026-01-29T10:30:00.000Z",
      "details": { "location": "Bohol" }
    }
  ],
  "total": 150,
  "limit": 50,
  "skip": 0,
  "hasMore": true
}
```

## Tips & Best Practices

✅ **Do:**
- Always include required fields (action, description, type, timestamp)
- Use specific activity types for better filtering
- Add entityId for tracking specific entities
- Include userId for audit trails
- Use details for additional context

❌ **Don't:**
- Store sensitive data (passwords, tokens)
- Log the same event multiple times
- Use vague descriptions
- Forget to add userId for user actions
- Store very large objects in details

## Troubleshooting

**Q: Logs not appearing?**
A: Check that userId is set and the collection has documents

**Q: Slow queries?**
A: Ensure you're filtering by indexed fields (type, entityId, userId, timestamp)

**Q: Too many logs?**
A: Implement cleanup strategy in maintenance script

---

**Last Updated**: January 29, 2026
**Status**: ✅ Active and Ready
