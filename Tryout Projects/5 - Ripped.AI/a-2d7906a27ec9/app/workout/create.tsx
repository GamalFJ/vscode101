import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutGenerator } from '../../services/workoutGenerator';
import { WorkoutPlanStorage } from '../../services/workoutPlanStorage';
import MusicService, { MusicPlatform, MusicSettings as MusicSettingsType } from '../../services/musicService';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  muscle: string;
  instructions?: string;
}

interface WorkoutGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function CreateWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [workoutDuration, setWorkoutDuration] = useState<number>(45);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<any>(null);
  const [musicSettings, setMusicSettings] = useState<MusicSettingsType | null>(null);
  const [connectedPlatform, setConnectedPlatform] = useState<MusicPlatform | null>(null);

  const workoutGoals: WorkoutGoal[] = [
    {
      id: 'fat_loss',
      title: 'Fat Loss',
      description: 'High intensity, metabolic training',
      icon: 'flash'
    },
    {
      id: 'strength',
      title: 'Build Strength',
      description: 'Focus on heavy compound movements',
      icon: 'barbell'
    },
    {
      id: 'muscle_gain',
      title: 'Muscle Gain',
      description: 'Hypertrophy-focused training',
      icon: 'fitness'
    },
    {
      id: 'endurance',
      title: 'Endurance',
      description: 'Cardiovascular and muscular endurance',
      icon: 'heart'
    },
    {
      id: 'athletic_performance',
      title: 'Athletic Performance',
      description: 'Sport-specific training',
      icon: 'trophy'
    },
    {
      id: 'general_fitness',
      title: 'General Fitness',
      description: 'Well-rounded workout routine',
      icon: 'star'
    }
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;

  useEffect(() => {
    loadMusicSettings();
  }, []);

  const loadMusicSettings = async () => {
    try {
      console.log('🎵 Loading music settings in CreateWorkout...');
      await MusicService.initialize();
      const settings = await MusicService.loadSettings();
      const platform = MusicService.getConnectedPlatform();
      setMusicSettings(settings);
      setConnectedPlatform(platform || null);
      console.log('🎵 Music settings loaded in CreateWorkout:', { 
        settings, 
        platform: platform?.name,
        autoPlay: settings.autoPlayEnabled 
      });
    } catch (error) {
      console.error('❌ Failed to load music settings:', error);
    }
  };

  const generateWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Missing Information', 'Please enter a workout name.');
      return;
    }
    
    if (!selectedGoal) {
      Alert.alert('Missing Information', 'Please select a workout goal.');
      return;
    }

    setIsGenerating(true);
    console.log('Generating workout with goal:', selectedGoal, 'difficulty:', selectedDifficulty, 'duration:', workoutDuration);

    // Simulate AI workout generation with realistic delay
    setTimeout(() => {
      try {
        const workoutPlan = WorkoutGenerator.generateSingleWorkout(
          selectedGoal,
          selectedDifficulty,
          workoutDuration
        );

        const generatedExercises: Exercise[] = workoutPlan.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          restTime: ex.restTime,
          muscle: ex.muscle,
          instructions: ex.instructions
        }));

        setExercises(generatedExercises);
        console.log('Generated workout plan:', workoutPlan);
      } catch (error) {
        console.error('Error generating workout:', error);
        Alert.alert('Error', 'Failed to generate workout. Please try again.');
      }
      
      setIsGenerating(false);
    }, 1500);
  };

  const generateWeeklyPlan = async () => {
    if (!selectedGoal) {
      Alert.alert('Missing Information', 'Please select a workout goal.');
      return;
    }

    setIsGenerating(true);
    console.log('Generating weekly plan with goal:', selectedGoal, 'difficulty:', selectedDifficulty);

    setTimeout(() => {
      try {
        const plan = WorkoutGenerator.generateWeeklyPlan(
          selectedGoal,
          selectedDifficulty,
          workoutDuration
        );

        setWeeklyPlan(plan);
        console.log('Generated weekly plan:', plan);
      } catch (error) {
        console.error('Error generating weekly plan:', error);
        Alert.alert('Error', 'Failed to generate weekly plan. Please try again.');
      }
      
      setIsGenerating(false);
    }, 2000);
  };

  const addCustomExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: 'New Exercise',
      sets: 3,
      reps: '10-12',
      restTime: 60,
      muscle: 'Custom',
      instructions: 'Add your instructions here'
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Missing Information', 'Please enter a workout name.');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one exercise.');
      return;
    }

    try {
      // Create a workout plan object
      const workoutPlan = {
        id: Date.now().toString(),
        name: workoutName,
        goal: selectedGoal,
        difficulty: selectedDifficulty,
        duration: workoutDuration,
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          restTime: ex.restTime,
          muscle: ex.muscle,
          instructions: ex.instructions || '',
          difficulty: selectedDifficulty,
          equipment: []
        })),
        description: `Custom ${selectedGoal.replace('_', ' ')} workout`,
        targetMuscles: [...new Set(exercises.map(ex => ex.muscle))],
        estimatedCalories: Math.round(workoutDuration * 7) // Rough estimate
      };

      await WorkoutPlanStorage.saveSingleWorkout(workoutPlan);

      Alert.alert(
        'Workout Saved!',
        `"${workoutName}" has been saved to your workout library.`,
        [
          { text: 'View Workouts', onPress: () => router.push('/workouts') },
          { 
            text: 'Start Now', 
            onPress: () => router.push({
              pathname: '/workout/active',
              params: {
                workoutName: workoutName,
                exercises: JSON.stringify(exercises)
              }
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
    
    console.log('Workout saved:', { name: workoutName, exercises });
  };

  const testMusicIntegration = async () => {
    try {
      console.log('🎵 Testing music integration...');
      await MusicService.initialize();
      const success = await MusicService.autoPlayWorkoutMusic();
      
      if (success) {
        Alert.alert(
          '🎵 Music Test Successful!',
          'Your music integration is working! Check the console for details.',
          [{ text: 'Great!' }]
        );
      } else {
        Alert.alert(
          '🔇 Music Test Failed',
          'Music integration is not working. Please check:\n\n• Is a music platform connected?\n• Is auto-play enabled?\n• Is a playlist selected?\n\nGo to Settings > Music Integration to configure.',
          [
            { text: 'Open Settings', onPress: () => router.push('/(tabs)/settings') },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Music test error:', error);
      Alert.alert('Error', 'Failed to test music integration.');
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
          Create Workout
        </Text>
        <TouchableOpacity onPress={saveWorkout} disabled={exercises.length === 0}>
          <Ionicons 
            name="checkmark" 
            size={24} 
            color={exercises.length > 0 ? colors.success : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Workout Name */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Workout Name</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              backgroundColor: colors.backgroundAlt,
              color: colors.text,
            }}
            placeholder="Enter workout name..."
            placeholderTextColor={colors.textSecondary}
            value={workoutName}
            onChangeText={setWorkoutName}
          />
        </View>

        {/* Workout Goals */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Workout Goal</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {workoutGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={{
                  backgroundColor: selectedGoal === goal.id ? colors.primary : colors.backgroundAlt,
                  borderWidth: 1,
                  borderColor: selectedGoal === goal.id ? colors.primary : colors.border,
                  borderRadius: 12,
                  padding: 16,
                  width: '48%',
                  alignItems: 'center',
                }}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <Ionicons 
                  name={goal.icon as any} 
                  size={24} 
                  color={selectedGoal === goal.id ? 'white' : colors.primary}
                  style={{ marginBottom: 8 }}
                />
                <Text style={{
                  color: selectedGoal === goal.id ? 'white' : colors.text,
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: 4,
                }}>
                  {goal.title}
                </Text>
                <Text style={{
                  color: selectedGoal === goal.id ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                  {goal.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Level */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Difficulty Level</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {difficultyLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={{
                  backgroundColor: selectedDifficulty === level ? colors.primary : colors.backgroundAlt,
                  borderWidth: 1,
                  borderColor: selectedDifficulty === level ? colors.primary : colors.border,
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flex: 1,
                  alignItems: 'center',
                }}
                onPress={() => setSelectedDifficulty(level)}
              >
                <Text style={{
                  color: selectedDifficulty === level ? 'white' : colors.text,
                  fontWeight: '600',
                }}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Duration */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Workout Duration (minutes)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.backgroundAlt,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => setWorkoutDuration(Math.max(15, workoutDuration - 15))}
            >
              <Ionicons name="remove" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '600' }]}>
                {workoutDuration}
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                minutes
              </Text>
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: colors.backgroundAlt,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              onPress={() => setWorkoutDuration(Math.min(120, workoutDuration + 15))}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Music Integration Status */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Music Integration</Text>
          {connectedPlatform ? (
            <View style={[commonStyles.card, { backgroundColor: connectedPlatform.color + '10', borderColor: connectedPlatform.color + '40' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons 
                  name={connectedPlatform.icon as any} 
                  size={20} 
                  color={connectedPlatform.color} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                  {connectedPlatform.name} Connected
                </Text>
                {musicSettings?.autoPlayEnabled && (
                  <View style={{ 
                    backgroundColor: colors.success, 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>AUTO-PLAY</Text>
                  </View>
                )}
              </View>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 12 }]}>
                {musicSettings?.autoPlayEnabled 
                  ? '🎵 Your workout playlist will automatically start when you begin this workout'
                  : '🔇 Auto-play is disabled. You can enable it in Settings > Music Integration'
                }
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: connectedPlatform.color,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    flex: 1,
                    alignItems: 'center',
                  }}
                  onPress={testMusicIntegration}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    Test Music 🎵
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.backgroundAlt,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={() => router.push('/(tabs)/settings')}
                >
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>
                    Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons 
                  name="musical-notes-outline" 
                  size={20} 
                  color={colors.primary} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                  Connect Your Music
                </Text>
              </View>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 12 }]}>
                Connect Spotify, YouTube Music, or Apple Music to automatically play your workout playlists when you start exercising.
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    flex: 1,
                    alignItems: 'center',
                  }}
                  onPress={() => router.push('/(tabs)/settings')}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    Set Up Music
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.backgroundAlt,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={testMusicIntegration}
                >
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>
                    Test
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Generate Workout Buttons */}
        {exercises.length === 0 && !weeklyPlan && (
          <View style={commonStyles.section}>
            <Button
              text={isGenerating ? 'Generating...' : 'Generate Single Workout'}
              onPress={generateWorkout}
              style={{ 
                backgroundColor: isGenerating ? colors.textSecondary : colors.primary,
                opacity: isGenerating ? 0.7 : 1,
                marginBottom: 12,
              }}
            />
            
            <Button
              text={isGenerating ? 'Generating...' : 'Generate Weekly Plan'}
              onPress={generateWeeklyPlan}
              style={{ 
                backgroundColor: isGenerating ? colors.textSecondary : colors.accent,
                opacity: isGenerating ? 0.7 : 1,
              }}
              variant="secondary"
            />
            
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              AI will create personalized workouts based on your goals
            </Text>
          </View>
        )}

        {/* Weekly Plan Display */}
        {weeklyPlan && (
          <View style={commonStyles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={commonStyles.subtitle}>Weekly Plan</Text>
              <TouchableOpacity onPress={() => setWeeklyPlan(null)}>
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>

            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                {weeklyPlan.goal.replace('_', ' ').toUpperCase()} - {weeklyPlan.difficulty}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
                {weeklyPlan.description}
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>WORKOUT DAYS</Text>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {weeklyPlan.workouts.filter(w => !w.isRestDay).length}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>TOTAL TIME</Text>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {weeklyPlan.totalDuration} min
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>REST DAYS</Text>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {weeklyPlan.restDays.length}
                  </Text>
                </View>
              </View>
            </View>

            {/* Weekly Schedule */}
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Weekly Schedule</Text>
            {weeklyPlan.workouts.map((dayWorkout, index) => (
              <View key={dayWorkout.day} style={[commonStyles.card, { marginBottom: 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    Day {dayWorkout.day}: {dayWorkout.name}
                  </Text>
                  {dayWorkout.isRestDay ? (
                    <View style={{ 
                      backgroundColor: colors.success, 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 12 
                    }}>
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>REST</Text>
                    </View>
                  ) : (
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                      {dayWorkout.duration} min
                    </Text>
                  )}
                </View>
                
                <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                  Focus: {dayWorkout.focus}
                </Text>
                
                {dayWorkout.isRestDay && dayWorkout.activeRecovery ? (
                  <View>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                      Active Recovery Options:
                    </Text>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12, fontStyle: 'italic' }]}>
                      {dayWorkout.activeRecovery.join(', ')}
                    </Text>
                  </View>
                ) : (
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    {dayWorkout.exercises.length} exercises targeting {dayWorkout.focus.toLowerCase()}
                  </Text>
                )}
              </View>
            ))}

            {/* Tips Section */}
            {weeklyPlan.tips && weeklyPlan.tips.length > 0 && (
              <View style={[commonStyles.card, { marginTop: 16 }]}>
                <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>💡 Tips for Success</Text>
                {weeklyPlan.tips.map((tip, index) => (
                  <Text key={index} style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 6 }]}>
                    • {tip}
                  </Text>
                ))}
              </View>
            )}

            {/* Save Weekly Plan Button */}
            <Button
              text="Save Weekly Plan"
              onPress={async () => {
                try {
                  await WorkoutPlanStorage.saveWeeklyPlan(weeklyPlan);
                  Alert.alert(
                    'Weekly Plan Saved!',
                    'Your personalized weekly workout plan has been saved and activated.',
                    [
                      { text: 'View Plans', onPress: () => router.push('/workouts') },
                      { text: 'OK' }
                    ]
                  );
                } catch (error) {
                  console.error('Error saving weekly plan:', error);
                  Alert.alert('Error', 'Failed to save weekly plan. Please try again.');
                }
              }}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* Exercise List */}
        {exercises.length > 0 && !weeklyPlan && (
          <View style={commonStyles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={commonStyles.subtitle}>Exercises ({exercises.length})</Text>
              <TouchableOpacity onPress={addCustomExercise}>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {exercises.map((exercise, index) => (
              <View key={exercise.id} style={[commonStyles.card, { marginBottom: 16 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
                    {index + 1}. {exercise.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                    <Ionicons name="trash" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                      SETS
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        textAlign: 'center',
                        backgroundColor: colors.backgroundAlt,
                        color: colors.text,
                      }}
                      value={exercise.sets.toString()}
                      onChangeText={(text) => updateExercise(exercise.id, 'sets', parseInt(text) || 1)}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                      REPS
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        textAlign: 'center',
                        backgroundColor: colors.backgroundAlt,
                        color: colors.text,
                      }}
                      value={exercise.reps}
                      onChangeText={(text) => updateExercise(exercise.id, 'reps', text)}
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                      REST (sec)
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        textAlign: 'center',
                        backgroundColor: colors.backgroundAlt,
                        color: colors.text,
                      }}
                      value={exercise.restTime.toString()}
                      onChangeText={(text) => updateExercise(exercise.id, 'restTime', parseInt(text) || 30)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {exercise.instructions && (
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, fontStyle: 'italic' }]}>
                    💡 {exercise.instructions}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}