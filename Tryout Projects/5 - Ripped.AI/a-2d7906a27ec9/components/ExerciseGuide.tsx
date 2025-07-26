import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import MuscleAnatomyDiagram from './MuscleAnatomyDiagram';

interface ExerciseGuideProps {
  exerciseName: string;
  muscle: string;
  instructions?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const { width: screenWidth } = Dimensions.get('window');

// Exercise drawing mapping - using simple, clear illustrations
const getExerciseDrawingUrl = (exerciseName: string): string => {
  const exerciseDrawingMap: { [key: string]: string } = {
    'Bench Press': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Squats': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&crop=center',
    'Deadlifts': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop&crop=center',
    'Pull-ups': 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center',
    'Push-ups': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&crop=center',
    'Overhead Press': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop&crop=center',
    'Barbell Rows': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop&crop=center',
    'Dips': 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center',
    'Lunges': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&crop=center',
    'Plank': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Burpees': 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center',
    'Mountain Climbers': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&crop=center',
    'Bicep Curls': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop&crop=center',
    'Tricep Extensions': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Leg Press': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&crop=center',
    'Lat Pulldowns': 'https://images.unsplash.com/photo-1599058918133-58d2bb90c1a1?w=600&h=400&fit=crop&crop=center',
  };

  return exerciseDrawingMap[exerciseName] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center';
};

// Get equipment drawing URL
const getEquipmentDrawingUrl = (exerciseName: string): string => {
  const equipmentDrawingMap: { [key: string]: string } = {
    'Bench Press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Squats': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Deadlifts': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Pull-ups': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Push-ups': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&crop=center',
    'Overhead Press': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Barbell Rows': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Dips': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Lunges': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Plank': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&crop=center',
    'Burpees': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&crop=center',
    'Mountain Climbers': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop&crop=center',
    'Bicep Curls': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Tricep Extensions': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center',
    'Leg Press': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
    'Lat Pulldowns': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center',
  };

  return equipmentDrawingMap[exerciseName] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center';
};

// Create simple ASCII-style drawings for exercises
const getExerciseDrawing = (exerciseName: string): string => {
  const drawingMap: { [key: string]: string } = {
    'Bench Press': `
    BENCH PRESS FORM
    ================
    
    Starting Position:
    ┌─────────────────┐
    │  ●  ←  Head     │
    │ /|\\  ←  Arms    │
    │ / \\  ←  Legs    │
    └─────────────────┘
    ═══════════════════  ← Bench
    
    Movement:
    1. Lie flat on bench
    2. Grip bar wider than shoulders
    3. Lower bar to chest
    4. Press up explosively
    `,
    'Squats': `
    SQUAT FORM
    ==========
    
    Starting Position:    Down Position:
         ●                    ●
        /|\\                  /|\\
        / \\                 /   \\
    ═══════════         ═══════════
    
    Movement:
    1. Feet shoulder-width apart
    2. Lower hips back and down
    3. Keep chest up
    4. Drive through heels up
    `,
    'Deadlifts': `
    DEADLIFT FORM
    =============
    
    Starting:           Lifting:
         ●                  ●
        /|\\                /|\\
        / \\                / \\
    ════════           ════════
    ▬▬▬▬▬▬▬▬  ← Bar    ▬▬▬▬▬▬▬▬
    
    Movement:
    1. Bar over mid-foot
    2. Grip just outside legs
    3. Keep back straight
    4. Drive through heels
    `,
    'Pull-ups': `
    PULL-UP FORM
    ============
    
    Hanging:            Up Position:
    ▬▬▬▬▬▬▬▬▬▬▬▬       ▬▬▬▬▬▬▬▬▬▬▬▬
         ●                   ●
        /|\\                 /|\\
        / \\                 / \\
    
    Movement:
    1. Hang with arms extended
    2. Pull body up
    3. Chin over bar
    4. Lower with control
    `,
    'Push-ups': `
    PUSH-UP FORM
    ============
    
    Up Position:        Down Position:
         ●                   ●
        /|\\                 /|\\
        / \\                 / \\
    ═══════════         ═══════════
    
    Movement:
    1. Plank position
    2. Lower chest to ground
    3. Keep body straight
    4. Push up explosively
    `,
    'Overhead Press': `
    OVERHEAD PRESS
    ==============
    
    Starting:           Pressed:
         ●                  ●
        /|\\                /|\\
        / \\                / \\
      ▬▬▬▬▬              ▬▬▬▬▬
    
    Movement:
    1. Bar at shoulder height
    2. Press straight up
    3. Keep core tight
    4. Lower with control
    `,
    'Plank': `
    PLANK FORM
    ==========
    
    Proper Position:
         ●
        /|\\
        / \\
    ═══════════
    
    Key Points:
    1. Straight line head to heels
    2. Engage core
    3. Don't let hips sag
    4. Breathe normally
    `
  };

  return drawingMap[exerciseName] || `
    EXERCISE FORM
    =============
    
    Follow proper form and technique
    for this exercise. Focus on:
    
    1. Controlled movements
    2. Proper breathing
    3. Full range of motion
    4. Safety first
  `;
};

// Get detailed exercise instructions
const getDetailedInstructions = (exerciseName: string): string[] => {
  const instructionsMap: { [key: string]: string[] } = {
    'Bench Press': [
      'Lie flat on bench with feet firmly planted on the ground',
      'Grip the bar with hands slightly wider than shoulder-width apart',
      'Unrack the bar and position it directly over your chest',
      'Lower the bar slowly to your chest, touching lightly at nipple level',
      'Press the bar up explosively, extending arms fully but not locking out aggressively',
      'Keep your core tight and maintain natural arch in your back throughout'
    ],
    'Squats': [
      'Stand with feet shoulder-width apart, toes slightly pointed outward',
      'Keep chest up, shoulders back, and core engaged throughout movement',
      'Initiate movement by pushing hips back and bending at knees simultaneously',
      'Descend until thighs are parallel to ground or as low as mobility allows',
      'Drive through heels and push floor away to return to starting position',
      'Keep knees tracking over toes throughout the movement'
    ],
    'Deadlifts': [
      'Stand with feet hip-width apart, bar positioned over mid-foot',
      'Grip bar with hands just outside your legs, mixed or double overhand grip',
      'Keep chest up, shoulders back, and maintain neutral spine',
      'Engage lats by pulling shoulder blades down and back',
      'Lift by driving through heels and extending hips and knees simultaneously',
      'Keep bar close to body throughout entire range of motion',
      'Stand tall at top, then reverse movement to lower bar with control'
    ],
    'Pull-ups': [
      'Hang from bar with arms fully extended and shoulders engaged',
      'Use overhand grip with hands positioned shoulder-width apart',
      'Engage core and pull body up by driving elbows down and back',
      'Continue pulling until chin clears the bar completely',
      'Lower with control to full arm extension, maintaining shoulder engagement',
      'Avoid swinging, kipping, or using momentum to complete reps'
    ],
    'Push-ups': [
      'Start in plank position with hands placed directly under shoulders',
      'Keep body in straight line from head to heels throughout movement',
      'Engage core and glutes to maintain proper body alignment',
      'Lower chest to ground with elbows at 45-degree angle to torso',
      'Push up explosively to starting position, fully extending arms',
      'Breathe in on the way down, breathe out on the way up'
    ],
    'Overhead Press': [
      'Stand with feet shoulder-width apart, core engaged',
      'Hold barbell or dumbbells at shoulder height with palms facing forward',
      'Press weight straight up overhead, keeping core tight',
      'Avoid arching back excessively during the press',
      'Lower weight with control back to starting position',
      'Keep movement strict and controlled throughout'
    ],
    'Barbell Rows': [
      'Stand with feet hip-width apart, holding barbell with overhand grip',
      'Hinge at hips and lean forward, keeping back straight and chest up',
      'Let arms hang straight down with bar at arm&apos;s length',
      'Pull bar to lower chest/upper abdomen, squeezing shoulder blades together',
      'Lower bar with control back to starting position',
      'Keep core tight throughout movement to protect lower back'
    ],
    'Dips': [
      'Position yourself between parallel bars or on dip station',
      'Support your body weight with arms extended and shoulders over hands',
      'Keep body upright with slight forward lean',
      'Lower body by bending elbows until shoulders are below elbows',
      'Push up explosively to starting position without locking elbows aggressively',
      'Avoid swinging or using momentum'
    ],
    'Lunges': [
      'Stand tall with feet hip-width apart',
      'Step forward with one leg, lowering hips until both knees are bent at 90 degrees',
      'Keep front knee directly above ankle, not pushed out past toes',
      'Keep torso upright and core engaged',
      'Push back to starting position through front heel',
      'Alternate legs or complete all reps on one side before switching'
    ],
    'Plank': [
      'Start in push-up position with forearms on ground instead of hands',
      'Keep body in straight line from head to heels',
      'Engage core, glutes, and legs to maintain position',
      'Keep head in neutral position, looking at floor',
      'Breathe normally while holding position',
      'Avoid letting hips sag or pike up'
    ]
  };

  return instructionsMap[exerciseName] || [
    'Follow proper form and technique for this exercise',
    'Start with lighter weight if you&apos;re a beginner',
    'Focus on controlled movements rather than speed',
    'Breathe properly throughout the exercise',
    'Stop immediately if you feel pain or discomfort'
  ];
};

// Get equipment needed for exercise
const getEquipmentNeeded = (exerciseName: string): string[] => {
  const equipmentMap: { [key: string]: string[] } = {
    'Bench Press': ['Barbell', 'Weight plates', 'Bench', 'Safety bars/spotter'],
    'Squats': ['Barbell', 'Weight plates', 'Squat rack', 'Safety bars'],
    'Deadlifts': ['Barbell', 'Weight plates', 'Lifting platform (optional)'],
    'Pull-ups': ['Pull-up bar', 'Resistance bands (for assistance)'],
    'Push-ups': ['Exercise mat (optional)', 'Push-up handles (optional)'],
    'Overhead Press': ['Barbell or dumbbells', 'Weight plates'],
    'Barbell Rows': ['Barbell', 'Weight plates'],
    'Dips': ['Dip station', 'Parallel bars', 'Resistance bands (for assistance)'],
    'Lunges': ['Dumbbells (optional)', 'Exercise mat'],
    'Plank': ['Exercise mat', 'Timer']
  };

  return equipmentMap[exerciseName] || ['Basic gym equipment'];
};

// Get equipment descriptions for beginners
const getEquipmentDescriptions = (exerciseName: string): { [key: string]: string } => {
  const equipmentDescMap: { [key: string]: { [key: string]: string } } = {
    'Bench Press': {
      'Barbell': 'Long metal bar (usually 45 lbs/20 kg) that you add weight plates to',
      'Weight plates': 'Round metal discs that slide onto the barbell ends',
      'Bench': 'Flat padded surface to lie on, usually adjustable',
      'Safety bars/spotter': 'Metal bars set at chest height for safety, or a person to help'
    },
    'Squats': {
      'Barbell': 'Long metal bar placed across your upper back/shoulders',
      'Weight plates': 'Round metal discs added to both ends of the barbell',
      'Squat rack': 'Metal frame with adjustable bar holders and safety bars',
      'Safety bars': 'Horizontal bars set at your lowest squat position for safety'
    },
    'Deadlifts': {
      'Barbell': 'Long metal bar loaded with weight plates',
      'Weight plates': 'Round metal discs, usually 45 lb plates for proper height',
      'Lifting platform': 'Rubber surface to protect floor and reduce noise'
    },
    'Pull-ups': {
      'Pull-up bar': 'Horizontal bar mounted high enough to hang from',
      'Resistance bands': 'Elastic bands to assist with the movement if needed'
    },
    'Push-ups': {
      'Exercise mat': 'Padded surface for comfort and grip',
      'Push-up handles': 'Small handles that reduce wrist strain'
    }
  };

  return equipmentDescMap[exerciseName] || {};
};

export default function ExerciseGuide({ exerciseName, muscle, instructions, difficulty }: ExerciseGuideProps) {
  // Comprehensive null checks for all props
  const safeExerciseName = exerciseName && typeof exerciseName === 'string' ? exerciseName.trim() : 'Unknown Exercise';
  const safeMuscle = muscle && typeof muscle === 'string' ? muscle.trim() : 'General';
  const safeInstructions = instructions && typeof instructions === 'string' ? instructions.trim() : undefined;
  const safeDifficulty = difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(difficulty) ? difficulty : undefined;
  
  console.log('ExerciseGuide props validated:', { safeExerciseName, safeMuscle, safeInstructions, safeDifficulty });
  
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'drawing' | 'equipment' | 'instructions' | 'form' | 'anatomy'>('drawing');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAnatomyDiagram, setShowAnatomyDiagram] = useState(false);

