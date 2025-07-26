import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useTheme } from '../utils/theme.tsx';
import HealthDataService, { ActivitySummary, HeartRateData } from '../services/healthDataService';

interface HealthDashboardTileProps {
  onPress?: () => void;
  compact?: boolean;
}

interface HealthMetric {
  key: string;
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  progress?: number;
  goal?: number;
  trend?: 'up' | 'down' | 'stable';
}

export default function HealthDashboardTile({ onPress, compact = false }: HealthDashboardTileProps) {
  const { theme } = useTheme();
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [currentHeartRate, setCurrentHeartRate] = useState<HeartRateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);

  // Animated values
  const heartPulseValue = useSharedValue(1);

  // Heart pulse animation
  const heartPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartPulseValue.value }],
  }));

  // Memoize the load function to prevent infinite re-renders
  const loadHealthData = useCallback(async () => {
    try {
      console.log('Loading health data for dashboard tile...');
      const healthService = HealthDataService.getInstance();
      await healthService.initialize();
      
      const permissions = await healthService.getPermissions();
      setHasPermissions(permissions.granted);
      
      if (permissions.granted) {
        const [summary, heartRate] = await Promise.all([
          healthService.getTodayActivitySummary(),
          healthService.getCurrentHeartRate()
        ]);
        
        setActivitySummary(summary);
        setCurrentHeartRate(heartRate);
        console.log('Health data loaded for dashboard:', { summary, heartRate });
      }
    } catch (error) {
      console.error('Error loading health data for dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealthData();
  }, []);

  // Start heart pulse animation when heart rate is available
  useEffect(() => {
    if (currentHeartRate?.bpm) {
      const bpm = currentHeartRate.bpm;
      const interval = 60000 / bpm; // Convert BPM to milliseconds
      
      heartPulseValue.value = withRepeat(
        withTiming(1.2, { duration: interval / 2 }),
        -1,
        true
      );
    } else {
      heartPulseValue.value = withSpring(1);
    }
  }, [currentHeartRate?.bpm, heartPulseValue]);

  const getHealthMetrics = (): HealthMetric[] => {
    const metrics: HealthMetric[] = [];

    // Safely check heart rate data with comprehensive null checks
    if (currentHeartRate && typeof currentHeartRate === 'object' && typeof currentHeartRate?.bpm === 'number' && currentHeartRate.bpm > 0) {
      metrics.push({
        key: 'heart_rate',
        title: 'Heart Rate',
        value: currentHeartRate.bpm,
        unit: 'BPM',
        icon: 'heart',
        color: theme?.colors?.error || '#F44336',
        trend: 'stable'
      });
    }

    // Safely check activity summary with comprehensive null checks
    if (activitySummary && typeof activitySummary === 'object') {
      const steps = typeof activitySummary?.steps === 'number' ? activitySummary.steps : 0;
      const caloriesBurned = typeof activitySummary?.caloriesBurned === 'number' ? activitySummary.caloriesBurned : 0;
      const activeMinutes = typeof activitySummary?.activeMinutes === 'number' ? activitySummary.activeMinutes : 0;
      
      // Use safe fallbacks for goals that might not exist
      const stepsGoal = 10000; // Default step goal
      const caloriesGoal = 2000; // Default calorie goal

      metrics.push(
        {
          key: 'steps',
          title: 'Steps',
          value: steps.toLocaleString(),
          unit: '',
          icon: 'walk',
          color: theme?.colors?.primary || '#B8860B',
          progress: stepsGoal ? (steps / stepsGoal) * 100 : undefined,
          goal: stepsGoal,
          trend: 'up'
        },
        {
          key: 'calories',
          title: 'Calories',
          value: Math.round(caloriesBurned),
          unit: 'cal',
          icon: 'flame',
          color: theme?.colors?.warning || '#FF9800',
          progress: caloriesGoal ? (caloriesBurned / caloriesGoal) * 100 : undefined,
          goal: caloriesGoal,
          trend: 'up'
        },
        {
          key: 'active_minutes',
          title: 'Active',
          value: activeMinutes,
          unit: 'min',
          icon: 'time',
          color: theme?.colors?.success || '#4CAF50',
          trend: 'stable'
        }
      );
    }

    return metrics;
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return theme.colors.success;
      case 'down': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const renderCompactView = () => {
    const metrics = getHealthMetrics();
    const primaryMetric = metrics[0];

    if (!primaryMetric) {
      return (
        <View style={[styles.compactContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="fitness" size={24} color={theme.colors.primary} />
          <Text style={[styles.compactText, { color: theme.colors.textSecondary }]}>
            Connect Health Data
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: theme.colors.card }]}
        onPress={onPress}
      >
        <Animated.View style={primaryMetric.key === 'heart_rate' ? heartPulseStyle : undefined}>
          <Ionicons name={primaryMetric.icon as any} size={24} color={primaryMetric.color} />
        </Animated.View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactValue, { color: theme.colors.text }]}>
            {primaryMetric.value} {primaryMetric.unit}
          </Text>
          <Text style={[styles.compactTitle, { color: theme.colors.textSecondary }]}>
            {primaryMetric.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  const renderFullView = () => {
    if (isLoading) {
      return (
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={[styles.container, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.header}>
            <Ionicons name="fitness" size={24} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Health Dashboard
            </Text>
          </View>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading health data...
            </Text>
          </View>
        </Animated.View>
      );
    }

    if (!hasPermissions) {
      return (
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={[styles.container, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.header}>
            <Ionicons name="fitness" size={24} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Health Dashboard
            </Text>
          </View>
          <TouchableOpacity style={styles.permissionPrompt} onPress={onPress}>
            <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
            <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
              Connect Health Data
            </Text>
            <Text style={[styles.permissionDescription, { color: theme.colors.textSecondary }]}>
              Track your fitness progress with personalized health insights
            </Text>
            <View style={[styles.connectButton, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.connectButtonText, { color: theme.colors.white }]}>
                Get Started
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    const metrics = getHealthMetrics();

    return (
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={[styles.container, { backgroundColor: theme.colors.card }]}
      >
        <TouchableOpacity style={styles.header} onPress={onPress}>
          <View style={styles.headerLeft}>
            <Ionicons name="fitness" size={24} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Health Dashboard
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsContainer}
        >
          {metrics.map((metric, index) => (
            <View key={metric.key} style={[styles.metricCard, { backgroundColor: theme.colors.backgroundAlt }]}>
              <View style={styles.metricHeader}>
                <Animated.View style={metric.key === 'heart_rate' ? heartPulseStyle : undefined}>
                  <Ionicons name={metric.icon as any} size={20} color={metric.color} />
                </Animated.View>
                {metric.trend && (
                  <Ionicons 
                    name={getTrendIcon(metric.trend) as any} 
                    size={14} 
                    color={getTrendColor(metric.trend)} 
                  />
                )}
              </View>
              
              <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                {metric.value}
                <Text style={[styles.metricUnit, { color: theme.colors.textSecondary }]}>
                  {metric.unit ? ` ${metric.unit}` : ''}
                </Text>
              </Text>
              
              <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>
                {metric.title}
              </Text>

              {metric.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          backgroundColor: metric.color,
                          width: `${Math.min(metric.progress, 100)}%`
                        }
                      ]} 
                    />
                  </View>
                  {metric.goal && (
                    <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                      Goal: {metric.goal.toLocaleString()}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {metrics.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="analytics" size={32} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No health data available yet
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  if (compact) {
    return renderCompactView();
  }

  return renderFullView();
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
  },
  compactValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  compactTitle: {
    fontSize: 12,
  },
  compactText: {
    fontSize: 14,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
  },
  permissionPrompt: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricsContainer: {
    paddingRight: 16,
  },
  metricCard: {
    width: 120,
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  metricTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
});