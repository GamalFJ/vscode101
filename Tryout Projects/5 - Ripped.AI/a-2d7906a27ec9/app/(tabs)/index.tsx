import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../../components/Button';
import AIAssistant from '../../components/AIAssistant';
import HealthDashboardTile from '../../components/HealthDashboardTile';
import HeartRateMonitor from '../../components/HeartRateMonitor';
import MuscleAnatomyDiagram from '../../components/MuscleAnatomyDiagram';
import HealthPermissionsScreen from '../../components/HealthPermissionsScreen';
import PWAInstallPrompt from '../../components/PWAInstallPrompt';

import { useTheme } from '../../utils/theme.tsx';
import { commonStyles, spacing, borderRadius } from '../../styles/commonStyles';
import { WorkoutPlanStorage, SavedWorkoutPlan } from '../../services/workoutPlanStorage';
import MusicService, { MusicPlatform, MusicSettings as MusicSettingsType } from '../../services/musicService';
import HeartRateService, { HeartRateReading } from '../../services/heartRateService';
import HealthDataService, { HealthPermissions } from '../../services/healthDataService';

export default function HomeScreen() {
  const { theme } = useTheme();
  const pulseAnimation = useSharedValue(1);
  
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showHeartRateMonitor, setShowHeartRateMonitor] = useState(false);
  const [showMuscleAnatomy, setShowMuscleAnatomy] = useState(false);
  const [showHealthPermissions, setShowHealthPermissions] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [currentHeartRate, setCurrentHeartRate] = useState<HeartRateReading | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkoutPlan[]>([]);
  const [musicSettings, setMusicSettings] = useState<MusicSettingsType | null>(null);
  const [healthPermissions, setHealthPermissions] = useState<HealthPermissions | null>(null);

  // Pulse animation for heart rate
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  useEffect(() => {
    if (currentHeartRate?.bpm) {
      pulseAnimation.value = withRepeat(
        withTiming(1.1, { duration: 60000 / (currentHeartRate.bpm * 2) }),
        -1,
        true
      );
    }
  }, [currentHeartRate?.bpm, pulseAnimation]);

  const initializeHomeScreen = useCallback(async () => {
    try {
      console.log('Initializing home screen...');
      
      // Load all data in parallel
      await Promise.all([
        loadMusicSettings(),
        initializeHealthData(),
        loadWorkoutData(),
        checkPWAPrompt()
      ]);
      
      console.log('Home screen initialization completed');
    } catch (error) {
      console.error('Error initializing home screen:', error);
    }
  }, []);

  useEffect(() => {
    initializeHomeScreen();
  }, [initializeHomeScreen]);

  const loadMusicSettings = useCallback(async () => {
    try {
      const settings = await MusicService.getSettings();
      // Ensure settings is a valid object before setting
      if (settings && typeof settings === 'object') {
        setMusicSettings(settings);
      } else {
        console.warn('Invalid music settings received:', settings);
        setMusicSettings(null);
      }
    } catch (error) {
      console.error('Error loading music settings:', error);
      setMusicSettings(null);
    }
  }, []);

  const initializeHealthData = useCallback(async () => {
    try {
      // Check health permissions with null safety
      const permissions = await HealthDataService.getPermissions();
      if (permissions && typeof permissions === 'object') {
        setHealthPermissions(permissions);
        
        // If permissions granted, load current heart rate
        if (permissions?.granted === true) {
          const heartRate = await HeartRateService.getCurrentHeartRate();
          if (heartRate && typeof heartRate === 'object') {
            setCurrentHeartRate(heartRate);
          }
        }
      } else {
        console.warn('Invalid health permissions received:', permissions);
        setHealthPermissions(null);
      }
    } catch (error) {
      console.error('Error initializing health data:', error);
      setHealthPermissions(null);
      setCurrentHeartRate(null);
    }
  }, []);

  const loadWorkoutData = useCallback(async () => {
    try {
      const workouts = await WorkoutPlanStorage.getAllWorkoutPlans();
      // Ensure workouts is a valid array before setting
      if (Array.isArray(workouts)) {
        setSavedWorkouts(workouts);
      } else {
        console.warn('Invalid workout data received:', workouts);
        setSavedWorkouts([]);
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
      setSavedWorkouts([]);
    }
  }, []);

  const checkPWAPrompt = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        const dismissed = await AsyncStorage.getItem('pwa_prompt_dismissed');
        if (!dismissed) {
          setShowPWAPrompt(true);
        }
      }
    } catch (error) {
      console.error('Error checking PWA prompt:', error);
    }
  }, []);

  const getTodaysWorkout = (plans: SavedWorkoutPlan[]) => {
    if (!Array.isArray(plans) || plans.length === 0) {
      return null;
    }

    const today = new Date().getDay();
    const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today];
    
    for (const plan of plans) {
      if (plan && 
          typeof plan === 'object' && 
          plan?.schedule && 
          Array.isArray(plan.schedule) && 
          plan.schedule.includes(todayName)) {
        return plan;
      }
    }
    return null;
  };

  const handleFabPress = () => {
    setShowAIAssistant(true);
  };

  const handleMusicSetup = () => {
    router.push('/(tabs)/settings');
  };

  const handleTestMusic = async () => {
    try {
      if (musicSettings?.selectedPlatform) {
        await MusicService.testPlayback();
      } else {
        handleMusicSetup();
      }
    } catch (error) {
      console.error('Error testing music:', error);
    }
  };

  const handleHealthPermissionsComplete = (granted: boolean) => {
    setShowHealthPermissions(false);
    if (granted) {
      initializeHealthData();
    }
  };

  const handleHealthDashboardPress = () => {
    if (!healthPermissions?.granted) {
      setShowHealthPermissions(true);
    } else {
      setShowHeartRateMonitor(true);
    }
  };

  const todaysWorkout = getTodaysWorkout(savedWorkouts);

  return (
    <ScrollView 
      style={[commonStyles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={[commonStyles.header, { paddingHorizontal: spacing.lg }]}
      >
        <View>
          <Text style={[commonStyles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[commonStyles.subtitle, { color: theme.colors.textSecondary }]}>
            Ready to crush your fitness goals?
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          style={[commonStyles.iconButton, { backgroundColor: theme.colors.card }]}
        >
          <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Health Dashboard Tile */}
      <Animated.View entering={FadeInDown.delay(200)}>
        <HealthDashboardTile 
          onPress={handleHealthDashboardPress}
          compact={false}
        />
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        entering={FadeInDown.delay(300)}
        style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}
      >
        <Text style={[commonStyles.sectionTitle, { color: theme.colors.text, marginBottom: spacing.md }]}>
          Quick Actions
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <TouchableOpacity
            onPress={() => router.push('/workout/create')}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.primary,
                flex: 1,
                marginRight: spacing.sm,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
              }
            ]}
          >
            <Ionicons name="add-circle-outline" size={32} color={theme.colors.white} />
            <Text style={[commonStyles.cardTitle, { color: theme.colors.white, marginTop: spacing.sm }]}>
              New Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMuscleAnatomy(true)}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.secondary,
                flex: 1,
                marginLeft: spacing.sm,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
              }
            ]}
          >
            <Ionicons name="body-outline" size={32} color={theme.colors.white} />
            <Text style={[commonStyles.cardTitle, { color: theme.colors.white, marginTop: spacing.sm }]}>
              Muscle Guide
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Workout */}
        {todaysWorkout && (
          <Animated.View 
            entering={FadeInUp.delay(400)}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.card,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.lg,
              }
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
              <Ionicons name="today-outline" size={24} color={theme.colors.primary} />
              <Text style={[commonStyles.cardTitle, { color: theme.colors.text, marginLeft: spacing.sm }]}>
                Today's Workout
              </Text>
            </View>
            <Text style={[commonStyles.cardSubtitle, { color: theme.colors.textSecondary, marginBottom: spacing.md }]}>
              {todaysWorkout?.name || 'Workout Plan'}
            </Text>
            <Button
              text="Start Workout"
              onPress={() => router.push(`/workout/details?id=${todaysWorkout?.id || ''}`)}
              variant="primary"
              size="medium"
            />
          </Animated.View>
        )}

        {/* Music Integration */}
        {musicSettings && (
          <Animated.View 
            entering={FadeInUp.delay(500)}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.card,
                padding: spacing.lg,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.lg,
              }
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.cardTitle, { color: theme.colors.text }]}>
                  Workout Music
                </Text>
                <Text style={[commonStyles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                  {musicSettings?.selectedPlatform ? `Connected to ${musicSettings.selectedPlatform}` : 'Not connected'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleTestMusic}
                style={[
                  commonStyles.iconButton,
                  { backgroundColor: theme.colors.primary }
                ]}
              >
                <Ionicons 
                  name={musicSettings?.selectedPlatform ? "play" : "musical-notes"} 
                  size={20} 
                  color={theme.colors.white} 
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Navigation Shortcuts */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/exercise-library')}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.card,
                flex: 1,
                marginRight: spacing.xs,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                alignItems: 'center',
              }
            ]}
          >
            <Ionicons name="library-outline" size={24} color={theme.colors.primary} />
            <Text style={[commonStyles.caption, { color: theme.colors.text, marginTop: spacing.xs, textAlign: 'center' }]}>
              Exercise Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/nutrition')}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.card,
                flex: 1,
                marginHorizontal: spacing.xs,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                alignItems: 'center',
              }
            ]}
          >
            <Ionicons name="nutrition-outline" size={24} color={theme.colors.secondary} />
            <Text style={[commonStyles.caption, { color: theme.colors.text, marginTop: spacing.xs, textAlign: 'center' }]}>
              Nutrition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/coach')}
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.card,
                flex: 1,
                marginLeft: spacing.xs,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                alignItems: 'center',
              }
            ]}
          >
            <Ionicons name="chatbubble-outline" size={24} color={theme.colors.accent} />
            <Text style={[commonStyles.caption, { color: theme.colors.text, marginTop: spacing.xs, textAlign: 'center' }]}>
              AI Coach
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          pulseStyle,
          {
            position: 'absolute',
            bottom: spacing.xl,
            right: spacing.lg,
            zIndex: 1000,
          }
        ]}
      >
        <TouchableOpacity
          onPress={handleFabPress}
          style={[
            {
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 8,
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }
          ]}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color={theme.colors.white} />
        </TouchableOpacity>
      </Animated.View>

      {/* Modals */}
      <AIAssistant
        visible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />

      <HeartRateMonitor
        visible={showHeartRateMonitor}
        onClose={() => setShowHeartRateMonitor(false)}
        userAge={25} // This should come from user profile
      />

      <MuscleAnatomyDiagram
        visible={showMuscleAnatomy}
        onClose={() => setShowMuscleAnatomy(false)}
      />

      <HealthPermissionsScreen
        visible={showHealthPermissions}
        onComplete={handleHealthPermissionsComplete}
        onSkip={() => setShowHealthPermissions(false)}
      />

      <PWAInstallPrompt
        visible={showPWAPrompt}
        onClose={() => setShowPWAPrompt(false)}
      />
    </ScrollView>
  );
}