  // Use safe values for all function calls
  const drawingUrl = getExerciseDrawingUrl(safeExerciseName);
  const equipmentUrl = getEquipmentDrawingUrl(safeExerciseName);
  const exerciseDrawing = getExerciseDrawing(safeExerciseName);
  const detailedInstructions = getDetailedInstructions(safeExerciseName);
  const equipment = getEquipmentNeeded(safeExerciseName);
  const equipmentDescriptions = getEquipmentDescriptions(safeExerciseName);

  const getDifficultyColor = (diff?: string) => {
    // Add null check for colors object and safe property access
    if (!colors || typeof colors !== 'object') {
      console.warn('Colors object not available, using fallback');
      return '#B8860B'; // Fallback gold color
    }
    
    switch (diff) {
      case 'Beginner': return colors?.success || '#2E7D32';
      case 'Intermediate': return colors?.warning || '#F57C00';
      case 'Advanced': return colors?.error || '#D32F2F';
      default: return colors?.primary || '#B8860B';
    }
  };

  console.log('ExerciseGuide rendered for:', safeExerciseName);

  return (
    <View>
      {/* Exercise Preview Card */}
      <TouchableOpacity 
        style={[commonStyles.card, styles.previewCard]}
        onPress={() => {
          console.log('Opening exercise guide for:', exerciseName);
          setShowModal(true);
        }}
      >
        <View style={styles.previewContent}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: drawingUrl }}
              style={styles.previewImage}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <View style={[styles.previewImage, styles.imagePlaceholder]}>
                <Ionicons name="image" size={24} color={colors.textSecondary} />
              </View>
            )}
          </View>
          
          <View style={styles.previewTextContainer}>
            <View style={styles.titleRow}>
              <Text style={[commonStyles.text, styles.exerciseTitle]}>
                {safeExerciseName}
              </Text>
              {safeDifficulty && (
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(safeDifficulty) }]}>
                  <Text style={styles.difficultyText}>
                    {safeDifficulty.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={[commonStyles.textSecondary, styles.muscleText]}>
              Target: {safeMuscle}
            </Text>
            
            <View style={styles.actionRow}>
              <Ionicons name="eye" size={16} color={colors.primary} />
              <Text style={[commonStyles.textSecondary, styles.actionText]}>
                Tap to view visual guide
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Exercise Guide Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
            <TouchableOpacity onPress={() => {
              console.log('Closing exercise guide');
              setShowModal(false);
            }}>
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
              Visual Exercise Guide
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Exercise Title */}
          <View style={styles.modalHeader}>
            <Text style={[commonStyles.title, styles.modalTitle]}>
              {safeExerciseName}
            </Text>
            <Text style={[commonStyles.textSecondary, styles.modalSubtitle]}>
              Primary Muscle: {safeMuscle}
            </Text>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'drawing', label: 'Form', icon: 'body' },
              { key: 'anatomy', label: 'Muscles', icon: 'body-outline' },
              { key: 'equipment', label: 'Equipment', icon: 'barbell' },
              { key: 'instructions', label: 'Steps', icon: 'list' },
              { key: 'form', label: 'Diagram', icon: 'analytics' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  { backgroundColor: activeTab === tab.key ? colors.primary : 'transparent' }
                ]}
                onPress={() => {
                  console.log('Switching to tab:', tab.key);
                  setActiveTab(tab.key as any);
                }}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={20} 
                  color={activeTab === tab.key ? colors.white : colors.textSecondary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? colors.white : colors.textSecondary }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
            {activeTab === 'drawing' && (
              <View style={commonStyles.section}>
                <Image 
                  source={{ uri: drawingUrl }}
                  style={styles.fullImage}
                  resizeMode="cover"
                />
                
                <View style={[commonStyles.card, styles.infoCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={20} color={colors?.primary || '#B8860B'} style={styles.infoIcon} />
                    <Text style={[commonStyles.text, { flex: 1 }]}>
                      {safeInstructions || 'Study the image above to understand proper form and positioning for this exercise.'}
                    </Text>
                  </View>
                </View>

                <View style={[commonStyles.card, styles.tipCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="bulb" size={20} color={colors.warning} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Beginner Tip
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Start with bodyweight or very light weights to master the movement pattern before adding load.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'anatomy' && (
              <View style={commonStyles.section}>
                <TouchableOpacity
                  style={[commonStyles.card, styles.anatomyCard]}
                  onPress={() => {
                    console.log('Opening anatomy diagram from exercise guide');
                    setShowAnatomyDiagram(true);
                  }}
                >
                  <View style={styles.anatomyCardHeader}>
                    <Ionicons name="body" size={24} color={colors.primary} />
                    <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
                      Muscle Anatomy
                    </Text>
                  </View>
                  <Text style={[commonStyles.textSecondary, { marginTop: 8, marginBottom: 16 }]}>
                    See which muscles are targeted by {safeExerciseName} on an interactive anatomy diagram.
                  </Text>
                  <View style={styles.anatomyPreview}>
                    <View style={[styles.muscleHighlight, { backgroundColor: colors?.primary || '#B8860B' }]}>
                      <Text style={[commonStyles.text, { color: colors?.white || '#FFFFFF', fontWeight: '600' }]}>
                        Primary: {safeMuscle}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.anatomyAction}>
                    <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600' }]}>
                      Tap to view interactive diagram
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </View>
                </TouchableOpacity>

                <View style={[commonStyles.card, styles.infoCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Understanding Muscle Targeting
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        The anatomy diagram shows which muscles are primarily worked during {safeExerciseName}. 
                        Understanding this helps you plan balanced workouts and track your progress.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'equipment' && (
              <View style={commonStyles.section}>
                <Image 
                  source={{ uri: equipmentUrl }}
                  style={styles.fullImage}
                  resizeMode="cover"
                />
                
                <Text style={[commonStyles.subtitle, { marginBottom: 20, marginTop: 16 }]}>
                  Equipment Needed
                </Text>
                
                {Array.isArray(equipment) ? equipment.map((item, index) => {
                  // Add null check for each equipment item
                  if (!item || typeof item !== 'string') {
                    console.warn('Invalid equipment item at index:', index, item);
                    return null;
                  }
                  
                  return (
                    <View key={index} style={[commonStyles.card, { marginBottom: 12 }]}>
                      <View style={styles.equipmentRow}>
                        <Ionicons name="checkmark-circle" size={20} color={colors?.success || '#2E7D32'} style={styles.infoIcon} />
                        <View style={{ flex: 1 }}>
                          <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                            {item}
                          </Text>
                          {equipmentDescriptions && typeof equipmentDescriptions === 'object' && equipmentDescriptions[item] && (
                            <Text style={[commonStyles.textSecondary, { marginTop: 4, fontSize: 14 }]}>
                              {equipmentDescriptions[item]}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                }) : (
                  <Text style={[commonStyles.textSecondary]}>No equipment information available.</Text>
                )}

                <View style={[commonStyles.card, styles.infoCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="help-circle" size={20} color={colors.primary} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Don&apos;t Have Equipment?
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Ask gym staff for equipment location or alternatives. Most gyms have multiple options for each exercise type.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'instructions' && (
              <View style={commonStyles.section}>
                <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                  Step-by-Step Instructions
                </Text>
                
                {Array.isArray(detailedInstructions) ? detailedInstructions.map((instruction, index) => {
                  // Add null check for each instruction
                  if (!instruction || typeof instruction !== 'string') {
                    console.warn('Invalid instruction at index:', index, instruction);
                    return null;
                  }
                  
                  return (
                    <View key={index} style={[commonStyles.card, { marginBottom: 12 }]}>
                      <View style={styles.instructionRow}>
                        <View style={[styles.stepNumber, { backgroundColor: colors?.primary || '#B8860B' }]}>
                          <Text style={[styles.stepNumberText, { color: colors?.white || '#FFFFFF' }]}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={[commonStyles.text, { flex: 1 }]}>
                          {instruction}
                        </Text>
                      </View>
                    </View>
                  );
                }) : (
                  <Text style={[commonStyles.textSecondary]}>No detailed instructions available.</Text>
                )}

                {/* Safety Tips */}
                <View style={[commonStyles.card, styles.safetyCard, { backgroundColor: colors?.warning || '#F57C00' }]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="warning" size={20} color={colors?.white || '#FFFFFF'} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, styles.safetyTitle, { color: colors?.white || '#FFFFFF' }]}>
                        Safety Tips
                      </Text>
                      <Text style={[commonStyles.text, styles.safetyText, { color: colors?.white || '#FFFFFF' }]}>
                        • Start with lighter weights to master the form{'\n'}
                        • Warm up properly before exercising{'\n'}
                        • Stop if you feel pain or discomfort{'\n'}
                        • Consider working with a trainer initially{'\n'}
                        • Focus on quality over quantity
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'form' && (
              <View style={commonStyles.section}>
                <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                  Form Diagram
                </Text>
                
                <View style={[commonStyles.card, styles.diagramCard]}>
                  <Text style={styles.diagramText}>
                    {exerciseDrawing}
                  </Text>
                </View>

                <View style={[commonStyles.card, styles.infoCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="eye" size={20} color={colors.primary} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Visual Learning
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Use this simple diagram to understand the basic movement pattern and body positioning for {safeExerciseName}.
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[commonStyles.card, styles.tipCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="school" size={20} color={colors.warning} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Practice Tip
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Practice the movement without weight first. Focus on the motion pattern shown in the diagram above.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Muscle Anatomy Diagram Modal */}
      <MuscleAnatomyDiagram
        visible={showAnatomyDiagram}
        onClose={() => {
          console.log('Closing anatomy diagram from exercise guide');
          setShowAnatomyDiagram(false);
        }}
        highlightedMuscles={[safeMuscle]}
        onMusclePress={(selectedMuscle) => {
          console.log('Muscle selected from exercise anatomy:', selectedMuscle);
          setShowAnatomyDiagram(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewCard: {
    marginBottom: 16,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: colors.backgroundAlt,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseTitle: {
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  muscleText: {
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
  },
  modalHeader: {
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fullImage: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.6,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: colors.backgroundAlt,
  },
  infoCard: {
    backgroundColor: colors.backgroundAlt,
  },
  tipCard: {
    backgroundColor: colors.backgroundAlt,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  safetyCard: {
    backgroundColor: colors.warning,
    marginTop: 20,
  },
  safetyTitle: {
    color: colors.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  safetyText: {
    color: colors.white,
    fontSize: 14,
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  diagramCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    marginBottom: 16,
  },
  diagramText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
  anatomyCard: {
    backgroundColor: colors.backgroundAlt,
    marginBottom: 16,
  },
  anatomyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anatomyPreview: {
    marginBottom: 16,
  },
  muscleHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  anatomyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});