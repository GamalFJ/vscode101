import { exercisesData, Exercise } from '../data/exercises';

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  exercises: WorkoutExercise[];
  description: string;
  targetMuscles: string[];
  estimatedCalories: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  muscle: string;
  instructions: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
}

export interface WeeklyWorkoutPlan {
  id: string;
  goal: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration: number;
  workouts: DayWorkout[];
  restDays: number[];
  description: string;
  tips: string[];
}

export interface DayWorkout {
  day: number;
  name: string;
  focus: string;
  duration: number;
  exercises: WorkoutExercise[];
  isRestDay: boolean;
  activeRecovery?: string[];
}

export class WorkoutGenerator {
  private static muscleGroups = {
    push: ['Chest', 'Shoulders', 'Arms'],
    pull: ['Back', 'Arms'],
    legs: ['Legs'],
    core: ['Core'],
    cardio: ['Cardio']
  };

  private static goalConfigs = {
    fat_loss: {
      setsRange: [3, 4],
      repsRange: ['12-15', '15-20', '20-25'],
      restTime: [30, 45, 60],
      workoutDays: 5,
      cardioRatio: 0.4,
      strengthRatio: 0.6,
      focusAreas: ['Full Body', 'HIIT', 'Circuit Training']
    },
    strength: {
      setsRange: [3, 5],
      repsRange: ['3-5', '5-6', '6-8'],
      restTime: [120, 180, 240],
      workoutDays: 4,
      cardioRatio: 0.1,
      strengthRatio: 0.9,
      focusAreas: ['Compound Movements', 'Progressive Overload']
    },
    muscle_gain: {
      setsRange: [3, 4],
      repsRange: ['8-10', '10-12', '12-15'],
      restTime: [60, 90, 120],
      workoutDays: 5,
      cardioRatio: 0.2,
      strengthRatio: 0.8,
      focusAreas: ['Hypertrophy', 'Volume Training']
    },
    endurance: {
      setsRange: [2, 4],
      repsRange: ['15-20', '20-25', '25-30'],
      restTime: [30, 45, 60],
      workoutDays: 5,
      cardioRatio: 0.6,
      strengthRatio: 0.4,
      focusAreas: ['Cardiovascular', 'Muscular Endurance']
    },
    athletic_performance: {
      setsRange: [3, 5],
      repsRange: ['6-8', '8-10', '10-12'],
      restTime: [60, 90, 120],
      workoutDays: 6,
      cardioRatio: 0.3,
      strengthRatio: 0.7,
      focusAreas: ['Power', 'Agility', 'Sport-Specific']
    },
    general_fitness: {
      setsRange: [3, 4],
      repsRange: ['10-12', '12-15'],
      restTime: [60, 90],
      workoutDays: 4,
      cardioRatio: 0.3,
      strengthRatio: 0.7,
      focusAreas: ['Balanced Training', 'Functional Movement']
    }
  };

