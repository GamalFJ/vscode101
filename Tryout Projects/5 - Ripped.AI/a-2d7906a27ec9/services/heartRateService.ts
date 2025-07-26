import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Heart Rate Service for Ripped.AI
 * 
 * This service provides heart rate monitoring capabilities with preparation for
 * Apple HealthKit and Google Fit integration. Currently uses simulated data
 * for demonstration purposes.
 * 
 * Features:
 * - Real-time heart rate monitoring with pulse animation
 * - Heart rate zone calculation and display (Resting, Fat Burn, Cardio, Peak)
 * - Data persistence and history tracking
 * - Prepared integration points for HealthKit/Google Fit
 * - Simulated data generation for testing and demo
 * 
 * Future Integration Plans:
 * - Apple HealthKit: Use expo-health or react-native-health package
 * - Google Fit: Use react-native-google-fit package
 * - Real-time data from wearable devices
 * - Advanced analytics and insights
 * 
 * Usage:
 * ```typescript
 * const heartRateService = HeartRateService.getInstance();
 * const stopMonitoring = heartRateService.startSimulatedMonitoring((reading) => {
 *   console.log('Heart rate:', reading.bpm, 'Zone:', reading.zone.name);
 * });
 * ```
 */

export interface HeartRateReading {
  bpm: number;
  timestamp: Date;
  source: 'apple_health' | 'google_fit' | 'manual' | 'simulated';
  zone: HeartRateZone;
}

export interface HeartRateZone {
  name: 'Resting' | 'Fat Burn' | 'Cardio' | 'Peak';
  color: string;
  range: { min: number; max: number };
  description: string;
}

export interface UserHeartRateProfile {
  age: number;
  restingHeartRate?: number;
  maxHeartRate?: number;
  customZones?: HeartRateZone[];
}

const HEART_RATE_STORAGE_KEY = 'heart_rate_data';
const PROFILE_STORAGE_KEY = 'heart_rate_profile';

class HeartRateService {
  private static instance: HeartRateService;
  private readings: HeartRateReading[] = [];
  private profile: UserHeartRateProfile | null = null;

  static getInstance(): HeartRateService {
    if (!HeartRateService.instance) {
      HeartRateService.instance = new HeartRateService();
    }
    return HeartRateService.instance;
  }

  // Calculate heart rate zones based on age and optional resting HR
  calculateHeartRateZones(age: number, restingHR?: number): HeartRateZone[] {
    const maxHR = 220 - age;
    
    return [
      {
        name: 'Resting',
        color: '#4CAF50',
        range: { min: restingHR || 50, max: Math.round(maxHR * 0.6) },
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

  // Determine which zone a BPM reading falls into
  getZoneForBPM(bpm: number, zones: HeartRateZone[]): HeartRateZone {
    for (const zone of zones) {
      if (bpm >= zone.range.min && bpm <= zone.range.max) {
        return zone;
      }
    }
    // Default to resting if below all zones, peak if above all zones
    return bpm < zones[0].range.min ? zones[0] : zones[zones.length - 1];
  }

  // Save heart rate reading
  async saveReading(reading: HeartRateReading): Promise<void> {
    try {
      this.readings.push(reading);
      
      // Keep only last 1000 readings to manage storage
      if (this.readings.length > 1000) {
        this.readings = this.readings.slice(-1000);
      }

      await AsyncStorage.setItem(
        HEART_RATE_STORAGE_KEY,
        JSON.stringify(this.readings)
      );
    } catch (error) {
      console.error('Error saving heart rate reading:', error);
    }
  }

  // Load heart rate readings from storage
  async loadReadings(): Promise<HeartRateReading[]> {
    try {
      const stored = await AsyncStorage.getItem(HEART_RATE_STORAGE_KEY);
      if (stored) {
        this.readings = JSON.parse(stored).map((reading: any) => ({
          ...reading,
          timestamp: new Date(reading.timestamp)
        }));
      }
      return this.readings;
    } catch (error) {
      console.error('Error loading heart rate readings:', error);
      return [];
    }
  }

  // Get recent readings (last N readings)
  getRecentReadings(count: number = 50): HeartRateReading[] {
    return this.readings.slice(-count);
  }

  // Get readings for a specific time period
  getReadingsInRange(startDate: Date, endDate: Date): HeartRateReading[] {
    return this.readings.filter(reading => 
      reading.timestamp >= startDate && reading.timestamp <= endDate
    );
  }

  // Calculate average heart rate for a time period
  getAverageHeartRate(readings: HeartRateReading[]): number {
    if (readings.length === 0) return 0;
    const sum = readings.reduce((total, reading) => total + reading.bpm, 0);
    return Math.round(sum / readings.length);
  }

  // Get time spent in each zone
  getTimeInZones(readings: HeartRateReading[]): Record<string, number> {
    const zoneTime: Record<string, number> = {
      'Resting': 0,
      'Fat Burn': 0,
      'Cardio': 0,
      'Peak': 0
    };

    readings.forEach(reading => {
      zoneTime[reading.zone.name] += 1; // Each reading represents a time unit
    });

    return zoneTime;
  }

  // Save user profile
  async saveProfile(profile: UserHeartRateProfile): Promise<void> {
    try {
      this.profile = profile;
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving heart rate profile:', error);
    }
  }

  // Load user profile
  async loadProfile(): Promise<UserHeartRateProfile | null> {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        this.profile = JSON.parse(stored);
      }
      return this.profile;
    } catch (error) {
      console.error('Error loading heart rate profile:', error);
      return null;
    }
  }

  // Apple HealthKit integration (placeholder)
  async connectToAppleHealth(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.warn('Apple HealthKit is only available on iOS');
      return false;
    }

    try {
      // TODO: Implement actual HealthKit integration
      // This would require expo-health or react-native-health package
      console.log('Apple HealthKit integration would be implemented here');
      
      // For now, return false to indicate not yet implemented
      return false;
    } catch (error) {
      console.error('Error connecting to Apple HealthKit:', error);
      return false;
    }
  }

  // Google Fit integration (placeholder)
  async connectToGoogleFit(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.warn('Google Fit is only available on Android');
      return false;
    }

    try {
      // TODO: Implement actual Google Fit integration
      // This would require react-native-google-fit package
      console.log('Google Fit integration would be implemented here');
      
      // For now, return false to indicate not yet implemented
      return false;
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
      return false;
    }
  }

  // Simulate heart rate data for demo purposes
  generateSimulatedReading(baseRate: number = 75): HeartRateReading {
    const variation = Math.random() * 20 - 10; // ±10 BPM variation
    const bpm = Math.max(50, Math.min(180, Math.round(baseRate + variation)));
    
    const zones = this.calculateHeartRateZones(30); // Default age 30
    const zone = this.getZoneForBPM(bpm, zones);

    return {
      bpm,
      timestamp: new Date(),
      source: 'simulated',
      zone
    };
  }

  // Start simulated heart rate monitoring
  startSimulatedMonitoring(callback: (reading: HeartRateReading) => void): () => void {
    const interval = setInterval(() => {
      const reading = this.generateSimulatedReading();
      this.saveReading(reading);
      callback(reading);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }

  // Export data for sharing or backup
  async exportData(): Promise<string> {
    try {
      const data = {
        readings: this.readings,
        profile: this.profile,
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting heart rate data:', error);
      return '';
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      this.readings = [];
      this.profile = null;
      await AsyncStorage.removeItem(HEART_RATE_STORAGE_KEY);
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing heart rate data:', error);
    }
  }
}

export default HeartRateService;