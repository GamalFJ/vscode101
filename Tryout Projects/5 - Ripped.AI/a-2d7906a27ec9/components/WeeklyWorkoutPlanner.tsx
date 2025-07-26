import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { WorkoutGenerator, WeeklyWorkoutPlan } from '../services/workoutGenerator';
import Button from './Button';

interface WeeklyWorkoutPlannerProps {
  visible: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: WeeklyWorkoutPlan) => void;
}

export default function WeeklyWorkoutPlanner({ 
  visible, 
  onClose, 
  onPlanGenerated 
}: WeeklyWorkoutPlannerProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [workoutDuration, setWorkoutDuration] = useState<number>(45);
  const [isGenerating, setIsGenerating] = useState(false);

  const goals = [
    { id: 'fat_loss', title: 'Fat Loss', icon: 'flash', color: colors.error },
    { id: 'strength', title: 'Strength', icon: 'barbell', color: colors.primary },
    { id: 'muscle_gain', title: 'Muscle Gain', icon: 'fitness', color: colors.accent },
    { id: 'endurance', title: 'Endurance', icon: 'heart', color: colors.success },
    { id: 'athletic_performance', title: 'Athletic', icon: 'trophy', color: colors.warning },
    { id: 'general_fitness', title: 'General', icon: 'star', color: colors.textSecondary }
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'] as const;

  const generatePlan = async () => {
    if (!selectedGoal) {
      Alert.alert('Missing Information', 'Please select a workout goal.');
      return;
    }

    setIsGenerating(true);
    console.log('Generating weekly plan:', { selectedGoal, selectedDifficulty, workoutDuration });

    // Simulate AI generation delay
    setTimeout(() => {
      try {
        const plan = WorkoutGenerator.generateWeeklyPlan(
          selectedGoal,
          selectedDifficulty,
          workoutDuration
        );

        onPlanGenerated(plan);
        setIsGenerating(false);
        onClose();
      } catch (error) {
        console.error('Error generating weekly plan:', error);
        Alert.alert('Error', 'Failed to generate weekly plan. Please try again.');
        setIsGenerating(false);
      }
    }, 2000);
  };

  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <View style={{
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxHeight: '80%',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 0 }]}>
            Weekly Plan Generator
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Goal Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Select Your Goal</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={{
                    backgroundColor: selectedGoal === goal.id ? goal.color : colors.backgroundAlt,
                    borderWidth: 1,
                    borderColor: selectedGoal === goal.id ? goal.color : colors.border,
                    borderRadius: 8,
                    padding: 12,
                    width: '48%',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                  onPress={() => setSelectedGoal(goal.id)}
                >
                  <Ionicons 
                    name={goal.icon as any} 
                    size={20} 
                    color={selectedGoal === goal.id ? 'white' : goal.color}
                    style={{ marginBottom: 4 }}
                  />
                  <Text style={{
                    color: selectedGoal === goal.id ? 'white' : colors.text,
                    fontWeight: '600',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                    {goal.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Difficulty Level</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {difficulties.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={{
                    backgroundColor: selectedDifficulty === level ? colors.primary : colors.backgroundAlt,
                    borderWidth: 1,
                    borderColor: selectedDifficulty === level ? colors.primary : colors.border,
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    flex: 1,
                    alignItems: 'center',
                  }}
                  onPress={() => setSelectedDifficulty(level)}
                >
                  <Text style={{
                    color: selectedDifficulty === level ? 'white' : colors.text,
                    fontWeight: '600',
                    fontSize: 12,
                  }}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Workout Duration</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.backgroundAlt,
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => setWorkoutDuration(Math.max(15, workoutDuration - 15))}
              >
                <Ionicons name="remove" size={20} color={colors.primary} />
              </TouchableOpacity>
              
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '600' }]}>
                  {workoutDuration}
                </Text>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  minutes per workout
                </Text>
              </View>
              
              <TouchableOpacity
                style={{
                  backgroundColor: colors.backgroundAlt,
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => setWorkoutDuration(Math.min(120, workoutDuration + 15))}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Generate Button */}
          <Button
            text={isGenerating ? 'Generating Plan...' : 'Generate Weekly Plan'}
            onPress={generatePlan}
            disabled={!selectedGoal || isGenerating}
            style={{
              backgroundColor: (!selectedGoal || isGenerating) ? colors.textSecondary : colors.primary,
              opacity: (!selectedGoal || isGenerating) ? 0.7 : 1,
            }}
          />

          {selectedGoal && (
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 12, fontSize: 12 }]}>
              AI will create a complete 7-day plan with targeted workouts and rest days
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}