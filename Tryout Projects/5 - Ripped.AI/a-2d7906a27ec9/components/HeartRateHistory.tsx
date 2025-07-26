import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../utils/theme.tsx';
import HeartRateService, { HeartRateReading } from '../services/heartRateService';

interface HeartRateHistoryProps {
  visible: boolean;
  onClose: () => void;
}

export default function HeartRateHistory({ visible, onClose }: HeartRateHistoryProps) {
  const { theme } = useTheme();
  const [heartRateData, setHeartRateData] = useState<HeartRateReading[]>([]);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the load function to prevent infinite re-renders
  const loadHeartRateData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading heart rate data for range:', timeRange);
      
      const heartRateService = HeartRateService.getInstance();
      let data: HeartRateReading[] = [];
      
      switch (timeRange) {
        case 'day':
          data = await heartRateService.getTodayReadings();
          break;
        case 'week':
          data = await heartRateService.getWeekReadings();
          break;
        case 'month':
          data = await heartRateService.getMonthReadings();
          break;
      }
      
      setHeartRateData(data);
      console.log('Heart rate data loaded:', data.length, 'readings');
    } catch (error) {
      console.error('Error loading heart rate data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    if (visible) {
      loadHeartRateData();
    }
  }, [visible, timeRange]);

  const renderChart = () => {
    if (heartRateData.length === 0) {
      return (
        <View style={[styles.emptyChart, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="heart-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No heart rate data available for this period
          </Text>
        </View>
      );
    }

    const chartWidth = Dimensions.get('window').width - 40;
    const chartHeight = 200;
    const padding = 20;
    const dataWidth = chartWidth - padding * 2;
    const dataHeight = chartHeight - padding * 2;

    const maxBpm = Math.max(...heartRateData.map(d => d.bpm));
    const minBpm = Math.min(...heartRateData.map(d => d.bpm));
    const bpmRange = maxBpm - minBpm || 1;

    const points = heartRateData.map((reading, index) => {
      const x = padding + (index / (heartRateData.length - 1)) * dataWidth;
      const y = padding + ((maxBpm - reading.bpm) / bpmRange) * dataHeight;
      return { x, y, bpm: reading.bpm, timestamp: reading.timestamp };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <View style={[styles.chartContainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
          Heart Rate Trend
        </Text>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + ratio * dataHeight;
              const bpm = Math.round(maxBpm - ratio * bpmRange);
              return (
                <G key={index}>
                  <Line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke={theme.colors.border}
                    strokeWidth={1}
                    strokeDasharray="5,5"
                  />
                  <SvgText
                    x={padding - 5}
                    y={y + 4}
                    fontSize="12"
                    fill={theme.colors.textSecondary}
                    textAnchor="end"
                  >
                    {bpm}
                  </SvgText>
                </G>
              );
            })}
          </G>

          {/* Heart rate line */}
          <Line
            d={pathData}
            stroke={theme.colors.error}
            strokeWidth={2}
            fill="none"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={theme.colors.error}
              stroke={theme.colors.white}
              strokeWidth={2}
            />
          ))}
        </Svg>
      </View>
    );
  };

  const renderStats = () => {
    if (heartRateData.length === 0) return null;

    const bpms = heartRateData.map(d => d.bpm);
    const avgBpm = Math.round(bpms.reduce((sum, bpm) => sum + bpm, 0) / bpms.length);
    const maxBpm = Math.max(...bpms);
    const minBpm = Math.min(...bpms);
    const restingBpm = Math.min(...bpms.slice(0, Math.min(10, bpms.length))); // Approximate resting HR

    const stats = [
      { label: 'Average', value: avgBpm, unit: 'BPM', color: theme.colors.primary },
      { label: 'Maximum', value: maxBpm, unit: 'BPM', color: theme.colors.error },
      { label: 'Minimum', value: minBpm, unit: 'BPM', color: theme.colors.success },
      { label: 'Resting', value: restingBpm, unit: 'BPM', color: theme.colors.textSecondary },
    ];

    return (
      <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
          Statistics
        </Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statUnit, { color: theme.colors.textSecondary }]}>
                {stat.unit}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTimeInZones = () => {
    if (heartRateData.length === 0) return null;

    // Calculate time in each zone (simplified)
    const zones = [
      { name: 'Resting', range: [0, 100], color: '#4ECDC4' },
      { name: 'Fat Burn', range: [100, 140], color: '#FFE66D' },
      { name: 'Cardio', range: [140, 170], color: '#FF6B6B' },
      { name: 'Peak', range: [170, 220], color: '#A8E6CF' },
    ];

    const zoneData = zones.map(zone => {
      const readingsInZone = heartRateData.filter(reading => 
        reading.bpm >= zone.range[0] && reading.bpm < zone.range[1]
      );
      const percentage = (readingsInZone.length / heartRateData.length) * 100;
      return { ...zone, percentage: Math.round(percentage) };
    });

    return (
      <View style={[styles.zonesContainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.zonesTitle, { color: theme.colors.text }]}>
          Time in Heart Rate Zones
        </Text>
        {zoneData.map((zone, index) => (
          <View key={index} style={styles.zoneRow}>
            <View style={styles.zoneInfo}>
              <View style={[styles.zoneColor, { backgroundColor: zone.color }]} />
              <Text style={[styles.zoneName, { color: theme.colors.text }]}>
                {zone.name}
              </Text>
              <Text style={[styles.zoneRange, { color: theme.colors.textSecondary }]}>
                {zone.range[0]}-{zone.range[1]} BPM
              </Text>
            </View>
            <View style={styles.zoneProgress}>
              <View style={[styles.zoneProgressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.zoneProgressFill, 
                    { 
                      backgroundColor: zone.color,
                      width: `${zone.percentage}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.zonePercentage, { color: theme.colors.text }]}>
                {zone.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const getZoneColor = (zoneName: string): string => {
    switch (zoneName) {
      case 'Resting': return '#4ECDC4';
      case 'Fat Burn': return '#FFE66D';
      case 'Cardio': return '#FF6B6B';
      case 'Peak': return '#A8E6CF';
      default: return theme.colors.textSecondary;
    }
  };

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
          Heart Rate History
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Time Range Selector */}
      <View style={[styles.timeRangeContainer, { backgroundColor: theme.colors.card }]}>
        {(['day', 'week', 'month'] as const).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              {
                backgroundColor: timeRange === range ? theme.colors.primary : 'transparent'
              }
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[
              styles.timeRangeText,
              {
                color: timeRange === range ? theme.colors.white : theme.colors.text
              }
            ]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="heart" size={48} color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading heart rate data...
            </Text>
          </View>
        ) : (
          <>
            {renderChart()}
            {renderStats()}
            {renderTimeInZones()}
          </>
        )}
        
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

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
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    margin: 20,
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyChart: {
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 12,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  zonesContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  zonesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  zoneRange: {
    fontSize: 12,
  },
  zoneProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  zoneProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  zoneProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  zonePercentage: {
    fontSize: 12,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
});