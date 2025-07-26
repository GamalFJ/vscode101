export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  equipment: string[];
  sets?: number;
  reps?: string;
  restTime?: number;
  machineUsed?: string;
}

export const exercisesData: Exercise[] = [
  // Chest Exercises
  {
    id: '1',
    name: 'Bench Press',
    muscle: 'Chest',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Classic chest exercise using a barbell on a bench to build upper body strength and mass.',
    instructions: [
      'Lie flat on the bench with feet firmly on the ground',
      'Grip the barbell with hands slightly wider than shoulder-width',
      'Lower the bar slowly to your chest',
      'Press the bar back up to starting position',
      'Keep your core tight throughout the movement'
    ],
    equipment: ['Barbell', 'Bench', 'Weight Plates'],
    sets: 3,
    reps: '8-12',
    restTime: 90,
    machineUsed: 'Bench Press Station'
  },
  {
    id: '2',
    name: 'Push-ups',
    muscle: 'Chest',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Bodyweight exercise for chest, shoulders, and triceps development.',
    instructions: [
      'Start in plank position with hands under shoulders',
      'Keep body in straight line from head to heels',
      'Lower chest toward ground',
      'Push back up to starting position',
      'Maintain core engagement throughout'
    ],
    equipment: ['Bodyweight'],
    sets: 3,
    reps: '10-20',
    restTime: 45,
    machineUsed: 'None'
  },
  {
    id: '3',
    name: 'Chest Press Machine',
    muscle: 'Chest',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Machine-based chest exercise providing guided movement and safety.',
    instructions: [
      'Adjust seat height so handles are at chest level',
      'Sit with back flat against the pad',
      'Grip handles and press forward',
      'Return to starting position with control',
      'Keep core engaged throughout'
    ],
    equipment: ['Chest Press Machine'],
    sets: 3,
    reps: '10-15',
    restTime: 60,
    machineUsed: 'Chest Press Machine'
  },
  {
    id: '4',
    name: 'Dumbbell Flyes',
    muscle: 'Chest',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Isolation exercise targeting the chest muscles with a stretching motion.',
    instructions: [
      'Lie on bench holding dumbbells above chest',
      'Lower weights in wide arc until chest stretch is felt',
      'Bring dumbbells back together above chest',
      'Keep slight bend in elbows throughout',
      'Focus on squeezing chest muscles'
    ],
    equipment: ['Dumbbells', 'Bench'],
    sets: 3,
    reps: '12-15',
    restTime: 75,
    machineUsed: 'Bench'
  },

  // Back Exercises
  {
    id: '5',
    name: 'Deadlift',
    muscle: 'Back',
    category: 'Strength',
    difficulty: 'Advanced',
    description: 'Compound exercise targeting posterior chain muscles including back, glutes, and hamstrings.',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip the bar',
      'Keep chest up and back straight',
      'Drive through heels and extend hips to lift the bar',
      'Stand tall, then lower the bar with control'
    ],
    equipment: ['Barbell', 'Weight Plates'],
    sets: 3,
    reps: '5-8',
    restTime: 120,
    machineUsed: 'None'
  },
  {
    id: '6',
    name: 'Pull-ups',
    muscle: 'Back',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Upper body pulling exercise using body weight to develop back and arm strength.',
    instructions: [
      'Hang from pull-up bar with palms facing away',
      'Engage core and pull body up',
      'Bring chin over the bar',
      'Lower body with control',
      'Maintain straight body line'
    ],
    equipment: ['Pull-up Bar'],
    sets: 3,
    reps: '6-10',
    restTime: 90,
    machineUsed: 'Pull-up Bar'
  },
  {
    id: '7',
    name: 'Lat Pulldown',
    muscle: 'Back',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Machine exercise targeting the latissimus dorsi and other back muscles.',
    instructions: [
      'Sit at lat pulldown machine with thighs secured',
      'Grip bar with hands wider than shoulders',
      'Pull bar down to upper chest',
      'Squeeze shoulder blades together',
      'Return bar to starting position with control'
    ],
    equipment: ['Lat Pulldown Machine'],
    sets: 3,
    reps: '10-12',
    restTime: 75,
    machineUsed: 'Lat Pulldown Machine'
  },
  {
    id: '8',
    name: 'Seated Cable Row',
    muscle: 'Back',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Cable exercise for developing middle back and rear deltoid muscles.',
    instructions: [
      'Sit at cable row station with feet on platform',
      'Grip handle with both hands',
      'Pull handle to lower chest while squeezing shoulder blades',
      'Keep torso upright throughout movement',
      'Return to starting position with control'
    ],
    equipment: ['Cable Machine', 'Row Handle'],
    sets: 3,
    reps: '12-15',
    restTime: 60,
    machineUsed: 'Cable Machine'
  },

  // Leg Exercises
  {
    id: '9',
    name: 'Squats',
    muscle: 'Legs',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body by bending at hips and knees',
      'Go down until thighs are parallel to floor',
      'Push through heels to return to starting position'
    ],
    equipment: ['Bodyweight', 'Optional: Barbell, Dumbbells'],
    sets: 3,
    reps: '12-15',
    restTime: 60,
    machineUsed: 'Squat Rack'
  },
  {
    id: '10',
    name: 'Leg Press',
    muscle: 'Legs',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Machine-based leg exercise providing support and safety for heavy loads.',
    instructions: [
      'Sit in leg press machine with back against pad',
      'Place feet on platform shoulder-width apart',
      'Lower weight by bending knees to 90 degrees',
      'Press weight back up through heels',
      'Keep core tight throughout movement'
    ],
    equipment: ['Leg Press Machine'],
    sets: 3,
    reps: '12-15',
    restTime: 75,
    machineUsed: 'Leg Press Machine'
  },
  {
    id: '11',
    name: 'Lunges',
    muscle: 'Legs',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Unilateral leg exercise improving balance, strength, and coordination.',
    instructions: [
      'Stand tall with feet hip-width apart',
      'Step forward with one leg into lunge position',
      'Lower hips until both knees are at 90 degrees',
      'Push back to starting position',
      'Alternate legs or complete all reps on one side'
    ],
    equipment: ['Bodyweight', 'Optional: Dumbbells'],
    sets: 3,
    reps: '10-12 each leg',
    restTime: 60,
    machineUsed: 'None'
  },
  {
    id: '12',
    name: 'Leg Curls',
    muscle: 'Legs',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Isolation exercise targeting the hamstring muscles.',
    instructions: [
      'Lie face down on leg curl machine',
      'Position ankles under the pad',
      'Curl heels toward glutes',
      'Squeeze hamstrings at the top',
      'Lower weight with control'
    ],
    equipment: ['Leg Curl Machine'],
    sets: 3,
    reps: '12-15',
    restTime: 60,
    machineUsed: 'Leg Curl Machine'
  },

  // Shoulder Exercises
  {
    id: '13',
    name: 'Overhead Press',
    muscle: 'Shoulders',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Compound movement for developing shoulder and arm strength.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold barbell at shoulder height',
      'Press weight straight up overhead',
      'Lower with control to starting position',
      'Keep core tight throughout'
    ],
    equipment: ['Barbell', 'Weight Plates'],
    sets: 3,
    reps: '8-10',
    restTime: 90,
    machineUsed: 'None'
  },
  {
    id: '14',
    name: 'Lateral Raises',
    muscle: 'Shoulders',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Isolation exercise targeting the lateral deltoid muscles.',
    instructions: [
      'Stand holding dumbbells at your sides',
      'Raise weights out to sides until parallel to floor',
      'Keep slight bend in elbows',
      'Lower weights with control',
      'Focus on controlled movement'
    ],
    equipment: ['Dumbbells'],
    sets: 3,
    reps: '12-15',
    restTime: 45,
    machineUsed: 'None'
  },
  {
    id: '15',
    name: 'Shoulder Press Machine',
    muscle: 'Shoulders',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Machine-based shoulder exercise providing stability and safety.',
    instructions: [
      'Sit in shoulder press machine',
      'Adjust seat height so handles are at shoulder level',
      'Press handles straight up overhead',
      'Lower with control to starting position',
      'Keep back against pad'
    ],
    equipment: ['Shoulder Press Machine'],
    sets: 3,
    reps: '10-12',
    restTime: 75,
    machineUsed: 'Shoulder Press Machine'
  },

  // Arm Exercises
  {
    id: '16',
    name: 'Bicep Curls',
    muscle: 'Arms',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Isolation exercise for developing bicep muscle strength and size.',
    instructions: [
      'Stand holding dumbbells with arms at sides',
      'Keep elbows close to torso',
      'Curl weights up toward shoulders',
      'Squeeze biceps at the top',
      'Lower weights with control'
    ],
    equipment: ['Dumbbells'],
    sets: 3,
    reps: '12-15',
    restTime: 45,
    machineUsed: 'None'
  },
  {
    id: '17',
    name: 'Tricep Dips',
    muscle: 'Arms',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Bodyweight exercise targeting the tricep muscles.',
    instructions: [
      'Position hands on parallel bars or bench',
      'Support body weight with arms extended',
      'Lower body by bending elbows',
      'Push back up to starting position',
      'Keep body upright throughout'
    ],
    equipment: ['Dip Station', 'Parallel Bars'],
    sets: 3,
    reps: '8-12',
    restTime: 75,
    machineUsed: 'Dip Station'
  },
  {
    id: '18',
    name: 'Cable Tricep Pushdowns',
    muscle: 'Arms',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Cable exercise isolating the tricep muscles.',
    instructions: [
      'Stand at cable machine with rope or bar attachment',
      'Keep elbows at your sides',
      'Push weight down by extending forearms',
      'Squeeze triceps at bottom',
      'Return to starting position with control'
    ],
    equipment: ['Cable Machine', 'Rope or Bar Attachment'],
    sets: 3,
    reps: '12-15',
    restTime: 60,
    machineUsed: 'Cable Machine'
  },

  // Core Exercises
  {
    id: '19',
    name: 'Plank',
    muscle: 'Core',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Isometric exercise for developing core stability and strength.',
    instructions: [
      'Start in push-up position on forearms',
      'Keep body in straight line from head to heels',
      'Engage core and hold position',
      'Breathe normally while holding',
      'Avoid letting hips sag or pike up'
    ],
    equipment: ['Exercise Mat'],
    sets: 3,
    reps: '30-60 seconds',
    restTime: 60,
    machineUsed: 'None'
  },
  {
    id: '20',
    name: 'Crunches',
    muscle: 'Core',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Classic abdominal exercise targeting the rectus abdominis.',
    instructions: [
      'Lie on back with knees bent',
      'Place hands behind head or across chest',
      'Lift shoulders off ground by contracting abs',
      'Lower back down with control',
      'Keep lower back pressed to floor'
    ],
    equipment: ['Exercise Mat'],
    sets: 3,
    reps: '15-20',
    restTime: 45,
    machineUsed: 'None'
  },

  // Cardio Exercises
  {
    id: '21',
    name: 'Treadmill Running',
    muscle: 'Cardio',
    category: 'Cardio',
    difficulty: 'Beginner',
    description: 'Cardiovascular exercise for improving heart health and endurance.',
    instructions: [
      'Start with 5-minute warm-up walk',
      'Gradually increase speed to comfortable running pace',
      'Maintain steady rhythm and breathing',
      'Cool down with 5-minute walk',
      'Stay hydrated throughout'
    ],
    equipment: ['Treadmill'],
    sets: 1,
    reps: '20-30 minutes',
    restTime: 0,
    machineUsed: 'Treadmill'
  },
  {
    id: '22',
    name: 'Stationary Bike',
    muscle: 'Cardio',
    category: 'Cardio',
    difficulty: 'Beginner',
    description: 'Low-impact cardiovascular exercise suitable for all fitness levels.',
    instructions: [
      'Adjust seat height for proper leg extension',
      'Start with light resistance',
      'Maintain steady pedaling rhythm',
      'Gradually increase resistance as needed',
      'Keep upper body relaxed'
    ],
    equipment: ['Stationary Bike'],
    sets: 1,
    reps: '20-45 minutes',
    restTime: 0,
    machineUsed: 'Stationary Bike'
  },
  {
    id: '23',
    name: 'Elliptical Machine',
    muscle: 'Cardio',
    category: 'Cardio',
    difficulty: 'Beginner',
    description: 'Full-body, low-impact cardiovascular exercise.',
    instructions: [
      'Step onto elliptical and grip handles',
      'Start with slow, smooth motion',
      'Coordinate arm and leg movements',
      'Maintain upright posture',
      'Adjust resistance as needed'
    ],
    equipment: ['Elliptical Machine'],
    sets: 1,
    reps: '20-40 minutes',
    restTime: 0,
    machineUsed: 'Elliptical Machine'
  },
  {
    id: '24',
    name: 'Rowing Machine',
    muscle: 'Cardio',
    category: 'Cardio',
    difficulty: 'Intermediate',
    description: 'Full-body cardiovascular and strength exercise.',
    instructions: [
      'Sit on rowing machine with feet secured',
      'Grip handle with both hands',
      'Push with legs, then pull with arms',
      'Reverse the motion to return',
      'Maintain smooth, rhythmic strokes'
    ],
    equipment: ['Rowing Machine'],
    sets: 1,
    reps: '15-30 minutes',
    restTime: 0,
    machineUsed: 'Rowing Machine'
  }
];

