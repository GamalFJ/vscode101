import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme.tsx';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Heart Rate Monitor Component for Ripped.AI
 * 
 * A comprehensive heart rate monitoring interface that displays:
 * - Real-time BPM with animated pulse effect
 * - Heart rate zones with color-coded indicators
 * - Connection status and data source
 * - Zone chart with current zone highlighting
 * - Integration options for Apple HealthKit and Google Fit
 * 
 * Features:
 * - Smooth pulse animation synchronized with heart rate
 * - Age-based heart rate zone calculation
 * - Responsive design for different screen sizes
 * - Accessibility-friendly with proper color contrast
 * - Prepared for real health data integration
 * 
 * The component currently uses simulated data but is structured to easily
 * integrate with actual health monitoring APIs in future updates.
 */

interface HeartRateData {
  bpm: number;
  timestamp: Date;
  zone: HeartRateZone;
  isConnected: boolean;
  source?: 'apple_health' | 'google_fit' | 'manual' | 'simulated';
}

interface HeartRateZone {
  name: 'Resting' | 'Fat Burn' | 'Cardio' | 'Peak';
  color: string;
  range: { min: number; max: number };
  description: string;
}

interface HeartRateMonitorProps {
  visible: boolean;
  onClose: () => void;
  userAge?: number; // For calculating max heart rate zones
}

const { width: screenWidth } = Dimensions.get('window');

// Heart rate zones based on age (220 - age formula)
const getHeartRateZones = (age: number = 30): HeartRateZone[] => {
  const maxHR = 220 - age;
  
  return [
    {
      name: 'Resting',
      color: '#4CAF50', // Green
      range: { min: 50, max: Math.round(maxHR * 0.6) },
      description: 'Recovery and warm-up zone'
    },
    {
      name: 'Fat Burn',
      color: '#FF9800', // Orange
      range: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
      description: 'Optimal fat burning zone'
    },
    {
      name: 'Cardio',
      color: '#F44336', // Red
      range: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.85) },
      description: 'Cardiovascular fitness zone'
    },
    {
      name: 'Peak',
      color: '#9C27B0', // Purple
      range: { min: Math.round(maxHR * 0.85), max: maxHR },
      description: 'Maximum effort zone'
    }
  ];
};

const getCurrentZone = (bpm: number, zones: HeartRateZone[]): HeartRateZone => {
  for (const zone of zones) {
    if (bpm >= zone.range.min && bpm <= zone.range.max) {
      return zone;
    }
  }
  // Default to resting if below all zones, peak if above all zones
  return bpm < zones[0].range.min ? zones[0] : zones[zones.length - 1];
};

