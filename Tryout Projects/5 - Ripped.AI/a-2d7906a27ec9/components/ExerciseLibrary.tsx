import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import ExerciseGuide from './ExerciseGuide';
import GymMachineGuide from './GymMachineGuide';

interface Exercise {
  name: string;
  muscle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

const exerciseDatabase: Exercise[] = [
  // Upper Body - Chest
  { name: 'Bench Press', muscle: 'Chest', category: 'Upper Body', difficulty: 'Intermediate', description: 'Primary chest exercise for building mass and strength' },
  { name: 'Push-ups', muscle: 'Chest', category: 'Upper Body', difficulty: 'Beginner', description: 'Bodyweight exercise for chest, shoulders, and triceps' },
  
  // Upper Body - Back
  { name: 'Pull-ups', muscle: 'Back', category: 'Upper Body', difficulty: 'Intermediate', description: 'Compound pulling exercise for back and biceps' },
  { name: 'Barbell Rows', muscle: 'Back', category: 'Upper Body', difficulty: 'Intermediate', description: 'Horizontal pulling exercise for back thickness' },
  { name: 'Lat Pulldowns', muscle: 'Back', category: 'Upper Body', difficulty: 'Beginner', description: 'Machine exercise for lat development' },
  
  // Upper Body - Shoulders
  { name: 'Overhead Press', muscle: 'Shoulders', category: 'Upper Body', difficulty: 'Intermediate', description: 'Primary shoulder exercise for mass and strength' },
  
  // Upper Body - Arms
  { name: 'Bicep Curls', muscle: 'Biceps', category: 'Upper Body', difficulty: 'Beginner', description: 'Isolation exercise for bicep development' },
  { name: 'Tricep Extensions', muscle: 'Triceps', category: 'Upper Body', difficulty: 'Beginner', description: 'Isolation exercise for tricep development' },
  { name: 'Dips', muscle: 'Triceps', category: 'Upper Body', difficulty: 'Intermediate', description: 'Compound exercise for triceps and chest' },
  
  // Lower Body
  { name: 'Squats', muscle: 'Quadriceps', category: 'Lower Body', difficulty: 'Intermediate', description: 'King of all exercises for leg development' },
  { name: 'Deadlifts', muscle: 'Hamstrings', category: 'Lower Body', difficulty: 'Advanced', description: 'Full body compound exercise' },
  { name: 'Lunges', muscle: 'Quadriceps', category: 'Lower Body', difficulty: 'Beginner', description: 'Unilateral leg exercise for balance and strength' },
  { name: 'Leg Press', muscle: 'Quadriceps', category: 'Lower Body', difficulty: 'Beginner', description: 'Machine exercise for leg development' },
  
  // Core & Cardio
  { name: 'Plank', muscle: 'Core', category: 'Core', difficulty: 'Beginner', description: 'Isometric core strengthening exercise' },
  { name: 'Burpees', muscle: 'Full Body', category: 'Cardio', difficulty: 'Advanced', description: 'High-intensity full body exercise' },
  { name: 'Mountain Climbers', muscle: 'Core', category: 'Cardio', difficulty: 'Intermediate', description: 'Dynamic core and cardio exercise' },
];

interface GymMachine {
  name: string;
  exercises: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

const gymMachineDatabase: GymMachine[] = [
  {
    name: 'Bench Press Station',
    exercises: ['Bench Press', 'Incline Press', 'Decline Press'],
    difficulty: 'Intermediate',
    description: 'Complete station for chest development'
  },
  {
    name: 'Squat Rack',
    exercises: ['Squats', 'Overhead Press', 'Barbell Rows'],
    difficulty: 'Intermediate',
    description: 'Versatile rack for compound movements'
  },
  {
    name: 'Cable Machine',
    exercises: ['Cable Rows', 'Lat Pulldowns', 'Cable Flyes', 'Tricep Pushdowns'],
    difficulty: 'Beginner',
    description: 'Adjustable cable system for various exercises'
  },
  {
    name: 'Leg Press Machine',
    exercises: ['Leg Press', 'Calf Press'],
    difficulty: 'Beginner',
    description: 'Safe machine for leg development'
  },
  {
    name: 'Lat Pulldown Machine',
    exercises: ['Lat Pulldowns', 'Cable Rows'],
    difficulty: 'Beginner',
    description: 'Seated pulling machine for back development'
  },
];

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'exercises' | 'machines'>('exercises');

  const categories = ['All', 'Upper Body', 'Lower Body', 'Core', 'Cardio'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredMachines = gymMachineDatabase.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         machine.exercises.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'All' || machine.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.warning;
      case 'Advanced': return colors.error;
      default: return colors.primary;
    }
  };