  static generateSingleWorkout(
    goal: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    duration: number,
    targetMuscles?: string[]
  ): WorkoutPlan {
    console.log('Generating single workout:', { goal, difficulty, duration, targetMuscles });
    
    // Comprehensive null checks for all parameters
    const safeGoal = goal && typeof goal === 'string' ? goal.trim() : 'general_fitness';
    const safeDifficulty = difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(difficulty) ? difficulty : 'Beginner';
    const safeDuration = typeof duration === 'number' && duration > 0 ? duration : 30;
    const safeTargetMuscles = Array.isArray(targetMuscles) ? targetMuscles.filter(m => m && typeof m === 'string') : [];
    
    // Ensure goal config exists with comprehensive null checks
    const goalKey = safeGoal as keyof typeof this.goalConfigs;
    const config = this.goalConfigs[goalKey] || this.goalConfigs.general_fitness;
    
    // Ensure config has required properties with comprehensive null checks
    const safeConfig = {
      setsRange: Array.isArray(config?.setsRange) ? config.setsRange : [3, 4],
      repsRange: Array.isArray(config?.repsRange) ? config.repsRange : ['10-12', '12-15'],
      restTime: Array.isArray(config?.restTime) ? config.restTime : [60, 90],
      workoutDays: typeof config?.workoutDays === 'number' ? config.workoutDays : 4,
      cardioRatio: typeof config?.cardioRatio === 'number' ? config.cardioRatio : 0.3,
      strengthRatio: typeof config?.strengthRatio === 'number' ? config.strengthRatio : 0.7,
      focusAreas: Array.isArray(config?.focusAreas) ? config.focusAreas : ['General Fitness']
    };
    
    const difficultyIndex = difficulty === 'Beginner' ? 0 : difficulty === 'Intermediate' ? 1 : 2;
    
    // Filter exercises based on goal and difficulty with comprehensive null checks
    let availableExercises = [];
    
    if (Array.isArray(exercisesData)) {
      availableExercises = exercisesData.filter(exercise => {
        // Ensure exercise object exists and has required properties
        if (!exercise || typeof exercise !== 'object') {
          console.warn('Invalid exercise object found:', exercise);
          return false;
        }
        
        // Safely access exercise properties with fallbacks
        const exerciseDifficulty = exercise?.difficulty && typeof exercise.difficulty === 'string' ? exercise.difficulty : 'Beginner';
        const exerciseMuscle = exercise?.muscle && typeof exercise.muscle === 'string' ? exercise.muscle : 'General';
        const exerciseName = exercise?.name && typeof exercise.name === 'string' ? exercise.name : 'Unknown Exercise';
        
        // Validate that exercise has essential properties
        if (!exerciseName || exerciseName === 'Unknown Exercise') {
          console.warn('Exercise missing name:', exercise);
          return false;
        }
        
        const difficultyMatch = exerciseDifficulty === safeDifficulty || 
          (safeDifficulty === 'Intermediate' && exerciseDifficulty === 'Beginner') ||
          (safeDifficulty === 'Advanced' && exerciseDifficulty !== 'Advanced');
        
        if (safeTargetMuscles.length > 0) {
          return difficultyMatch && safeTargetMuscles.includes(exerciseMuscle);
        }
        
        return difficultyMatch;
      });
    } else {
      console.error('exercisesData is not an array:', exercisesData);
      availableExercises = [];
    }

    // Select exercises based on goal with safe parameters
    const selectedExercises = this.selectExercisesForGoal(availableExercises, safeGoal, safeDuration, safeDifficulty);
    
    const workoutExercises: WorkoutExercise[] = [];
    
    if (Array.isArray(selectedExercises)) {
      selectedExercises.forEach(exercise => {
        // Comprehensive null checks for exercise properties
        if (!exercise || typeof exercise !== 'object') {
          console.warn('Invalid exercise in selectedExercises:', exercise);
          return;
        }
        
        // Ensure exercise has all required properties with comprehensive null checks
        const safeExercise = {
          id: exercise?.id && typeof exercise.id === 'string' ? exercise.id : Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: exercise?.name && typeof exercise.name === 'string' ? exercise.name : 'Unknown Exercise',
          muscle: exercise?.muscle && typeof exercise.muscle === 'string' ? exercise.muscle : 'General',
          instructions: Array.isArray(exercise?.instructions) ? exercise.instructions.filter(inst => inst && typeof inst === 'string') : ['No instructions available'],
          difficulty: exercise?.difficulty && typeof exercise.difficulty === 'string' ? exercise.difficulty : safeDifficulty,
          equipment: Array.isArray(exercise?.equipment) ? exercise.equipment.filter(eq => eq && typeof eq === 'string') : []
        };

        // Safely access array elements with bounds checking
        const difficultyIndex = safeDifficulty === 'Beginner' ? 0 : safeDifficulty === 'Intermediate' ? 1 : 2;
        const setsValue = Array.isArray(safeConfig?.setsRange) && safeConfig.setsRange[difficultyIndex] 
          ? safeConfig.setsRange[difficultyIndex] 
          : 3;
        const repsValue = Array.isArray(safeConfig?.repsRange) && safeConfig.repsRange[difficultyIndex] 
          ? safeConfig.repsRange[difficultyIndex] 
          : '10-12';
        const restTimeValue = Array.isArray(safeConfig?.restTime) && safeConfig.restTime[difficultyIndex] 
          ? safeConfig.restTime[difficultyIndex] 
          : 60;

        const workoutExercise: WorkoutExercise = {
          id: safeExercise.id,
          name: safeExercise.name,
          sets: typeof setsValue === 'number' ? setsValue : 3,
          reps: typeof repsValue === 'string' ? repsValue : '10-12',
          restTime: typeof restTimeValue === 'number' ? restTimeValue : 60,
          muscle: safeExercise.muscle,
          instructions: Array.isArray(safeExercise.instructions) ? safeExercise.instructions.join('. ') : 'No instructions available',
          difficulty: safeExercise.difficulty,
          equipment: safeExercise.equipment
        };
        
        workoutExercises.push(workoutExercise);
      });
    } else {
      console.warn('selectedExercises is not an array:', selectedExercises);
    }

    // Safely extract target muscle groups with null checks
    const targetMuscleGroups = [...new Set(
      workoutExercises
        .map(ex => ex?.muscle && typeof ex.muscle === 'string' ? ex.muscle : 'General')
        .filter(muscle => muscle && typeof muscle === 'string')
    )];
    
    const estimatedCalories = this.calculateEstimatedCalories(workoutExercises, safeDuration, safeGoal);

    return {
      id: Date.now().toString(),
      name: `${safeGoal.replace(/_/g, ' ').toUpperCase()} Workout`,
      goal: safeGoal,
      difficulty: safeDifficulty,
      duration: safeDuration,
      exercises: workoutExercises,
      description: this.generateWorkoutDescription(safeGoal, safeDifficulty, targetMuscleGroups),
      targetMuscles: targetMuscleGroups,
      estimatedCalories
    };
  }