// Simulated heart rate data for demo purposes
const generateSimulatedHeartRate = (): number => {
  // Simulate realistic heart rate fluctuations
  const baseRate = 75;
  const variation = Math.random() * 20 - 10; // ±10 BPM variation
  return Math.max(50, Math.min(180, Math.round(baseRate + variation)));
};

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  visible,
  onClose,
  userAge = 30
}) => {
  const { theme } = useTheme();
  const [heartRateData, setHeartRateData] = useState<HeartRateData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateData[]>([]);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const heartIconAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const zones = getHeartRateZones(userAge);

  // Pulse animation effect
  useEffect(() => {
    if (heartRateData?.bpm) {
      const interval = 60000 / heartRateData.bpm; // Convert BPM to milliseconds
      
      const createPulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();

        // Heart icon pulse
        Animated.sequence([
          Animated.timing(heartIconAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(heartIconAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      };

      const pulseInterval = setInterval(createPulse, interval);
      return () => clearInterval(pulseInterval);
    }
  }, [heartRateData?.bpm, pulseAnim, heartIconAnim]);

  // Fade in animation when modal opens
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  // Simulate heart rate data (replace with actual HealthKit/Google Fit integration)
  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        const bpm = generateSimulatedHeartRate();
        const currentZone = getCurrentZone(bpm, zones);
        
        const newData: HeartRateData = {
          bpm,
          timestamp: new Date(),
          zone: currentZone,
          isConnected: true,
          source: 'simulated'
        };
        
        setHeartRateData(newData);
        
        // Add to history (keep last 50 readings)
        setHeartRateHistory(prev => {
          const updated = [...prev, newData];
          return updated.slice(-50);
        });
      }, 2000); // Update every 2 seconds

      return () => clearInterval(interval);
    }
  }, [visible, zones]);

  const connectToHealthKit = async () => {
    setIsConnecting(true);
    
    // TODO: Implement actual HealthKit integration
    // For now, simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      console.log('HealthKit integration would be implemented here');
      // Alert.alert('HealthKit', 'HealthKit integration will be implemented in future updates');
    }, 2000);
  };

  const connectToGoogleFit = async () => {
    setIsConnecting(true);
    
    // TODO: Implement actual Google Fit integration
    // For now, simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      console.log('Google Fit integration would be implemented here');
      // Alert.alert('Google Fit', 'Google Fit integration will be implemented in future updates');
    }, 2000);
  };

  const renderHeartRateDisplay = () => {
    if (!heartRateData) {
      return (
        <View style={styles.noDataContainer}>
          <Ionicons name="heart-outline" size={64} color={theme.colors.grey} />
          <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>
            No heart rate data available
          </Text>
          <Text style={[styles.noDataSubtext, { color: theme.colors.grey }]}>
            Connect to Apple HealthKit or Google Fit to start monitoring
          </Text>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.heartRateContainer, { opacity: fadeAnim }]}>
        {/* Main BPM Display */}
        <View style={styles.bpmContainer}>
          <Animated.View style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              borderColor: heartRateData.zone.color,
            }
          ]} />
          
          <Animated.View style={[
            styles.heartIconContainer,
            { transform: [{ scale: heartIconAnim }] }
          ]}>
            <Ionicons 
              name="heart" 
              size={32} 
              color={heartRateData.zone.color} 
            />
          </Animated.View>
          
          <Text style={[styles.bpmValue, { color: theme.colors.text }]}>
            {heartRateData.bpm}
          </Text>
          <Text style={[styles.bpmLabel, { color: theme.colors.textSecondary }]}>
            BPM
          </Text>
        </View>

        {/* Zone Indicator */}
        <View style={[
          styles.zoneContainer,
          { backgroundColor: heartRateData.zone.color + '20' }
        ]}>
          <View style={[
            styles.zoneIndicator,
            { backgroundColor: heartRateData.zone.color }
          ]} />
          <Text style={[styles.zoneName, { color: heartRateData.zone.color }]}>
            {heartRateData.zone.name} Zone
          </Text>
          <Text style={[styles.zoneDescription, { color: theme.colors.textSecondary }]}>
            {heartRateData.zone.description}
          </Text>
          <Text style={[styles.zoneRange, { color: theme.colors.grey }]}>
            {heartRateData.zone.range.min} - {heartRateData.zone.range.max} BPM
          </Text>
        </View>

        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: heartRateData.isConnected ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            {heartRateData.isConnected ? 'Connected' : 'Disconnected'} • {heartRateData.source}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderZoneChart = () => (
    <View style={styles.zoneChartContainer}>
      <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
        Heart Rate Zones
      </Text>
      {zones.map((zone, index) => (
        <View key={zone.name} style={styles.zoneRow}>
          <View style={[styles.zoneColorBox, { backgroundColor: zone.color }]} />
          <View style={styles.zoneInfo}>
            <Text style={[styles.zoneRowName, { color: theme.colors.text }]}>
              {zone.name}
            </Text>
            <Text style={[styles.zoneRowRange, { color: theme.colors.textSecondary }]}>
              {zone.range.min} - {zone.range.max} BPM
            </Text>
          </View>
          <View style={[
            styles.currentZoneIndicator,
            { 
              opacity: heartRateData?.zone.name === zone.name ? 1 : 0,
              backgroundColor: zone.color 
            }
          ]} />
        </View>
      ))}
    </View>
  );

  const renderConnectionOptions = () => (
    <View style={styles.connectionContainer}>
      <Text style={[styles.connectionTitle, { color: theme.colors.text }]}>
        Connect Health Data
      </Text>
      
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.connectionButton, { borderColor: theme.colors.border }]}
          onPress={connectToHealthKit}
          disabled={isConnecting}
        >
          <Ionicons name="fitness" size={24} color={theme.colors.primary} />
          <View style={styles.connectionButtonText}>
            <Text style={[styles.connectionButtonTitle, { color: theme.colors.text }]}>
              Apple HealthKit
            </Text>
            <Text style={[styles.connectionButtonSubtitle, { color: theme.colors.textSecondary }]}>
              Access heart rate data from Apple Health
            </Text>
          </View>
          <Ionicons 
            name={isConnecting ? "hourglass" : "chevron-forward"} 
            size={20} 
            color={theme.colors.grey} 
          />
        </TouchableOpacity>
      )}

      {Platform.OS === 'android' && (
        <TouchableOpacity
          style={[styles.connectionButton, { borderColor: theme.colors.border }]}
          onPress={connectToGoogleFit}
          disabled={isConnecting}
        >
          <Ionicons name="fitness" size={24} color={theme.colors.primary} />
          <View style={styles.connectionButtonText}>
            <Text style={[styles.connectionButtonTitle, { color: theme.colors.text }]}>
              Google Fit
            </Text>
            <Text style={[styles.connectionButtonSubtitle, { color: theme.colors.textSecondary }]}>
              Access heart rate data from Google Fit
            </Text>
          </View>
          <Ionicons 
            name={isConnecting ? "hourglass" : "chevron-forward"} 
            size={20} 
            color={theme.colors.grey} 
          />
        </TouchableOpacity>
      )}

      <View style={styles.integrationNote}>
        <Ionicons name="information-circle" size={16} color={theme.colors.warning} />
        <Text style={[styles.integrationNoteText, { color: theme.colors.textSecondary }]}>
          Health data integration will be available in future updates. Currently showing simulated data for demonstration.
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Heart Rate Monitor
          </Text>
          <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
            <Ionicons 
              name={showHistory ? "stats-chart" : "list"} 
              size={24} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderHeartRateDisplay()}
          {renderZoneChart()}
          {renderConnectionOptions()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heartRateContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  bpmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 32,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    opacity: 0.3,
  },
  heartIconContainer: {
    position: 'absolute',
    top: -60,
  },
  bpmValue: {
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },
  bpmLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  zoneContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  zoneIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  zoneRange: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  zoneChartContainer: {
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  zoneColorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneRowName: {
    fontSize: 16,
    fontWeight: '600',
  },
  zoneRowRange: {
    fontSize: 12,
    marginTop: 2,
  },
  currentZoneIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionContainer: {
    marginBottom: 32,
  },
  connectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  connectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  connectionButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  connectionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectionButtonSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  integrationNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  integrationNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 8,
  },
});

export default HeartRateMonitor;