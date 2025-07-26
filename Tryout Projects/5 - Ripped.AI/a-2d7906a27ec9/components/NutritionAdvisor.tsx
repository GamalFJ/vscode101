import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme.tsx';
import Button from './Button';
import { getRecommendedFoods, NutritionData } from '../data/nutrition';
import { nutritionService, formatMacros, getMacroColor } from '../services/nutritionService';
import NutritionTips from './NutritionTips';

type FoodSuggestion = NutritionData;

interface NutritionAdvisorProps {
  visible: boolean;
  onClose: () => void;
}

interface UserPreferences {
  fitnessGoal: string;
  dietaryPreferences: string[];
  allergies: string[];
  dailyCalories: string;
  mealsPerDay: string;
}

const NutritionAdvisor: React.FC<NutritionAdvisorProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<'preferences' | 'suggestions' | 'mealplan'>('preferences');
  const [selectedFood, setSelectedFood] = useState<FoodSuggestion | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    fitnessGoal: '',
    dietaryPreferences: [],
    allergies: [],
    dailyCalories: '',
    mealsPerDay: '3',
  });

  const [foodSuggestions, setFoodSuggestions] = useState<FoodSuggestion[]>([]);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      width: Dimensions.get('window').width * 0.95,
      maxHeight: Dimensions.get('window').height * 0.9,
      maxWidth: 500,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    scrollContent: {
      flexGrow: 1,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontFamily: theme.fonts.bold,
    },
    input: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.sm,
      fontFamily: theme.fonts.regular,
    },
    multilineInput: {
      height: 80,
      textAlignVertical: 'top',
    },
    optionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    option: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionText: {
      fontSize: 14,
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    selectedOptionText: {
      color: theme.colors.background,
    },
    generateButton: {
      marginTop: theme.spacing.lg,
    },
    foodCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      boxShadow: `0px 4px 12px ${theme.colors.background}80`,
      elevation: 4,
    },
    foodHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    foodName: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      flex: 1,
    },
    categoryBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    categoryText: {
      fontSize: 12,
      color: theme.colors.background,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
    macroContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    macroItem: {
      alignItems: 'center',
      flex: 1,
    },
    macroValue: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
    },
    macroLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
    },
    servingSize: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm,
      fontFamily: theme.fonts.regular,
    },
    benefitsList: {
      marginBottom: theme.spacing.sm,
    },
    benefitItem: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    alternativesButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
    alternativesButtonText: {
      color: theme.colors.background,
      fontSize: 14,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
    alternativesList: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.borderRadius.md,
    },
    alternativeItem: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginLeft: theme.spacing.sm,
      fontFamily: theme.fonts.medium,
    },
    emptyState: {
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
      fontFamily: theme.fonts.regular,
    },
    mealPlanContainer: {
      marginBottom: theme.spacing.lg,
    },
    mealPlanHeader: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    mealPlanTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      marginBottom: theme.spacing.sm,
    },
    mealPlanStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mealPlanStat: {
      alignItems: 'center',
    },
    mealPlanStatValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
    },
    mealPlanStatLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
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
      marginBottom: theme.spacing.md,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    mealTime: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
    },
    mealFoodsList: {
      marginBottom: theme.spacing.sm,
    },
    mealFoodItem: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    mealMacros: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    mealMacroItem: {
      alignItems: 'center',
    },
    mealMacroValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
      fontFamily: theme.fonts.medium,
    },
    mealMacroLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.regular,
    },
  });

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Maintenance',
    'Athletic Performance',
    'General Health',
  ];

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Low Carb',
    'High Protein',
    'Gluten Free',
  ];

  const commonAllergies = [
    'Nuts',
    'Dairy',
    'Gluten',
    'Eggs',
    'Soy',
    'Shellfish',
    'Fish',
    'Sesame',
  ];

  const generateFoodSuggestions = () => {
    console.log('Generating food suggestions with preferences:', preferences);
    
    // Comprehensive null checks for preferences object and its properties
    if (!preferences || typeof preferences !== 'object') {
      console.warn('Invalid preferences object:', preferences);
      Alert.alert('Error', 'Invalid preferences data. Please try again.');
      return;
    }
    
    const safePreferences = {
      fitnessGoal: preferences?.fitnessGoal && typeof preferences.fitnessGoal === 'string' ? preferences.fitnessGoal : '',
      dietaryPreferences: Array.isArray(preferences?.dietaryPreferences) ? preferences.dietaryPreferences.filter(pref => pref && typeof pref === 'string') : [],
      allergies: Array.isArray(preferences?.allergies) ? preferences.allergies.filter(allergy => allergy && typeof allergy === 'string') : [],
      dailyCalories: preferences?.dailyCalories && typeof preferences.dailyCalories === 'string' ? preferences.dailyCalories : '',
      mealsPerDay: preferences?.mealsPerDay && typeof preferences.mealsPerDay === 'string' ? preferences.mealsPerDay : '3'
    };
    
    if (!safePreferences.fitnessGoal) {
      Alert.alert('Missing Information', 'Please select a fitness goal to continue.');
      return;
    }

    try {
      // Use the nutrition database to get recommendations
      const suggestions = getRecommendedFoods(
        safePreferences.fitnessGoal,
        safePreferences.dietaryPreferences,
        safePreferences.allergies
      );

      // Validate that suggestions is an array
      if (Array.isArray(suggestions)) {
        console.log('Generated suggestions:', suggestions.length);
        setFoodSuggestions(suggestions);
        setCurrentStep('suggestions');
      } else {
        console.warn('getRecommendedFoods did not return an array:', suggestions);
        Alert.alert('Error', 'Unable to generate food suggestions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating food suggestions:', error);
      Alert.alert('Error', 'Failed to generate food suggestions. Please try again.');
    }
  };

  const generateMealPlan = () => {
    console.log('Generating meal plan with preferences:', preferences);
    
    // Comprehensive null checks for preferences object and its properties
    if (!preferences || typeof preferences !== 'object') {
      console.warn('Invalid preferences object:', preferences);
      Alert.alert('Error', 'Invalid preferences data. Please try again.');
      return;
    }
    
    const safePreferences = {
      fitnessGoal: preferences?.fitnessGoal && typeof preferences.fitnessGoal === 'string' ? preferences.fitnessGoal : '',
      dietaryPreferences: Array.isArray(preferences?.dietaryPreferences) ? preferences.dietaryPreferences.filter(pref => pref && typeof pref === 'string') : [],
      allergies: Array.isArray(preferences?.allergies) ? preferences.allergies.filter(allergy => allergy && typeof allergy === 'string') : [],
      dailyCalories: preferences?.dailyCalories && typeof preferences.dailyCalories === 'string' ? preferences.dailyCalories : '',
      mealsPerDay: preferences?.mealsPerDay && typeof preferences.mealsPerDay === 'string' ? preferences.mealsPerDay : '3'
    };
    
    if (!safePreferences.fitnessGoal || !safePreferences.dailyCalories) {
      Alert.alert('Missing Information', 'Please fill in all required fields to continue.');
      return;
    }

    // Validate and parse numeric values
    const dailyCaloriesNum = parseInt(safePreferences.dailyCalories);
    const mealsPerDayNum = parseInt(safePreferences.mealsPerDay);
    
    if (isNaN(dailyCaloriesNum) || dailyCaloriesNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number for daily calories.');
      return;
    }
    
    if (isNaN(mealsPerDayNum) || mealsPerDayNum <= 0 || mealsPerDayNum > 6) {
      Alert.alert('Invalid Input', 'Please enter a valid number of meals per day (1-6).');
      return;
    }

    try {
      // Calculate nutrition goals based on user input
      const nutritionGoals = {
        calories: dailyCaloriesNum,
        protein: Math.round(dailyCaloriesNum * 0.25 / 4), // 25% of calories from protein
        carbs: Math.round(dailyCaloriesNum * 0.45 / 4), // 45% from carbs
        fat: Math.round(dailyCaloriesNum * 0.30 / 9), // 30% from fat
        fiber: Math.max(25, dailyCaloriesNum / 1000 * 14), // 14g per 1000 calories
      };

      const plan = nutritionService.generateMealPlan(
        nutritionGoals,
        safePreferences.dietaryPreferences,
        safePreferences.allergies,
        mealsPerDayNum
      );

      // Validate that plan is a valid object
      if (plan && typeof plan === 'object' && plan.id) {
        console.log('Generated meal plan:', plan);
        setMealPlan(plan);
        setCurrentStep('mealplan');
      } else {
        console.warn('Invalid meal plan generated:', plan);
        Alert.alert('Error', 'Unable to generate meal plan. Please try again.');
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
    }
  };

  const toggleOption = (option: string, type: 'dietary' | 'allergies') => {
    if (type === 'dietary') {
      setPreferences(prev => ({
        ...prev,
        dietaryPreferences: prev.dietaryPreferences.includes(option)
          ? prev.dietaryPreferences.filter(item => item !== option)
          : [...prev.dietaryPreferences, option]
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        allergies: prev.allergies.includes(option)
          ? prev.allergies.filter(item => item !== option)
          : [...prev.allergies, option]
      }));
    }
  };

  const handleFoodPress = (food: FoodSuggestion) => {
    // Add comprehensive null checks for food object
    if (!food || typeof food !== 'object') {
      console.warn('Invalid food object passed to handleFoodPress:', food);
      return;
    }
    
    // Validate that food has required properties
    if (!food.id || typeof food.id !== 'string') {
      console.warn('Food object missing valid id:', food);
      return;
    }
    
    setSelectedFood(food);
    setShowAlternatives(!showAlternatives || selectedFood?.id !== food.id);
  };

  const renderPreferencesForm = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fitness Goal</Text>
        <View style={styles.optionContainer}>
          {fitnessGoals.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.option,
                preferences.fitnessGoal === goal && styles.selectedOption,
              ]}
              onPress={() => setPreferences(prev => ({ ...prev, fitnessGoal: goal }))}
            >
              <Text
                style={[
                  styles.optionText,
                  preferences.fitnessGoal === goal && styles.selectedOptionText,
                ]}
              >
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Calorie Target</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2000"
          placeholderTextColor={theme.colors.textSecondary}
          value={preferences.dailyCalories}
          onChangeText={(text) => setPreferences(prev => ({ ...prev, dailyCalories: text }))}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meals Per Day</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 3"
          placeholderTextColor={theme.colors.textSecondary}
          value={preferences.mealsPerDay}
          onChangeText={(text) => setPreferences(prev => ({ ...prev, mealsPerDay: text }))}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        <View style={styles.optionContainer}>
          {dietaryOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                preferences.dietaryPreferences.includes(option) && styles.selectedOption,
              ]}
              onPress={() => toggleOption(option, 'dietary')}
            >
              <Text
                style={[
                  styles.optionText,
                  preferences.dietaryPreferences.includes(option) && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>
        <View style={styles.optionContainer}>
          {commonAllergies.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              style={[
                styles.option,
                preferences.allergies.includes(allergy) && styles.selectedOption,
              ]}
              onPress={() => toggleOption(allergy, 'allergies')}
            >
              <Text
                style={[
                  styles.optionText,
                  preferences.allergies.includes(allergy) && styles.selectedOptionText,
                ]}
              >
                {allergy}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <Button
          text="Food Suggestions"
          onPress={generateFoodSuggestions}
          style={[styles.generateButton, { flex: 1 }]}
          disabled={!preferences.fitnessGoal || !preferences.dailyCalories}
        />
        <Button
          text="Meal Plan"
          onPress={generateMealPlan}
          style={[styles.generateButton, { flex: 1 }]}
          variant="secondary"
          disabled={!preferences.fitnessGoal || !preferences.dailyCalories}
        />
      </View>
    </ScrollView>
  );

  const renderFoodSuggestions = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentStep('preferences')}
      >
        <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
        <Text style={styles.backButtonText}>Back to Preferences</Text>
      </TouchableOpacity>

      {foodSuggestions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            No food suggestions match your current preferences. Try adjusting your dietary restrictions.
          </Text>
        </View>
      ) : (
        foodSuggestions.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={styles.foodCard}
            onPress={() => handleFoodPress(food)}
          >
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{food.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{food.category.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.servingSize}>Per {food.servingSize}</Text>

            <View style={styles.macroContainer}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{food.calories}</Text>
                <Text style={styles.macroLabel}>Calories</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{food.protein}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{food.carbs}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{food.fat}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{food.fiber}g</Text>
                <Text style={styles.macroLabel}>Fiber</Text>
              </View>
            </View>

            <View style={styles.benefitsList}>
              {food.benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefitItem}>
                  • {benefit}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.alternativesButton}
              onPress={() => handleFoodPress(food)}
            >
              <Text style={styles.alternativesButtonText}>
                {selectedFood?.id === food.id && showAlternatives ? 'Hide' : 'Show'} Alternatives
              </Text>
            </TouchableOpacity>

            {selectedFood?.id === food.id && showAlternatives && (
              <View style={styles.alternativesList}>
                <Text style={[styles.sectionTitle, { marginBottom: theme.spacing.sm }]}>
                  Alternative Options:
                </Text>
                {food.alternatives.map((alternative, index) => (
                  <Text key={index} style={styles.alternativeItem}>
                    • {alternative}
                  </Text>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))
      )}

      <NutritionTips 
        goal={preferences.fitnessGoal}
        dietaryPreferences={preferences.dietaryPreferences}
      />
    </ScrollView>
  );

  const renderMealPlan = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentStep('preferences')}
      >
        <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
        <Text style={styles.backButtonText}>Back to Preferences</Text>
      </TouchableOpacity>

      {!mealPlan ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            No meal plan generated. Please try again.
          </Text>
        </View>
      ) : (
        <View style={styles.mealPlanContainer}>
          <View style={styles.mealPlanHeader}>
            <Text style={styles.mealPlanTitle}>{mealPlan.name}</Text>
            <View style={styles.mealPlanStats}>
              <View style={styles.mealPlanStat}>
                <Text style={styles.mealPlanStatValue}>{mealPlan.totalCalories}</Text>
                <Text style={styles.mealPlanStatLabel}>Calories</Text>
              </View>
              <View style={styles.mealPlanStat}>
                <Text style={styles.mealPlanStatValue}>{mealPlan.totalProtein}g</Text>
                <Text style={styles.mealPlanStatLabel}>Protein</Text>
              </View>
              <View style={styles.mealPlanStat}>
                <Text style={styles.mealPlanStatValue}>{mealPlan.totalCarbs}g</Text>
                <Text style={styles.mealPlanStatLabel}>Carbs</Text>
              </View>
              <View style={styles.mealPlanStat}>
                <Text style={styles.mealPlanStatValue}>{mealPlan.totalFat}g</Text>
                <Text style={styles.mealPlanStatLabel}>Fat</Text>
              </View>
            </View>
          </View>

          {mealPlan.meals.map((meal: any, index: number) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>

              <View style={styles.mealFoodsList}>
                {meal.foods.map((foodPortion: any, foodIndex: number) => (
                  <Text key={foodIndex} style={styles.mealFoodItem}>
                    • {foodPortion.food.name} ({foodPortion.quantity} {foodPortion.unit})
                  </Text>
                ))}
              </View>

              <View style={styles.mealMacros}>
                <View style={styles.mealMacroItem}>
                  <Text style={styles.mealMacroValue}>{meal.calories}</Text>
                  <Text style={styles.mealMacroLabel}>Cal</Text>
                </View>
                <View style={styles.mealMacroItem}>
                  <Text style={styles.mealMacroValue}>{meal.protein}g</Text>
                  <Text style={styles.mealMacroLabel}>Protein</Text>
                </View>
                <View style={styles.mealMacroItem}>
                  <Text style={styles.mealMacroValue}>{meal.carbs}g</Text>
                  <Text style={styles.mealMacroLabel}>Carbs</Text>
                </View>
                <View style={styles.mealMacroItem}>
                  <Text style={styles.mealMacroValue}>{meal.fat}g</Text>
                  <Text style={styles.mealMacroLabel}>Fat</Text>
                </View>
              </View>
            </View>
          ))}

          <NutritionTips 
            goal={preferences.fitnessGoal}
            dietaryPreferences={preferences.dietaryPreferences}
          />
        </View>
      )}
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {currentStep === 'preferences' ? 'Nutrition Advisor' : 
               currentStep === 'suggestions' ? 'Food Suggestions' : 'Meal Plan'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {currentStep === 'preferences' ? renderPreferencesForm() : 
           currentStep === 'suggestions' ? renderFoodSuggestions() : renderMealPlan()}
        </View>
      </View>
    </Modal>
  );
};

export default NutritionAdvisor;