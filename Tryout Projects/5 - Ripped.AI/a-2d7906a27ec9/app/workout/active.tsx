import { Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../../components/Button';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import HeartRateWidget from '../../components/HeartRateWidget';
import MusicService from '../../services/musicService';
import MusicControlWidget from '../../components/MusicControlWidget';
import HealthDataService, { CalorieData } from '../../services/healthDataService';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  muscle: string;
  instructions?: string;
}

interface WorkoutSession {
  currentExercise: number;
  currentSet: number;
  isResting: boolean;
  restTimeLeft: number;
  workoutStartTime: Date;
  completedSets: { exerciseIndex: number; setIndex: number; completed: boolean }[];
  estimatedCalories: number;
  workoutType: string;
}

export default function ActiveWorkoutScreen() {
  const { workoutId } = useLocalSearchParams();
  const [session, setSession] = useState<WorkoutSession>({
    currentExercise: 0,
    currentSet: 1,
    isResting: false,
    restTimeLeft: 0,
    workoutStartTime: new Date(),
    completedSets: [],
    estimatedCalories: 0,
    workoutType: 'strength'
  });
  const [workoutTime, setWorkoutTime] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample workout data - in real app, this would come from storage/API
  const exercises: Exercise[] = [
    { name: 'Bench Press', sets: 4, reps: '8-10', restTime: 90, muscle: 'Chest', instructions: 'Lower bar to chest, press up explosively' },
    { name: 'Overhead Press', sets: 3, reps: '10-12', restTime: 60, muscle: 'Shoulders', instructions: 'Press straight up, engage core' },
    { name: 'Barbell Rows', sets: 3, reps: '10-12', restTime: 60, muscle: 'Back', instructions: 'Pull to lower chest, squeeze shoulder blades' },
    { name: 'Dips', sets: 3, reps: '8-12', restTime: 60, muscle: 'Triceps', instructions: 'Lower until 90 degrees, push up' },
  ];

  const updateCalorieEstimation = useCallback(async (currentWorkoutTime: number) => {
    try {
      const healthService = HealthDataService.getInstance();
      const durationMinutes = Math.floor(currentWorkoutTime / 60);
      
      if (durationMinutes > 0) {
        const calorieData = healthService.estimateCaloriesBurned(
          session.workoutType,
          durationMinutes,
          'moderate' // Could be dynamic based on heart rate zones
        );
        
        setSession(prev => ({
          ...prev,
          estimatedCalories: calorieData.calories
        }));
        
        console.log(`Calories estimated: ${calorieData.calories} for ${durationMinutes} minutes of ${session.workoutType}`);
      }
    } catch (error) {
      console.error('Error updating calorie estimation:', error);
    }
  }, [session.workoutType]);

  useEffect(() => {
    // Start workout timer
    intervalRef.current = setInterval(() => {
      setWorkoutTime(prev => {
        const newTime = prev + 1;
        // Update calorie estimation every minute
        if (newTime % 60 === 0) {
          updateCalorieEstimation(newTime);
        }
        return newTime;
      });
    }, 1000);

    // Initialize music service and start auto-play
    initializeMusic();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
      // Stop music when workout ends
      MusicService.stopMusic();
    };
  }, []);

  const initializeMusic = async () => {
    try {
      await MusicService.initialize();
      const success = await MusicService.autoPlayWorkoutMusic();
      if (success) {
        setMusicStarted(true);
        console.log('🎵 Workout music auto-started');
      } else {
        console.log('🔇 No music auto-play (disabled or no platform connected)');
      }
    } catch (error) {
      console.error('Failed to initialize music:', error);
    }
  };

  useEffect(() => {
    if (session.isResting && session.restTimeLeft > 0) {
      restIntervalRef.current = setInterval(() => {
        setSession(prev => {
          if (prev.restTimeLeft <= 1) {
            // Rest is over
            if (restIntervalRef.current) clearInterval(restIntervalRef.current);
            Alert.alert('Rest Complete! 💪', 'Time to start your next set.');
            return {
              ...prev,
              isResting: false,
              restTimeLeft: 0
            };
          }
          return {
            ...prev,
            restTimeLeft: prev.restTimeLeft - 1
          };
        });
      }, 1000);
    } else {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
        restIntervalRef.current = null;
      }
    }

    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [session.isResting, session.restTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completeSet = async () => {
    const currentExercise = exercises[session.currentExercise];
    const isLastSet = session.currentSet >= currentExercise.sets;
    const isLastExercise = session.currentExercise >= exercises.length - 1;

    // Mark set as completed
    const newCompletedSets = [...session.completedSets, {
      exerciseIndex: session.currentExercise,
      setIndex: session.currentSet - 1,
      completed: true
    }];

    if (isLastSet && isLastExercise) {
      // Workout complete! Calculate final calories
      const finalDurationMinutes = Math.floor(workoutTime / 60);
      let finalCalories = session.estimatedCalories;
      
      try {
        const healthService = HealthDataService.getInstance();
        if (finalDurationMinutes > 0) {
          const calorieData = healthService.estimateCaloriesBurned(
            session.workoutType,
            finalDurationMinutes,
            'moderate'
          );
          finalCalories = calorieData.calories;
        }
      } catch (error) {
        console.error('Error calculating final calories:', error);
      }
      
      if (musicStarted) {
        await MusicService.stopMusic();
      }
      
      Alert.alert(
        'Workout Complete! 🎉',
        `Outstanding work! You completed your workout in ${formatTime(workoutTime)} and burned approximately ${finalCalories} calories.`,
        [
          { text: 'View Summary', onPress: () => router.push('/workout/summary') },
          { text: 'Done', onPress: () => router.push('/') }
        ]
      );
      console.log('Workout completed:', { 
        duration: workoutTime, 
        calories: finalCalories,
        type: session.workoutType 
      });
      return;
    }

    if (isLastSet) {
      // Move to next exercise
      setSession(prev => ({
        ...prev,
        currentExercise: prev.currentExercise + 1,
        currentSet: 1,
        completedSets: newCompletedSets,
        isResting: false,
        restTimeLeft: 0
      }));
    } else {
      // Start rest period for next set
      setSession(prev => ({
        ...prev,
        currentSet: prev.currentSet + 1,
        completedSets: newCompletedSets,
        isResting: true,
        restTimeLeft: currentExercise.restTime
      }));
    }

    console.log('Set completed:', session.currentExercise, session.currentSet);
  };

  const skipRest = () => {
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    setSession(prev => ({
      ...prev,
      isResting: false,
      restTimeLeft: 0
    }));
  };

  const pauseWorkout = () => {
    Alert.alert(
      'Pause Workout?',
      'Your progress will be saved.',
      [
        { text: 'Continue', style: 'cancel' },
        { 
          text: 'Pause', 
          onPress: async () => {
            // Pause music when workout is paused
            if (musicStarted) {
              await MusicService.pauseMusic();
            }
            router.back();
          }
        }
      ]
    );
  };

  const endWorkout = () => {
    Alert.alert(
      'End Workout?',
      'Are you sure you want to end your workout? Your progress will be saved.',
      [
        { text: 'Continue', style: 'cancel' },
        { 
          text: 'End Workout', 
          onPress: async () => {
            // Stop music when workout ends
            if (musicStarted) {
              await MusicService.stopMusic();
            }
            router.push('/');
          }
        }
      ]
    );
  };

  const currentExercise = exercises[session.currentExercise];
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSetsCount = session.completedSets.length;
  const progressPercentage = (completedSetsCount / totalSets) * 100;

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={pauseWorkout}>
          <Ionicons name="pause" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
            Active Workout
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              {formatTime(workoutTime)}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginHorizontal: 8 }}>
              •
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              {session.estimatedCalories} cal
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={endWorkout}>
          <Ionicons name="stop" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={{ backgroundColor: colors.backgroundAlt, paddingVertical: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            Exercise {session.currentExercise + 1} of {exercises.length}
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            {Math.round(progressPercentage)}% Complete
          </Text>
        </View>
        <View style={{
          height: 6,
          backgroundColor: colors.border,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${progressPercentage}%`,
            backgroundColor: colors.primary,
            borderRadius: 3,
          }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {/* Heart Rate Widget */}
        <View style={{ marginVertical: 16 }}>
          <HeartRateWidget size="small" showZone={true} showStatus={false} />
        </View>

        {/* Music Control Widget */}
        <MusicControlWidget
          visible={musicStarted}
          onToggleVisibility={() => setMusicStarted(false)}
        />

        <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        {session.isResting ? (
          /* Rest Screen */
          <View style={{ alignItems: 'center' }}>
            <Text style={[commonStyles.title, { color: colors.warning, marginBottom: 8 }]}>
              Rest Time
            </Text>
            <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 24 }]}>
              Get ready for set {session.currentSet} of {currentExercise.name}
            </Text>
            
            <View style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 8,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.backgroundAlt,
              position: 'relative',
            }}>
              <Text style={{
                fontSize: 48,
                fontWeight: '700',
                color: colors.warning,
                textAlign: 'center',
              }}>
                {formatTime(session.restTimeLeft)}
              </Text>
            </View>

            <View style={{ marginTop: 40, width: '100%' }}>
              <Button
                text="Skip Rest"
                onPress={skipRest}
                style={{ backgroundColor: colors.accent, marginBottom: 12 }}
                textStyle={{ color: colors.white }}
              />
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                Next: {currentExercise.name} - Set {session.currentSet}
              </Text>
            </View>
          </View>
        ) : (
          /* Exercise Screen */
          <View style={{ alignItems: 'center', width: '100%' }}>
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              alignItems: 'center',
            }}>
              <Text style={{ color: colors.white, fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
                {currentExercise.muscle.toUpperCase()}
              </Text>
              <Text style={{ color: colors.white, fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
                {currentExercise.name}
              </Text>
            </View>

            <View style={[commonStyles.card, { width: '100%', alignItems: 'center', marginBottom: 24 }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 14, marginBottom: 8 }]}>
                SET {session.currentSet} OF {currentExercise.sets}
              </Text>
              <Text style={[commonStyles.title, { fontSize: 36, marginBottom: 16, color: colors.primary }]}>
                {currentExercise.reps}
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
                REPS
              </Text>
            </View>

            {currentExercise.instructions && (
              <View style={[commonStyles.card, { width: '100%', backgroundColor: colors.backgroundAlt, marginBottom: 24 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Ionicons name="information-circle" size={20} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={[commonStyles.text, { flex: 1 }]}>
                    {currentExercise.instructions}
                  </Text>
                </View>
              </View>
            )}

            <View style={{ width: '100%' }}>
              <Button
                text="Complete Set ✓"
                onPress={completeSet}
                style={{ backgroundColor: colors.success, marginBottom: 16 }}
                textStyle={{ color: colors.white, fontSize: 16, fontWeight: '700' }}
              />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    COMPLETED
                  </Text>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {session.currentSet - 1}/{currentExercise.sets}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    REST TIME
                  </Text>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {formatTime(currentExercise.restTime)}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    MUSCLE
                  </Text>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {currentExercise.muscle}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        </View>
      </ScrollView>
    </View>
  );
}