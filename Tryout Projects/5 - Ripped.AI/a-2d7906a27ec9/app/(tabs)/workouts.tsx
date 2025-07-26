import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme.tsx';
import Button from '../../components/Button';
import WeeklyWorkoutPlanner from '../../components/WeeklyWorkoutPlanner';
import WorkoutPlanViewer from '../../components/WorkoutPlanViewer';
import { WeeklyWorkoutPlan } from '../../services/workoutGenerator';

export default function WorkoutsScreen() {
  const { theme } = useTheme();
  const [showWeeklyPlanner, setShowWeeklyPlanner] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [showPlanViewer, setShowPlanViewer] = useState(false);

  const handlePlanGenerated = (plan: WeeklyWorkoutPlan) => {
    setCurrentPlan(plan);
    setShowPlanViewer(true);
  };

  const handleSavePlan = () => {
    // Here you would save the plan to storage/database
    console.log('Saving plan:', currentPlan);
    setShowPlanViewer(false);
    setCurrentPlan(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontFamily: theme.fonts.bold,
    },
    workoutCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    workoutHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    workoutTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      flex: 1,
    },
    workoutMeta: {
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
    workoutDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
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
    createButton: {
      marginBottom: theme.spacing.lg,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    halfButton: {
      flex: 1,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      fontFamily: theme.fonts.regular,
    },
    emptyState: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    emptyStateText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
      fontFamily: theme.fonts.medium,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
    },
  });

  const workouts = [
    {
      id: '1',
      title: 'Upper Body Strength',
      duration: '45 min',
      difficulty: 'Intermediate',
      exercises: 8,
      description: 'Focus on building upper body strength with compound movements.',
    },
    {
      id: '2',
      title: 'HIIT Cardio Blast',
      duration: '30 min',
      difficulty: 'Advanced',
      exercises: 6,
      description: 'High-intensity interval training for maximum calorie burn.',
    },
    {
      id: '3',
      title: 'Beginner Full Body',
      duration: '35 min',
      difficulty: 'Beginner',
      exercises: 10,
      description: 'Perfect introduction to strength training for beginners.',
    },
  ];

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Workout Generator</Text>
          <Text style={styles.description}>
            Let AI create personalized workouts based on your goals and fitness level
          </Text>
          
          <View style={styles.buttonRow}>
            <Button
              text="Create Single Workout"
              onPress={() => router.push('/workout/create')}
              variant="primary"
              style={styles.halfButton}
            />
            <Button
              text="Generate Weekly Plan"
              onPress={() => setShowWeeklyPlanner(true)}
              variant="secondary"
              style={styles.halfButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Workouts</Text>
          {workouts.map((workout) => {
            const difficultyStyle = getDifficultyColor(workout.difficulty);
            return (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutCard}
                onPress={() => router.push(`/workout/details?id=${workout.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyStyle.backgroundColor }]}>
                    <Text style={[styles.difficultyText, { color: difficultyStyle.color }]}>
                      {workout.difficulty}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.workoutMeta}>
                  <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{workout.duration}</Text>
                  <Ionicons name="fitness" size={16} color={theme.colors.textSecondary} style={{ marginLeft: theme.spacing.md }} />
                  <Text style={styles.metaText}>{workout.exercises} exercises</Text>
                </View>
                
                <Text style={styles.workoutDescription}>{workout.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Weekly Plans</Text>
          <Text style={styles.description}>
            Your saved workout plans will appear here
          </Text>
          
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No saved plans yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Generate your first weekly plan to get started
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Weekly Workout Planner Modal */}
      <WeeklyWorkoutPlanner
        visible={showWeeklyPlanner}
        onClose={() => setShowWeeklyPlanner(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Workout Plan Viewer */}
      {showPlanViewer && currentPlan && (
        <View style={styles.modalOverlay}>
          <WorkoutPlanViewer
            plan={currentPlan}
            onClose={() => setShowPlanViewer(false)}
            onSave={handleSavePlan}
          />
        </View>
      )}
    </View>
  );
}