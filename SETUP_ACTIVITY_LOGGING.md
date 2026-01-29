# Activity Logging System - Setup Guide

## ✅ What Has Been Implemented

### 1. **Activity Logging Infrastructure**
   - ✓ MongoDB collection: `activity_logs` (already exists in your database)
   - ✓ API endpoint: `GET/POST/DELETE /api/activity-logs`
   - ✓ Automatic logging in sites and personnel APIs

### 2. **Client-Side Utilities**
   - ✓ `lib/activityLogger.ts` - Centralized activity logging functions
   - ✓ `hooks/useActivityLogger.ts` - React hook for logging activities
   - ✓ `hooks/useActivityStats.ts` - Hook for fetching activity statistics

### 3. **Components**
   - ✓ `components/ActivitySummary.tsx` - Dashboard widget showing activity stats
   - ✓ Existing Activity Logs page at `/activity-logs`

### 4. **Database**
   - ✓ `activity_logs` collection with automatic tracking
   - ✓ Migration script ready to create indexes

## 🚀 Getting Started

### Step 1: Run Database Migration

To set up the proper indexes for optimal performance, run:

```bash
npm run migrate
```

**Note:** Make sure your `.env.local` file has `MONGODB_URI` set before running this command.

Example `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority
```

### Step 2: Add Activity Summary to Dashboard

Edit `app/dashboard/page.tsx` and add the ActivitySummary component:

```tsx
import ActivitySummary from "../components/ActivitySummary";

export default function DashboardPage() {
  return (
    <SidebarAndNavbar activePage="Dashboard">
      <div className="flex h-full">
        <div className="flex-1 p-6 space-y-6">
          {/* ... existing header code ... */}
          
          {/* Add this section for activity summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Your existing map */}
            </div>
            <div>
              <ActivitySummary />
            </div>
          </div>
        </div>
      </div>
    </SidebarAndNavbar>
  );
}
```

## 📊 How Activities Are Logged

### Automatic Logging (Already Working)

Activities are **automatically logged** in the following operations:

1. **Sites Operations:**
   - ✓ Create site → Logged as "Site Created"
   - ✓ Update site → Logged as "Site Updated"
   - ✓ Delete site → Logged as "Site Deleted"

2. **Personnel Operations:**
   - ✓ Create personnel → Logged as "Personnel Created"
   - ✓ Update personnel → Logged as "Personnel Updated"
   - ✓ Delete personnel → Logged as "Personnel Deleted"

### Manual Logging (For Custom Events)

Use the hooks to log custom activities:

```typescript
import { useActivityLogger } from '@/hooks/useActivityLogger';

export function MyComponent() {
  const { logActivity } = useActivityLogger();

  const handleCustomAction = async () => {
    await logActivity({
      action: 'Custom Action',
      description: 'Something important happened',
      type: 'system',
      entity: 'Custom',
      details: { customData: 'value' }
    });
  };

  return <button onClick={handleCustomAction}>Do Something</button>;
}
```

Or use the utility functions:

```typescript
import { siteActivities, personnelActivities, systemActivities } from '@/lib/activityLogger';

// Log site activities
await siteActivities.created('Site Name', siteId);
await siteActivities.statusChanged('Site Name', siteId, 'Inactive', 'Active');
await siteActivities.assigned('Site Name', siteId, 'John Doe');

// Log personnel activities
await personnelActivities.created('John Doe', personnelId);
await personnelActivities.assigned('John Doe', personnelId, 5);

// Log system activities
await systemActivities.login('user@example.com', userId);
await systemActivities.exported('Dashboard Report');
```

## 📋 Activity Log Structure

Each activity log record contains:

```json
{
  "_id": "ObjectId",
  "action": "Created",                    // What action was taken
  "description": "Created new site...",   // Human-readable description
  "type": "site",                         // Type: site|personnel|system|other
  "entity": "Site",                       // Entity type
  "entityId": "507f...",                  // Reference to the entity
  "userId": "user123",                    // Who performed the action
  "details": {},                          // Additional metadata
  "timestamp": "2026-01-29T..."           // When it happened
}
```

## 🔍 Viewing Activity Logs

### Via Activity Logs Page
Navigate to `/activity-logs` to see:
- Complete activity history
- Filter by type (Site, Personnel, System)
- Sort by timestamp
- Delete old logs

### Via Dashboard
The Activity Summary widget shows:
- Total activities count
- Today's activities
- Site-related count
- Personnel-related count
- Recent activity feed

## 🗂️ Data Retention

- Activities are kept for **90 days**
- Older logs are automatically deleted
- This is managed by MongoDB TTL index

## 🎯 Performance Features

Optimized indexes created automatically:

1. **Timestamp Index** - Fast date-based queries
2. **Type Index** - Fast filtering by activity type
3. **Entity Index** - Find activities for specific entities
4. **Compound Indexes** - Optimized for common queries
5. **TTL Index** - Automatic cleanup of old records

## 📝 Files Created/Modified

### New Files:
- ✓ `lib/activityLogger.ts` - Activity logging utility
- ✓ `hooks/useActivityLogger.ts` - React hook for logging
- ✓ `hooks/useActivityStats.ts` - Statistics hook
- ✓ `components/ActivitySummary.tsx` - Dashboard widget
- ✓ `scripts/migrate.js` - Database migration script
- ✓ `ACTIVITY_LOGGING.md` - Full documentation

### Modified Files:
- ✓ `package.json` - Added migrate script
- ✓ Already has activity logging in `/api/sites/route.ts`
- ✓ Already has activity logging in `/api/personnel/route.ts`

## 🔧 Troubleshooting

### Migration Won't Run
```bash
# Make sure MONGODB_URI is in .env.local
# Then run:
npm run migrate
```

### Logs Not Showing
1. Check that activities were triggered (create/update/delete a site)
2. Navigate to `/activity-logs` page
3. Check browser console for errors

### Performance Issues
Run migration again to ensure indexes are created:
```bash
npm run migrate
```

## ✨ Next Steps (Optional)

1. **Add to More Pages**: Integrate ActivitySummary into other dashboard pages
2. **Real-time Updates**: Convert to use WebSocket for live activity feeds
3. **Alerts**: Set up alerts for critical activities
4. **Exports**: Add ability to export activity logs as CSV/PDF
5. **Advanced Filtering**: Add more filter options (user, date range, etc.)

## 📞 Support

For more details, see `ACTIVITY_LOGGING.md` in the root directory.

---

**Status:** ✅ Ready to use! Activities are already being logged automatically.
