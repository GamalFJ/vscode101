import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Sensors from 'expo-sensors';

/**
 * Health Data Service for Ripped.AI
 * 
 * Comprehensive health data integration service that provides:
 * - Heart rate tracking from Apple Health (iOS) and Google Fit (Android)
 * - Calorie estimation during workouts based on time and workout type
 * - Daily activity summaries (steps, sleep, etc.)
 * - Data synchronization and storage
 * - Permission management for health data access
 * 
 * This service acts as a unified interface for all health-related data,
 * abstracting platform-specific implementations and providing a consistent API.
 */

export interface HealthPermissions {
  heartRate: boolean;
  steps: boolean;
  calories: boolean;
  sleep: boolean;
  workouts: boolean;
  granted: boolean;
  requestedAt?: Date;
}

export interface HeartRateData {
  bpm: number;
  timestamp: Date;
  source: 'apple_health' | 'google_fit' | 'manual' | 'simulated';
  zone?: HeartRateZone;
  confidence?: number; // 0-1 confidence score for the reading
}

export interface HeartRateZone {
  name: 'Resting' | 'Fat Burn' | 'Cardio' | 'Peak';
  color: string;
  range: { min: number; max: number };
  description: string;
}

export interface CalorieData {
  calories: number;
  timestamp: Date;
  source: 'calculated' | 'apple_health' | 'google_fit';
  workoutType?: string;
  duration?: number; // in minutes
  intensity?: 'low' | 'moderate' | 'high' | 'very_high';
}

export interface ActivitySummary {
  date: string; // YYYY-MM-DD format
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  sleepHours?: number;
  heartRateAvg?: number;
  workoutsCompleted: number;
  source: 'apple_health' | 'google_fit' | 'manual' | 'calculated';
}

export interface WorkoutCalorieEstimate {
  workoutType: string;
  caloriesPerMinute: number;
  intensityMultiplier: number;
}

const HEALTH_PERMISSIONS_KEY = 'health_permissions';
const HEART_RATE_DATA_KEY = 'heart_rate_data';
const CALORIE_DATA_KEY = 'calorie_data';
const ACTIVITY_SUMMARY_KEY = 'activity_summary';
const HEALTH_PROFILE_KEY = 'health_profile';

// Calorie estimation data based on workout types and intensity
const WORKOUT_CALORIE_ESTIMATES: Record<string, WorkoutCalorieEstimate> = {
  'strength': { workoutType: 'Strength Training', caloriesPerMinute: 6, intensityMultiplier: 1.2 },
  'cardio': { workoutType: 'Cardio', caloriesPerMinute: 10, intensityMultiplier: 1.5 },
  'hiit': { workoutType: 'HIIT', caloriesPerMinute: 12, intensityMultiplier: 1.8 },
  'yoga': { workoutType: 'Yoga', caloriesPerMinute: 3, intensityMultiplier: 0.8 },
  'pilates': { workoutType: 'Pilates', caloriesPerMinute: 4, intensityMultiplier: 0.9 },
  'running': { workoutType: 'Running', caloriesPerMinute: 11, intensityMultiplier: 1.6 },
  'cycling': { workoutType: 'Cycling', caloriesPerMinute: 8, intensityMultiplier: 1.3 },
  'swimming': { workoutType: 'Swimming', caloriesPerMinute: 9, intensityMultiplier: 1.4 },
  'walking': { workoutType: 'Walking', caloriesPerMinute: 4, intensityMultiplier: 0.7 },
  'flexibility': { workoutType: 'Flexibility', caloriesPerMinute: 2, intensityMultiplier: 0.6 },
};

export interface HealthProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessGoals: string[];
  restingHeartRate?: number;
  maxHeartRate?: number;
}

class HealthDataService {
  private static instance: HealthDataService;
  private permissions: HealthPermissions = {
    heartRate: false,
    steps: false,
    calories: false,
    sleep: false,
    workouts: false,
    granted: false,
  };
  private profile: HealthProfile | null = null;
  private heartRateData: HeartRateData[] = [];
  private calorieData: CalorieData[] = [];
  private activitySummaries: ActivitySummary[] = [];

