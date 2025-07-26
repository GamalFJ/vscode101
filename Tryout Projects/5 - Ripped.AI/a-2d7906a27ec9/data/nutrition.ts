export interface NutritionData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'fats' | 'dairy' | 'grains' | 'legumes';
  subcategory?: string;
  benefits: string[];
  allergens: string[];
  dietaryTags: string[];
  alternatives: string[];
  preparationTips?: string[];
  bestPairedWith?: string[];
}

export const nutritionDatabase: NutritionData[] = [
  // Protein Sources
  {
    id: 'protein_1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: '100g',
    category: 'protein',
    subcategory: 'lean meat',
    benefits: [
      'High-quality complete protein',
      'Rich in B vitamins',
      'Low in saturated fat',
      'Supports muscle growth and repair'
    ],
    allergens: [],
    dietaryTags: ['high-protein', 'low-carb', 'keto-friendly'],
    alternatives: ['Turkey breast', 'Lean beef', 'Fish', 'Tofu'],
    preparationTips: [
      'Marinate for extra flavor',
      'Cook to internal temperature of 165°F',
      'Let rest before slicing'
    ],
    bestPairedWith: ['Brown rice', 'Sweet potato', 'Steamed vegetables']
  },
  {
    id: 'protein_2',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: '100g',
    category: 'protein',
    subcategory: 'fatty fish',
    benefits: [
      'Rich in omega-3 fatty acids',
      'High-quality protein',
      'Supports heart health',
      'Good source of vitamin D'
    ],
    allergens: ['Fish'],
    dietaryTags: ['high-protein', 'omega-3', 'keto-friendly'],
    alternatives: ['Mackerel', 'Sardines', 'Tuna', 'Trout'],
    preparationTips: [
      'Cook skin-side down first',
      'Don&apos;t overcook to maintain moisture',
      'Season with herbs and lemon'
    ],
    bestPairedWith: ['Quinoa', 'Asparagus', 'Sweet potato']
  },
  {
    id: 'protein_3',
    name: 'Greek Yogurt (Plain)',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 6,
    sodium: 56,
    servingSize: '170g container',
    category: 'dairy',
    subcategory: 'fermented dairy',
    benefits: [
      'High protein content',
      'Probiotics for gut health',
      'Calcium for bone health',
      'Versatile ingredient'
    ],
    allergens: ['Dairy'],
    dietaryTags: ['high-protein', 'probiotic', 'vegetarian'],
    alternatives: ['Cottage cheese', 'Skyr', 'Plant-based yogurt', 'Kefir'],
    preparationTips: [
      'Add fresh fruits for natural sweetness',
      'Use as base for smoothies',
      'Mix with nuts and seeds'
    ],
    bestPairedWith: ['Berries', 'Nuts', 'Honey', 'Granola']
  },
  {
    id: 'protein_4',
    name: 'Tofu (Firm)',
    calories: 144,
    protein: 17,
    carbs: 3,
    fat: 9,
    fiber: 2,
    sugar: 1,
    sodium: 7,
    servingSize: '100g',
    category: 'protein',
    subcategory: 'plant protein',
    benefits: [
      'Complete plant protein',
      'Contains isoflavones',
      'Low in saturated fat',
      'Versatile cooking ingredient'
    ],
    allergens: ['Soy'],
    dietaryTags: ['vegan', 'vegetarian', 'plant-based', 'high-protein'],
    alternatives: ['Tempeh', 'Seitan', 'Lentils', 'Chickpeas'],
    preparationTips: [
      'Press to remove excess water',
      'Marinate for better flavor',
      'Pan-fry for crispy texture'
    ],
    bestPairedWith: ['Stir-fried vegetables', 'Brown rice', 'Soy sauce']
  },

  // Carbohydrate Sources
  {
    id: 'carbs_1',
    name: 'Quinoa (Cooked)',
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 3.6,
    fiber: 5,
    sugar: 2,
    sodium: 13,
    servingSize: '1 cup (185g)',
    category: 'grains',
    subcategory: 'ancient grain',
    benefits: [
      'Complete protein source',
      'High in fiber',
      'Gluten-free',
      'Rich in minerals'
    ],
    allergens: [],
    dietaryTags: ['gluten-free', 'high-fiber', 'complete-protein', 'vegetarian', 'vegan'],
    alternatives: ['Brown rice', 'Wild rice', 'Bulgur', 'Farro'],
    preparationTips: [
      'Rinse before cooking to remove bitterness',
      'Use 2:1 water to quinoa ratio',
      'Fluff with fork when done'
    ],
    bestPairedWith: ['Grilled chicken', 'Roasted vegetables', 'Black beans']
  },
  {
    id: 'carbs_2',
    name: 'Sweet Potato (Baked)',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    fiber: 3.9,
    sugar: 5.4,
    sodium: 7,
    servingSize: '1 medium (128g)',
    category: 'carbs',
    subcategory: 'root vegetable',
    benefits: [
      'High in beta-carotene',
      'Good source of fiber',
      'Natural sweetness',
      'Rich in potassium'
    ],
    allergens: [],
    dietaryTags: ['high-fiber', 'vitamin-a', 'vegetarian', 'vegan', 'paleo'],
    alternatives: ['Regular potato', 'Butternut squash', 'Carrots', 'Pumpkin'],
    preparationTips: [
      'Pierce skin before baking',
      'Bake at 425°F for 45-60 minutes',
      'Top with cinnamon or herbs'
    ],
    bestPairedWith: ['Grilled protein', 'Black beans', 'Spinach salad']
  },
  {
    id: 'carbs_3',
    name: 'Oats (Rolled, Dry)',
    calories: 389,
    protein: 17,
    carbs: 66,
    fat: 7,
    fiber: 11,
    sugar: 1,
    sodium: 2,
    servingSize: '100g',
    category: 'grains',
    subcategory: 'whole grain',
    benefits: [
      'High in soluble fiber',
      'Helps lower cholesterol',
      'Sustained energy release',
      'Heart-healthy'
    ],
    allergens: ['Gluten (may contain)'],
    dietaryTags: ['high-fiber', 'heart-healthy', 'vegetarian', 'vegan'],
    alternatives: ['Quinoa flakes', 'Buckwheat', 'Chia seeds', 'Millet'],
    preparationTips: [
      'Soak overnight for easier digestion',
      'Add fruits and nuts for flavor',
      'Cook with milk or plant milk'
    ],
    bestPairedWith: ['Berries', 'Nuts', 'Greek yogurt', 'Banana']
  },

  // Healthy Fats
  {
    id: 'fats_1',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    fiber: 7,
    sugar: 1,
    sodium: 7,
    servingSize: '1/2 medium (100g)',
    category: 'fats',
    subcategory: 'monounsaturated fat',
    benefits: [
      'Rich in monounsaturated fats',
      'High in potassium',
      'Supports heart health',
      'Helps nutrient absorption'
    ],
    allergens: [],
    dietaryTags: ['keto-friendly', 'heart-healthy', 'vegetarian', 'vegan', 'paleo'],
    alternatives: ['Olive oil', 'Nuts', 'Seeds', 'Olives'],
    preparationTips: [
      'Choose ripe but firm avocados',
      'Add lemon juice to prevent browning',
      'Mash for guacamole or spread'
    ],
    bestPairedWith: ['Toast', 'Salads', 'Eggs', 'Lime and cilantro']
  },
  {
    id: 'fats_2',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    sugar: 4,
    sodium: 1,
    servingSize: '100g',
    category: 'fats',
    subcategory: 'tree nuts',
    benefits: [
      'High in vitamin E',
      'Good source of magnesium',
      'Heart-healthy fats',
      'May help with weight management'
    ],
    allergens: ['Tree nuts'],
    dietaryTags: ['keto-friendly', 'high-protein', 'vegetarian', 'vegan', 'paleo'],
    alternatives: ['Walnuts', 'Cashews', 'Pistachios', 'Sunflower seeds'],
    preparationTips: [
      'Soak overnight for easier digestion',
      'Roast for enhanced flavor',
      'Portion control - small handful per serving'
    ],
    bestPairedWith: ['Greek yogurt', 'Oatmeal', 'Salads', 'Dark chocolate']
  },

  // Vegetables
  {
    id: 'vegetables_1',
    name: 'Spinach (Raw)',
    calories: 23,
    protein: 3,
    carbs: 4,
    fat: 0.4,
    fiber: 2,
    sugar: 0.4,
    sodium: 79,
    servingSize: '100g',
    category: 'vegetables',
    subcategory: 'leafy greens',
    benefits: [
      'Rich in iron and folate',
      'High in antioxidants',
      'Low in calories',
      'Supports eye health'
    ],
    allergens: [],
    dietaryTags: ['low-calorie', 'nutrient-dense', 'vegetarian', 'vegan', 'keto-friendly'],
    alternatives: ['Kale', 'Arugula', 'Swiss chard', 'Romaine lettuce'],
    preparationTips: [
      'Wash thoroughly before eating',
      'Add to smoothies for nutrition boost',
      'Sauté quickly to retain nutrients'
    ],
    bestPairedWith: ['Eggs', 'Feta cheese', 'Strawberries', 'Nuts']
  },
  {
    id: 'vegetables_2',
    name: 'Broccoli (Steamed)',
    calories: 35,
    protein: 3,
    carbs: 7,
    fat: 0.4,
    fiber: 3,
    sugar: 2,
    sodium: 41,
    servingSize: '100g',
    category: 'vegetables',
    subcategory: 'cruciferous',
    benefits: [
      'High in vitamin C',
      'Contains sulforaphane',
      'Good source of fiber',
      'May have anti-cancer properties'
    ],
    allergens: [],
    dietaryTags: ['low-calorie', 'high-fiber', 'vegetarian', 'vegan', 'keto-friendly'],
    alternatives: ['Cauliflower', 'Brussels sprouts', 'Cabbage', 'Bok choy'],
    preparationTips: [
      'Steam for 3-5 minutes to retain crunch',
      'Don&apos;t overcook to preserve nutrients',
      'Season with garlic and lemon'
    ],
    bestPairedWith: ['Grilled chicken', 'Brown rice', 'Cheese sauce', 'Almonds']
  },

  // Fruits
  {
    id: 'fruits_1',
    name: 'Blueberries',
    calories: 84,
    protein: 1,
    carbs: 21,
    fat: 0.5,
    fiber: 4,
    sugar: 15,
    sodium: 1,
    servingSize: '1 cup (148g)',
    category: 'fruits',
    subcategory: 'berries',
    benefits: [
      'High in antioxidants',
      'Supports brain health',
      'May improve memory',
      'Anti-inflammatory properties'
    ],
    allergens: [],
    dietaryTags: ['antioxidant-rich', 'low-calorie', 'vegetarian', 'vegan', 'paleo'],
    alternatives: ['Strawberries', 'Raspberries', 'Blackberries', 'Cherries'],
    preparationTips: [
      'Rinse gently before eating',
      'Freeze for smoothies',
      'Add to oatmeal or yogurt'
    ],
    bestPairedWith: ['Greek yogurt', 'Oatmeal', 'Pancakes', 'Spinach salad']
  },
  {
    id: 'fruits_2',
    name: 'Banana',
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0.4,
    fiber: 3,
    sugar: 14,
    sodium: 1,
    servingSize: '1 medium (118g)',
    category: 'fruits',
    subcategory: 'tropical fruit',
    benefits: [
      'High in potassium',
      'Natural energy source',
      'Supports heart health',
      'Good pre-workout snack'
    ],
    allergens: [],
    dietaryTags: ['natural-energy', 'potassium-rich', 'vegetarian', 'vegan', 'paleo'],
    alternatives: ['Apple', 'Pear', 'Mango', 'Dates'],
    preparationTips: [
      'Choose yellow with small brown spots for ripeness',
      'Freeze for smoothies',
      'Mash for baking substitute'
    ],
    bestPairedWith: ['Peanut butter', 'Oatmeal', 'Protein smoothies', 'Dark chocolate']
  },

  // Legumes
  {
    id: 'legumes_1',
    name: 'Black Beans (Cooked)',
    calories: 132,
    protein: 9,
    carbs: 24,
    fat: 0.5,
    fiber: 9,
    sugar: 0.3,
    sodium: 2,
    servingSize: '100g',
    category: 'legumes',
    subcategory: 'beans',
    benefits: [
      'High in protein and fiber',
      'Rich in folate',
      'May help stabilize blood sugar',
      'Good source of iron'
    ],
    allergens: [],
    dietaryTags: ['high-protein', 'high-fiber', 'vegetarian', 'vegan', 'gluten-free'],
    alternatives: ['Kidney beans', 'Pinto beans', 'Chickpeas', 'Lentils'],
    preparationTips: [
      'Soak dried beans overnight',
      'Rinse canned beans to reduce sodium',
      'Season with cumin and garlic'
    ],
    bestPairedWith: ['Brown rice', 'Quinoa', 'Avocado', 'Salsa']
  }
];

