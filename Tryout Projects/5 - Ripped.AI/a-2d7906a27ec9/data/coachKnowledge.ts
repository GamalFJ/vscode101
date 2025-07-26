export interface FitnessKnowledge {
  category: string;
  topics: {
    [key: string]: {
      title: string;
      content: string;
      tags: string[];
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    };
  };
}

export const fitnessKnowledge: FitnessKnowledge[] = [
  {
    category: 'nutrition',
    topics: {
      muscle_recovery: {
        title: 'Muscle Recovery Nutrition',
        content: `Great question about muscle recovery! Here are my top recommendations:

🥩 **Protein**: Aim for 20-30g within 2 hours post-workout. Try lean meats, Greek yogurt, or protein shakes.

🍌 **Carbs**: Replenish glycogen with fruits like bananas or berries.

💧 **Hydration**: Drink plenty of water and consider electrolyte replacement.

😴 **Sleep**: 7-9 hours of quality sleep is when most muscle repair happens.

🧊 **Active Recovery**: Light stretching or walking can help reduce soreness.

Would you like me to create a specific post-workout meal plan for you?`,
        tags: ['recovery', 'protein', 'post-workout', 'muscle'],
        difficulty: 'beginner',
      },
      pre_workout: {
        title: 'Pre-Workout Nutrition',
        content: `Perfect timing for fuel! Here's my pre-workout nutrition guide:

⏰ **Timing**: Eat 30-60 minutes before training.

🍌 **Quick Carbs**: Banana, dates, or oatmeal for immediate energy.

☕ **Caffeine**: Coffee or green tea can boost performance (if tolerated).

💧 **Hydration**: 16-20oz water 2-3 hours before, 8oz right before.

🚫 **Avoid**: High fat/fiber foods that might cause discomfort.

**Quick Options**:
• Banana + almond butter
• Greek yogurt + berries
• Oatmeal + honey
• Apple + small handful of nuts

What type of workout are you planning? I can give more specific recommendations!`,
        tags: ['pre-workout', 'energy', 'timing', 'carbs'],
        difficulty: 'beginner',
      },
      protein_requirements: {
        title: 'Daily Protein Requirements',
        content: `Great question about protein needs! Here's my breakdown:

🎯 **General Guidelines**:
• Sedentary: 0.8g per kg body weight
• Active: 1.2-1.6g per kg
• Strength training: 1.6-2.2g per kg
• Endurance athletes: 1.2-1.4g per kg

📊 **Example**: 70kg person doing strength training = 112-154g protein daily

🥩 **Quality Sources**:
• Lean meats, fish, eggs
• Greek yogurt, cottage cheese
• Legumes, quinoa
• Protein powder (if needed)

⏰ **Timing**: Spread throughout the day, 20-30g per meal.

🔄 **Post-Workout**: Within 2 hours for optimal recovery.

What's your current weight and training style? I can calculate your specific needs!`,
        tags: ['protein', 'daily', 'requirements', 'calculation'],
        difficulty: 'intermediate',
      },
      weight_loss_nutrition: {
        title: 'Weight Loss Nutrition Strategy',
        content: `Effective weight loss combines smart training and nutrition! Here's my strategy:

🔥 **Cardio + Strength**: Mix both for maximum calorie burn and muscle preservation.

🍽️ **Caloric Deficit**: Eat 300-500 calories below maintenance (I can help calculate this).

⏱️ **HIIT Training**: High-intensity intervals are very effective for fat loss.

🥗 **Whole Foods**: Focus on lean proteins, vegetables, and complex carbs.

📊 **Track Progress**: Use measurements, not just the scale.

💧 **Stay Hydrated**: Often thirst is mistaken for hunger.

What's your current activity level? I can create a personalized plan!`,
        tags: ['weight loss', 'deficit', 'calories', 'fat loss'],
        difficulty: 'intermediate',
      },
    },
  },
  {
    category: 'workouts',
    topics: {
      beginner_guide: {
        title: 'Beginner Workout Guide',
        content: `Welcome to your fitness journey! Here's my beginner-friendly approach:

🏃‍♀️ **Start Slow**: 2-3 workouts per week, 20-30 minutes each.

💪 **Focus on Form**: Master bodyweight exercises first:
• Push-ups (or knee push-ups)
• Squats
• Planks
• Walking/light jogging

📈 **Progressive Overload**: Gradually increase intensity each week.

🎯 **Set Realistic Goals**: Focus on consistency over intensity.

⏰ **Rest Days**: Allow 48 hours between strength sessions.

Would you like me to create a specific 4-week beginner program for you?`,
        tags: ['beginner', 'start', 'bodyweight', 'form'],
        difficulty: 'beginner',
      },
      injury_prevention: {
        title: 'Injury Prevention Protocol',
        content: `Smart thinking about injury prevention! Here's my protection protocol:

🔥 **Warm-Up**: Always start with 5-10 minutes of light movement.

🧘‍♀️ **Mobility**: Daily stretching and foam rolling.

📈 **Progressive Loading**: Increase intensity gradually (10% rule).

💪 **Balanced Training**: Don't neglect opposing muscle groups.

😴 **Recovery**: Rest days are when your body adapts and strengthens.

🎯 **Proper Form**: Quality over quantity, always.

⚠️ **Listen to Your Body**: Pain is different from muscle fatigue.

🏃‍♀️ **Cross-Training**: Vary your activities to prevent overuse.

Are you experiencing any specific discomfort, or looking for general prevention strategies?`,
        tags: ['injury', 'prevention', 'warm-up', 'form'],
        difficulty: 'beginner',
      },
      strength_training: {
        title: 'Strength Training Fundamentals',
        content: `Let's build some serious strength! Here's my approach:

🏋️‍♀️ **Compound Movements**: Focus on squats, deadlifts, bench press, rows.

📊 **Rep Ranges**:
• Strength: 1-5 reps at 85-95% 1RM
• Hypertrophy: 6-12 reps at 70-85% 1RM
• Endurance: 12+ reps at 50-70% 1RM

⏱️ **Rest Periods**:
• Strength: 3-5 minutes
• Hypertrophy: 1-3 minutes
• Endurance: 30-90 seconds

📈 **Progressive Overload**: Increase weight, reps, or sets weekly.

🎯 **Form First**: Master technique before adding weight.

What's your current strength training experience?`,
        tags: ['strength', 'compound', 'progressive overload', 'reps'],
        difficulty: 'intermediate',
      },
    },
  },
  {
    category: 'recovery',
    topics: {
      sleep_optimization: {
        title: 'Sleep for Recovery',
        content: `Quality sleep is when the magic happens! Here's my sleep optimization guide:

😴 **Duration**: Aim for 7-9 hours per night.

🌙 **Sleep Hygiene**:
• Cool, dark room (65-68°F)
• No screens 1 hour before bed
• Consistent sleep/wake times
• Comfortable mattress and pillows

🧘‍♀️ **Pre-Sleep Routine**:
• Light stretching or meditation
• Reading or journaling
• Herbal tea (chamomile, valerian)

💪 **Recovery Benefits**:
• Muscle protein synthesis
• Growth hormone release
• Mental recovery
• Immune system support

Having trouble sleeping? Let's troubleshoot your routine!`,
        tags: ['sleep', 'recovery', 'hygiene', 'growth hormone'],
        difficulty: 'beginner',
      },
      active_recovery: {
        title: 'Active Recovery Methods',
        content: `Recovery doesn't mean being sedentary! Here's my active recovery toolkit:

🚶‍♀️ **Light Movement**:
• 20-30 minute walks
• Easy swimming
• Gentle yoga or stretching
• Foam rolling

🧊 **Temperature Therapy**:
• Cold showers (2-3 minutes)
• Ice baths (10-15 minutes)
• Contrast showers (hot/cold)
• Sauna sessions (15-20 minutes)

🧘‍♀️ **Stress Management**:
• Meditation or mindfulness
• Deep breathing exercises
• Nature walks
• Massage therapy

💧 **Hydration**: Maintain electrolyte balance throughout the day.

What type of recovery feels best for your body?`,
        tags: ['active recovery', 'movement', 'stress', 'hydration'],
        difficulty: 'beginner',
      },
    },
  },
];

export const getKnowledgeByTags = (tags: string[]): any[] => {
  const results: any[] = [];
  
  fitnessKnowledge.forEach(category => {
    Object.entries(category.topics).forEach(([key, topic]) => {
      const hasMatchingTag = tags.some(tag => 
        topic.tags.some(topicTag => 
          topicTag.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(topicTag.toLowerCase())
        )
      );
      
      if (hasMatchingTag) {
        results.push({
          key,
          category: category.category,
          ...topic,
        });
      }
    });
  });
  
  return results;
};

export const searchKnowledge = (query: string): any[] => {
  const searchTerms = query.toLowerCase().split(' ');
  const results: any[] = [];
  
  fitnessKnowledge.forEach(category => {
    Object.entries(category.topics).forEach(([key, topic]) => {
      const searchableText = `${topic.title} ${topic.content} ${topic.tags.join(' ')}`.toLowerCase();
      
      const hasMatch = searchTerms.some(term => 
        searchableText.includes(term) && term.length > 2
      );
      
      if (hasMatch) {
        results.push({
          key,
          category: category.category,
          ...topic,
        });
      }
    });
  });
  
  return results;
};