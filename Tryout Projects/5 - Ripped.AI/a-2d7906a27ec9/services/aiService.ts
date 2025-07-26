// AI Service for future integration with external AI APIs
// Currently using simulated responses, but structured for easy API integration

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WorkoutPlan {
  name: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
  focus: string;
  description: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  instructions?: string;
  muscle: string;
}

export interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: Meal[];
}

export interface Meal {
  name: string;
  time: string;
  calories: number;
  foods: string[];
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1'; // Example API endpoint
  
  // Initialize the service with API credentials
  initialize(apiKey: string) {
    this.apiKey = apiKey;
    console.log('AI Service initialized');
  }

  // Simulate AI response for now, replace with actual API call later
  async generateResponse(messages: AIMessage[]): Promise<string> {
    // TODO: Replace with actual API call
    // const response = await this.callAIAPI(messages);
    
    // For now, return simulated response
    return this.simulateAIResponse(messages[messages.length - 1].content);
  }

  // Generate workout plan based on user preferences
  async generateWorkoutPlan(
    goal: string,
    experience: string,
    duration: number,
    equipment: string[]
  ): Promise<WorkoutPlan> {
    // TODO: Replace with actual AI API call
    console.log('Generating workout plan for:', { goal, experience, duration, equipment });
    
    return this.simulateWorkoutPlan(goal, experience, duration);
  }

  // Generate nutrition plan based on user goals
  async generateNutritionPlan(
    goal: string,
    weight: number,
    height: number,
    age: number,
    activityLevel: string
  ): Promise<NutritionPlan> {
    // TODO: Replace with actual AI API call
    console.log('Generating nutrition plan for:', { goal, weight, height, age, activityLevel });
    
    return this.simulateNutritionPlan(goal, weight, activityLevel);
  }

