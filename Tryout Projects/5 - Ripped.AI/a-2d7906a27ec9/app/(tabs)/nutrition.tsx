import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme.tsx';
import NutritionAdvisor from '../../components/NutritionAdvisor';

export default function NutritionScreen() {
  const { theme } = useTheme();
  const [showNutritionAdvisor, setShowNutritionAdvisor] = useState(false);

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
    dailyStatsCard: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.onPrimaryContainer,
      marginTop: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
      textAlign: 'center',
    },
    macroCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    macroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    macroName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    macroValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    mealCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    mealName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    mealCalories: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
      fontFamily: theme.fonts.medium,
    },
    mealDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      fontFamily: theme.fonts.regular,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    addButtonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
    advisorCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      boxShadow: `0px 4px 12px ${theme.colors.primary}20`,
      elevation: 4,
    },
    advisorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    advisorTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    advisorDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      fontFamily: theme.fonts.regular,
    },
  });

  const dailyStats = [
    { number: '1,847', label: 'Calories\nConsumed' },
    { number: '2,200', label: 'Daily\nGoal' },
    { number: '353', label: 'Remaining' },
  ];

  const macros = [
    { name: 'Protein', current: 120, target: 150, color: theme.colors.primary },
    { name: 'Carbs', current: 180, target: 220, color: theme.colors.secondary },
    { name: 'Fat', current: 65, target: 80, color: theme.colors.accent },
  ];

  const meals = [
    {
      name: 'Breakfast',
      calories: 450,
      description: 'Oatmeal with berries and protein powder',
    },
    {
      name: 'Lunch',
      calories: 620,
      description: 'Grilled chicken salad with quinoa',
    },
    {
      name: 'Dinner',
      calories: 580,
      description: 'Salmon with sweet potato and vegetables',
    },
    {
      name: 'Snacks',
      calories: 197,
      description: 'Greek yogurt and almonds',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Overview</Text>
          <View style={styles.dailyStatsCard}>
            <View style={styles.statsRow}>
              {dailyStats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statNumber}>{stat.number}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Macronutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          {macros.map((macro, index) => {
            const percentage = (macro.current / macro.target) * 100;
            return (
              <View key={index} style={styles.macroCard}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroName}>{macro.name}</Text>
                  <Text style={styles.macroValue}>{macro.current}g / {macro.target}g</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: macro.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>
          {meals.map((meal, index) => (
            <View key={index} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
              </View>
              <Text style={styles.mealDescription}>{meal.description}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Advisor Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Nutrition Advisor</Text>
          <TouchableOpacity 
            style={styles.advisorCard}
            onPress={() => setShowNutritionAdvisor(true)}
          >
            <View style={styles.advisorHeader}>
              <Ionicons name="nutrition" size={24} color={theme.colors.primary} />
              <Text style={styles.advisorTitle}>Get Personalized Food Suggestions</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.advisorDescription}>
              Enter your fitness goals, dietary preferences, and allergies to receive AI-powered food recommendations with detailed macros.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionAdvisor 
        visible={showNutritionAdvisor}
        onClose={() => setShowNutritionAdvisor(false)}
      />
    </View>
  );
}