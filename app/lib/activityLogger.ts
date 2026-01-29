/**
 * Activity Logger Utility
 * Provides centralized logging for all user actions and system events
 */

export type ActivityType = 'site' | 'personnel' | 'system' | 'other';

export interface ActivityLogData {
  action: string;
  description: string;
  type: ActivityType;
  entity?: string;
  entityId?: string;
  userId?: string;
  details?: Record<string, any>;
}

/**
 * Log an activity to the database
 */
export const logActivity = async (data: ActivityLogData): Promise<boolean> => {
  try {
    const response = await fetch('/api/activity-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Failed to log activity: ${response.statusText}`);
      return false;
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error logging activity:', error);
    return false;
  }
};

/**
 * Site-related activities
 */
export const siteActivities = {
  created: (siteName: string, siteId: string, details?: any) =>
    logActivity({
      action: 'Created',
      description: `Created new site: ${siteName}`,
      type: 'site',
      entity: 'Site',
      entityId: siteId,
      details: details || {},
    }),

  updated: (siteName: string, siteId: string, changes?: any) =>
    logActivity({
      action: 'Updated',
      description: `Updated site: ${siteName}`,
      type: 'site',
      entity: 'Site',
      entityId: siteId,
      details: changes || {},
    }),

  deleted: (siteName: string, siteId: string) =>
    logActivity({
      action: 'Deleted',
      description: `Deleted site: ${siteName}`,
      type: 'site',
      entity: 'Site',
      entityId: siteId,
    }),

  statusChanged: (siteName: string, siteId: string, oldStatus: string, newStatus: string) =>
    logActivity({
      action: 'Status Changed',
      description: `Site ${siteName} status changed from ${oldStatus} to ${newStatus}`,
      type: 'site',
      entity: 'Site',
      entityId: siteId,
      details: { oldStatus, newStatus },
    }),

  assigned: (siteName: string, siteId: string, personnelName: string) =>
    logActivity({
      action: 'Assigned',
      description: `Assigned site ${siteName} to ${personnelName}`,
      type: 'site',
      entity: 'Site',
      entityId: siteId,
      details: { assignedTo: personnelName },
    }),
};

/**
 * Personnel-related activities
 */
export const personnelActivities = {
  created: (personnelName: string, personnelId: string, details?: any) =>
    logActivity({
      action: 'Created',
      description: `Created new personnel: ${personnelName}`,
      type: 'personnel',
      entity: 'Personnel',
      entityId: personnelId,
      details: details || {},
    }),

  updated: (personnelName: string, personnelId: string, changes?: any) =>
    logActivity({
      action: 'Updated',
      description: `Updated personnel: ${personnelName}`,
      type: 'personnel',
      entity: 'Personnel',
      entityId: personnelId,
      details: changes || {},
    }),

  deleted: (personnelName: string, personnelId: string) =>
    logActivity({
      action: 'Deleted',
      description: `Deleted personnel: ${personnelName}`,
      type: 'personnel',
      entity: 'Personnel',
      entityId: personnelId,
    }),

  assigned: (personnelName: string, personnelId: string, siteCount: number) =>
    logActivity({
      action: 'Assigned',
      description: `Assigned ${siteCount} site(s) to ${personnelName}`,
      type: 'personnel',
      entity: 'Personnel',
      entityId: personnelId,
      details: { siteCount },
    }),

  roleChanged: (personnelName: string, personnelId: string, newRole: string) =>
    logActivity({
      action: 'Role Changed',
      description: `Changed ${personnelName}'s role to ${newRole}`,
      type: 'personnel',
      entity: 'Personnel',
      entityId: personnelId,
      details: { newRole },
    }),
};

/**
 * System-related activities
 */
export const systemActivities = {
  login: (userName: string, userId: string) =>
    logActivity({
      action: 'Login',
      description: `User ${userName} logged in`,
      type: 'system',
      entity: 'User',
      entityId: userId,
    }),

  logout: (userName: string, userId: string) =>
    logActivity({
      action: 'Logout',
      description: `User ${userName} logged out`,
      type: 'system',
      entity: 'User',
      entityId: userId,
    }),

  exported: (exportType: string, details?: any) =>
    logActivity({
      action: 'Exported',
      description: `Exported ${exportType}`,
      type: 'system',
      entity: 'Export',
      details: details || {},
    }),

  configChanged: (configName: string, changes?: any) =>
    logActivity({
      action: 'Configuration Changed',
      description: `Updated configuration: ${configName}`,
      type: 'system',
      entity: 'Configuration',
      details: changes || {},
    }),

  alertTriggered: (alertType: string, details?: any) =>
    logActivity({
      action: 'Alert Triggered',
      description: `System alert: ${alertType}`,
      type: 'system',
      entity: 'Alert',
      details: details || {},
    }),
};
