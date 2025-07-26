import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, G, Text as SvgText, Circle, Ellipse } from 'react-native-svg';
import { colors, commonStyles } from '../styles/commonStyles';
import { exercisesData, getExercisesByMuscle } from '../data/exercises';
import ExerciseGuide from './ExerciseGuide';

interface MuscleAnatomyDiagramProps {
  visible: boolean;
  onClose: () => void;
  highlightedMuscles?: string[];
  onMusclePress?: (muscle: string) => void;
}

interface MuscleGroup {
  id: string;
  name: string;
  displayName: string;
  path: string;
  color: string;
  exercises: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const diagramWidth = screenWidth - 40;
const diagramHeight = diagramWidth * 1.2;

// Define muscle groups with SVG paths for front and back views
const frontMuscleGroups: MuscleGroup[] = [
  {
    id: 'chest',
    name: 'Chest',
    displayName: 'Chest',
    path: 'M120,80 Q140,70 160,80 Q170,90 160,110 Q140,120 120,110 Q110,90 120,80 Z',
    color: colors.primary,
    exercises: 0
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    displayName: 'Shoulders',
    path: 'M90,70 Q100,60 110,70 Q115,80 110,90 Q100,95 90,90 Q85,80 90,70 Z M170,70 Q180,60 190,70 Q195,80 190,90 Q180,95 170,90 Q165,80 170,70 Z',
    color: colors.secondary,
    exercises: 0
  },
  {
    id: 'arms',
    name: 'Arms',
    displayName: 'Arms (Biceps/Triceps)',
    path: 'M70,90 Q80,85 85,95 Q85,120 80,140 Q75,145 70,140 Q65,120 65,95 Q65,85 70,90 Z M195,90 Q205,85 210,95 Q215,120 210,140 Q205,145 200,140 Q195,120 195,95 Q190,85 195,90 Z',
    color: colors.accent,
    exercises: 0
  },
  {
    id: 'core',
    name: 'Core',
    displayName: 'Core/Abs',
    path: 'M120,120 Q140,115 160,120 Q165,140 160,170 Q140,175 120,170 Q115,140 120,120 Z',
    color: colors.warning,
    exercises: 0
  },
  {
    id: 'legs',
    name: 'Legs',
    displayName: 'Legs (Quads/Calves)',
    path: 'M110,180 Q120,175 130,180 Q135,220 130,260 Q125,265 120,260 Q115,220 110,180 Z M150,180 Q160,175 170,180 Q175,220 170,260 Q165,265 160,260 Q155,220 150,180 Z',
    color: colors.success,
    exercises: 0
  }
];

const backMuscleGroups: MuscleGroup[] = [
  {
    id: 'back',
    name: 'Back',
    displayName: 'Back (Lats/Traps)',
    path: 'M110,80 Q140,70 170,80 Q175,100 170,130 Q140,140 110,130 Q105,100 110,80 Z',
    color: colors.primary,
    exercises: 0
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    displayName: 'Rear Delts',
    path: 'M85,70 Q95,60 105,70 Q110,80 105,90 Q95,95 85,90 Q80,80 85,70 Z M175,70 Q185,60 195,70 Q200,80 195,90 Q185,95 175,90 Q170,80 175,70 Z',
    color: colors.secondary,
    exercises: 0
  },
  {
    id: 'arms',
    name: 'Arms',
    displayName: 'Arms (Triceps)',
    path: 'M65,90 Q75,85 80,95 Q80,120 75,140 Q70,145 65,140 Q60,120 60,95 Q60,85 65,90 Z M200,90 Q210,85 215,95 Q220,120 215,140 Q210,145 205,140 Q200,120 200,95 Q195,85 200,90 Z',
    color: colors.accent,
    exercises: 0
  },
  {
    id: 'legs',
    name: 'Legs',
    displayName: 'Legs (Hamstrings/Glutes)',
    path: 'M110,140 Q140,135 170,140 Q175,160 170,180 Q140,185 110,180 Q105,160 110,140 Z M110,190 Q120,185 130,190 Q135,230 130,270 Q125,275 120,270 Q115,230 110,190 Z M150,190 Q160,185 170,190 Q175,230 170,270 Q165,275 160,270 Q155,230 150,190 Z',
    color: colors.success,
    exercises: 0
  }
];

export default function MuscleAnatomyDiagram({ 
  visible, 
  onClose, 
  highlightedMuscles = [], 
  onMusclePress 
}: MuscleAnatomyDiagramProps) {
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // Calculate exercise counts for each muscle group
  const updateMuscleGroupsWithCounts = (muscleGroups: MuscleGroup[]) => {
    return muscleGroups.map(group => ({
      ...group,
      exercises: getExercisesByMuscle(group.name).length
    }));
  };

  const frontMuscles = updateMuscleGroupsWithCounts(frontMuscleGroups);
  const backMuscles = updateMuscleGroupsWithCounts(backMuscleGroups);
  const currentMuscles = viewMode === 'front' ? frontMuscles : backMuscles;

  const handleMusclePress = (muscle: MuscleGroup) => {
    console.log('Muscle pressed:', muscle.name);
    setSelectedMuscle(muscle.name);
    setShowExercises(true);
    if (onMusclePress) {
      onMusclePress(muscle.name);
    }
  };

  const getMuscleOpacity = (muscle: MuscleGroup) => {
    if (highlightedMuscles.length === 0) return 0.7;
    return highlightedMuscles.includes(muscle.name) ? 1.0 : 0.3;
  };

  const getMuscleColor = (muscle: MuscleGroup) => {
    if (highlightedMuscles.includes(muscle.name)) {
      return colors.primary;
    }
    return muscle.color;
  };

  const selectedMuscleExercises = selectedMuscle ? getExercisesByMuscle(selectedMuscle) : [];

  console.log('MuscleAnatomyDiagram rendered, viewMode:', viewMode);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
            Muscle Anatomy Guide
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* View Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: viewMode === 'front' ? colors.primary : 'transparent' }
            ]}
            onPress={() => {
              console.log('Switching to front view');
              setViewMode('front');
            }}
          >
            <Ionicons 
              name="person" 
              size={20} 
              color={viewMode === 'front' ? colors.white : colors.textSecondary}
            />
            <Text style={[
              styles.toggleText,
              { color: viewMode === 'front' ? colors.white : colors.textSecondary }
            ]}>
              Front
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: viewMode === 'back' ? colors.primary : 'transparent' }
            ]}
            onPress={() => {
              console.log('Switching to back view');
              setViewMode('back');
            }}
          >
            <Ionicons 
              name="person" 
              size={20} 
              color={viewMode === 'back' ? colors.white : colors.textSecondary}
              style={{ transform: [{ scaleX: -1 }] }}
            />
            <Text style={[
              styles.toggleText,
              { color: viewMode === 'back' ? colors.white : colors.textSecondary }
            ]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Instructions */}
          <View style={[commonStyles.card, styles.instructionCard]}>
            <View style={styles.instructionRow}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={[commonStyles.text, { marginLeft: 8, flex: 1 }]}>
                Tap on any muscle group to see exercises that target it
              </Text>
            </View>
          </View>

          {/* Anatomy Diagram */}
          <View style={styles.diagramContainer}>
            <View style={styles.diagramWrapper}>
              <Svg width={diagramWidth} height={diagramHeight} viewBox="0 0 280 320">
                {/* Body outline */}
                <Path
                  d="M140,20 Q160,15 180,30 Q190,50 185,70 Q180,90 175,110 Q170,130 165,150 Q160,170 155,190 Q150,210 145,230 Q140,250 135,270 Q130,290 125,310 L155,310 L155,270 Q160,250 165,230 Q170,210 175,190 Q180,170 185,150 Q190,130 195,110 Q200,90 205,70 Q210,50 200,30 Q180,15 160,20 Q140,15 120,20 Q100,15 80,30 Q70,50 75,70 Q80,90 85,110 Q90,130 95,150 Q100,170 105,190 Q110,210 115,230 Q120,250 125,270 L125,310 L155,310 Q150,290 145,270 Q140,250 135,230 Q130,210 125,190 Q120,170 115,150 Q110,130 105,110 Q100,90 95,70 Q90,50 100,30 Q120,15 140,20 Z"
                  fill="none"
                  stroke={colors.border}
                  strokeWidth="2"
                />

                {/* Muscle groups */}
                {currentMuscles.map((muscle, index) => (
                  <G key={muscle.id}>
                    <Path
                      d={muscle.path}
                      fill={getMuscleColor(muscle)}
                      fillOpacity={getMuscleOpacity(muscle)}
                      stroke={colors.border}
                      strokeWidth="1"
                      onPress={() => handleMusclePress(muscle)}
                    />
                  </G>
                ))}

                {/* Labels */}
                <SvgText
                  x="140"
                  y="15"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={colors.text}
                >
                  {viewMode === 'front' ? 'FRONT VIEW' : 'BACK VIEW'}
                </SvgText>
              </Svg>
            </View>
          </View>

          {/* Muscle Legend */}
          <View style={[commonStyles.card, styles.legendCard]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Muscle Groups ({viewMode === 'front' ? 'Front' : 'Back'})
            </Text>
            
            {currentMuscles.map((muscle) => (
              <TouchableOpacity
                key={muscle.id}
                style={styles.legendItem}
                onPress={() => handleMusclePress(muscle)}
              >
                <View style={[styles.colorIndicator, { backgroundColor: muscle.color }]} />
                <View style={styles.legendContent}>
                  <Text style={[commonStyles.text, styles.legendTitle]}>
                    {muscle.displayName}
                  </Text>
                  <Text style={[commonStyles.textSecondary, styles.legendSubtitle]}>
                    {muscle.exercises} exercises available
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tips */}
          <View style={[commonStyles.card, styles.tipCard]}>
            <View style={styles.instructionRow}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                  Training Tip
                </Text>
                <Text style={[commonStyles.textSecondary]}>
                  For balanced development, train both front and back muscle groups. 
                  Focus on compound movements that work multiple muscle groups together.
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Exercise List Modal */}
        <Modal
          visible={showExercises}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
            {/* Exercise List Header */}
            <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
              <TouchableOpacity onPress={() => {
                console.log('Closing exercise list');
                setShowExercises(false);
                setSelectedMuscle(null);
              }}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </TouchableOpacity>
              <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
                {selectedMuscle} Exercises
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.exerciseListContainer}>
                <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                  {selectedMuscleExercises.length} exercises targeting {selectedMuscle}
                </Text>

                {selectedMuscleExercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[commonStyles.card, styles.exerciseCard]}
                    onPress={() => {
                      console.log('Selected exercise from anatomy:', exercise.name);
                      setSelectedExercise(exercise.name);
                    }}
                  >
                    <View style={styles.exerciseHeader}>
                      <Text style={[commonStyles.text, styles.exerciseTitle]}>
                        {exercise.name}
                      </Text>
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(exercise.difficulty) }
                      ]}>
                        <Text style={styles.difficultyText}>
                          {exercise.difficulty.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={[commonStyles.textSecondary, styles.exerciseDescription]}>
                      {exercise.description}
                    </Text>

                    <View style={styles.exerciseDetails}>
                      <View style={styles.exerciseDetailItem}>
                        <Ionicons name="fitness" size={14} color={colors.textSecondary} />
                        <Text style={styles.exerciseDetailText}>
                          {exercise.category}
                        </Text>
                      </View>
                      
                      {exercise.sets && exercise.reps && (
                        <View style={styles.exerciseDetailItem}>
                          <Ionicons name="repeat" size={14} color={colors.textSecondary} />
                          <Text style={styles.exerciseDetailText}>
                            {exercise.sets} × {exercise.reps}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                {selectedMuscleExercises.length === 0 && (
                  <View style={styles.noExercisesContainer}>
                    <Ionicons name="fitness" size={48} color={colors.textSecondary} />
                    <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
                      No exercises found for {selectedMuscle}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        </Modal>

        {/* Exercise Guide Modal */}
        {selectedExercise && (
          <ExerciseGuide
            exerciseName={selectedExercise}
            muscle={exercisesData.find(e => e.name === selectedExercise)?.muscle || ''}
            instructions={exercisesData.find(e => e.name === selectedExercise)?.description}
            difficulty={exercisesData.find(e => e.name === selectedExercise)?.difficulty}
          />
        )}
      </View>
    </Modal>
  );
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return colors.success;
    case 'Intermediate': return colors.warning;
    case 'Advanced': return colors.error;
    default: return colors.primary;
  }
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  toggleText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  instructionCard: {
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diagramContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  diagramWrapper: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    boxShadow: `0px 4px 12px ${colors.background}80`,
    elevation: 4,
  },
  legendCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendContent: {
    flex: 1,
  },
  legendTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  legendSubtitle: {
    fontSize: 12,
  },
  tipCard: {
    backgroundColor: colors.backgroundAlt,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  exerciseListContainer: {
    padding: 20,
  },
  exerciseCard: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  exerciseDescription: {
    marginBottom: 12,
    lineHeight: 20,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  noExercisesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});