  static generateWeeklyPlan(
    goal: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    workoutDuration: number = 45
  ): WeeklyWorkoutPlan {
    console.log('Generating weekly plan:', { goal, difficulty, workoutDuration });
    
    // Ensure goal is valid and config exists
    const safeGoal = goal && typeof goal === 'string' ? goal : 'general_fitness';
    const config = this.goalConfigs[safeGoal as keyof typeof this.goalConfigs] || this.goalConfigs.general_fitness;
    
    // Ensure config has required properties with comprehensive null checks
    const safeConfig = {
      workoutDays: typeof config?.workoutDays === 'number' ? config.workoutDays : 4,
      cardioRatio: typeof config?.cardioRatio === 'number' ? config.cardioRatio : 0.3,
      strengthRatio: typeof config?.strengthRatio === 'number' ? config.strengthRatio : 0.7,
      focusAreas: Array.isArray(config?.focusAreas) ? config.focusAreas : ['General Fitness']
    };
    
    const workoutDays = safeConfig.workoutDays;
    
    const weeklyPlan: DayWorkout[] = [];
    const restDays: number[] = [];
    
    // Generate workout schedule based on goal
    const schedule = this.generateWorkoutSchedule(safeGoal, workoutDays, difficulty);
    
    for (let day = 1; day <= 7; day++) {
      const dayPlan = Array.isArray(schedule) ? schedule.find(s => s && typeof s === 'object' && s?.day === day) : null;
      
      if (dayPlan && typeof dayPlan === 'object' && !dayPlan?.isRestDay) {
        const workout = this.generateSingleWorkout(
          safeGoal,
          difficulty,
          workoutDuration,
          Array.isArray(dayPlan?.targetMuscles) ? dayPlan.targetMuscles : undefined
        );
        
        weeklyPlan.push({
          day,
          name: dayPlan?.name && typeof dayPlan.name === 'string' ? dayPlan.name : `Day ${day} Workout`,
          focus: dayPlan?.focus && typeof dayPlan.focus === 'string' ? dayPlan.focus : 'General Training',
          duration: workoutDuration,
          exercises: Array.isArray(workout?.exercises) ? workout.exercises : [],
          isRestDay: false
        });
      } else {
        restDays.push(day);
        weeklyPlan.push({
          day,
          name: dayPlan?.name && typeof dayPlan.name === 'string' ? dayPlan.name : 'Rest Day',
          focus: 'Recovery',
          duration: 0,
          exercises: [],
          isRestDay: true,
          activeRecovery: this.getActiveRecoveryOptions(safeGoal)
        });
      }
    }

    return {
      id: Date.now().toString(),
      goal: safeGoal,
      difficulty,
      totalDuration: workoutDays * workoutDuration,
      workouts: weeklyPlan,
      restDays,
      description: this.generateWeeklyPlanDescription(safeGoal, difficulty, workoutDays),
      tips: this.getGoalSpecificTips(safeGoal, difficulty)
    };
  }