export const getExerciseById = (id: string): Exercise | undefined => {
  const safeId = id && typeof id === 'string' ? id.trim() : '';
  
  if (!safeId) {
    return undefined;
  }
  
  return exercisesData.find(exercise => 
    exercise && 
    typeof exercise === 'object' &&
    exercise?.id === safeId
  );
};

export const getExercisesByMuscle = (muscle: string): Exercise[] => {
  const safeMuscle = muscle && typeof muscle === 'string' ? muscle.trim() : '';
  
  if (!safeMuscle) {
    return [];
  }
  
  return exercisesData.filter(exercise => 
    exercise && 
    typeof exercise === 'object' &&
    exercise?.muscle && 
    typeof exercise.muscle === 'string' &&
    exercise.muscle.toLowerCase() === safeMuscle.toLowerCase()
  );
};

export const getExercisesByDifficulty = (difficulty: string): Exercise[] => {
  const safeDifficulty = difficulty && typeof difficulty === 'string' ? difficulty.trim() : '';
  
  if (!safeDifficulty) {
    return [];
  }
  
  return exercisesData.filter(exercise => 
    exercise && 
    typeof exercise === 'object' &&
    exercise?.difficulty && 
    typeof exercise.difficulty === 'string' &&
    exercise.difficulty.toLowerCase() === safeDifficulty.toLowerCase()
  );
};

