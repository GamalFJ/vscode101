import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface AIResponse {
  type: 'workout' | 'nutrition' | 'general';
  content: string;
  timestamp: Date;
  isUser?: boolean;
}

interface WorkoutSuggestion {
  name: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: string[];
  focus: string;
}

// Simulated AI responses based on user input
const generateAIResponse = (userInput: string): AIResponse => {
  const lowerInput = userInput.toLowerCase();
  let content = '';
  let type: 'workout' | 'nutrition' | 'general' = 'general';

  if (lowerInput.includes('workout') || lowerInput.includes('exercise')) {
    type = 'workout';
    if (lowerInput.includes('upper body') || lowerInput.includes('arms') || lowerInput.includes('chest')) {
      content = `🏋️ **Upper Body Workout Plan**

**Push Day Routine (45 minutes)**
1. Warm-up: 5 minutes light cardio
2. Bench Press: 4 sets × 8-10 reps
3. Overhead Press: 3 sets × 10-12 reps
4. Incline Dumbbell Press: 3 sets × 10-12 reps
5. Dips: 3 sets × 8-15 reps
6. Push-ups: 2 sets to failure
7. Tricep Extensions: 3 sets × 12-15 reps
8. Cool-down: 5 minutes stretching

💡 **Pro Tips:**
• Rest 60-90 seconds between sets
• Focus on proper form over heavy weight
• Progressive overload each week
• Stay hydrated throughout`;
    } else if (lowerInput.includes('leg') || lowerInput.includes('lower body')) {
      content = `🦵 **Lower Body Power Workout**

**Leg Day Routine (50 minutes)**
1. Warm-up: 5 minutes walking/cycling
2. Squats: 4 sets × 8-12 reps
3. Deadlifts: 4 sets × 6-8 reps
4. Lunges: 3 sets × 10 reps each leg
5. Leg Press: 3 sets × 12-15 reps
6. Calf Raises: 4 sets × 15-20 reps
7. Leg Curls: 3 sets × 10-12 reps
8. Cool-down: 10 minutes stretching

💡 **Key Points:**
• Maintain proper form throughout
• Control the weight on the way down
• Breathe properly during each rep
• Don't skip the warm-up!`;
    } else if (lowerInput.includes('beginner') || lowerInput.includes('start')) {
      content = `🌟 **Perfect for Beginners!**

**Full-Body Starter Routine (30 minutes)**
1. Warm-up: 5 minutes marching in place
2. Bodyweight Squats: 2 sets × 10-15 reps
3. Push-ups (modified if needed): 2 sets × 5-10 reps
4. Plank: 2 sets × 20-30 seconds
5. Lunges: 2 sets × 8 reps each leg
6. Wall Sit: 2 sets × 15-30 seconds
7. Arm Circles: 2 sets × 10 each direction
8. Cool-down: 5 minutes gentle stretching

🎯 **Getting Started:**
• Start with 2-3 sessions per week
• Focus on learning proper form first
• Listen to your body
• Progress gradually`;
    } else if (lowerInput.includes('hiit') || lowerInput.includes('cardio')) {
      content = `🔥 **HIIT Cardio Blast**

**High-Intensity Interval Training (20 minutes)**
1. Warm-up: 3 minutes light movement
2. Circuit (repeat 4 times):
   • Burpees: 30 seconds
   • Rest: 30 seconds
   • Mountain Climbers: 30 seconds
   • Rest: 30 seconds
   • Jump Squats: 30 seconds
   • Rest: 30 seconds
   • High Knees: 30 seconds
   • Rest: 60 seconds
3. Cool-down: 5 minutes walking + stretching

⚡ **HIIT Benefits:**
• Burns calories efficiently
• Improves cardiovascular health
• Boosts metabolism
• Time-efficient workout`;
    } else {
      content = `🏋️ **Workout Options Available**

I can help you create personalized workouts for:

**Strength Training:**
• Upper body focus
• Lower body focus
• Full-body routines
• Push/Pull/Legs split

**Cardio Options:**
• HIIT workouts
• Steady-state cardio
• Circuit training
• Bodyweight cardio

**Specialized Programs:**
• Beginner-friendly routines
• Weight loss focused
• Muscle building
• Flexibility & mobility

What specific type of workout interests you most? I can create a detailed routine based on your goals and fitness level.`;
    }
  } else if (lowerInput.includes('weight loss') || lowerInput.includes('lose weight') || lowerInput.includes('fat')) {
    type = 'nutrition';
    content = `🎯 **Weight Loss Strategy**

**Exercise Approach:**
• Combine cardio (3-4×/week) with strength training (2-3×/week)
• HIIT workouts are excellent for burning calories
• Aim for 150+ minutes of moderate activity weekly
• Include compound movements (squats, deadlifts, etc.)

**Nutrition Guidelines:**
• Create a moderate calorie deficit (300-500 calories)
• Focus on whole foods: lean proteins, vegetables, fruits
• Eat protein with each meal (0.8-1g per lb body weight)
• Stay hydrated (8+ glasses of water daily)
• Limit processed foods and added sugars

**Lifestyle Factors:**
• Get 7-9 hours of quality sleep
• Manage stress through meditation/relaxation
• Track progress with measurements, not just scale
• Be patient and consistent

Would you like me to create a specific workout plan for weight loss?`;
  } else if (lowerInput.includes('nutrition') || lowerInput.includes('diet') || lowerInput.includes('calories')) {
    type = 'nutrition';
    content = `🥗 **Nutrition Fundamentals**

**Macronutrient Targets:**
• Protein: 0.8-1.2g per lb body weight
• Carbs: 2-3g per lb for active individuals
• Fats: 0.3-0.4g per lb body weight

**Meal Timing:**
• Pre-workout: Light carbs + protein (30-60 min before)
• Post-workout: Protein + carbs within 2 hours
• Spread protein throughout the day

**Hydration Guidelines:**
• 8-10 glasses of water daily
• Extra 16-24oz per hour of intense exercise
• Monitor urine color for hydration status

**Quality Food Choices:**
• Lean proteins: chicken, fish, eggs, legumes
• Complex carbs: oats, quinoa, sweet potatoes
• Healthy fats: avocados, nuts, olive oil
• Vegetables: aim for variety and color

What's your specific nutrition goal? I can provide more targeted advice!`;
  } else if (lowerInput.includes('muscle') || lowerInput.includes('gain') || lowerInput.includes('bulk')) {
    type = 'workout';
    content = `💪 **Muscle Building Guide**

**Training Principles:**
• Progressive overload is key
• Focus on compound movements
• Train each muscle group 2-3× per week
• 6-12 rep range for hypertrophy
• Rest 48-72 hours between training same muscles

**Essential Exercises:**
• Squats, Deadlifts, Bench Press
• Pull-ups/Rows, Overhead Press
• Dips, Lunges, Hip Thrusts

**Nutrition for Muscle Gain:**
• Slight calorie surplus (200-500 calories)
• High protein intake (1-1.2g per lb)
• Adequate carbs for energy
• Don't neglect healthy fats

**Recovery:**
• 7-9 hours of sleep nightly
• Manage stress levels
• Stay hydrated
• Consider rest days

Ready to start building muscle? I can create a specific program for you!`;
  } else {
    content = `👋 **Welcome to Your AI Trainer!**

I'm here to help with all your fitness questions! I can assist with:

🏋️ **Workout Planning**
• Custom routines for any goal
• Exercise form and technique
• Progressive training programs

🥗 **Nutrition Guidance**
• Meal planning strategies
• Macronutrient calculations
• Healthy eating habits

📈 **Goal Achievement**
• Weight loss strategies
• Muscle building programs
• Performance improvement

⏰ **Training Tips**
• Workout timing and frequency
• Recovery optimization
• Injury prevention

Try asking me something like:
• "Create a workout for building muscle"
• "How should I eat to lose fat?"
• "What's the best beginner routine?"
• "Help me improve my cardio"

What would you like to know about fitness and health?`;
  }

  return {
    type,
    content,
    timestamp: new Date(),
    isUser: false
  };
};

