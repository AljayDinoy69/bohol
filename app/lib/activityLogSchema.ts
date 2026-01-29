/**
 * Activity Log Schema and Types
 * Defines the structure and types for activity logging
 */

import { ObjectId } from 'mongodb';

export type ActivityType = 'site' | 'personnel' | 'system' | 'other' | 'report';

/**
 * Database schema for Activity Logs
 * Stored in MongoDB collection: activity_logs
 */
export interface ActivityLogSchema {
  _id?: ObjectId | string;
  id?: string;
  
  // Required fields
  action: string;
  description: string;
  type: ActivityType;
  timestamp: Date;
  
  // Optional fields for context
  userId?: string;
  entity?: string;
  entityId?: string;
  status?: string;
  
  // Additional metadata
  details?: Record<string, any>;
}

/**
 * Create Activity Log Request DTO
 * Used when logging new activities
 */
export interface CreateActivityLogRequest {
  action: string;
  description: string;
  type: ActivityType;
  userId?: string;
  entity?: string;
  entityId?: string;
  status?: string;
  details?: Record<string, any>;
}

/**
 * Activity Log Response DTO
 * Returned from API endpoints
 */
export interface ActivityLogResponse extends ActivityLogSchema {
  id: string;
  _id?: string;
}

/**
 * Activity Log Filter Options
 * Used for querying activity logs
 */
export interface ActivityLogFilter {
  type?: ActivityType;
  entity?: string;
  entityId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  limit?: number;
  skip?: number;
  sortBy?: 'timestamp' | 'action' | 'type';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Activity Statistics
 * Aggregated data about activities
 */
export interface ActivityStats {
  totalActivities: number;
  activitiesByType: Record<ActivityType, number>;
  activitiesByEntity: Record<string, number>;
  recentActivities: ActivityLogResponse[];
  topUsers: Array<{ userId: string; count: number }>;
}

/**
 * Query result wrapper
 */
export interface ActivityLogsQueryResult {
  data: ActivityLogResponse[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}