export const getExercisesByCategory = (category: string): Exercise[] => {
  const safeCategory = category && typeof category === 'string' ? category.trim() : '';
  
  if (!safeCategory) {
    return [];
  }
  
  return exercisesData.filter(exercise => 
    exercise && 
    typeof exercise === 'object' &&
    exercise?.category && 
    typeof exercise.category === 'string' &&
    exercise.category.toLowerCase() === safeCategory.toLowerCase()
  );
};

export const getExercisesByMachine = (machine: string): Exercise[] => {
  const safeMachine = machine && typeof machine === 'string' ? machine.trim() : '';
  
  if (!safeMachine) {
    return [];
  }
  
  return exercisesData.filter(exercise => 
    exercise && 
    typeof exercise === 'object' &&
    exercise?.machineUsed && 
    typeof exercise.machineUsed === 'string' &&
    exercise.machineUsed.toLowerCase().includes(safeMachine.toLowerCase())
  );
};

export const searchExercises = (query: string): Exercise[] => {
  const lowercaseQuery = query && typeof query === 'string' ? query.toLowerCase() : '';
  
  return exercisesData.filter(exercise => {
    if (!exercise || typeof exercise !== 'object') {
      return false;
    }
    
    const name = exercise?.name && typeof exercise.name === 'string' ? exercise.name.toLowerCase() : '';
    const description = exercise?.description && typeof exercise.description === 'string' ? exercise.description.toLowerCase() : '';
    const muscle = exercise?.muscle && typeof exercise.muscle === 'string' ? exercise.muscle.toLowerCase() : '';
    const category = exercise?.category && typeof exercise.category === 'string' ? exercise.category.toLowerCase() : '';
    const equipment = Array.isArray(exercise?.equipment) ? exercise.equipment : [];
    
    return name.includes(lowercaseQuery) ||
           description.includes(lowercaseQuery) ||
           muscle.includes(lowercaseQuery) ||
           category.includes(lowercaseQuery) ||
           equipment.some(eq => eq && typeof eq === 'string' && eq.toLowerCase().includes(lowercaseQuery));
  });
};