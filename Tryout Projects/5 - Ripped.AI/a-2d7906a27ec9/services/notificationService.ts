import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { safeGet, safeJsonParse, safeJsonStringify, validateObject } from '../utils/safeAccess';

export interface WorkoutSchedule {
  id: string;
  days: string[];
  time: string;
  workoutType: string;
  isActive: boolean;
  createdAt: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private permissionStatus: string = 'granted'; // Default to granted since we're not using notifications

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    try {
      console.log('Initializing NotificationService...');
      
      // Skip notification setup on web platform to avoid warnings
      if (Platform.OS === 'web') {
        console.log('Web platform detected - skipping notification setup');
        this.permissionStatus = 'granted';
        return;
      }
      
      // For native platforms, we're keeping notifications disabled for now
      console.log('Native platform detected - notifications disabled');
      this.permissionStatus = 'granted';
      console.log('NotificationService initialized successfully');
    } catch (error) {
      console.error('Error initializing NotificationService:', error);
      // Don't throw error, just log it to prevent app crashes
      this.permissionStatus = 'denied';
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      console.log('Notification permissions not available (notifications disabled)');
      this.permissionStatus = 'granted';
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async scheduleWorkoutReminder(schedule: WorkoutSchedule): Promise<string[]> {
    console.log('Workout reminder scheduling disabled (notifications removed)');
    
    // Add comprehensive null checks for schedule object and its properties
    if (!schedule || typeof schedule !== 'object') {
      console.error('Invalid schedule object provided:', schedule);
      return [];
    }

    // Safely check schedule properties with fallbacks
    const safeSchedule = {
      id: schedule?.id || Date.now().toString(),
      days: Array.isArray(schedule?.days) ? schedule.days : [],
      time: typeof schedule?.time === 'string' ? schedule.time : '09:00',
      workoutType: typeof schedule?.workoutType === 'string' ? schedule.workoutType : 'General Workout',
      isActive: typeof schedule?.isActive === 'boolean' ? schedule.isActive : true,
      createdAt: schedule?.createdAt instanceof Date ? schedule.createdAt : new Date()
    };

    // Validate required fields
    if (!safeSchedule.days || safeSchedule.days.length === 0) {
      console.error('Invalid schedule days - no days provided');
      return [];
    }

    // Store schedule for reference but don't actually schedule notifications
    try {
      await this.storeSchedule(safeSchedule);
      console.log('Schedule stored (notifications disabled):', safeSchedule);
      return []; // Return empty array since no notifications are scheduled
    } catch (error) {
      console.error('Error storing schedule:', error);
      return [];
    }
  }

  async cancelScheduleNotifications(scheduleId: string): Promise<void> {
    try {
      if (!scheduleId || typeof scheduleId !== 'string') {
        console.warn('Invalid schedule ID provided for cancellation:', scheduleId);
        return;
      }

      await this.removeStoredSchedule(scheduleId);
      console.log('Schedule removed (notifications disabled):', scheduleId);
    } catch (error) {
      console.error('Error removing schedule:', error);
    }
  }

  async scheduleTimerNotification(title: string, body: string, delay: number = 0): Promise<string | null> {
    console.log('Timer notification disabled (notifications removed)');
    
    // Add comprehensive null checks for parameters with safe fallbacks
    const safeTitle = title && typeof title === 'string' ? title : 'Workout Timer';
    const safeBody = body && typeof body === 'string' ? body : 'Timer notification';
    const safeDelay = typeof delay === 'number' && delay >= 0 ? delay : 0;

    if (!title || typeof title !== 'string') {
      console.warn('Invalid title provided for timer notification, using fallback:', safeTitle);
    }

    if (!body || typeof body !== 'string') {
      console.warn('Invalid body provided for timer notification, using fallback:', safeBody);
    }

    // Log the notification that would have been sent
    console.log('Timer notification (would have been sent):', { 
      title: safeTitle, 
      body: safeBody, 
      delay: safeDelay 
    });
    return null;
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem('workoutSchedules');
      console.log('All schedules cleared (notifications disabled)');
    } catch (error) {
      console.error('Error clearing schedules:', error);
    }
  }

  cleanup() {
    console.log('NotificationService cleanup completed (no-op)');
  }

  private async storeSchedule(schedule: WorkoutSchedule): Promise<void> {
    try {
      if (!schedule || typeof schedule !== 'object') {
        console.warn('Invalid schedule for storage:', schedule);
        return;
      }

      // Ensure schedule has all required properties with safe defaults
      const safeSchedule: WorkoutSchedule = {
        id: safeGet(schedule, 'id', Date.now().toString()),
        days: Array.isArray(safeGet(schedule, 'days')) ? schedule.days : [],
        time: safeGet(schedule, 'time', '09:00'),
        workoutType: safeGet(schedule, 'workoutType', 'General Workout'),
        isActive: typeof safeGet(schedule, 'isActive') === 'boolean' ? schedule.isActive : true,
        createdAt: safeGet(schedule, 'createdAt') instanceof Date ? schedule.createdAt : new Date()
      };

      const existingSchedules = await this.getStoredSchedules();
      const updatedSchedules = [...(existingSchedules || []), safeSchedule];
      const jsonString = safeJsonStringify(updatedSchedules, '[]');
      await AsyncStorage.setItem('workoutSchedules', jsonString);
    } catch (error) {
      console.error('Error storing schedule:', error);
    }
  }

  private async getStoredSchedules(): Promise<WorkoutSchedule[]> {
    try {
      const stored = await AsyncStorage.getItem('workoutSchedules');
      const parsed = safeJsonParse(stored, []);
      
      // Validate that parsed data is an array and filter out invalid schedules
      if (Array.isArray(parsed)) {
        return parsed.filter(schedule => 
          validateObject(schedule, ['id', 'days', 'time', 'workoutType', 'isActive', 'createdAt'])
        );
      }
      
      console.warn('Stored schedules is not an array:', parsed);
      return [];
    } catch (error) {
      console.error('Error getting stored schedules:', error);
      return [];
    }
  }

  private async removeStoredSchedule(scheduleId: string): Promise<void> {
    try {
      if (!scheduleId || typeof scheduleId !== 'string') {
        console.warn('Invalid schedule ID for removal:', scheduleId);
        return;
      }

      const existingSchedules = await this.getStoredSchedules();
      const updatedSchedules = existingSchedules.filter(s => 
        s && typeof s === 'object' && safeGet(s, 'id') !== scheduleId
      );
      const jsonString = safeJsonStringify(updatedSchedules, '[]');
      await AsyncStorage.setItem('workoutSchedules', jsonString);
    } catch (error) {
      console.error('Error removing stored schedule:', error);
    }
  }

  getPermissionStatus(): string {
    return this.permissionStatus;
  }
}

export default NotificationService.getInstance();