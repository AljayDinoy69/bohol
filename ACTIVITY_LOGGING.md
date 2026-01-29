# Activity Logging System Documentation

## Overview

The Activity Logging System provides comprehensive tracking of all user actions and system events in the Bohol Signal Map application. All activities are automatically logged to the MongoDB database and can be viewed in the Activity Logs page.

## Database Schema

### activity_logs Collection

```typescript
{
  _id: ObjectId,
  action: string,              // e.g., "Created", "Updated", "Deleted", "Login"
  description: string,         // Human-readable description
  type: string,                // 'site' | 'personnel' | 'system' | 'other'
  entity: string,              // e.g., 'Site', 'Personnel', 'User'
  entityId: string,            // Reference to the entity
  userId: string,              // User who performed the action
  details: object,             // Additional details/changes
  timestamp: Date              // When the action occurred
}
```

## Indexes Created

For optimal performance, the following indexes are automatically created:

- `timestamp: -1` - Query by date
- `type: 1` - Filter by activity type
- `entity: 1` - Filter by entity
- `entityId: 1` - Find activities for specific entity
- `userId: 1` - Activities by user
- `type + timestamp` - Common query pattern
- `entity + timestamp` - Common query pattern
- TTL Index: Automatic deletion of logs older than 90 days

## API Endpoints

### GET /api/activity-logs

Retrieve activity logs with optional filtering.

**Query Parameters:**
- `type` - Filter by type ('site', 'personnel', 'system', 'other')
- `entity` - Filter by entity type
- `limit` - Maximum number of logs to return (default: 100)

**Example:**
```javascript
// Get all site activities
fetch('/api/activity-logs?type=site&limit=50')

// Get all personnel activities
fetch('/api/activity-logs?type=personnel&entity=Personnel')
```

### POST /api/activity-logs

Create a new activity log entry.

**Request Body:**
```json
{
  "action": "Created",
  "description": "Created new site: Site A",
  "type": "site",
  "entity": "Site",
  "entityId": "507f1f77bcf86cd799439011",
  "userId": "user123",
  "details": {
    "siteName": "Site A",
    "location": "Tagbilaran"
  }
}
```

### DELETE /api/activity-logs?id=<logId>

Delete a specific activity log.

## Usage

### Client-Side Activity Logging

#### Option 1: Using the useActivityLogger Hook

```typescript
import { useActivityLogger } from '@/hooks/useActivityLogger';

export function MyComponent() {
  const { logActivity } = useActivityLogger();

  const handleCreate = async (siteName) => {
    // ... create logic ...
    await logActivity({
      action: 'Created',
      description: `Created new site: ${siteName}`,
      type: 'site',
      entity: 'Site',
      entityId: siteId,
      details: { siteName }
    });
  };

  return <button onClick={() => handleCreate('My Site')}>Create</button>;
}
```

#### Option 2: Using the Activity Logger Utility

```typescript
import { siteActivities, personnelActivities, systemActivities } from '@/lib/activityLogger';

// Log a site creation
await siteActivities.created('Site A', siteId, { location: 'Tagbilaran' });

// Log a personnel assignment
await personnelActivities.assigned('John Doe', personnelId, 3);

// Log a system login
await systemActivities.login('user@example.com', userId);
```

### Server-Side Activity Logging

Activities are automatically logged in the API endpoints. The sites and personnel routes already include activity logging:

```typescript
// In /api/sites/route.ts or /api/personnel/route.ts
await logActivity(
  db,
  'Site Created',
  `New site "${name}" was created`,
  'site',
  'site',
  insertedId.toString()
);
```

## Viewing Activities

### Activity Logs Page

Navigate to `/activity-logs` to view all logged activities with:
- Filtering by type (site, personnel, system)
- Filtering by entity
- Timestamp sorting
- Delete functionality

### Dashboard Activity Summary

The Activity Summary widget displays:
- Total activities count
- Today's activities
- Site-related activities
- Personnel-related activities
- Recent activity feed

## Activity Types

### Site Activities
- `created` - New site added
- `updated` - Site information modified
- `deleted` - Site removed
- `statusChanged` - Site status changed
- `assigned` - Personnel assigned to site

### Personnel Activities
- `created` - New personnel added
- `updated` - Personnel information modified
- `deleted` - Personnel removed
- `assigned` - Sites assigned to personnel
- `roleChanged` - Role changed

### System Activities
- `login` - User logged in
- `logout` - User logged out
- `exported` - Data exported
- `configChanged` - Configuration updated
- `alertTriggered` - System alert triggered

## Data Retention

Activity logs are automatically retained for 90 days. Older logs are automatically deleted by the TTL index to manage storage.

## Performance Tips

1. **Query Optimization**: Use specific filters when querying logs
2. **Batch Operations**: Group multiple operations when possible
3. **Monitoring**: Check index usage with MongoDB monitoring tools
4. **Cleanup**: Logs are auto-deleted after 90 days

## Example: Integrating Activity Logging in a Feature

```typescript
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { siteActivities } from '@/lib/activityLogger';

export function SiteForm() {
  const { logActivity } = useActivityLogger();

  const handleSubmit = async (formData) => {
    try {
      // Create site
      const response = await fetch('/api/sites', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Activity is logged in the API, but you can also log client-side if needed
        await logActivity({
          action: 'Site Created',
          description: `New site created: ${formData.name}`,
          type: 'site',
          entity: 'Site',
          entityId: result.data._id,
          details: formData
        });
      }
    } catch (error) {
      // Log error
      await logActivity({
        action: 'Error',
        description: `Failed to create site: ${error.message}`,
        type: 'system',
        entity: 'Error',
        details: { error: error.message }
      });
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Migration & Setup

To ensure all indexes are properly created, run:

```bash
npm run migrate
```

This will:
1. Create all necessary indexes
2. Verify collection existence
3. Set up TTL indexes for automatic cleanup

## Troubleshooting

### Logs Not Appearing
- Check database connection
- Verify API endpoint is accessible
- Check browser console for errors

### Performance Issues
- Ensure indexes are created with `npm run migrate`
- Consider increasing the limit when querying
- Check MongoDB logs for slow queries

### Storage Growth
- TTL index automatically deletes logs after 90 days
- To manually clean, use MongoDB shell:
  ```javascript
  db.activity_logs.deleteMany({
    timestamp: { $lt: new Date(Date.now() - 90*24*60*60*1000) }
  })
  ```
