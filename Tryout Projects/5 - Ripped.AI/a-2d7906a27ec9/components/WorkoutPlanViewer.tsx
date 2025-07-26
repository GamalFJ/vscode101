import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { WeeklyWorkoutPlan, DayWorkout } from '../services/workoutGenerator';
import Button from './Button';
import { router } from 'expo-router';

interface WorkoutPlanViewerProps {
  plan: WeeklyWorkoutPlan;
  onClose: () => void;
  onSave?: () => void;
}

export default function WorkoutPlanViewer({ plan, onClose, onSave }: WorkoutPlanViewerProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const getDayName = (dayNumber: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber - 1] || `Day ${dayNumber}`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.error;
      default: return colors.primary;
    }
  };

  const handleStartWorkout = (dayWorkout: DayWorkout) => {
    if (dayWorkout.isRestDay) {
      Alert.alert(
        'Rest Day',
        'This is a rest day. Consider doing some light activity or active recovery.',
        [
          { text: 'OK' },
          { text: 'View Recovery Options', onPress: () => showRecoveryOptions(dayWorkout) }
        ]
      );
      return;
    }

    Alert.alert(
      'Start Workout',
      `Ready to start "${dayWorkout.name}"?`,
      [
        { text: 'Cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // Navigate to active workout with the day's exercises
            router.push({
              pathname: '/workout/active',
              params: {
                workoutName: dayWorkout.name,
                exercises: JSON.stringify(dayWorkout.exercises)
              }
            });
          }
        }
      ]
    );
  };

  const showRecoveryOptions = (dayWorkout: DayWorkout) => {
    if (dayWorkout.activeRecovery) {
      Alert.alert(
        'Active Recovery Options',
        dayWorkout.activeRecovery.join('\n• '),
        [{ text: 'OK' }]
      );
    }
  };

  const renderDayCard = (dayWorkout: DayWorkout) => (
    <TouchableOpacity
      key={dayWorkout.day}
      style={[
        commonStyles.card,
        {
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: dayWorkout.isRestDay ? colors.success : colors.primary,
        }
      ]}
      onPress={() => setSelectedDay(selectedDay === dayWorkout.day ? null : dayWorkout.day)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
            {getDayName(dayWorkout.day)}
          </Text>
          <Text style={[commonStyles.text, { fontSize: 16, fontWeight: '700' }]}>
            {dayWorkout.name}
          </Text>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          {dayWorkout.isRestDay ? (
            <View style={{ 
              backgroundColor: colors.success, 
              paddingHorizontal: 8, 
              paddingVertical: 4, 
              borderRadius: 12 
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>REST</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {dayWorkout.duration} min
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {dayWorkout.exercises.length} exercises
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
        Focus: {dayWorkout.focus}
      </Text>

      {selectedDay === dayWorkout.day && (
        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
          {dayWorkout.isRestDay ? (
            <View>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 8 }]}>
                Take a well-deserved rest! Your body needs time to recover and grow stronger.
              </Text>
              {dayWorkout.activeRecovery && (
                <View>
                  <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 14, marginBottom: 8 }]}>
                    Active Recovery Options:
                  </Text>
                  {dayWorkout.activeRecovery.map((option, index) => (
                    <Text key={index} style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                      • {option}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 14, marginBottom: 8 }]}>
                Exercises:
              </Text>
              {dayWorkout.exercises.slice(0, 3).map((exercise, index) => (
                <Text key={index} style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                  • {exercise.name} - {exercise.sets} sets × {exercise.reps}
                </Text>
              ))}
              {dayWorkout.exercises.length > 3 && (
                <Text style={[commonStyles.textSecondary, { fontSize: 12, fontStyle: 'italic' }]}>
                  ... and {dayWorkout.exercises.length - 3} more exercises
                </Text>
              )}
              
              <Button
                text={dayWorkout.isRestDay ? 'View Recovery' : 'Start Workout'}
                onPress={() => handleStartWorkout(dayWorkout)}
                style={{ marginTop: 12 }}
                size="small"
              />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.header, { marginBottom: 16 }]}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 18, textAlign: 'center', marginBottom: 0 }]}>
          Weekly Plan
        </Text>
        <TouchableOpacity onPress={onSave}>
          <Ionicons name="bookmark" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Plan Overview */}
        <View style={[commonStyles.card, { marginBottom: 16 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18, flex: 1 }]}>
              {plan.goal.replace('_', ' ').toUpperCase()} PLAN
            </Text>
            <View style={{
              backgroundColor: getDifficultyColor(plan.difficulty),
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                {plan.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            {plan.description}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>WORKOUT DAYS</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                {plan.workouts.filter(w => !w.isRestDay).length}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>TOTAL TIME</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                {Math.round(plan.totalDuration / 60)}h {plan.totalDuration % 60}m
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>REST DAYS</Text>
              <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
                {plan.restDays.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Schedule */}
        <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Weekly Schedule</Text>
        {plan.workouts.map(renderDayCard)}

        {/* Tips Section */}
        {plan.tips && plan.tips.length > 0 && (
          <View style={[commonStyles.card, { marginTop: 16 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>💡 Tips for Success</Text>
            {plan.tips.map((tip, index) => (
              <Text key={index} style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 8 }]}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}