export const getNutritionByCategory = (category: string): NutritionData[] => {
  const safeCategory = category && typeof category === 'string' ? category.trim() : '';
  
  if (!safeCategory) {
    return [];
  }
  
  return nutritionDatabase.filter(item => 
    item && 
    typeof item === 'object' &&
    item?.category && 
    typeof item.category === 'string' &&
    item.category.toLowerCase() === safeCategory.toLowerCase()
  );
};

export const getNutritionByDietaryTag = (tag: string): NutritionData[] => {
  const safeTag = tag && typeof tag === 'string' ? tag.trim() : '';
  
  if (!safeTag) {
    return [];
  }
  
  return nutritionDatabase.filter(item => 
    item && 
    typeof item === 'object' &&
    Array.isArray(item?.dietaryTags) &&
    item.dietaryTags.some(dietTag => 
      dietTag && 
      typeof dietTag === 'string' &&
      dietTag.toLowerCase().includes(safeTag.toLowerCase())
    )
  );
};

export const getNutritionWithoutAllergens = (allergens: string[]): NutritionData[] => {
  const safeAllergens = Array.isArray(allergens) ? allergens : [];
  
  return nutritionDatabase.filter(item => 
    item && Array.isArray(item?.allergens) && (
      !item.allergens.some(allergen => 
        allergen && typeof allergen === 'string' &&
        safeAllergens.some(userAllergen => 
          userAllergen && typeof userAllergen === 'string' &&
          allergen.toLowerCase().includes(userAllergen.toLowerCase())
        )
      )
    )
  );
};

