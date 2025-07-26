import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors } from '../../styles/commonStyles';
import ExerciseGuide from '../../components/ExerciseGuide';
import Button from '../../components/Button';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  muscle: string;
  instructions?: string;
}

interface Workout {
  id: string;
  name: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Strength' | 'Cardio' | 'Flexibility' | 'HIIT';
  exercises: Exercise[];
  description: string;
}

export default function WorkoutDetailsScreen() {
  const { workoutId } = useLocalSearchParams();
  
  // Sample workout data - in real app, this would come from storage/API
  const workout: Workout = {
    id: '1',
    name: 'Upper Body Power',
    duration: 45,
    difficulty: 'Intermediate',
    type: 'Strength',
    description: 'Build strength in chest, shoulders, and arms with compound movements',
    exercises: [
      { 
        name: 'Bench Press', 
        sets: 4, 
        reps: '8-10', 
        restTime: 90, 
        muscle: 'Chest',
        instructions: 'Lower bar to chest, press up explosively. Keep feet planted and maintain natural arch.'
      },
      { 
        name: 'Overhead Press', 
        sets: 3, 
        reps: '10-12', 
        restTime: 60, 
        muscle: 'Shoulders',
        instructions: 'Press straight up, engage core. Keep the movement strict and controlled.'
      },
      { 
        name: 'Pull-ups', 
        sets: 3, 
        reps: '6-10', 
        restTime: 90, 
        muscle: 'Back',
        instructions: 'Pull until chin clears bar. Lower with control, no swinging.'
      },
      { 
        name: 'Dips', 
        sets: 3, 
        reps: '8-12', 
        restTime: 60, 
        muscle: 'Triceps',
        instructions: 'Lower until 90 degrees, push up explosively. Keep body upright.'
      },
      { 
        name: 'Barbell Rows', 
        sets: 3, 
        reps: '10-12', 
        restTime: 60, 
        muscle: 'Back',
        instructions: 'Pull to lower chest, squeeze shoulder blades. Keep core tight.'
      },
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.warning;
      case 'Advanced': return colors.error;
      default: return colors.primary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Strength': return 'barbell';
      case 'Cardio': return 'heart';
      case 'HIIT': return 'flash';
      case 'Flexibility': return 'body';
      default: return 'fitness';
    }
  };

  const handleStartWorkout = () => {
    console.log('Starting workout:', workout.name);
    router.push(`/workout/active?workoutId=${workout.id}`);
  };

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const muscleGroups = [...new Set(workout.exercises.map(ex => ex.muscle))];

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
          Workout Details
        </Text>
        <TouchableOpacity onPress={() => console.log('Share workout')}>
          <Ionicons name="share" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Workout Header */}
        <View style={[commonStyles.card, { margin: 20, backgroundColor: colors.backgroundAlt }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              marginRight: 16,
            }}>
              <Ionicons 
                name={getTypeIcon(workout.type) as any} 
                size={32} 
                color={colors.white} 
              />
            </View>
            
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[commonStyles.title, { fontSize: 24, flex: 1, marginBottom: 0 }]}>
                  {workout.name}
                </Text>
                <View style={{
                  backgroundColor: getDifficultyColor(workout.difficulty),
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 16,
                }}>
                  <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>
                    {workout.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <Text style={[commonStyles.text, { marginBottom: 16 }]}>
                {workout.description}
              </Text>
            </View>
          </View>

          {/* Workout Stats */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around',
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingVertical: 16,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
                DURATION
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {workout.duration} min
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="fitness" size={20} color={colors.primary} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
                EXERCISES
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {workout.exercises.length}
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="layers" size={20} color={colors.primary} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
                TOTAL SETS
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {totalSets}
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="body" size={20} color={colors.primary} />
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
                MUSCLES
              </Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                {muscleGroups.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Muscle Groups */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Target Muscle Groups
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {muscleGroups.map((muscle, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600' }}>
                  {muscle}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Exercise List with Visual Guides */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Exercise Guide & Instructions
          </Text>
          
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginBottom: 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                    {exercise.name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>SETS</Text>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>{exercise.sets}</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>REPS</Text>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>{exercise.reps}</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>REST</Text>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>{exercise.restTime}s</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>MUSCLE</Text>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>{exercise.muscle}</Text>
                  </View>
                </View>
              </View>

              {/* Exercise Guide Component */}
              <ExerciseGuide
                exerciseName={exercise.name}
                muscle={exercise.muscle}
                instructions={exercise.instructions}
                difficulty={workout.difficulty}
              />
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={[commonStyles.section, { marginBottom: 32 }]}>
          <Button
            text="Start This Workout"
            onPress={handleStartWorkout}
            style={{ 
              backgroundColor: colors.primary, 
              marginBottom: 12,
              paddingVertical: 16,
            }}
            textStyle={{ fontSize: 18, fontWeight: '700' }}
          />
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.backgroundAlt,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => console.log('Add to favorites')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="heart-outline" size={20} color={colors.primary} />
                <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
                  Favorite
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.backgroundAlt,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => router.push('/workout/create')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="copy-outline" size={20} color={colors.primary} />
                <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
                  Duplicate
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}