  // Future method for actual API integration
  private async callAIAPI(messages: AIMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI Service not initialized with API key');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // or gpt-4
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API call failed:', error);
      throw new Error('Failed to get AI response');
    }
  }

  // Simulated responses for development
  private simulateAIResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('workout') || lowerInput.includes('exercise')) {
      return this.getWorkoutResponse(lowerInput);
    } else if (lowerInput.includes('nutrition') || lowerInput.includes('diet')) {
      return this.getNutritionResponse(lowerInput);
    } else if (lowerInput.includes('motivation') || lowerInput.includes('help')) {
      return this.getMotivationResponse();
    } else {
      return this.getGeneralResponse();
    }
  }

  private getWorkoutResponse(input: string): string {
    if (input.includes('beginner')) {
      return `🌟 **Perfect for Beginners!**

Here's a simple full-body routine to get you started:

**Beginner Workout (30 minutes)**
1. Warm-up: 5 minutes light movement
2. Bodyweight Squats: 2 sets × 10-15 reps
3. Push-ups (modified if needed): 2 sets × 5-10 reps
4. Plank: 2 sets × 20-30 seconds
5. Lunges: 2 sets × 8 reps each leg
6. Wall Sit: 2 sets × 15-30 seconds
7. Cool-down: 5 minutes stretching

Start with 2-3 sessions per week and focus on proper form!`;
    } else if (input.includes('upper body')) {
      return `💪 **Upper Body Strength Workout**

**Push Day Routine (45 minutes)**
1. Warm-up: 5 minutes
2. Bench Press: 4 sets × 8-10 reps
3. Overhead Press: 3 sets × 10-12 reps
4. Dips: 3 sets × 8-15 reps
5. Push-ups: 2 sets to failure
6. Tricep Extensions: 3 sets × 12-15 reps
7. Cool-down: 5 minutes

Rest 60-90 seconds between sets!`;
    } else {
      return `I can help you create a personalized workout! What's your fitness goal and experience level?`;
    }
  }

  private getNutritionResponse(input: string): string {
    return `🥗 **Nutrition Guidance**

**Key Principles:**
• Eat in a slight calorie deficit for weight loss
• Consume 0.8-1.2g protein per lb body weight
• Include complex carbs for energy
• Don't forget healthy fats

**Meal Timing:**
• Pre-workout: Light carbs + protein
• Post-workout: Protein + carbs within 2 hours
• Stay hydrated throughout the day

Would you like a specific meal plan based on your goals?`;
  }

  private getMotivationResponse(): string {
    const motivationalQuotes = [
      "💪 Every workout is a step closer to your goals!",
      "🔥 Consistency beats perfection every time!",
      "⭐ You're stronger than you think!",
      "🎯 Progress, not perfection!",
      "💯 Your only competition is who you were yesterday!"
    ];
    
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }

  private getGeneralResponse(): string {
    return `👋 I'm here to help with your fitness journey! I can assist with:

🏋️ **Workout Planning** - Custom routines for any goal
🥗 **Nutrition Advice** - Meal planning and dietary guidance
📈 **Progress Tracking** - Help you stay on track
💡 **Fitness Tips** - Best practices and motivation

What would you like to know about?`;
  }

  private simulateWorkoutPlan(goal: string, experience: string, duration: number): WorkoutPlan {
    const exercises: Exercise[] = [
      {
        name: 'Squats',
        sets: 3,
        reps: '10-12',
        restTime: 60,
        muscle: 'Legs',
        instructions: 'Keep your back straight and lower until thighs are parallel to the floor.'
      },
      {
        name: 'Push-ups',
        sets: 3,
        reps: '8-15',
        restTime: 45,
        muscle: 'Chest',
        instructions: 'Maintain a straight line from head to heels.'
      },
      {
        name: 'Plank',
        sets: 3,
        reps: '30-60 seconds',
        restTime: 30,
        muscle: 'Core',
        instructions: 'Keep your core tight and body in a straight line.'
      }
    ];

    return {
      name: `${experience} ${goal} Workout`,
      duration,
      difficulty: experience as 'Beginner' | 'Intermediate' | 'Advanced',
      exercises,
      focus: 'Full Body',
      description: `A ${duration}-minute ${experience.toLowerCase()} workout focused on ${goal.toLowerCase()}.`
    };
  }

  private simulateNutritionPlan(goal: string, weight: number, activityLevel: string): NutritionPlan {
    const baseCalories = weight * (activityLevel === 'high' ? 16 : activityLevel === 'medium' ? 14 : 12);
    const calories = goal.includes('loss') ? baseCalories - 300 : baseCalories + 200;
    
    return {
      calories,
      protein: Math.round(weight * 1.2),
      carbs: Math.round(calories * 0.4 / 4),
      fats: Math.round(calories * 0.25 / 9),
      meals: [
        {
          name: 'Breakfast',
          time: '7:00 AM',
          calories: Math.round(calories * 0.25),
          foods: ['Oatmeal', 'Berries', 'Greek Yogurt']
        },
        {
          name: 'Lunch',
          time: '12:00 PM',
          calories: Math.round(calories * 0.35),
          foods: ['Grilled Chicken', 'Brown Rice', 'Vegetables']
        },
        {
          name: 'Dinner',
          time: '6:00 PM',
          calories: Math.round(calories * 0.4),
          foods: ['Salmon', 'Sweet Potato', 'Salad']
        }
      ]
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

// Helper function to format AI responses for display
export const formatAIResponse = (response: string): string => {
  // Add any formatting logic here (e.g., markdown parsing)
  return response;
};

// Helper function to validate user input
export const validateUserInput = (input: string): boolean => {
  return input.trim().length > 0 && input.length <= 500;
};

// Helper function to extract workout parameters from user input
export const extractWorkoutParameters = (input: string) => {
  const lowerInput = input.toLowerCase();
  
  return {
    goal: lowerInput.includes('weight loss') ? 'weight loss' :
          lowerInput.includes('muscle') ? 'muscle building' :
          lowerInput.includes('strength') ? 'strength' : 'general fitness',
    experience: lowerInput.includes('beginner') ? 'Beginner' :
               lowerInput.includes('advanced') ? 'Advanced' : 'Intermediate',
    duration: lowerInput.includes('30') ? 30 :
             lowerInput.includes('45') ? 45 :
             lowerInput.includes('60') ? 60 : 30,
    bodyPart: lowerInput.includes('upper') ? 'upper body' :
             lowerInput.includes('lower') ? 'lower body' :
             lowerInput.includes('core') ? 'core' : 'full body'
  };
};