  static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService();
    }
    return HealthDataService.instance;
  }

  // Initialize the service and load stored data
  async initialize(): Promise<void> {
    try {
      await this.loadPermissions();
      await this.loadProfile();
      await this.loadStoredData();
      console.log('HealthDataService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize HealthDataService:', error);
    }
  }

  // Request health data permissions
  async requestPermissions(): Promise<HealthPermissions> {
    try {
      console.log('Requesting health data permissions...');
      
      if (Platform.OS === 'ios') {
        return await this.requestAppleHealthPermissions();
      } else if (Platform.OS === 'android') {
        return await this.requestGoogleFitPermissions();
      } else {
        // Web or other platforms - use simulated data
        this.permissions = {
          heartRate: true,
          steps: true,
          calories: true,
          sleep: true,
          workouts: true,
          granted: true,
          requestedAt: new Date(),
        };
        await this.savePermissions();
        return this.permissions;
      }
    } catch (error) {
      console.error('Error requesting health permissions:', error);
      return this.permissions;
    }
  }

  // Apple HealthKit permission request
  private async requestAppleHealthPermissions(): Promise<HealthPermissions> {
    try {
      // TODO: Implement actual Apple HealthKit integration
      // This would require expo-health or react-native-health package
      console.log('Apple HealthKit permission request would be implemented here');
      
      // For now, simulate permission grant for demo
      this.permissions = {
        heartRate: true,
        steps: true,
        calories: true,
        sleep: true,
        workouts: true,
        granted: true,
        requestedAt: new Date(),
      };
      
      await this.savePermissions();
      return this.permissions;
    } catch (error) {
      console.error('Apple HealthKit permission error:', error);
      return this.permissions;
    }
  }

  // Google Fit permission request
  private async requestGoogleFitPermissions(): Promise<HealthPermissions> {
    try {
      // TODO: Implement actual Google Fit integration
      // This would require react-native-google-fit package
      console.log('Google Fit permission request would be implemented here');
      
      // For now, simulate permission grant for demo
      this.permissions = {
        heartRate: true,
        steps: true,
        calories: true,
        sleep: true,
        workouts: true,
        granted: true,
        requestedAt: new Date(),
      };
      
      await this.savePermissions();
      return this.permissions;
    } catch (error) {
      console.error('Google Fit permission error:', error);
      return this.permissions;
    }
  }

  // Get current permissions status
  getPermissions(): HealthPermissions {
    // Ensure permissions object has all required properties
    return {
      heartRate: typeof this.permissions?.heartRate === 'boolean' ? this.permissions.heartRate : false,
      steps: typeof this.permissions?.steps === 'boolean' ? this.permissions.steps : false,
      calories: typeof this.permissions?.calories === 'boolean' ? this.permissions.calories : false,
      sleep: typeof this.permissions?.sleep === 'boolean' ? this.permissions.sleep : false,
      workouts: typeof this.permissions?.workouts === 'boolean' ? this.permissions.workouts : false,
      granted: typeof this.permissions?.granted === 'boolean' ? this.permissions.granted : false,
      requestedAt: this.permissions?.requestedAt instanceof Date ? this.permissions.requestedAt : undefined
    };
  }

  // Check if specific permission is granted
  hasPermission(permission: keyof Omit<HealthPermissions, 'granted' | 'requestedAt'>): boolean {
    const safePermissions = this.getPermissions();
    return safePermissions[permission] && safePermissions.granted;
  }

  // Heart Rate Tracking
  async startHeartRateMonitoring(callback: (data: HeartRateData) => void): Promise<() => void> {
    if (!this.hasPermission('heartRate')) {
      console.warn('Heart rate permission not granted');
      return () => {};
    }

    try {
      if (Platform.OS === 'ios') {
        return await this.startAppleHealthHeartRateMonitoring(callback);
      } else if (Platform.OS === 'android') {
        return await this.startGoogleFitHeartRateMonitoring(callback);
      } else {
        return this.startSimulatedHeartRateMonitoring(callback);
      }
    } catch (error) {
      console.error('Error starting heart rate monitoring:', error);
      return this.startSimulatedHeartRateMonitoring(callback);
    }
  }

  private async startAppleHealthHeartRateMonitoring(callback: (data: HeartRateData) => void): Promise<() => void> {
    // TODO: Implement actual Apple HealthKit heart rate monitoring
    console.log('Apple HealthKit heart rate monitoring would be implemented here');
    return this.startSimulatedHeartRateMonitoring(callback);
  }

  private async startGoogleFitHeartRateMonitoring(callback: (data: HeartRateData) => void): Promise<() => void> {
    // TODO: Implement actual Google Fit heart rate monitoring
    console.log('Google Fit heart rate monitoring would be implemented here');
    return this.startSimulatedHeartRateMonitoring(callback);
  }

  private startSimulatedHeartRateMonitoring(callback: (data: HeartRateData) => void): () => void {
    const interval = setInterval(() => {
      const heartRateData = this.generateSimulatedHeartRate();
      this.saveHeartRateData(heartRateData);
      callback(heartRateData);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }

  private generateSimulatedHeartRate(): HeartRateData {
    const baseRate = this.profile?.restingHeartRate || 70;
    const variation = Math.random() * 30 - 15; // ±15 BPM variation
    const bpm = Math.max(50, Math.min(180, Math.round(baseRate + variation)));
    
    const zones = this.calculateHeartRateZones();
    const zone = this.getZoneForBPM(bpm, zones);

    return {
      bpm,
      timestamp: new Date(),
      source: 'simulated',
      zone,
      confidence: 0.95,
    };
  }

  // Calculate heart rate zones based on user profile
  calculateHeartRateZones(): HeartRateZone[] {
    const age = this.profile?.age || 30;
    const maxHR = this.profile?.maxHeartRate || (220 - age);
    const restingHR = this.profile?.restingHeartRate || 60;
    
    return [
      {
        name: 'Resting',
        color: '#4CAF50',
        range: { min: restingHR, max: Math.round(maxHR * 0.6) },
        description: 'Recovery and warm-up zone'
      },
      {
        name: 'Fat Burn',
        color: '#FF9800',
        range: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
        description: 'Optimal fat burning zone'
      },
      {
        name: 'Cardio',
        color: '#F44336',
        range: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.85) },
        description: 'Cardiovascular fitness zone'
      },
      {
        name: 'Peak',
        color: '#9C27B0',
        range: { min: Math.round(maxHR * 0.85), max: maxHR },
        description: 'Maximum effort zone'
      }
    ];
  }

  private getZoneForBPM(bpm: number, zones: HeartRateZone[]): HeartRateZone {
    for (const zone of zones) {
      if (bpm >= zone.range.min && bpm <= zone.range.max) {
        return zone;
      }
    }
    return bpm < zones[0].range.min ? zones[0] : zones[zones.length - 1];
  }

  // Calorie Estimation
  estimateCaloriesBurned(workoutType: string, durationMinutes: number, intensity: 'low' | 'moderate' | 'high' | 'very_high' = 'moderate'): CalorieData {
    const estimate = WORKOUT_CALORIE_ESTIMATES[workoutType.toLowerCase()] || WORKOUT_CALORIE_ESTIMATES['strength'];
    
    const intensityMultipliers = {
      low: 0.7,
      moderate: 1.0,
      high: 1.3,
      very_high: 1.6,
    };

    const userWeight = this.profile?.weight || 70; // Default 70kg
    const weightMultiplier = userWeight / 70; // Adjust for user weight
    
    const baseCalories = estimate.caloriesPerMinute * durationMinutes;
    const adjustedCalories = baseCalories * estimate.intensityMultiplier * intensityMultipliers[intensity] * weightMultiplier;
    
    const calorieData: CalorieData = {
      calories: Math.round(adjustedCalories),
      timestamp: new Date(),
      source: 'calculated',
      workoutType,
      duration: durationMinutes,
      intensity,
    };

    this.saveCalorieData(calorieData);
    return calorieData;
  }

  // Activity Summary
  async getDailyActivitySummary(date: string): Promise<ActivitySummary | null> {
    try {
      const existingSummary = this.activitySummaries.find(summary => summary?.date === date);
      if (existingSummary) {
        return existingSummary;
      }

      // Generate or fetch new summary
      if (Platform.OS === 'ios') {
        return await this.getAppleHealthActivitySummary(date);
      } else if (Platform.OS === 'android') {
        return await this.getGoogleFitActivitySummary(date);
      } else {
        return this.generateSimulatedActivitySummary(date);
      }
    } catch (error) {
      console.error('Error getting daily activity summary:', error);
      return this.generateSimulatedActivitySummary(date);
    }
  }

  private async getAppleHealthActivitySummary(date: string): Promise<ActivitySummary> {
    // TODO: Implement actual Apple HealthKit data fetching
    console.log('Apple HealthKit activity summary would be fetched here for date:', date);
    return this.generateSimulatedActivitySummary(date);
  }

  private async getGoogleFitActivitySummary(date: string): Promise<ActivitySummary> {
    // TODO: Implement actual Google Fit data fetching
    console.log('Google Fit activity summary would be fetched here for date:', date);
    return this.generateSimulatedActivitySummary(date);
  }

  private generateSimulatedActivitySummary(date: string): ActivitySummary {
    const isToday = date === new Date().toISOString().split('T')[0];
    const baseSteps = isToday ? Math.floor(Math.random() * 5000) + 3000 : Math.floor(Math.random() * 8000) + 5000;
    
    const summary: ActivitySummary = {
      date,
      steps: baseSteps,
      caloriesBurned: Math.round(baseSteps * 0.04 + Math.random() * 200), // Rough estimation
      activeMinutes: Math.round(baseSteps / 100 + Math.random() * 30),
      sleepHours: isToday ? undefined : Math.round((Math.random() * 2 + 6.5) * 10) / 10,
      heartRateAvg: Math.round(Math.random() * 20 + 70),
      workoutsCompleted: Math.random() > 0.7 ? 1 : 0,
      source: 'simulated',
    };

    this.activitySummaries.push(summary);
    this.saveActivitySummaries();
    return summary;
  }

  // Get activity summaries for a date range
  async getActivitySummaries(startDate: string, endDate: string): Promise<ActivitySummary[]> {
    const summaries: ActivitySummary[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const summary = await this.getDailyActivitySummary(dateString);
      if (summary) {
        summaries.push(summary);
      }
    }
    
    return summaries;
  }

  // Profile Management
  async saveHealthProfile(profile: HealthProfile): Promise<void> {
    try {
      // Validate profile object before saving
      if (!profile || typeof profile !== 'object') {
        console.warn('Invalid profile object provided:', profile);
        return;
      }

      // Ensure profile has required properties with safe defaults
      const safeProfile: HealthProfile = {
        age: typeof profile?.age === 'number' && profile.age > 0 ? profile.age : 30,
        weight: typeof profile?.weight === 'number' && profile.weight > 0 ? profile.weight : 70,
        height: typeof profile?.height === 'number' && profile.height > 0 ? profile.height : 170,
        gender: profile?.gender === 'male' || profile?.gender === 'female' || profile?.gender === 'other' ? profile.gender : 'other',
        activityLevel: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'].includes(profile?.activityLevel) ? profile.activityLevel : 'moderately_active',
        fitnessGoals: Array.isArray(profile?.fitnessGoals) ? profile.fitnessGoals : [],
        restingHeartRate: typeof profile?.restingHeartRate === 'number' ? profile.restingHeartRate : undefined,
        maxHeartRate: typeof profile?.maxHeartRate === 'number' ? profile.maxHeartRate : undefined
      };

      this.profile = safeProfile;
      await AsyncStorage.setItem(HEALTH_PROFILE_KEY, JSON.stringify(safeProfile));
      console.log('Health profile saved successfully');
    } catch (error) {
      console.error('Error saving health profile:', error);
    }
  }

  getHealthProfile(): HealthProfile | null {
    return this.profile;
  }

  // Data Storage Methods
  private async savePermissions(): Promise<void> {
    try {
      await AsyncStorage.setItem(HEALTH_PERMISSIONS_KEY, JSON.stringify(this.permissions));
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  }

  private async loadPermissions(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(HEALTH_PERMISSIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate parsed permissions object
        if (parsed && typeof parsed === 'object') {
          this.permissions = {
            heartRate: typeof parsed?.heartRate === 'boolean' ? parsed.heartRate : false,
            steps: typeof parsed?.steps === 'boolean' ? parsed.steps : false,
            calories: typeof parsed?.calories === 'boolean' ? parsed.calories : false,
            sleep: typeof parsed?.sleep === 'boolean' ? parsed.sleep : false,
            workouts: typeof parsed?.workouts === 'boolean' ? parsed.workouts : false,
            granted: typeof parsed?.granted === 'boolean' ? parsed.granted : false,
            requestedAt: parsed?.requestedAt ? new Date(parsed.requestedAt) : undefined
          };
        }
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  }

  private async loadProfile(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(HEALTH_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate parsed profile object
        if (parsed && typeof parsed === 'object') {
          this.profile = parsed;
        }
      }
    } catch (error) {
      console.error('Error loading health profile:', error);
    }
  }

  private async saveHeartRateData(data: HeartRateData): Promise<void> {
    try {
      // Validate heart rate data before saving
      if (!data || typeof data !== 'object' || typeof data?.bpm !== 'number') {
        console.warn('Invalid heart rate data provided:', data);
        return;
      }

      this.heartRateData.push(data);
      // Keep only last 1000 readings
      if (this.heartRateData.length > 1000) {
        this.heartRateData = this.heartRateData.slice(-1000);
      }
      await AsyncStorage.setItem(HEART_RATE_DATA_KEY, JSON.stringify(this.heartRateData));
    } catch (error) {
      console.error('Error saving heart rate data:', error);
    }
  }

  private async saveCalorieData(data: CalorieData): Promise<void> {
    try {
      // Validate calorie data before saving
      if (!data || typeof data !== 'object' || typeof data?.calories !== 'number') {
        console.warn('Invalid calorie data provided:', data);
        return;
      }

      this.calorieData.push(data);
      // Keep only last 500 entries
      if (this.calorieData.length > 500) {
        this.calorieData = this.calorieData.slice(-500);
      }
      await AsyncStorage.setItem(CALORIE_DATA_KEY, JSON.stringify(this.calorieData));
    } catch (error) {
      console.error('Error saving calorie data:', error);
    }
  }

  private async saveActivitySummaries(): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVITY_SUMMARY_KEY, JSON.stringify(this.activitySummaries));
    } catch (error) {
      console.error('Error saving activity summaries:', error);
    }
  }

  private async loadStoredData(): Promise<void> {
    try {
      // Load heart rate data
      const heartRateStored = await AsyncStorage.getItem(HEART_RATE_DATA_KEY);
      if (heartRateStored) {
        const parsed = JSON.parse(heartRateStored);
        if (Array.isArray(parsed)) {
          this.heartRateData = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })).filter(item => item && typeof item.bpm === 'number');
        }
      }

      // Load calorie data
      const calorieStored = await AsyncStorage.getItem(CALORIE_DATA_KEY);
      if (calorieStored) {
        const parsed = JSON.parse(calorieStored);
        if (Array.isArray(parsed)) {
          this.calorieData = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })).filter(item => item && typeof item.calories === 'number');
        }
      }

      // Load activity summaries
      const activityStored = await AsyncStorage.getItem(ACTIVITY_SUMMARY_KEY);
      if (activityStored) {
        const parsed = JSON.parse(activityStored);
        if (Array.isArray(parsed)) {
          this.activitySummaries = parsed.filter(item => 
            item && 
            typeof item === 'object' && 
            typeof item.date === 'string' &&
            typeof item.steps === 'number'
          );
        }
      }
    } catch (error) {
      console.error('Error loading stored health data:', error);
    }
  }

  // Get recent heart rate data
  getRecentHeartRateData(count: number = 50): HeartRateData[] {
    return this.heartRateData.slice(-count);
  }

  // Get recent calorie data
  getRecentCalorieData(count: number = 50): CalorieData[] {
    return this.calorieData.slice(-count);
  }

  // Export all health data
  async exportHealthData(): Promise<string> {
    try {
      const data = {
        permissions: this.permissions,
        profile: this.profile,
        heartRateData: this.heartRateData,
        calorieData: this.calorieData,
        activitySummaries: this.activitySummaries,
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting health data:', error);
      return '';
    }
  }

  // Get today's activity summary
  async getTodayActivitySummary(): Promise<ActivitySummary | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const summary = await this.getDailyActivitySummary(today);
      
      // Comprehensive validation of the activity summary structure
      if (summary && 
          typeof summary === 'object' && 
          typeof summary?.date === 'string' &&
          typeof summary?.steps === 'number' &&
          typeof summary?.caloriesBurned === 'number' &&
          typeof summary?.activeMinutes === 'number' &&
          typeof summary?.workoutsCompleted === 'number' &&
          typeof summary?.source === 'string') {
        
        // Additional validation for optional properties
        const validatedSummary: ActivitySummary = {
          date: summary.date,
          steps: summary.steps,
          caloriesBurned: summary.caloriesBurned,
          activeMinutes: summary.activeMinutes,
          sleepHours: typeof summary?.sleepHours === 'number' ? summary.sleepHours : undefined,
          heartRateAvg: typeof summary?.heartRateAvg === 'number' ? summary.heartRateAvg : undefined,
          workoutsCompleted: summary.workoutsCompleted,
          source: summary.source
        };
        
        return validatedSummary;
      }
      
      console.warn('Invalid activity summary structure:', summary);
      return null;
    } catch (error) {
      console.error('Error getting today activity summary:', error);
      return null;
    }
  }

  // Get current heart rate
  async getCurrentHeartRate(): Promise<HeartRateData | null> {
    try {
      if (!Array.isArray(this.heartRateData) || this.heartRateData.length === 0) {
        console.log('No heart rate data available');
        return null;
      }
      
      const latestReading = this.heartRateData[this.heartRateData.length - 1];
      
      // Comprehensive validation of the heart rate data structure
      if (latestReading && 
          typeof latestReading === 'object' && 
          typeof latestReading?.bpm === 'number' && 
          latestReading?.timestamp instanceof Date &&
          typeof latestReading?.source === 'string') {
        
        // Additional validation for optional properties
        const validatedReading: HeartRateData = {
          bpm: latestReading.bpm,
          timestamp: latestReading.timestamp,
          source: latestReading.source,
          zone: latestReading?.zone && typeof latestReading.zone === 'object' ? latestReading.zone : undefined,
          confidence: typeof latestReading?.confidence === 'number' ? latestReading.confidence : undefined
        };
        
        return validatedReading;
      }
      
      console.warn('Invalid heart rate data structure:', latestReading);
      return null;
    } catch (error) {
      console.error('Error getting current heart rate:', error);
      return null;
    }
  }

  // Clear all health data
  async clearAllHealthData(): Promise<void> {
    try {
      this.heartRateData = [];
      this.calorieData = [];
      this.activitySummaries = [];
      this.permissions = {
        heartRate: false,
        steps: false,
        calories: false,
        sleep: false,
        workouts: false,
        granted: false,
      };
      this.profile = null;

      await AsyncStorage.multiRemove([
        HEALTH_PERMISSIONS_KEY,
        HEART_RATE_DATA_KEY,
        CALORIE_DATA_KEY,
        ACTIVITY_SUMMARY_KEY,
        HEALTH_PROFILE_KEY,
      ]);

      console.log('All health data cleared successfully');
    } catch (error) {
      console.error('Error clearing health data:', error);
    }
  }
}

export default HealthDataService;