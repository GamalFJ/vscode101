import { NutritionData, getRecommendedFoods, nutritionDatabase } from '../data/nutrition';

// Utility function to safely access nested object properties
const safeGet = (obj: any, path: string, defaultValue: any = undefined) => {
  try {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.warn('Error accessing property path:', path, error);
    return defaultValue;
  }
};

// Utility function to validate nutrition data object
const validateNutritionData = (data: any): data is NutritionData => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'name', 'calories', 'protein', 'carbs', 'fat', 'category'];
  return requiredFields.every(field => 
    data.hasOwnProperty(field) && 
    data[field] !== null && 
    data[field] !== undefined
  );
};

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealPlan {
  id: string;
  name: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: FoodPortion[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodPortion {
  food: NutritionData;
  quantity: number;
  unit: string;
}

class NutritionService {
  
  // Calculate daily nutrition goals based on user profile
  calculateNutritionGoals(
    weight: number, // in kg
    height: number, // in cm
    age: number,
    gender: 'male' | 'female',
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'weight_loss' | 'maintenance' | 'muscle_gain'
  ): NutritionGoals {
    
    // Comprehensive null checks and validation for all parameters
    const safeWeight = typeof weight === 'number' && weight > 0 ? weight : 70;
    const safeHeight = typeof height === 'number' && height > 0 ? height : 170;
    const safeAge = typeof age === 'number' && age > 0 ? age : 30;
    const safeGender = gender === 'male' || gender === 'female' ? gender : 'male';
    const safeActivityLevel = ['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(activityLevel) ? activityLevel : 'moderate';
    const safeGoal = ['weight_loss', 'maintenance', 'muscle_gain'].includes(goal) ? goal : 'maintenance';
    
    console.log('Calculating nutrition goals with safe parameters:', {
      safeWeight, safeHeight, safeAge, safeGender, safeActivityLevel, safeGoal
    });
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (safeGender === 'male') {
      bmr = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5;
    } else {
      bmr = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const activityMultiplier = activityMultipliers[safeActivityLevel] || 1.55;
    let tdee = bmr * activityMultiplier;

    // Adjust for goal
    let calories: number;
    switch (safeGoal) {
      case 'weight_loss':
        calories = tdee - 500; // 500 calorie deficit
        break;
      case 'muscle_gain':
        calories = tdee + 300; // 300 calorie surplus
        break;
      default:
        calories = tdee;
    }

    // Ensure minimum calorie intake
    calories = Math.max(calories, 1200);

    // Calculate macronutrient targets with safe fallbacks
    const protein = safeWeight * (safeGoal === 'muscle_gain' ? 2.2 : 1.6); // g per kg body weight
    const fat = calories * 0.25 / 9; // 25% of calories from fat
    const carbs = (calories - (protein * 4) - (fat * 9)) / 4; // Remaining calories from carbs
    const fiber = Math.max(25, calories / 1000 * 14); // 14g per 1000 calories, minimum 25g

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      fiber: Math.round(fiber)
    };
  }

  // Get personalized food recommendations
  getPersonalizedRecommendations(
    fitnessGoal: string,
    dietaryPreferences: string[],
    allergies: string[],
    nutritionGoals?: NutritionGoals
  ): NutritionData[] {
    // Comprehensive null checks for all parameters
    const safeFitnessGoal = fitnessGoal && typeof fitnessGoal === 'string' ? fitnessGoal : 'general_fitness';
    const safeDietaryPreferences = Array.isArray(dietaryPreferences) ? dietaryPreferences.filter(pref => pref && typeof pref === 'string') : [];
    const safeAllergies = Array.isArray(allergies) ? allergies.filter(allergy => allergy && typeof allergy === 'string') : [];
    
    console.log('Getting personalized recommendations for:', {
      safeFitnessGoal,
      safeDietaryPreferences,
      safeAllergies,
      nutritionGoals
    });

    try {
      const recommendations = getRecommendedFoods(safeFitnessGoal, safeDietaryPreferences, safeAllergies);
      
      // Validate that recommendations is an array and filter out invalid items
      if (Array.isArray(recommendations)) {
        return recommendations.filter(item => validateNutritionData(item));
      } else {
        console.warn('getRecommendedFoods did not return an array:', recommendations);
        return [];
      }
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  // Generate a meal plan based on preferences and goals
  generateMealPlan(
    nutritionGoals: NutritionGoals,
    dietaryPreferences: string[],
    allergies: string[],
    mealsPerDay: number = 3
  ): MealPlan {
    // Comprehensive null checks for all parameters
    if (!nutritionGoals || typeof nutritionGoals !== 'object') {
      console.warn('Invalid nutritionGoals provided to generateMealPlan:', nutritionGoals);
      // Provide default nutrition goals
      nutritionGoals = {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 67,
        fiber: 28
      };
    }
    
    // Validate nutrition goals properties
    const safeNutritionGoals: NutritionGoals = {
      calories: typeof nutritionGoals?.calories === 'number' && nutritionGoals.calories > 0 ? nutritionGoals.calories : 2000,
      protein: typeof nutritionGoals?.protein === 'number' && nutritionGoals.protein > 0 ? nutritionGoals.protein : 150,
      carbs: typeof nutritionGoals?.carbs === 'number' && nutritionGoals.carbs > 0 ? nutritionGoals.carbs : 250,
      fat: typeof nutritionGoals?.fat === 'number' && nutritionGoals.fat > 0 ? nutritionGoals.fat : 67,
      fiber: typeof nutritionGoals?.fiber === 'number' && nutritionGoals.fiber > 0 ? nutritionGoals.fiber : 28
    };
    
    const safeDietaryPreferences = Array.isArray(dietaryPreferences) ? dietaryPreferences.filter(pref => pref && typeof pref === 'string') : [];
    const safeAllergies = Array.isArray(allergies) ? allergies.filter(allergy => allergy && typeof allergy === 'string') : [];
    const safeMealsPerDay = typeof mealsPerDay === 'number' && mealsPerDay > 0 && mealsPerDay <= 6 ? mealsPerDay : 3;
    
    console.log('Generating meal plan with safe parameters:', {
      safeNutritionGoals, safeDietaryPreferences, safeAllergies, safeMealsPerDay
    });
    
    try {
      const availableFoods = getRecommendedFoods('general', safeDietaryPreferences, safeAllergies);
      
      // Validate that availableFoods is an array
      if (!Array.isArray(availableFoods)) {
        console.warn('getRecommendedFoods did not return an array:', availableFoods);
        throw new Error('Unable to get available foods');
      }
      
      // Filter out invalid food items
      const validFoods = availableFoods.filter(food => validateNutritionData(food));
      
      if (validFoods.length === 0) {
        console.warn('No valid foods available for meal plan generation');
        throw new Error('No valid foods available');
      }
      
      // Distribute calories across meals
      const caloriesPerMeal = Math.round(safeNutritionGoals.calories / safeMealsPerDay);
      const proteinPerMeal = Math.round(safeNutritionGoals.protein / safeMealsPerDay);
      
      const mealNames = ['Breakfast', 'Lunch', 'Dinner', 'Snack 1', 'Snack 2', 'Snack 3'];
      const mealTimes = ['7:00 AM', '12:00 PM', '6:00 PM', '10:00 AM', '3:00 PM', '8:00 PM'];

      const meals: Meal[] = [];
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFiber = 0;

      for (let i = 0; i < safeMealsPerDay; i++) {
        try {
          const meal = this.generateSingleMeal(
            mealNames[i] || `Meal ${i + 1}`,
            mealTimes[i] || '12:00 PM',
            caloriesPerMeal,
            proteinPerMeal,
            validFoods
          );
          
          if (meal && typeof meal === 'object') {
            meals.push(meal);
            totalCalories += typeof meal.calories === 'number' ? meal.calories : 0;
            totalProtein += typeof meal.protein === 'number' ? meal.protein : 0;
            totalCarbs += typeof meal.carbs === 'number' ? meal.carbs : 0;
            totalFat += typeof meal.fat === 'number' ? meal.fat : 0;
            totalFiber += typeof meal.fiber === 'number' ? meal.fiber : 0;
          } else {
            console.warn('Invalid meal generated for index:', i);
          }
        } catch (error) {
          console.error('Error generating meal at index:', i, error);
        }
      }

      return {
        id: `meal_plan_${Date.now()}`,
        name: 'Personalized Meal Plan',
        meals,
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
        totalFiber: Math.round(totalFiber)
      };
    } catch (error) {
      console.error('Error generating meal plan:', error);
      
      // Return a basic fallback meal plan
      return {
        id: `meal_plan_fallback_${Date.now()}`,
        name: 'Basic Meal Plan',
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0
      };
    }
  }

  private generateSingleMeal(
    name: string,
    time: string,
    targetCalories: number,
    targetProtein: number,
    availableFoods: NutritionData[]
  ): Meal {
    // Comprehensive null checks for all parameters
    const safeName = name && typeof name === 'string' ? name : 'Meal';
    const safeTime = time && typeof time === 'string' ? time : '12:00 PM';
    const safeTargetCalories = typeof targetCalories === 'number' && targetCalories > 0 ? targetCalories : 500;
    const safeTargetProtein = typeof targetProtein === 'number' && targetProtein > 0 ? targetProtein : 25;
    
    // Validate availableFoods array
    if (!Array.isArray(availableFoods)) {
      console.warn('availableFoods is not an array in generateSingleMeal:', availableFoods);
      availableFoods = [];
    }
    
    // Filter out invalid foods and ensure they have required properties
    const validFoods = availableFoods.filter(food => validateNutritionData(food));
    
    if (validFoods.length === 0) {
      console.warn('No valid foods available for meal generation');
      return {
        id: `meal_${Date.now()}_${Math.random()}`,
        name: safeName,
        time: safeTime,
        foods: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      };
    }
    
    const foods: FoodPortion[] = [];
    let currentCalories = 0;
    let currentProtein = 0;
    let currentCarbs = 0;
    let currentFat = 0;
    let currentFiber = 0;

    // Select foods to meet targets with safe property access
    const proteinFoods = validFoods.filter(f => 
      (f?.category === 'protein') || 
      (typeof f?.protein === 'number' && f.protein > 15)
    );
    const carbFoods = validFoods.filter(f => 
      f?.category === 'carbs' || 
      f?.category === 'grains'
    );
    const vegetableFoods = validFoods.filter(f => f?.category === 'vegetables');
    const fatFoods = validFoods.filter(f => f?.category === 'fats');

    // Add protein source with safe property access
    if (proteinFoods.length > 0) {
      const proteinFood = proteinFoods[Math.floor(Math.random() * proteinFoods.length)];
      if (proteinFood && validateNutritionData(proteinFood)) {
        const portion: FoodPortion = {
          food: proteinFood,
          quantity: 1,
          unit: 'serving'
        };
        foods.push(portion);
        currentCalories += typeof proteinFood.calories === 'number' ? proteinFood.calories : 0;
        currentProtein += typeof proteinFood.protein === 'number' ? proteinFood.protein : 0;
        currentCarbs += typeof proteinFood.carbs === 'number' ? proteinFood.carbs : 0;
        currentFat += typeof proteinFood.fat === 'number' ? proteinFood.fat : 0;
        currentFiber += typeof proteinFood.fiber === 'number' ? proteinFood.fiber : 0;
      }
    }

    // Add carb source if calories allow
    if (currentCalories < safeTargetCalories * 0.7 && carbFoods.length > 0) {
      const carbFood = carbFoods[Math.floor(Math.random() * carbFoods.length)];
      if (carbFood && validateNutritionData(carbFood)) {
        const portion: FoodPortion = {
          food: carbFood,
          quantity: 0.5,
          unit: 'serving'
        };
        foods.push(portion);
        currentCalories += (typeof carbFood.calories === 'number' ? carbFood.calories : 0) * 0.5;
        currentProtein += (typeof carbFood.protein === 'number' ? carbFood.protein : 0) * 0.5;
        currentCarbs += (typeof carbFood.carbs === 'number' ? carbFood.carbs : 0) * 0.5;
        currentFat += (typeof carbFood.fat === 'number' ? carbFood.fat : 0) * 0.5;
        currentFiber += (typeof carbFood.fiber === 'number' ? carbFood.fiber : 0) * 0.5;
      }
    }

    // Add vegetables
    if (vegetableFoods.length > 0) {
      const vegetable = vegetableFoods[Math.floor(Math.random() * vegetableFoods.length)];
      if (vegetable && validateNutritionData(vegetable)) {
        const portion: FoodPortion = {
          food: vegetable,
          quantity: 1,
          unit: 'serving'
        };
        foods.push(portion);
        currentCalories += typeof vegetable.calories === 'number' ? vegetable.calories : 0;
        currentProtein += typeof vegetable.protein === 'number' ? vegetable.protein : 0;
        currentCarbs += typeof vegetable.carbs === 'number' ? vegetable.carbs : 0;
        currentFat += typeof vegetable.fat === 'number' ? vegetable.fat : 0;
        currentFiber += typeof vegetable.fiber === 'number' ? vegetable.fiber : 0;
      }
    }

    return {
      id: `meal_${Date.now()}_${Math.random()}`,
      name: safeName,
      time: safeTime,
      foods,
      calories: Math.round(currentCalories),
      protein: Math.round(currentProtein),
      carbs: Math.round(currentCarbs),
      fat: Math.round(currentFat),
      fiber: Math.round(currentFiber)
    };
  }

  // Calculate nutrition for a food portion
  calculatePortionNutrition(food: NutritionData, quantity: number): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } {
    return {
      calories: Math.round(food.calories * quantity),
      protein: Math.round(food.protein * quantity * 10) / 10,
      carbs: Math.round(food.carbs * quantity * 10) / 10,
      fat: Math.round(food.fat * quantity * 10) / 10,
      fiber: Math.round(food.fiber * quantity * 10) / 10,
    };
  }

  // Search foods by name or category
  searchFoods(query: string): NutritionData[] {
    const lowercaseQuery = query.toLowerCase();
    return nutritionDatabase.filter(food =>
      food.name.toLowerCase().includes(lowercaseQuery) ||
      food.category.toLowerCase().includes(lowercaseQuery) ||
      food.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery)) ||
      food.dietaryTags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get foods by category
  getFoodsByCategory(category: string): NutritionData[] {
    return nutritionDatabase.filter(food => 
      food.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get alternative foods for a given food
  getAlternativeFoods(foodId: string): NutritionData[] {
    const food = nutritionDatabase.find(f => f.id === foodId);
    if (!food) return [];

    // Find foods in the same category with similar nutrition profile
    return nutritionDatabase.filter(f => 
      f.id !== foodId && 
      f.category === food.category &&
      Math.abs(f.calories - food.calories) < 100
    ).slice(0, 5);
  }

  // Validate if a food meets dietary restrictions
  validateFoodForDiet(food: NutritionData, dietaryPreferences: string[], allergies: string[]): {
    isValid: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    let isValid = true;

    // Check allergies
    for (const allergen of allergies) {
      if (food.allergens.some(foodAllergen => 
        foodAllergen.toLowerCase().includes(allergen.toLowerCase())
      )) {
        isValid = false;
        reasons.push(`Contains ${allergen}`);
      }
    }

    // Check dietary preferences
    if (dietaryPreferences.includes('Vegan')) {
      if (food.category === 'dairy' || 
          (food.category === 'protein' && !food.dietaryTags.includes('vegan'))) {
        isValid = false;
        reasons.push('Not vegan-friendly');
      }
    }

    if (dietaryPreferences.includes('Vegetarian')) {
      if (food.category === 'protein' && 
          !food.dietaryTags.includes('vegetarian') && 
          !food.dietaryTags.includes('vegan') &&
          food.category !== 'dairy') {
        isValid = false;
        reasons.push('Not vegetarian-friendly');
      }
    }

    if (dietaryPreferences.includes('Keto')) {
      if (food.carbs > 10) {
        isValid = false;
        reasons.push('Too high in carbs for keto');
      }
    }

    if (dietaryPreferences.includes('Gluten Free')) {
      if (food.allergens.includes('Gluten')) {
        isValid = false;
        reasons.push('Contains gluten');
      }
    }

    return { isValid, reasons };
  }
}

// Export singleton instance
export const nutritionService = new NutritionService();

// Helper functions
export const formatMacros = (calories: number, protein: number, carbs: number, fat: number) => {
  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    proteinPercent: Math.round((protein * 4 / calories) * 100),
    carbsPercent: Math.round((carbs * 4 / calories) * 100),
    fatPercent: Math.round((fat * 9 / calories) * 100),
  };
};

export const getMacroColor = (macro: 'protein' | 'carbs' | 'fat'): string => {
  switch (macro) {
    case 'protein':
      return '#D4AF37'; // Gold
    case 'carbs':
      return '#B8860B'; // Dark Goldenrod
    case 'fat':
      return '#F4A460'; // Sandy Brown
    default:
      return '#8B7355'; // Warm grey
  }
};