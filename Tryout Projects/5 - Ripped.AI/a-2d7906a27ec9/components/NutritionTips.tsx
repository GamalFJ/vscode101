import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme.tsx';

interface NutritionTip {
  id: string;
  title: string;
  description: string;
  category: 'hydration' | 'timing' | 'preparation' | 'general';
  icon: string;
}

interface NutritionTipsProps {
  goal?: string;
  dietaryPreferences?: string[];
}

const NutritionTips: React.FC<NutritionTipsProps> = ({ goal, dietaryPreferences = [] }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontFamily: theme.fonts.bold,
    },
    tipCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    tipIcon: {
      marginRight: theme.spacing.sm,
    },
    tipTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      flex: 1,
    },
    tipDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      fontFamily: theme.fonts.regular,
    },
    categoryBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
    },
    categoryText: {
      fontSize: 12,
      color: theme.colors.background,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
  });

  const allTips: NutritionTip[] = [
    {
      id: 'hydration_1',
      title: 'Stay Hydrated',
      description: 'Drink at least 8-10 glasses of water daily. Proper hydration supports metabolism, nutrient transport, and helps control hunger.',
      category: 'hydration',
      icon: 'water',
    },
    {
      id: 'timing_1',
      title: 'Pre-Workout Nutrition',
      description: 'Eat a light snack with carbs and protein 30-60 minutes before exercising. Try a banana with peanut butter or Greek yogurt with berries.',
      category: 'timing',
      icon: 'time',
    },
    {
      id: 'timing_2',
      title: 'Post-Workout Recovery',
      description: 'Within 2 hours after exercise, consume protein and carbs to help muscle recovery. A 3:1 or 4:1 carb-to-protein ratio is ideal.',
      category: 'timing',
      icon: 'fitness',
    },
    {
      id: 'preparation_1',
      title: 'Meal Prep Success',
      description: 'Prepare meals in advance to avoid unhealthy choices. Cook proteins, chop vegetables, and portion snacks on weekends.',
      category: 'preparation',
      icon: 'restaurant',
    },
    {
      id: 'general_1',
      title: 'Eat the Rainbow',
      description: 'Include a variety of colorful fruits and vegetables in your diet. Different colors provide different nutrients and antioxidants.',
      category: 'general',
      icon: 'color-palette',
    },
    {
      id: 'general_2',
      title: 'Mindful Eating',
      description: 'Eat slowly and pay attention to hunger cues. It takes about 20 minutes for your brain to register fullness.',
      category: 'general',
      icon: 'heart',
    },
    {
      id: 'timing_3',
      title: 'Breakfast Importance',
      description: 'Start your day with a balanced breakfast including protein, healthy fats, and complex carbs to stabilize blood sugar.',
      category: 'timing',
      icon: 'sunny',
    },
    {
      id: 'preparation_2',
      title: 'Smart Snacking',
      description: 'Keep healthy snacks readily available: nuts, fruits, vegetables with hummus, or Greek yogurt to avoid processed options.',
      category: 'preparation',
      icon: 'nutrition',
    },
    {
      id: 'general_3',
      title: 'Portion Control',
      description: 'Use your hand as a guide: palm-sized protein, fist-sized vegetables, cupped-hand carbs, and thumb-sized fats.',
      category: 'general',
      icon: 'hand-left',
    },
    {
      id: 'hydration_2',
      title: 'Electrolyte Balance',
      description: 'During intense workouts or hot weather, replenish electrolytes with coconut water or add a pinch of sea salt to your water.',
      category: 'hydration',
      icon: 'flash',
    },
  ];

  // Filter tips based on goal and dietary preferences
  const getRelevantTips = (): NutritionTip[] => {
    let filteredTips = [...allTips];

    // Add goal-specific tips
    if (goal?.toLowerCase().includes('weight loss')) {
      filteredTips.push({
        id: 'weight_loss_1',
        title: 'Calorie Deficit',
        description: 'Create a moderate calorie deficit of 300-500 calories per day for sustainable weight loss of 1-2 pounds per week.',
        category: 'general',
        icon: 'trending-down',
      });
      filteredTips.push({
        id: 'weight_loss_2',
        title: 'Fiber for Satiety',
        description: 'Include high-fiber foods like vegetables, fruits, and whole grains to help you feel full longer and support weight loss.',
        category: 'general',
        icon: 'leaf',
      });
    }

    if (goal?.toLowerCase().includes('muscle')) {
      filteredTips.push({
        id: 'muscle_gain_1',
        title: 'Protein Timing',
        description: 'Distribute protein intake throughout the day, aiming for 20-30g per meal to optimize muscle protein synthesis.',
        category: 'timing',
        icon: 'barbell',
      });
      filteredTips.push({
        id: 'muscle_gain_2',
        title: 'Calorie Surplus',
        description: 'Maintain a slight calorie surplus of 200-500 calories above maintenance to support muscle growth without excess fat gain.',
        category: 'general',
        icon: 'trending-up',
      });
    }

    // Add dietary preference-specific tips
    if (dietaryPreferences.includes('Vegan')) {
      filteredTips.push({
        id: 'vegan_1',
        title: 'Complete Proteins',
        description: 'Combine different plant proteins like rice and beans, or quinoa and nuts to ensure all essential amino acids.',
        category: 'general',
        icon: 'leaf',
      });
      filteredTips.push({
        id: 'vegan_2',
        title: 'B12 Supplementation',
        description: 'Consider vitamin B12 supplementation as it&apos;s primarily found in animal products and crucial for nerve function.',
        category: 'general',
        icon: 'medical',
      });
    }

    if (dietaryPreferences.includes('Keto')) {
      filteredTips.push({
        id: 'keto_1',
        title: 'Electrolyte Management',
        description: 'Increase sodium, potassium, and magnesium intake to prevent keto flu and maintain proper electrolyte balance.',
        category: 'hydration',
        icon: 'flash',
      });
      filteredTips.push({
        id: 'keto_2',
        title: 'Healthy Fats Focus',
        description: 'Prioritize healthy fats like avocados, olive oil, nuts, and fatty fish over processed high-fat foods.',
        category: 'general',
        icon: 'nutrition',
      });
    }

    // Return a selection of the most relevant tips
    return filteredTips.slice(0, 6);
  };

  const relevantTips = getRelevantTips();

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'hydration':
        return 'water';
      case 'timing':
        return 'time';
      case 'preparation':
        return 'restaurant';
      default:
        return 'information-circle';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Nutrition Tips</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {relevantTips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons 
                name={tip.icon as any} 
                size={20} 
                color={theme.colors.primary} 
                style={styles.tipIcon}
              />
              <Text style={styles.tipTitle}>{tip.title}</Text>
            </View>
            <Text style={styles.tipDescription}>{tip.description}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{tip.category.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NutritionTips;