  private static selectExercisesForGoal(
    exercises: Exercise[],
    goal: string,
    duration: number,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): Exercise[] {
    const exerciseCount = Math.floor(duration / 8); // Roughly 8 minutes per exercise
    const maxExercises = Math.min(exerciseCount, 8);
    const minExercises = Math.max(4, Math.floor(maxExercises * 0.7));
    
    let selectedExercises: Exercise[] = [];
    
    switch (goal) {
      case 'fat_loss':
        // Prioritize compound movements and cardio
        selectedExercises = this.selectBalancedExercises(exercises, minExercises, maxExercises, [
          'Full Body', 'Cardio', 'Legs', 'Core'
        ]);
        break;
        
      case 'strength':
        // Focus on compound movements
        selectedExercises = this.selectBalancedExercises(exercises, minExercises, maxExercises, [
          'Legs', 'Back', 'Chest', 'Shoulders'
        ]);
        break;
        
      case 'muscle_gain':
        // Balanced muscle group targeting
        selectedExercises = this.selectBalancedExercises(exercises, minExercises, maxExercises, [
          'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'
        ]);
        break;
        
      case 'endurance':
        // Higher rep, bodyweight focused
        selectedExercises = this.selectBalancedExercises(exercises, minExercises, maxExercises, [
          'Cardio', 'Core', 'Legs', 'Full Body'
        ]);
        break;
        
      case 'athletic_performance':
        // Functional movements
        selectedExercises = this.selectBalancedExercises(exercises, minExercises, maxExercises, [
          'Legs', 'Core', 'Back', 'Shoulders'
        ]);
        break;
        
      default:
        selectedExercises = this.selectBalancedExercises(exercises, minExercises, maxExercises);
    }
    
    return selectedExercises.slice(0, maxExercises);
  }

  private static selectBalancedExercises(
    exercises: Exercise[],
    minCount: number,
    maxCount: number,
    priorityMuscles?: string[]
  ): Exercise[] {
    const selected: Exercise[] = [];
    const usedMuscles = new Set<string>();
    
    // Ensure exercises array is valid
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return [];
    }
    
    // First, try to get one exercise from each priority muscle group
    if (priorityMuscles && Array.isArray(priorityMuscles)) {
      for (const muscle of priorityMuscles) {
        const muscleExercises = exercises.filter(ex => 
          ex?.muscle === muscle && !selected.find(s => s?.id === ex?.id)
        );
        
        if (muscleExercises.length > 0) {
          const randomExercise = muscleExercises[Math.floor(Math.random() * muscleExercises.length)];
          if (randomExercise) {
            selected.push(randomExercise);
            usedMuscles.add(muscle);
          }
        }
        
        if (selected.length >= maxCount) break;
      }
    }
    
    // Fill remaining slots with diverse exercises
    while (selected.length < maxCount && selected.length < exercises.length) {
      const remainingExercises = exercises.filter(ex => 
        ex && !selected.find(s => s?.id === ex?.id)
      );
      
      if (remainingExercises.length === 0) break;
      
      // Prefer exercises from unused muscle groups
      const unusedMuscleExercises = remainingExercises.filter(ex => 
        ex?.muscle && !usedMuscles.has(ex.muscle)
      );
      
      const candidateExercises = unusedMuscleExercises.length > 0 ? 
        unusedMuscleExercises : remainingExercises;
      
      if (candidateExercises.length > 0) {
        const randomExercise = candidateExercises[Math.floor(Math.random() * candidateExercises.length)];
        if (randomExercise?.muscle) {
          selected.push(randomExercise);
          usedMuscles.add(randomExercise.muscle);
        }
      }
    }
    
