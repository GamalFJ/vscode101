import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import { commonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  muscle: string;
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

export default function WorkoutsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Strength', 'Cardio', 'HIIT', 'Flexibility'];
  
  const workouts: Workout[] = [
    {
      id: '1',
      name: 'Upper Body Power',
      duration: 45,
      difficulty: 'Intermediate',
      type: 'Strength',
      description: 'Build strength in chest, shoulders, and arms with compound movements',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', restTime: 90, muscle: 'Chest' },
        { name: 'Overhead Press', sets: 3, reps: '10-12', restTime: 60, muscle: 'Shoulders' },
        { name: 'Pull-ups', sets: 3, reps: '6-10', restTime: 90, muscle: 'Back' },
        { name: 'Dips', sets: 3, reps: '8-12', restTime: 60, muscle: 'Triceps' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', restTime: 60, muscle: 'Back' },
      ]
    },
    {
      id: '2',
      name: 'Lower Body Blast',
      duration: 50,
      difficulty: 'Advanced',
      type: 'Strength',
      description: 'Comprehensive leg and glute workout with progressive overload',
      exercises: [
        { name: 'Squats', sets: 4, reps: '8-12', restTime: 120, muscle: 'Quads' },
        { name: 'Deadlifts', sets: 4, reps: '6-8', restTime: 120, muscle: 'Hamstrings' },
        { name: 'Lunges', sets: 3, reps: '10 each', restTime: 60, muscle: 'Glutes' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', restTime: 45, muscle: 'Calves' },
        { name: 'Hip Thrusts', sets: 3, reps: '12-15', restTime: 60, muscle: 'Glutes' },
      ]
    },
    {
      id: '3',
      name: 'HIIT Cardio Burn',
      duration: 25,
      difficulty: 'Intermediate',
      type: 'HIIT',
      description: 'High-intensity interval training for maximum fat burning',
      exercises: [
        { name: 'Burpees', sets: 4, reps: '30 sec', restTime: 30, muscle: 'Full Body' },
        { name: 'Mountain Climbers', sets: 4, reps: '30 sec', restTime: 30, muscle: 'Core' },
        { name: 'Jump Squats', sets: 4, reps: '30 sec', restTime: 30, muscle: 'Legs' },
        { name: 'High Knees', sets: 4, reps: '30 sec', restTime: 30, muscle: 'Cardio' },
        { name: 'Plank Jacks', sets: 4, reps: '30 sec', restTime: 30, muscle: 'Core' },
      ]
    },
    {
      id: '4',
      name: 'Beginner Full Body',
      duration: 30,
      difficulty: 'Beginner',
      type: 'Strength',
      description: 'Perfect introduction to strength training with bodyweight exercises',
      exercises: [
        { name: 'Bodyweight Squats', sets: 2, reps: '10-15', restTime: 45, muscle: 'Legs' },
        { name: 'Push-ups', sets: 2, reps: '5-10', restTime: 45, muscle: 'Chest' },
        { name: 'Plank', sets: 2, reps: '20-30 sec', restTime: 45, muscle: 'Core' },
        { name: 'Lunges', sets: 2, reps: '8 each', restTime: 45, muscle: 'Legs' },
        { name: 'Wall Sit', sets: 2, reps: '15-30 sec', restTime: 45, muscle: 'Legs' },
      ]
    },
    {
      id: '5',
      name: 'Morning Stretch',
      duration: 15,
      difficulty: 'Beginner',
      type: 'Flexibility',
      description: 'Gentle stretches to start your day with improved mobility',
      exercises: [
        { name: 'Cat-Cow Stretch', sets: 1, reps: '10', restTime: 0, muscle: 'Spine' },
        { name: 'Forward Fold', sets: 1, reps: '30 sec', restTime: 0, muscle: 'Hamstrings' },
        { name: 'Shoulder Rolls', sets: 1, reps: '10 each', restTime: 0, muscle: 'Shoulders' },
        { name: 'Hip Circles', sets: 1, reps: '10 each', restTime: 0, muscle: 'Hips' },
        { name: 'Neck Stretch', sets: 1, reps: '15 sec each', restTime: 0, muscle: 'Neck' },
      ]
    },
  ];

  const filteredWorkouts = selectedCategory === 'All' 
    ? workouts 
    : workouts.filter(workout => workout.type === selectedCategory);

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

  const handleStartWorkout = (workout: Workout) => {
    console.log('Starting workout:', workout.name);
    router.push(`/workout/active?workoutId=${workout.id}`);
  };

  const handleViewWorkout = (workout: Workout) => {
    console.log('Viewing workout details:', workout.name);
    router.push(`/workout/details?workoutId=${workout.id}`);
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center', marginBottom: 0, color: colors.white }]}>
          Workout Library
        </Text>
        <TouchableOpacity onPress={() => router.push('/workout/create')}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View style={[commonStyles.section, { marginBottom: 16 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 4 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={{
                    backgroundColor: selectedCategory === category ? colors.primary : colors.backgroundAlt,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: selectedCategory === category ? colors.primary : colors.border,
                  }}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={{
                    color: selectedCategory === category ? colors.white : colors.text,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Workout List */}
        <View style={commonStyles.section}>
          {filteredWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={commonStyles.card}
              onPress={() => handleViewWorkout(workout)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  padding: 12,
                  marginRight: 16,
                }}>
                  <Ionicons 
                    name={getTypeIcon(workout.type) as any} 
                    size={24} 
                    color={colors.white} 
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                      {workout.name}
                    </Text>
                    <View style={{
                      backgroundColor: getDifficultyColor(workout.difficulty),
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}>
                      <Text style={{ color: colors.white, fontSize: 10, fontWeight: '600' }}>
                        {workout.difficulty.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                    {workout.description}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                      <Ionicons name="time" size={16} color={colors.textSecondary} />
                      <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                        {workout.duration} min
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                      <Ionicons name="fitness" size={16} color={colors.textSecondary} />
                      <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                        {workout.exercises.length} exercises
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="trending-up" size={16} color={colors.textSecondary} />
                      <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                        {workout.type}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button
                      text="Start Workout"
                      onPress={() => handleStartWorkout(workout)}
                      style={{ 
                        backgroundColor: colors.primary, 
                        flex: 1,
                        paddingVertical: 8,
                        marginTop: 0,
                      }}
                      textStyle={{ fontSize: 14, color: colors.white }}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.backgroundAlt,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => handleViewWorkout(workout)}
                    >
                      <Ionicons name="eye" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Custom Workout */}
        <View style={commonStyles.section}>
          <TouchableOpacity
            style={[commonStyles.card, { 
              backgroundColor: colors.backgroundAlt,
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 32,
            }]}
            onPress={() => router.push('/workout/create')}
          >
            <Ionicons name="add-circle" size={48} color={colors.primary} />
            <Text style={[commonStyles.text, { 
              marginTop: 12, 
              fontWeight: '600',
              color: colors.primary 
            }]}>
              Create Custom Workout
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 4 }]}>
              Design your own routine with AI assistance and visual guides
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}