  console.log('ExerciseLibrary rendered with', filteredExercises.length, 'exercises');

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
        <View style={{ width: 24 }} />
        <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
          Exercise Library
        </Text>
        <TouchableOpacity onPress={() => console.log('Search exercises')}>
          <Ionicons name="search" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={commonStyles.section}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* View Mode Toggle */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            View Mode
          </Text>
          <View style={styles.viewModeContainer}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                { backgroundColor: viewMode === 'exercises' ? colors.primary : colors.backgroundAlt }
              ]}
              onPress={() => {
                console.log('Switching to exercises view');
                setViewMode('exercises');
              }}
            >
              <Ionicons 
                name="fitness" 
                size={20} 
                color={viewMode === 'exercises' ? colors.white : colors.textSecondary}
                style={{ marginRight: 8 }}
              />
              <Text style={[
                styles.viewModeText,
                { color: viewMode === 'exercises' ? colors.white : colors.text }
              ]}>
                Exercises
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                { backgroundColor: viewMode === 'machines' ? colors.primary : colors.backgroundAlt }
              ]}
              onPress={() => {
                console.log('Switching to machines view');
                setViewMode('machines');
              }}
            >
              <Ionicons 
                name="construct" 
                size={20} 
                color={viewMode === 'machines' ? colors.white : colors.textSecondary}
                style={{ marginRight: 8 }}
              />
              <Text style={[
                styles.viewModeText,
                { color: viewMode === 'machines' ? colors.white : colors.text }
              ]}>
                Machines
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter - Only show for exercises */}
        {viewMode === 'exercises' && (
          <View style={commonStyles.section}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      { backgroundColor: selectedCategory === category ? colors.primary : colors.backgroundAlt }
                    ]}
                    onPress={() => {
                      console.log('Selected category:', category);
                      setSelectedCategory(category);
                    }}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: selectedCategory === category ? colors.white : colors.text }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Difficulty Filter */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Difficulty Level
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterContainer}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterChip,
                    { 
                      backgroundColor: selectedDifficulty === difficulty 
                        ? (difficulty === 'All' ? colors.primary : getDifficultyColor(difficulty))
                        : colors.backgroundAlt 
                    }
                  ]}
                  onPress={() => {
                    console.log('Selected difficulty:', difficulty);
                    setSelectedDifficulty(difficulty);
                  }}
                >
                  <Text style={[
                    styles.filterChipText,
                    { color: selectedDifficulty === difficulty ? colors.white : colors.text }
                  ]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results */}
        <View style={commonStyles.section}>
          <View style={styles.resultsHeader}>
            <Text style={[commonStyles.subtitle, { marginBottom: 0 }]}>
              {viewMode === 'exercises' ? `Exercises (${filteredExercises.length})` : `Machines (${filteredMachines.length})`}
            </Text>
            {((viewMode === 'exercises' && filteredExercises.length === 0) || 
              (viewMode === 'machines' && filteredMachines.length === 0)) && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                }}
                style={styles.clearButton}
              >
                <Text style={[commonStyles.text, { color: colors.primary, fontSize: 14 }]}>
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {viewMode === 'exercises' ? (
            filteredExercises.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                  No exercises found matching your criteria
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            ) : (
              filteredExercises.map((exercise, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                  <View style={[commonStyles.card, styles.exerciseCard]}>
                    <View style={styles.exerciseHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 16 }]}>
                          {exercise.name}
                        </Text>
                        <Text style={[commonStyles.textSecondary, { marginTop: 2 }]}>
                          {exercise.description}
                        </Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                        <Text style={styles.difficultyBadgeText}>
                          {exercise.difficulty}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.exerciseMetadata}>
                      <View style={styles.metadataItem}>
                        <Ionicons name="body" size={16} color={colors.primary} />
                        <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                          {exercise.muscle}
                        </Text>
                      </View>
                      <View style={styles.metadataItem}>
                        <Ionicons name="fitness" size={16} color={colors.primary} />
                        <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                          {exercise.category}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Exercise Guide Component */}
                  <ExerciseGuide
                    exerciseName={exercise.name}
                    muscle={exercise.muscle}
                    instructions={exercise.description}
                    difficulty={exercise.difficulty}
                  />
                </View>
              ))
            )
          ) : (
            filteredMachines.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                  No machines found matching your criteria
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            ) : (
              filteredMachines.map((machine, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                  <View style={[commonStyles.card, styles.exerciseCard]}>
                    <View style={styles.exerciseHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 16 }]}>
                          {machine.name}
                        </Text>
                        <Text style={[commonStyles.textSecondary, { marginTop: 2 }]}>
                          {machine.description}
                        </Text>
                      </View>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(machine.difficulty) }]}>
                        <Text style={styles.difficultyBadgeText}>
                          {machine.difficulty}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.exerciseMetadata}>
                      <View style={styles.metadataItem}>
                        <Ionicons name="construct" size={16} color={colors.primary} />
                        <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                          {machine.exercises.length} exercises
                        </Text>
                      </View>
                      <View style={styles.metadataItem}>
                        <Ionicons name="barbell" size={16} color={colors.primary} />
                        <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontSize: 12 }]}>
                          Machine
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Gym Machine Guide Component */}
                  <GymMachineGuide
                    machineName={machine.name}
                    exercises={machine.exercises}
                    difficulty={machine.difficulty}
                  />
                </View>
              ))
            )
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  exerciseCard: {
    marginBottom: 8,
    backgroundColor: colors.backgroundAlt,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  difficultyBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  exerciseMetadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});