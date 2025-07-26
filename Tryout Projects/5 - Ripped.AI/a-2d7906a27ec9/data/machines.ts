export interface Machine {
  id: string;
  name: string;
  exercises: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  setup: string[];
  safety: string[];
  muscleGroups: string[];
  image?: string;
}

export const machinesData: Machine[] = [
  {
    id: '1',
    name: 'Treadmill',
    exercises: ['Walking', 'Jogging', 'Running', 'Incline Walking', 'Sprint Intervals'],
    difficulty: 'Beginner',
    description: 'Motorized belt machine for cardiovascular exercise, allowing walking, jogging, and running at various speeds and inclines.',
    setup: [
      'Step onto the side rails, not the moving belt',
      'Attach safety clip to your clothing',
      'Start with a slow walking pace (2-3 mph)',
      'Gradually increase speed as you get comfortable',
      'Use handrails only for balance, not support'
    ],
    safety: [
      'Always use the safety clip attachment',
      'Start slowly and gradually increase speed',
      'Keep your eyes forward, not down at your feet',
      'Stay hydrated and take breaks as needed',
      'Stop immediately if you feel dizzy or unwell'
    ],
    muscleGroups: ['Cardiovascular System', 'Legs', 'Glutes', 'Core'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '2',
    name: 'Leg Press Machine',
    exercises: ['Leg Press', 'Calf Press', 'Single Leg Press', 'High Foot Position Press', 'Low Foot Position Press'],
    difficulty: 'Beginner',
    description: 'Seated machine for lower body strength training with back support, allowing safe heavy loading.',
    setup: [
      'Adjust the seat to comfortable position',
      'Set the desired weight on the weight stack',
      'Position feet on the footplate shoulder-width apart',
      'Ensure back is flat against the seat',
      'Release safety handles'
    ],
    safety: [
      'Keep your back flat against the seat',
      'Control the weight throughout the movement',
      'Use full range of motion but don\'t lock knees completely',
      'Keep feet flat on the footplate',
      'Re-engage safety handles when finished'
    ],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '3',
    name: 'Lat Pulldown Machine',
    exercises: ['Lat Pulldown', 'Wide Grip Pulldown', 'Close Grip Pulldown', 'Reverse Grip Pulldown', 'Single Arm Pulldown'],
    difficulty: 'Beginner',
    description: 'Seated machine for upper body pulling exercises targeting the back muscles with adjustable resistance.',
    setup: [
      'Adjust the thigh pad to secure your legs',
      'Select appropriate weight on the stack',
      'Grip the bar with hands wider than shoulders',
      'Sit with chest up and shoulders back',
      'Engage core before starting'
    ],
    safety: [
      'Keep chest up throughout the movement',
      'Pull the bar to upper chest, not behind neck',
      'Control the weight on the way up',
      'Don\'t use momentum to pull the weight',
      'Keep shoulders down and back'
    ],
    muscleGroups: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius', 'Biceps'],
    image: 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '4',
    name: 'Chest Press Machine',
    exercises: ['Chest Press', 'Incline Chest Press', 'Single Arm Press', 'Decline Chest Press'],
    difficulty: 'Beginner',
    description: 'Seated machine for chest and tricep development with guided movement path for safety.',
    setup: [
      'Adjust seat height so handles are at chest level',
      'Set the desired weight on the stack',
      'Sit with back flat against the pad',
      'Grip handles with palms facing down',
      'Position feet firmly on the ground'
    ],
    safety: [
      'Keep back against the pad at all times',
      'Press handles forward in controlled motion',
      'Don\'t lock elbows at full extension',
      'Return handles slowly to starting position',
      'Maintain steady breathing pattern'
    ],
    muscleGroups: ['Pectorals', 'Anterior Deltoids', 'Triceps'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '5',
    name: 'Cable Machine',
    exercises: ['Cable Rows', 'Cable Flyes', 'Cable Curls', 'Tricep Pushdowns', 'Cable Crossovers', 'Face Pulls'],
    difficulty: 'Intermediate',
    description: 'Versatile pulley system for various upper and lower body exercises with adjustable height and resistance.',
    setup: [
      'Select appropriate attachment for exercise',
      'Set the pulley height for the exercise',
      'Choose the desired weight on the stack',
      'Position yourself at proper distance from machine',
      'Maintain proper stance and posture'
    ],
    safety: [
      'Check that attachment is securely connected',
      'Control the weight throughout full range of motion',
      'Don\'t let the weight stack slam down',
      'Maintain proper form over heavy weight',
      'Keep core engaged during all movements'
    ],
    muscleGroups: ['Full Body - Depends on Exercise'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '6',
    name: 'Smith Machine',
    exercises: ['Smith Machine Squats', 'Smith Machine Bench Press', 'Smith Machine Rows', 'Smith Machine Lunges', 'Smith Machine Calf Raises'],
    difficulty: 'Intermediate',
    description: 'Guided barbell system with safety catches for various compound movements with added stability.',
    setup: [
      'Load appropriate weight plates on the bar',
      'Set safety catches at proper height for the exercise',
      'Position bench or adjust bar height as needed',
      'Ensure bar moves smoothly on the rails',
      'Check that safety mechanisms are working'
    ],
    safety: [
      'Always set safety catches below your lowest position',
      'Use proper form - machine doesn\'t correct bad technique',
      'Don\'t rely solely on the machine for safety',
      'Warm up properly before heavy lifting',
      'Have a spotter for heavy weights when possible'
    ],
    muscleGroups: ['Full Body - Depends on Exercise'],
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '7',
    name: 'Stationary Bike',
    exercises: ['Steady State Cycling', 'Interval Training', 'Hill Climbs', 'Sprint Intervals', 'Recovery Rides'],
    difficulty: 'Beginner',
    description: 'Low-impact cardiovascular exercise machine suitable for all fitness levels with adjustable resistance.',
    setup: [
      'Adjust seat height so leg is slightly bent at bottom of pedal stroke',
      'Adjust handlebars to comfortable height',
      'Secure feet in pedals or toe cages',
      'Set initial resistance to light level',
      'Ensure water bottle is within reach'
    ],
    safety: [
      'Start with low resistance and gradually increase',
      'Maintain proper posture throughout workout',
      'Keep feet securely in pedals',
      'Stay hydrated during longer sessions',
      'Stop if you experience any pain or discomfort'
    ],
    muscleGroups: ['Cardiovascular System', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '8',
    name: 'Elliptical Machine',
    exercises: ['Forward Motion', 'Reverse Motion', 'Upper Body Focus', 'Lower Body Focus', 'Interval Training'],
    difficulty: 'Beginner',
    description: 'Full-body, low-impact cardiovascular machine that combines upper and lower body movement.',
    setup: [
      'Step onto foot pedals and grip moving handles',
      'Start with slow, controlled movements',
      'Adjust resistance to comfortable level',
      'Maintain upright posture',
      'Coordinate arm and leg movements'
    ],
    safety: [
      'Start slowly to get familiar with the motion',
      'Keep feet flat on pedals throughout',
      'Don\'t lean heavily on handles',
      'Maintain smooth, controlled movements',
      'Step off carefully when finished'
    ],
    muscleGroups: ['Cardiovascular System', 'Full Body', 'Arms', 'Legs', 'Core'],
    image: 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '9',
    name: 'Rowing Machine',
    exercises: ['Steady State Rowing', 'Interval Rowing', 'Power Strokes', 'Endurance Rows', 'Technique Drills'],
    difficulty: 'Intermediate',
    description: 'Full-body cardiovascular and strength machine that simulates rowing motion.',
    setup: [
      'Sit on the seat with feet secured in foot straps',
      'Grip the handle with both hands',
      'Start with knees bent and arms extended',
      'Set resistance to appropriate level',
      'Maintain straight back posture'
    ],
    safety: [
      'Learn proper rowing technique before increasing intensity',
      'Keep back straight throughout the movement',
      'Use legs first, then back, then arms in the pull',
      'Reverse the sequence on the return',
      'Don\'t round your back at any point'
    ],
    muscleGroups: ['Cardiovascular System', 'Back', 'Legs', 'Arms', 'Core'],
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '10',
    name: 'Leg Curl Machine',
    exercises: ['Lying Leg Curls', 'Seated Leg Curls', 'Single Leg Curls', 'Slow Negative Curls'],
    difficulty: 'Beginner',
    description: 'Isolation machine specifically designed to target the hamstring muscles safely.',
    setup: [
      'Adjust the machine to fit your body size',
      'Lie face down or sit (depending on machine type)',
      'Position ankles under the pad',
      'Ensure hips are properly aligned',
      'Select appropriate weight'
    ],
    safety: [
      'Use full range of motion without forcing',
      'Control the weight on both up and down phases',
      'Don\'t use excessive weight that compromises form',
      'Keep hips pressed against the pad',
      'Stop if you feel any knee discomfort'
    ],
    muscleGroups: ['Hamstrings', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '11',
    name: 'Shoulder Press Machine',
    exercises: ['Seated Shoulder Press', 'Single Arm Press', 'Partial Range Press', 'Slow Negative Press'],
    difficulty: 'Beginner',
    description: 'Seated machine for shoulder development with back support and guided movement path.',
    setup: [
      'Adjust seat height so handles are at shoulder level',
      'Sit with back firmly against the pad',
      'Grip handles with palms facing forward',
      'Set feet flat on the ground',
      'Select appropriate starting weight'
    ],
    safety: [
      'Keep back against the pad throughout movement',
      'Press straight up, not forward',
      'Don\'t lock elbows aggressively at the top',
      'Lower weight with control',
      'Stop if you feel shoulder impingement'
    ],
    muscleGroups: ['Deltoids', 'Triceps', 'Upper Trapezius'],
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop&crop=center'
  },
  {
    id: '12',
    name: 'Dip Station',
    exercises: ['Parallel Bar Dips', 'Assisted Dips', 'Knee Raises', 'L-Sits'],
    difficulty: 'Intermediate',
    description: 'Bodyweight exercise station for upper body strength development, particularly triceps and chest.',
    setup: [
      'Adjust height if machine is adjustable',
      'Grip parallel bars with hands shoulder-width apart',
      'Support body weight with arms extended',
      'Keep body upright or lean slightly forward',
      'Engage core for stability'
    ],
    safety: [
      'Start with assisted version if you\'re a beginner',
      'Don\'t go too low if you have shoulder issues',
      'Keep shoulders down and back',
      'Control the movement, don\'t bounce',
      'Build up strength gradually'
    ],
    muscleGroups: ['Triceps', 'Chest', 'Anterior Deltoids'],
    image: 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center'
  }
];

export const getMachineById = (id: string): Machine | undefined => {
  return machinesData.find(machine => machine.id === id);
};

export const getMachinesByDifficulty = (difficulty: string): Machine[] => {
  return machinesData.filter(machine => 
    machine.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
};

export const getMachinesByMuscleGroup = (muscleGroup: string): Machine[] => {
  return machinesData.filter(machine => 
    machine.muscleGroups.some(group => 
      group.toLowerCase().includes(muscleGroup.toLowerCase())
    )
  );
};

export const getMachinesByExercise = (exercise: string): Machine[] => {
  return machinesData.filter(machine => 
    machine.exercises.some(ex => 
      ex.toLowerCase().includes(exercise.toLowerCase())
    )
  );
};

export const searchMachines = (query: string): Machine[] => {
  const lowercaseQuery = query.toLowerCase();
  return machinesData.filter(machine => 
    machine.name.toLowerCase().includes(lowercaseQuery) ||
    machine.description.toLowerCase().includes(lowercaseQuery) ||
    machine.exercises.some(ex => ex.toLowerCase().includes(lowercaseQuery)) ||
    machine.muscleGroups.some(group => group.toLowerCase().includes(lowercaseQuery))
  );
};