export default function AITrainerScreen() {
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([
    {
      type: 'general',
      content: '👋 Welcome to your AI Trainer! I can help you create personalized workout routines, provide nutrition advice, and answer fitness questions. What would you like to know?',
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'Create a 30-minute upper body workout',
    'I want to lose weight, what should I do?',
    'Design a beginner full-body routine',
    'How many calories should I eat daily?',
    'What exercises target the core?',
    'Create a HIIT cardio workout'
  ];

  const workoutSuggestions: WorkoutSuggestion[] = [
    {
      name: 'Push Day Power',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: ['Bench Press', 'Overhead Press', 'Dips', 'Push-ups', 'Tricep Extensions'],
      focus: 'Chest, Shoulders, Triceps'
    },
    {
      name: 'Full Body Beginner',
      duration: 30,
      difficulty: 'Beginner',
      exercises: ['Bodyweight Squats', 'Push-ups', 'Plank', 'Lunges', 'Wall Sit'],
      focus: 'Full Body Strength'
    },
    {
      name: 'HIIT Cardio Blast',
      duration: 20,
      difficulty: 'Advanced',
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees', 'Plank Jacks'],
      focus: 'Cardiovascular Endurance'
    }
  ];

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setIsLoading(true);

    // Add user message to responses
    const userResponse: AIResponse = {
      type: 'general',
      content: userMessage,
      timestamp: new Date(),
      isUser: true
    };
    
    setResponses(prev => [...prev, userResponse]);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setResponses(prev => [...prev, aiResponse]);
      setIsLoading(false);
      console.log('AI responded to:', userMessage);
    }, 1000 + Math.random() * 1000); // 1-2 second delay for realism
  };

  const handleQuickPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleStartWorkout = (workout: WorkoutSuggestion) => {
    Alert.alert(
      'Start Workout?',
      `Ready to begin "${workout.name}"? This ${workout.duration}-minute ${workout.difficulty.toLowerCase()} workout focuses on ${workout.focus}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Workout', 
          onPress: () => {
            console.log('Starting workout:', workout.name);
            // TODO: Connect to actual workout system
            router.push('/workouts');
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.warning;
      case 'Advanced': return colors.error;
      default: return colors.primary;
    }
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center', marginBottom: 0 }]}>
          AI Trainer
        </Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'AI Trainer Info',
            'This AI trainer uses simulated responses. In the future, this will connect to a real AI service for personalized fitness guidance.',
            [{ text: 'Got it!' }]
          );
        }}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* AI Suggestions */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Recommended Workouts</Text>
          {workoutSuggestions.map((workout, index) => (
            <View key={index} style={commonStyles.card}>
              <View style={commonStyles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                    {workout.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[commonStyles.textSecondary, { marginRight: 12 }]}>
                      {workout.duration} min
                    </Text>
                    <View style={{
                      backgroundColor: getDifficultyColor(workout.difficulty),
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}>
                      <Text style={[commonStyles.textSecondary, { color: 'white', fontSize: 12 }]}>
                        {workout.difficulty}
                      </Text>
                    </View>
                  </View>
                  <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
                    Focus: {workout.focus}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    {workout.exercises.slice(0, 3).join(', ')}
                    {workout.exercises.length > 3 && ` +${workout.exercises.length - 3} more`}
                  </Text>
                </View>
                <Button
                  text="Start"
                  onPress={() => handleStartWorkout(workout)}
                  style={{ backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, width: 'auto' }}
                  textStyle={{ fontSize: 14 }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Chat Messages */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Chat with AI Trainer</Text>
          {responses.map((response, index) => (
            <View 
              key={index} 
              style={[
                commonStyles.card, 
                response.isUser ? 
                  { backgroundColor: colors.primary, alignSelf: 'flex-end', maxWidth: '80%', marginLeft: '20%' } : 
                  { backgroundColor: colors.backgroundAlt, marginRight: '10%' }
              ]}
            >
              <Text style={[
                commonStyles.text, 
                response.isUser ? { color: 'white' } : { color: colors.text }
              ]}>
                {response.content}
              </Text>
              <Text style={[
                commonStyles.textSecondary, 
                { fontSize: 12, marginTop: 8 },
                response.isUser ? { color: 'rgba(255,255,255,0.7)' } : {}
              ]}>
                {response.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginRight: '10%' }]}>
              <Text style={[commonStyles.text, { fontStyle: 'italic' }]}>
                AI Trainer is thinking...
              </Text>
            </View>
          )}
        </View>

        {/* Quick Prompts */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Quick Questions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: colors.backgroundAlt,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Input Area */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        paddingVertical: 16, 
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'flex-end'
      }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginRight: 12,
            maxHeight: 100,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.backgroundAlt,
          }}
          placeholder="Ask your AI trainer anything..."
          placeholderTextColor={colors.textSecondary}
          value={userInput}
          onChangeText={setUserInput}
          multiline
          textAlignVertical="top"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: 24,
            padding: 12,
            opacity: userInput.trim() && !isLoading ? 1 : 0.5,
          }}
          onPress={handleSendMessage}
          disabled={!userInput.trim() || isLoading}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}