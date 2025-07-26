import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutSchedule {
  id: string;
  days: string[];
  time: string;
  workoutType: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TimerPreset {
  id: string;
  name: string;
  duration: number;
  type: 'rest' | 'work' | 'custom';
  isDefault: boolean;
}

export interface WorkoutSession {
  id: string;
  workoutType: string;
  duration: number;
  exercises: string[];
  completedAt: Date;
  timerUsed: boolean;
}

export class StorageService {
  private static instance: StorageService;
  private readonly SCHEDULES_KEY = 'workoutSchedules';
  private readonly PRESETS_KEY = 'timerPresets';
  private readonly SESSIONS_KEY = 'workoutSessions';
  private readonly SETTINGS_KEY = 'appSettings';

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Workout Schedules
  async getWorkoutSchedules(): Promise<WorkoutSchedule[]> {
    try {
      const storedSchedules = await AsyncStorage.getItem(this.SCHEDULES_KEY);
      if (storedSchedules) {
        const schedules = JSON.parse(storedSchedules);
        // Convert date strings back to Date objects
        return schedules.map((schedule: any) => ({
          ...schedule,
          createdAt: new Date(schedule.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading workout schedules:', error);
      return [];
    }
  }

  async saveWorkoutSchedules(schedules: WorkoutSchedule[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(schedules));
      console.log('Workout schedules saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving workout schedules:', error);
      return false;
    }
  }

  async addWorkoutSchedule(schedule: WorkoutSchedule): Promise<boolean> {
    try {
      const existingSchedules = await this.getWorkoutSchedules();
      const updatedSchedules = [...existingSchedules, schedule];
      return await this.saveWorkoutSchedules(updatedSchedules);
    } catch (error) {
      console.error('Error adding workout schedule:', error);
      return false;
    }
  }

  async updateWorkoutSchedule(scheduleId: string, updates: Partial<WorkoutSchedule>): Promise<boolean> {
    try {
      const existingSchedules = await this.getWorkoutSchedules();
      const updatedSchedules = existingSchedules.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
      );
      return await this.saveWorkoutSchedules(updatedSchedules);
    } catch (error) {
      console.error('Error updating workout schedule:', error);
      return false;
    }
  }

  async deleteWorkoutSchedule(scheduleId: string): Promise<boolean> {
    try {
      const existingSchedules = await this.getWorkoutSchedules();
      const updatedSchedules = existingSchedules.filter(schedule => schedule.id !== scheduleId);
      return await this.saveWorkoutSchedules(updatedSchedules);
    } catch (error) {
      console.error('Error deleting workout schedule:', error);
      return false;
    }
  }

  // Timer Presets
  async getTimerPresets(): Promise<TimerPreset[]> {
    try {
      const storedPresets = await AsyncStorage.getItem(this.PRESETS_KEY);
      if (storedPresets) {
        return JSON.parse(storedPresets);
      }
      
      // Return default presets if none exist
      const defaultPresets: TimerPreset[] = [
        { id: '1', name: 'Quick Rest', duration: 30, type: 'rest', isDefault: true },
        { id: '2', name: 'Standard Rest', duration: 60, type: 'rest', isDefault: true },
        { id: '3', name: 'Long Rest', duration: 90, type: 'rest', isDefault: true },
        { id: '4', name: 'Strength Rest', duration: 180, type: 'rest', isDefault: true },
        { id: '5', name: 'HIIT Work', duration: 45, type: 'work', isDefault: true },
        { id: '6', name: 'Plank Hold', duration: 60, type: 'work', isDefault: true },
      ];
      
      await this.saveTimerPresets(defaultPresets);
      return defaultPresets;
    } catch (error) {
      console.error('Error loading timer presets:', error);
      return [];
    }
  }

  async saveTimerPresets(presets: TimerPreset[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.PRESETS_KEY, JSON.stringify(presets));
      console.log('Timer presets saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving timer presets:', error);
      return false;
    }
  }

  async addTimerPreset(preset: TimerPreset): Promise<boolean> {
    try {
      const existingPresets = await this.getTimerPresets();
      const updatedPresets = [...existingPresets, preset];
      return await this.saveTimerPresets(updatedPresets);
    } catch (error) {
      console.error('Error adding timer preset:', error);
      return false;
    }
  }

  async deleteTimerPreset(presetId: string): Promise<boolean> {
    try {
      const existingPresets = await this.getTimerPresets();
      const updatedPresets = existingPresets.filter(preset => preset.id !== presetId);
      return await this.saveTimerPresets(updatedPresets);
    } catch (error) {
      console.error('Error deleting timer preset:', error);
      return false;
    }
  }

  // Workout Sessions
  async getWorkoutSessions(): Promise<WorkoutSession[]> {
    try {
      const storedSessions = await AsyncStorage.getItem(this.SESSIONS_KEY);
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions);
        return sessions.map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading workout sessions:', error);
      return [];
    }
  }

  async saveWorkoutSession(session: WorkoutSession): Promise<boolean> {
    try {
      const existingSessions = await this.getWorkoutSessions();
      const updatedSessions = [...existingSessions, session];
      await AsyncStorage.setItem(this.SESSIONS_KEY, JSON.stringify(updatedSessions));
      console.log('Workout session saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving workout session:', error);
      return false;
    }
  }

  // App Settings
  async getAppSettings(): Promise<any> {
    try {
      const storedSettings = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
      
      // Default settings
      const defaultSettings = {
        notificationsEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        defaultRestTime: 60,
        defaultWorkTime: 45,
        theme: 'dark',
      };
      
      await this.saveAppSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error loading app settings:', error);
      return {};
    }
  }

  async saveAppSettings(settings: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      console.log('App settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving app settings:', error);
      return false;
    }
  }

  async updateAppSetting(key: string, value: any): Promise<boolean> {
    try {
      const existingSettings = await this.getAppSettings();
      const updatedSettings = { ...existingSettings, [key]: value };
      return await this.saveAppSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating app setting:', error);
      return false;
    }
  }

  // Utility methods
  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        this.SCHEDULES_KEY,
        this.PRESETS_KEY,
        this.SESSIONS_KEY,
        this.SETTINGS_KEY,
      ]);
      console.log('All app data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing app data:', error);
      return false;
    }
  }

  async getStorageInfo(): Promise<{ keys: string[]; size: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => 
        key.startsWith('workout') || 
        key.startsWith('timer') || 
        key.startsWith('app')
      );
      
      // Estimate size (this is approximate)
      let totalSize = 0;
      for (const key of appKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return { keys: appKeys, size: totalSize };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { keys: [], size: 0 };
    }
  }
}

export default StorageService.getInstance();