export const searchNutrition = (query: string): NutritionData[] => {
  const safeQuery = query && typeof query === 'string' ? query.trim() : '';
  
  if (!safeQuery) {
    return [];
  }
  
  const lowercaseQuery = safeQuery.toLowerCase();
  
  return nutritionDatabase.filter(item => {
    if (!item || typeof item !== 'object') {
      return false;
    }
    
    const name = item?.name && typeof item.name === 'string' ? item.name.toLowerCase() : '';
    const category = item?.category && typeof item.category === 'string' ? item.category.toLowerCase() : '';
    const benefits = Array.isArray(item?.benefits) ? item.benefits : [];
    const dietaryTags = Array.isArray(item?.dietaryTags) ? item.dietaryTags : [];
    
    return name.includes(lowercaseQuery) ||
           benefits.some(benefit => 
             benefit && typeof benefit === 'string' && benefit.toLowerCase().includes(lowercaseQuery)
           ) ||
           category.includes(lowercaseQuery) ||
           dietaryTags.some(tag => 
             tag && typeof tag === 'string' && tag.toLowerCase().includes(lowercaseQuery)
           );
  });
};

export const getRecommendedFoods = (
  goal: string,
  dietaryPreferences: string[],
  allergies: string[]
): NutritionData[] => {
  // Ensure parameters are valid with safe fallbacks
  const safeGoal = goal && typeof goal === 'string' ? goal : 'general_fitness';
  const safeDietaryPreferences = Array.isArray(dietaryPreferences) ? dietaryPreferences : [];
  const safeAllergies = Array.isArray(allergies) ? allergies : [];
  
  let filtered = getNutritionWithoutAllergens(safeAllergies);

  // Filter by dietary preferences
  if (safeDietaryPreferences.includes('Vegan')) {
    filtered = filtered.filter(item => 
      item?.dietaryTags?.includes('vegan') || 
      ['vegetables', 'fruits', 'grains', 'legumes'].includes(item?.category)
    );
  } else if (safeDietaryPreferences.includes('Vegetarian')) {
    filtered = filtered.filter(item => 
      item && (
        (Array.isArray(item?.dietaryTags) && item.dietaryTags.includes('vegetarian')) || 
        item?.category !== 'protein' || 
        item?.subcategory === 'plant protein' ||
        item?.category === 'dairy'
      )
    );
  }

  if (safeDietaryPreferences.includes('Keto')) {
    filtered = filtered.filter(item => 
      item && (
        (Array.isArray(item?.dietaryTags) && item.dietaryTags.includes('keto-friendly')) || 
        (typeof item?.carbs === 'number' && item.carbs < 10)
      )
    );
  }

  if (safeDietaryPreferences.includes('High Protein')) {
    filtered = filtered.filter(item => 
      item && (
        (typeof item?.protein === 'number' && item.protein > 15) || 
        (Array.isArray(item?.dietaryTags) && item.dietaryTags.includes('high-protein'))
      )
    );
  }

  if (safeDietaryPreferences.includes('Gluten Free')) {
    filtered = filtered.filter(item => 
      item && (
        !(Array.isArray(item?.allergens) && item.allergens.includes('Gluten')) && 
        ((Array.isArray(item?.dietaryTags) && item.dietaryTags.includes('gluten-free')) || 
         ['vegetables', 'fruits', 'fats', 'dairy'].includes(item?.category))
      )
    );
  }

  // Filter by fitness goal
  if (safeGoal.toLowerCase().includes('weight loss')) {
    filtered = filtered.filter(item => 
      item && (
        (typeof item?.calories === 'number' && item.calories < 200) || 
        (Array.isArray(item?.dietaryTags) && item.dietaryTags.includes('low-calorie')) ||
        item?.category === 'vegetables'
      )
    );
  } else if (safeGoal.toLowerCase().includes('muscle')) {
    filtered = filtered.filter(item => 
      item && (
        (typeof item?.protein === 'number' && item.protein > 10) || 
        (Array.isArray(item?.dietaryTags) && item.dietaryTags.includes('high-protein'))
      )
    );
  }

  return filtered.slice(0, 10); // Return top 10 recommendations
};