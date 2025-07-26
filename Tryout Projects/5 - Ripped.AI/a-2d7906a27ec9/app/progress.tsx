import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { commonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface ProgressData {
  date: string;
  workoutName: string;
  duration: number;
  exercises: number;
  calories: number;
}

interface Stats {
  totalWorkouts: number;
  totalTime: number;
  averageWorkout: number;
  currentStreak: number;
  longestStreak: number;
  totalCalories: number;
}

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  
  const stats: Stats = {
    totalWorkouts: 24,
    totalTime: 1080, // minutes
    averageWorkout: 45,
    currentStreak: 7,
    longestStreak: 12,
    totalCalories: 3600
  };

  const recentWorkouts: ProgressData[] = [
    { date: '2024-01-15', workoutName: 'Upper Body Power', duration: 45, exercises: 5, calories: 220 },
    { date: '2024-01-13', workoutName: 'HIIT Cardio', duration: 25, exercises: 6, calories: 180 },
    { date: '2024-01-11', workoutName: 'Lower Body Blast', duration: 50, exercises: 5, calories: 240 },
    { date: '2024-01-09', workoutName: 'Full Body Strength', duration: 40, exercises: 8, calories: 200 },
    { date: '2024-01-07', workoutName: 'Morning Stretch', duration: 15, exercises: 5, calories: 60 },
  ];

  const weeklyProgress = [
    { day: 'Mon', completed: true, duration: 45 },
    { day: 'Tue', completed: false, duration: 0 },
    { day: 'Wed', completed: true, duration: 30 },
    { day: 'Thu', completed: true, duration: 50 },
    { day: 'Fri', completed: false, duration: 0 },
    { day: 'Sat', completed: true, duration: 25 },
    { day: 'Sun', completed: false, duration: 0 },
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center', marginBottom: 0 }]}>
          Progress
        </Text>
        <TouchableOpacity onPress={() => console.log('Share progress')}>
          <Ionicons name="share" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Time Period Selector */}
        <View style={[commonStyles.section, { marginBottom: 8 }]}>
          <View style={{ flexDirection: 'row', backgroundColor: colors.backgroundAlt, borderRadius: 8, padding: 4 }}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={{
                  flex: 1,
                  backgroundColor: selectedPeriod === period ? colors.primary : 'transparent',
                  paddingVertical: 8,
                  borderRadius: 6,
                  alignItems: 'center',
                }}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={{
                  color: selectedPeriod === period ? 'white' : colors.text,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Overview */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Overview</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={[commonStyles.card, { flex: 1, minWidth: '45%' }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                TOTAL WORKOUTS
              </Text>
              <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
                {stats.totalWorkouts}
              </Text>
            </View>
            
            <View style={[commonStyles.card, { flex: 1, minWidth: '45%' }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                TOTAL TIME
              </Text>
              <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
                {formatDuration(stats.totalTime)}
              </Text>
            </View>
            
            <View style={[commonStyles.card, { flex: 1, minWidth: '45%' }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                AVG WORKOUT
              </Text>
              <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
                {stats.averageWorkout}min
              </Text>
            </View>
            
            <View style={[commonStyles.card, { flex: 1, minWidth: '45%' }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                CALORIES BURNED
              </Text>
              <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
                {stats.totalCalories.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>This Week</Text>
          <View style={commonStyles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 8 }]}>
                    {day.day}
                  </Text>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: day.completed ? colors.success : colors.backgroundAlt,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                    {day.completed ? (
                      <Ionicons name="checkmark" size={16} color="white" />
                    ) : (
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.border,
                      }} />
                    )}
                  </View>
                  <Text style={[commonStyles.textSecondary, { fontSize: 10 }]}>
                    {day.duration > 0 ? `${day.duration}m` : '-'}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  CURRENT STREAK
                </Text>
                <Text style={[commonStyles.text, { fontWeight: '600', color: colors.success }]}>
                  {stats.currentStreak} days
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  LONGEST STREAK
                </Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {stats.longestStreak} days
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Workouts */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Recent Workouts</Text>
          {recentWorkouts.map((workout, index) => (
            <View key={index} style={commonStyles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 8,
                  marginRight: 12,
                }}>
                  <Ionicons name="barbell" size={16} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 2 }]}>
                    {workout.workoutName}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    {formatDate(workout.date)}
                  </Text>
                </View>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {workout.duration}min
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="fitness" size={12} color={colors.textSecondary} />
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginLeft: 4 }]}>
                    {workout.exercises} exercises
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="flame" size={12} color={colors.warning} />
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginLeft: 4 }]}>
                    {workout.calories} cal
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Achievements</Text>
          <View style={commonStyles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                backgroundColor: colors.warning,
                borderRadius: 20,
                padding: 8,
                marginRight: 12,
              }}>
                <Ionicons name="trophy" size={20} color="white" />
              </View>
              <View>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Week Warrior
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Complete 5 workouts in a week
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                backgroundColor: colors.success,
                borderRadius: 20,
                padding: 8,
                marginRight: 12,
              }}>
                <Ionicons name="flame" size={20} color="white" />
              </View>
              <View>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  Streak Master
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  Maintain a 7-day workout streak
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}