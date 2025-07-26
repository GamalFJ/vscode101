import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme.tsx';
import { machinesData, getMachinesByDifficulty, getMachinesByMuscleGroup } from '../../data/machines';
import GymMachineGuide from '../../components/GymMachineGuide';

export default function MachineLibraryScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedMachine, setSelectedMachine] = React.useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    searchContainer: {
      marginBottom: theme.spacing.lg,
    },
    searchInput: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontFamily: theme.fonts.regular,
    },
    categoriesContainer: {
      marginBottom: theme.spacing.lg,
    },
    categoriesScroll: {
      flexDirection: 'row',
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    categoryTextActive: {
      color: theme.colors.background,
    },
    machineCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    machineHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    machineTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      flex: 1,
    },
    machineMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    metaText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    machineDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: theme.spacing.sm,
      fontFamily: theme.fonts.regular,
    },
    exercisesList: {
      marginTop: theme.spacing.sm,
    },
    exercisesTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fonts.medium,
    },
    exerciseItem: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
      fontFamily: theme.fonts.regular,
    },
    muscleGroupsList: {
      marginTop: theme.spacing.sm,
    },
    muscleGroupsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fonts.medium,
    },
    muscleGroupItem: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
      fontFamily: theme.fonts.regular,
    },
    difficultyBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
    noResultsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    noResultsText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontFamily: theme.fonts.regular,
    },
  });

  // Get unique categories from machines data (based on difficulty and muscle groups)
  const categories = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Upper Body', 'Lower Body', 'Full Body'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return { backgroundColor: theme.colors.success + '20', color: theme.colors.success };
      case 'Intermediate':
        return { backgroundColor: theme.colors.warning + '20', color: theme.colors.warning };
      case 'Advanced':
        return { backgroundColor: theme.colors.error + '20', color: theme.colors.error };
      default:
        return { backgroundColor: theme.colors.grey + '20', color: theme.colors.grey };
    }
  };

  const filteredMachines = machinesData.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         machine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         machine.exercises.some(exercise => exercise.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         machine.muscleGroups.some(group => group.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedCategory)) {
        matchesCategory = machine.difficulty === selectedCategory;
      } else if (selectedCategory === 'Upper Body') {
        matchesCategory = machine.muscleGroups.some(group => 
          ['Pectorals', 'Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius', 'Biceps', 'Triceps', 'Anterior Deltoids'].includes(group)
        );
      } else if (selectedCategory === 'Lower Body') {
        matchesCategory = machine.muscleGroups.some(group => 
          ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'].includes(group)
        );
      } else if (selectedCategory === 'Full Body') {
        matchesCategory = machine.muscleGroups.includes('Full Body - Depends on Exercise');
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  console.log('MachineLibraryScreen rendered with', filteredMachines.length, 'machines');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search machines..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => {
                  console.log('Selected category:', category);
                  setSelectedCategory(category);
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredMachines.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.noResultsText}>
              No machines found matching your search criteria.
            </Text>
          </View>
        ) : (
          filteredMachines.map((machine) => {
            const difficultyStyle = getDifficultyColor(machine.difficulty);
            return (
              <TouchableOpacity
                key={machine.id}
                style={styles.machineCard}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Selected machine:', machine.name);
                  setSelectedMachine(machine.name);
                }}
              >
                <View style={styles.machineHeader}>
                  <Text style={styles.machineTitle}>{machine.name}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyStyle.backgroundColor }]}>
                    <Text style={[styles.difficultyText, { color: difficultyStyle.color }]}>
                      {machine.difficulty}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.machineMeta}>
                  <Ionicons name="hardware-chip" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {machine.exercises.length} exercise{machine.exercises.length !== 1 ? 's' : ''}
                  </Text>
                  <Ionicons name="body" size={16} color={theme.colors.textSecondary} style={{ marginLeft: 16 }} />
                  <Text style={styles.metaText}>
                    {machine.muscleGroups.length} muscle group{machine.muscleGroups.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                
                <Text style={styles.machineDescription}>{machine.description}</Text>
                
                <View style={styles.exercisesList}>
                  <Text style={styles.exercisesTitle}>Available Exercises:</Text>
                  {machine.exercises.slice(0, 3).map((exercise, index) => (
                    <Text key={index} style={styles.exerciseItem}>• {exercise}</Text>
                  ))}
                  {machine.exercises.length > 3 && (
                    <Text style={styles.exerciseItem}>• +{machine.exercises.length - 3} more exercises...</Text>
                  )}
                </View>

                <View style={styles.muscleGroupsList}>
                  <Text style={styles.muscleGroupsTitle}>Target Muscles:</Text>
                  {machine.muscleGroups.slice(0, 3).map((group, index) => (
                    <Text key={index} style={styles.muscleGroupItem}>• {group}</Text>
                  ))}
                  {machine.muscleGroups.length > 3 && (
                    <Text style={styles.muscleGroupItem}>• +{machine.muscleGroups.length - 3} more...</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Machine Guide Modal */}
      {selectedMachine && (
        <GymMachineGuide
          machineName={selectedMachine}
          exercises={machinesData.find(m => m.name === selectedMachine)?.exercises || []}
          difficulty={machinesData.find(m => m.name === selectedMachine)?.difficulty || 'Beginner'}
        />
      )}
    </View>
  );
}