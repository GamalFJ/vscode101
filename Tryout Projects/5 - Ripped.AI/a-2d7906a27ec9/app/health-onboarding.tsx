import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useTheme } from '../utils/theme.tsx';
import Button from '../components/Button';
import HealthPermissionsScreen from '../components/HealthPermissionsScreen';
import HealthDataService, { HealthPermissions } from '../services/healthDataService';

export default function HealthOnboardingScreen() {
  const { theme } = useTheme();
  const [healthPermissions, setHealthPermissions] = useState<HealthPermissions | null>(null);
  const [showPermissionsScreen, setShowPermissionsScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animated values
  const pulseValue = useSharedValue(1);

  // Pulse animation style
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  // Memoize the load function to prevent infinite re-renders
  const loadCurrentPermissions = useCallback(async () => {
    try {
      console.log('Loading current health permissions...');
      const healthService = HealthDataService.getInstance();
      await healthService.initialize();
      
      const permissions = await healthService.getPermissions();
      setHealthPermissions(permissions);
      console.log('Health permissions loaded:', permissions);
    } catch (error) {
      console.error('Error loading health permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentPermissions();
  }, []);

  // Start pulse animation
  useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(1.1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const handleStartSetup = () => {
    setShowPermissionsScreen(true);
  };

  const handlePermissionsComplete = (granted: boolean) => {
    setShowPermissionsScreen(false);
    if (granted) {
      loadCurrentPermissions();
      Alert.alert(
        'Health Data Connected! 🎉',
        'Your health data is now connected. You can view your fitness metrics and track your progress in the app.',
        [
          { text: 'Continue', onPress: () => router.replace('/(tabs)') }
        ]
      );
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip Health Setup?',
      'You can always connect your health data later in Settings. Some features may be limited without health data access.',
      [
        { text: 'Go Back', style: 'cancel' },
        { text: 'Skip', onPress: () => router.replace('/(tabs)') }
      ]
    );
  };

  const handleManagePermissions = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Manage Health Permissions',
        'To change health permissions, go to Settings > Privacy & Security > Health > Ripped.AI',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Manage Health Permissions',
        'To change health permissions, go to Settings > Apps > Ripped.AI > Permissions',
        [{ text: 'OK' }]
      );
    }
  };

  const renderConnectedState = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.headerContainer}>
        <Animated.View style={[styles.iconContainer, pulseStyle]}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
        </Animated.View>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Health Data Connected! 🎉
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Your health data is successfully connected and ready to enhance your fitness journey.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.featuresContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          What's Now Available:
        </Text>
        
        <View style={[styles.featureCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="heart" size={24} color={theme.colors.error} style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Heart Rate Monitoring
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Real-time heart rate tracking during workouts with zone analysis
            </Text>
          </View>
        </View>

        <View style={[styles.featureCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="flame" size={24} color={theme.colors.warning} style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Calorie Tracking
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Accurate calorie burn estimation based on your personal metrics
            </Text>
          </View>
        </View>

        <View style={[styles.featureCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="analytics" size={24} color={theme.colors.primary} style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Progress Analytics
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Detailed insights into your fitness progress and trends
            </Text>
          </View>
        </View>

        <View style={[styles.featureCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="walk" size={24} color={theme.colors.success} style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
              Activity Summaries
            </Text>
            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
              Daily, weekly, and monthly activity summaries and goals
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.actionsContainer}>
        <Button
          text="Continue to App"
          onPress={() => router.replace('/(tabs)')}
          style={styles.primaryButton}
        />
        
        <Button
          text="Manage Permissions"
          onPress={handleManagePermissions}
          variant="outline"
          style={styles.secondaryButton}
        />
      </Animated.View>
    </ScrollView>
  );

  const renderSetupState = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.headerContainer}>
        <Animated.View style={[styles.iconContainer, pulseStyle]}>
          <Ionicons name="fitness" size={80} color={theme.colors.primary} />
        </Animated.View>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Connect Your Health Data
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Unlock personalized insights and track your fitness progress by connecting your health data.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.benefitsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Why Connect Health Data?
        </Text>
        
        <View style={[styles.benefitCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="trending-up" size={24} color={theme.colors.success} style={styles.benefitIcon} />
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>
              Accurate Progress Tracking
            </Text>
            <Text style={[styles.benefitDescription, { color: theme.colors.textSecondary }]}>
              Monitor your heart rate, calories burned, and activity levels with precision
            </Text>
          </View>
        </View>

        <View style={[styles.benefitCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="bulb" size={24} color={theme.colors.warning} style={styles.benefitIcon} />
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>
              Personalized Recommendations
            </Text>
            <Text style={[styles.benefitDescription, { color: theme.colors.textSecondary }]}>
              Get AI-powered workout and nutrition suggestions based on your data
            </Text>
          </View>
        </View>

        <View style={[styles.benefitCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} style={styles.benefitIcon} />
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>
              Privacy Protected
            </Text>
            <Text style={[styles.benefitDescription, { color: theme.colors.textSecondary }]}>
              Your health data stays secure and is only used to enhance your experience
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.actionsContainer}>
        <Button
          text="Connect Health Data"
          onPress={handleStartSetup}
          style={styles.primaryButton}
        />
        
        <Button
          text="Skip for Now"
          onPress={handleSkipForNow}
          variant="outline"
          style={styles.secondaryButton}
        />
      </Animated.View>
    </ScrollView>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Animated.View style={[styles.iconContainer, pulseStyle]}>
          <Ionicons name="fitness" size={80} color={theme.colors.primary} />
        </Animated.View>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Checking health data permissions...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {healthPermissions?.granted ? renderConnectedState() : renderSetupState()}
      
      <HealthPermissionsScreen
        visible={showPermissionsScreen}
        onComplete={handlePermissionsComplete}
        onSkip={() => setShowPermissionsScreen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginBottom: 40,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
  },
});