    return selected;
  }

  private static generateWorkoutSchedule(
    goal: string,
    workoutDays: number,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): any[] {
    const schedules: { [key: string]: any[] } = {
      fat_loss: [
        { day: 1, name: 'Full Body HIIT', focus: 'High Intensity', targetMuscles: ['Full Body', 'Cardio'] },
        { day: 2, name: 'Upper Body Strength', focus: 'Upper Body', targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'] },
        { day: 3, name: 'Lower Body Power', focus: 'Lower Body', targetMuscles: ['Legs', 'Core'] },
        { day: 4, name: 'Rest Day', isRestDay: true },
        { day: 5, name: 'Cardio Circuit', focus: 'Cardiovascular', targetMuscles: ['Cardio', 'Core'] },
        { day: 6, name: 'Full Body Metabolic', focus: 'Metabolic', targetMuscles: ['Full Body'] },
        { day: 7, name: 'Active Recovery', isRestDay: true }
      ],
      strength: [
        { day: 1, name: 'Upper Body Push', focus: 'Push Movements', targetMuscles: ['Chest', 'Shoulders', 'Arms'] },
        { day: 2, name: 'Lower Body', focus: 'Legs & Glutes', targetMuscles: ['Legs'] },
        { day: 3, name: 'Rest Day', isRestDay: true },
        { day: 4, name: 'Upper Body Pull', focus: 'Pull Movements', targetMuscles: ['Back', 'Arms'] },
        { day: 5, name: 'Lower Body Power', focus: 'Power & Strength', targetMuscles: ['Legs'] },
        { day: 6, name: 'Rest Day', isRestDay: true },
        { day: 7, name: 'Rest Day', isRestDay: true }
      ],
      muscle_gain: [
        { day: 1, name: 'Chest & Triceps', focus: 'Push Muscles', targetMuscles: ['Chest', 'Arms'] },
        { day: 2, name: 'Back & Biceps', focus: 'Pull Muscles', targetMuscles: ['Back', 'Arms'] },
        { day: 3, name: 'Legs', focus: 'Lower Body', targetMuscles: ['Legs'] },
        { day: 4, name: 'Rest Day', isRestDay: true },
        { day: 5, name: 'Shoulders & Core', focus: 'Shoulders & Core', targetMuscles: ['Shoulders', 'Core'] },
        { day: 6, name: 'Full Body', focus: 'Full Body', targetMuscles: ['Chest', 'Back', 'Legs'] },
        { day: 7, name: 'Rest Day', isRestDay: true }
      ],
      endurance: [
        { day: 1, name: 'Cardio Base', focus: 'Aerobic Base', targetMuscles: ['Cardio'] },
        { day: 2, name: 'Upper Body Endurance', focus: 'Upper Body', targetMuscles: ['Chest', 'Back', 'Arms'] },
        { day: 3, name: 'Lower Body Endurance', focus: 'Lower Body', targetMuscles: ['Legs', 'Core'] },
        { day: 4, name: 'Active Recovery', isRestDay: true },
        { day: 5, name: 'Interval Training', focus: 'High Intensity', targetMuscles: ['Cardio', 'Core'] },
        { day: 6, name: 'Full Body Circuit', focus: 'Circuit Training', targetMuscles: ['Full Body'] },
        { day: 7, name: 'Rest Day', isRestDay: true }
      ],
      general_fitness: [
        { day: 1, name: 'Full Body Strength', focus: 'Balanced Training', targetMuscles: ['Chest', 'Back', 'Legs'] },
        { day: 2, name: 'Cardio & Core', focus: 'Cardiovascular', targetMuscles: ['Cardio', 'Core'] },
        { day: 3, name: 'Rest Day', isRestDay: true },
        { day: 4, name: 'Upper Body', focus: 'Upper Body', targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'] },
        { day: 5, name: 'Lower Body', focus: 'Lower Body', targetMuscles: ['Legs'] },
        { day: 6, name: 'Active Recovery', isRestDay: true },
        { day: 7, name: 'Rest Day', isRestDay: true }
      ]
    };

    const selectedSchedule = schedules[goal] || schedules.muscle_gain || schedules.general_fitness || [];
    
    // Ensure schedule is an array with proper structure
    if (!Array.isArray(selectedSchedule)) {
      console.warn('Invalid schedule format, using default');
      return schedules.general_fitness || [];
    }
    
    return selectedSchedule;
  }

  private static calculateEstimatedCalories(
    exercises: WorkoutExercise[],
    duration: number,
    goal: string
  ): number {
    const baseCaloriesPerMinute = {
      fat_loss: 8,
      strength: 6,
      muscle_gain: 7,
      endurance: 9,
      athletic_performance: 8,
      general_fitness: 7
    };

    const caloriesPerMinute = baseCaloriesPerMinute[goal as keyof typeof baseCaloriesPerMinute] || 7;
    return Math.round(duration * caloriesPerMinute);
  }

  private static generateWorkoutDescription(
    goal: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    targetMuscles: string[]
  ): string {
    const goalDescriptions = {
      fat_loss: 'High-intensity workout designed to maximize calorie burn and boost metabolism',
      strength: 'Strength-focused workout with compound movements for maximum power development',
      muscle_gain: 'Hypertrophy-focused workout targeting muscle growth and size',
      endurance: 'Endurance-based workout to improve cardiovascular and muscular stamina',
      athletic_performance: 'Performance-oriented workout for athletic development',
      general_fitness: 'Well-rounded workout for overall fitness and health'
    };

    const description = goalDescriptions[goal as keyof typeof goalDescriptions] || goalDescriptions.general_fitness;
    return `${description}. Targets: ${targetMuscles.join(', ')}. Difficulty: ${difficulty}.`;
  }

  private static generateWeeklyPlanDescription(
    goal: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
    workoutDays: number
  ): string {
    return `Complete ${workoutDays}-day weekly program designed for ${goal.replace('_', ' ')} at ${difficulty} level. Includes structured rest days and progressive overload principles.`;
  }

  private static getActiveRecoveryOptions(goal: string): string[] {
    const baseOptions = ['Light walking', 'Gentle stretching', 'Yoga', 'Foam rolling'];
    
    const goalSpecific = {
      fat_loss: ['Light cardio', 'Swimming', 'Bike ride'],
      strength: ['Mobility work', 'Light stretching'],
      muscle_gain: ['Light cardio', 'Stretching'],
      endurance: ['Easy walk', 'Swimming', 'Yoga'],
      athletic_performance: ['Dynamic stretching', 'Sport-specific drills'],
      general_fitness: ['Recreational activities', 'Light sports']
    };

    return [...baseOptions, ...(goalSpecific[goal as keyof typeof goalSpecific] || [])];
  }

  private static getGoalSpecificTips(
    goal: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): string[] {
    const tips = {
      fat_loss: [
        'Maintain a caloric deficit through diet and exercise',
        'Stay hydrated throughout your workouts',
        'Focus on compound movements for maximum calorie burn',
        'Include both cardio and strength training',
        'Get adequate sleep for recovery and metabolism'
      ],
      strength: [
        'Focus on progressive overload - gradually increase weight',
        'Prioritize compound movements like squats, deadlifts, bench press',
        'Allow adequate rest between sets (2-3 minutes)',
        'Maintain proper form over heavy weight',
        'Track your lifts to monitor progress'
      ],
      muscle_gain: [
        'Eat in a slight caloric surplus with adequate protein',
        'Focus on time under tension and mind-muscle connection',
        'Get 7-9 hours of sleep for muscle recovery',
        'Stay consistent with your training schedule',
        'Progressive overload is key for continued growth'
      ],
      endurance: [
        'Build your aerobic base with longer, easier sessions',
        'Include interval training to improve VO2 max',
        'Focus on proper breathing techniques',
        'Gradually increase training volume',
        'Include recovery weeks in your training cycle'
      ],
      athletic_performance: [
        'Include sport-specific movements in your training',
        'Focus on explosive power and agility',
        'Maintain flexibility and mobility',
        'Periodize your training for peak performance',
        'Include plyometric exercises for power development'
      ],
      general_fitness: [
        'Aim for consistency over perfection',
        'Include variety to prevent boredom',
        'Listen to your body and rest when needed',
        'Set realistic and achievable goals',
        'Make fitness a sustainable lifestyle habit'
      ]
    };

    return tips[goal as keyof typeof tips] || tips.general_fitness;
  }
}