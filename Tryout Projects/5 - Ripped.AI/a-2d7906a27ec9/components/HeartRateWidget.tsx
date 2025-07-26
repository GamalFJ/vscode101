import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme.tsx';
import HeartRateService, { HeartRateReading } from '../services/heartRateService';

interface HeartRateWidgetProps {
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showZone?: boolean;
  showStatus?: boolean;
}

const HeartRateWidget: React.FC<HeartRateWidgetProps> = ({
  onPress,
  size = 'medium',
  showZone = true,
  showStatus = true
}) => {
  const { theme } = useTheme();
  const [heartRateData, setHeartRateData] = useState<HeartRateReading | null>(null);
  const heartIconAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const heartRateService = HeartRateService.getInstance();
    
    // Start monitoring and get initial reading
    const stopMonitoring = heartRateService.startSimulatedMonitoring((reading) => {
      setHeartRateData(reading);
    });

    return stopMonitoring;
  }, []);

  // Heart rate pulse animation
  useEffect(() => {
    if (heartRateData?.bpm) {
      const interval = 60000 / heartRateData.bpm; // Convert BPM to milliseconds
      
      const createPulse = () => {
        Animated.sequence([
          Animated.timing(heartIconAnim, {
            toValue: 1.2,
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
  }, [heartRateData?.bpm, heartIconAnim]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: theme.spacing.sm },
          bpm: { fontSize: 20 },
          icon: 16,
          zone: { fontSize: 10 },
          status: { fontSize: 10 }
        };
      case 'large':
        return {
          container: { padding: theme.spacing.xl },
          bpm: { fontSize: 48 },
          icon: 32,
          zone: { fontSize: 16 },
          status: { fontSize: 14 }
        };
      default: // medium
        return {
          container: { padding: theme.spacing.lg },
          bpm: { fontSize: 32 },
          icon: 24,
          zone: { fontSize: 14 },
          status: { fontSize: 12 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...sizeStyles.container,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    title: {
      fontSize: sizeStyles.zone.fontSize + 2,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heartRateLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bpm: {
      fontSize: sizeStyles.bpm.fontSize,
      fontWeight: '700',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontFamily: theme.fonts.bold,
    },
    bpmLabel: {
      fontSize: sizeStyles.zone.fontSize,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    zoneContainer: {
      alignItems: 'flex-end',
    },
    zoneName: {
      fontSize: sizeStyles.zone.fontSize,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
    zoneDesc: {
      fontSize: sizeStyles.status.fontSize,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: sizeStyles.status.fontSize,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
    },
    noDataContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    noDataText: {
      fontSize: sizeStyles.zone.fontSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      fontFamily: theme.fonts.regular,
    },
  });

  const renderContent = () => {
    if (!heartRateData) {
      return (
        <View style={styles.noDataContainer}>
          <Ionicons name="heart-outline" size={sizeStyles.icon} color={theme.colors.textSecondary} />
          <Text style={styles.noDataText}>No heart rate data</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.content}>
          <View style={styles.heartRateLeft}>
            <Animated.View style={{ transform: [{ scale: heartIconAnim }] }}>
              <Ionicons 
                name="heart" 
                size={sizeStyles.icon} 
                color={heartRateData.zone.color} 
              />
            </Animated.View>
            <Text style={styles.bpm}>{heartRateData.bpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>
          
          {showZone && (
            <View style={styles.zoneContainer}>
              <Text style={[
                styles.zoneName,
                { color: heartRateData.zone.color }
              ]}>
                {heartRateData.zone.name}
              </Text>
              <Text style={styles.zoneDesc}>Zone</Text>
            </View>
          )}
        </View>
        
        {showStatus && (
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot,
              { backgroundColor: heartRateData.isConnected ? '#4CAF50' : '#F44336' }
            ]} />
            <Text style={styles.statusText}>
              {heartRateData.isConnected ? 'Connected' : 'Disconnected'} • {heartRateData.source}
            </Text>
          </View>
        )}
      </>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {size !== 'small' && (
          <View style={styles.header}>
            <Text style={styles.title}>Heart Rate</Text>
            <Ionicons name="expand" size={16} color={theme.colors.primary} />
          </View>
        )}
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {size !== 'small' && (
        <View style={styles.header}>
          <Text style={styles.title}>Heart Rate</Text>
        </View>
      )}
      {renderContent()}
    </View>
  );
};

export default HeartRateWidget;