import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme.tsx';
import { exercisesData, getExercisesByMuscle, getExercisesByDifficulty } from '../../data/exercises';
import ExerciseGuide from '../../components/ExerciseGuide';
import MuscleAnatomyDiagram from '../../components/MuscleAnatomyDiagram';

export default function ExerciseLibraryScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedExercise, setSelectedExercise] = React.useState<string | null>(null);
  const [showAnatomyDiagram, setShowAnatomyDiagram] = React.useState(false);
  const [highlightedMuscles, setHighlightedMuscles] = React.useState<string[]>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    headerSection: {
      marginBottom: theme.spacing.lg,
    },
    anatomyButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0px 4px 12px ${theme.colors.primary}40`,
      elevation: 4,
    },
    anatomyButtonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: '700',
      marginLeft: theme.spacing.sm,
      fontFamily: theme.fonts.bold,
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
    exerciseCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    exerciseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    exerciseTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      flex: 1,
    },
    exerciseMeta: {
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
    exerciseDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      fontFamily: theme.fonts.regular,
      marginBottom: theme.spacing.sm,
    },
    exerciseDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    exerciseDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    exerciseDetailText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
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
    equipmentList: {
      marginTop: theme.spacing.sm,
    },
    equipmentTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fonts.medium,
    },
    equipmentItem: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs / 2,
      fontFamily: theme.fonts.regular,
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
    anatomyPreview: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    anatomyPreviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    anatomyPreviewTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontFamily: theme.fonts.medium,
    },
    anatomyPreviewText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      fontFamily: theme.fonts.regular,
    },
    muscleHighlight: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
  });

  // Get unique muscle groups from exercises data
  const categories = ['All', ...Array.from(new Set(exercisesData.map(exercise => exercise.muscle)))];

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

  const filteredExercises = exercisesData.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.muscle === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMusclePress = (muscle: string) => {
    console.log('Muscle selected from anatomy:', muscle);
    setSelectedCategory(muscle);
    setHighlightedMuscles([muscle]);
    setShowAnatomyDiagram(false);
  };

  // Update highlighted muscles when category changes
  React.useEffect(() => {
    if (selectedCategory !== 'All') {
      setHighlightedMuscles([selectedCategory]);
    } else {
      setHighlightedMuscles([]);
    }
  }, [selectedCategory]);

  console.log('ExerciseLibraryScreen rendered with', filteredExercises.length, 'exercises');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          {/* Anatomy Diagram Button */}
          <TouchableOpacity
            style={styles.anatomyButton}
            onPress={() => {
              console.log('Opening anatomy diagram');
              setShowAnatomyDiagram(true);
            }}
          >
            <Ionicons name="body" size={24} color={theme.colors.background} />
            <Text style={styles.anatomyButtonText}>
              Interactive Muscle Anatomy
            </Text>
          </TouchableOpacity>

          {/* Anatomy Preview for Selected Muscle */}
          {selectedCategory !== 'All' && (
            <View style={[styles.anatomyPreview, styles.muscleHighlight]}>
              <View style={styles.anatomyPreviewHeader}>
                <Ionicons name="target" size={20} color={theme.colors.primary} />
                <Text style={styles.anatomyPreviewTitle}>
                  Targeting: {selectedCategory}
                </Text>
              </View>
              <Text style={styles.anatomyPreviewText}>
                Showing {filteredExercises.length} exercises that target the {selectedCategory.toLowerCase()} muscle group. 
                Tap the anatomy diagram above to explore other muscle groups.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
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

        {filteredExercises.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.noResultsText}>
              No exercises found matching your search criteria.
            </Text>
            <TouchableOpacity
              style={[styles.anatomyButton, { marginTop: 20 }]}
              onPress={() => setShowAnatomyDiagram(true)}
            >
              <Ionicons name="body" size={20} color={theme.colors.background} />
              <Text style={[styles.anatomyButtonText, { fontSize: 14 }]}>
                Browse by Muscle Group
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredExercises.map((exercise) => {
            const difficultyStyle = getDifficultyColor(exercise.difficulty);
            return (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Selected exercise:', exercise.name);
                  setSelectedExercise(exercise.name);
                }}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyStyle.backgroundColor }]}>
                    <Text style={[styles.difficultyText, { color: difficultyStyle.color }]}>
                      {exercise.difficulty}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.exerciseMeta}>
                  <Ionicons name="body" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{exercise.muscle}</Text>
                  <Ionicons name="fitness" size={16} color={theme.colors.textSecondary} style={{ marginLeft: 16 }} />
                  <Text style={styles.metaText}>{exercise.category}</Text>
                </View>
                
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>

                <View style={styles.exerciseDetails}>
                  {exercise.sets && exercise.reps && (
                    <View style={styles.exerciseDetailItem}>
                      <Ionicons name="repeat" size={14} color={theme.colors.textSecondary} />
                      <Text style={styles.exerciseDetailText}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </Text>
                    </View>
                  )}
                  
                  {exercise.restTime && (
                    <View style={styles.exerciseDetailItem}>
                      <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                      <Text style={styles.exerciseDetailText}>
                        {exercise.restTime}s rest
                      </Text>
                    </View>
                  )}
                </View>

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <View style={styles.equipmentList}>
                    <Text style={styles.equipmentTitle}>Equipment:</Text>
                    {exercise.equipment.slice(0, 3).map((item, index) => (
                      <Text key={index} style={styles.equipmentItem}>• {item}</Text>
                    ))}
                    {exercise.equipment.length > 3 && (
                      <Text style={styles.equipmentItem}>• +{exercise.equipment.length - 3} more...</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Muscle Anatomy Diagram Modal */}
      <MuscleAnatomyDiagram
        visible={showAnatomyDiagram}
        onClose={() => {
          console.log('Closing anatomy diagram');
          setShowAnatomyDiagram(false);
        }}
        highlightedMuscles={highlightedMuscles}
        onMusclePress={handleMusclePress}
      />

      {/* Exercise Guide Modal */}
      {selectedExercise && (
        <ExerciseGuide
          exerciseName={selectedExercise}
          muscle={exercisesData.find(e => e.name === selectedExercise)?.muscle || ''}
          instructions={exercisesData.find(e => e.name === selectedExercise)?.description}
          difficulty={exercisesData.find(e => e.name === selectedExercise)?.difficulty}
        />
      )}
    </View>
  );
}