import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
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
import Button from './Button';
import HealthDataService, { HealthPermissions, HealthProfile } from '../services/healthDataService';

interface HealthPermissionsScreenProps {
  visible: boolean;
  onComplete: (granted: boolean) => void;
  onSkip?: () => void;
}

interface PermissionItem {
  key: keyof Omit<HealthPermissions, 'granted' | 'requestedAt'>;
  title: string;
  description: string;
  icon: string;
  color: string;
  benefits: string[];
}

const PERMISSION_ITEMS: PermissionItem[] = [
  {
    key: 'heartRate',
    title: 'Heart Rate',
    description: 'Monitor your heart rate during workouts for optimal training zones',
    icon: 'heart',
    color: '#FF6B6B',
    benefits: [
      'Real-time workout intensity monitoring',
      'Personalized training zone recommendations',
      'Recovery time optimization'
    ]
  },
  {
    key: 'steps',
    title: 'Steps & Activity',
    description: 'Track your daily movement and activity levels',
    icon: 'walk',
    color: '#4ECDC4',
    benefits: [
      'Daily step count tracking',
      'Activity goal setting and monitoring',
      'Movement pattern analysis'
    ]
  },
  {
    key: 'calories',
    title: 'Calories',
    description: 'Monitor calories burned during workouts and daily activities',
    icon: 'flame',
    color: '#FFE66D',
    benefits: [
      'Accurate calorie burn tracking',
      'Nutrition goal alignment',
      'Weight management support'
    ]
  },
  {
    key: 'workouts',
    title: 'Workouts',
    description: 'Save and analyze your workout sessions',
    icon: 'fitness',
    color: '#A8E6CF',
    benefits: [
      'Workout history and progress tracking',
      'Performance analytics',
      'Training load optimization'
    ]
  }
];

export default function HealthPermissionsScreen({ visible, onComplete, onSkip }: HealthPermissionsScreenProps) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'permissions' | 'profile' | 'complete'>('welcome');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [healthProfile, setHealthProfile] = useState<Partial<HealthProfile>>({});

  // Animated values
  const pulseValue = useSharedValue(1);
  const slideValue = useSharedValue(0);

  // Animated styles
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideValue.value }],
  }));

  useEffect(() => {
    if (visible && currentStep === 'welcome') {
      // Start pulse animation
      pulseValue.value = withRepeat(
        withTiming(1.1, { duration: 2000 }),
        -1,
        true
      );
      
      // Slide in animation
      slideValue.value = withSpring(0);
    }
  }, [visible, currentStep, pulseValue, slideValue]);

  const handleRequestPermissions = async () => {
    setIsLoading(true);
    try {
      console.log('Requesting health permissions...');
      const healthService = HealthDataService.getInstance();
      await healthService.initialize();
      
      const success = await healthService.requestPermissions();
      console.log('Health permissions request result:', success);
      
      if (success) {
        setCurrentStep('profile');
      } else {
        Alert.alert(
          'Permissions Required',
          'Health data permissions are needed to provide personalized fitness insights. You can enable them later in Settings.',
          [
            { text: 'Skip', onPress: () => onComplete(false) },
            { text: 'Try Again', onPress: handleRequestPermissions }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting health permissions:', error);
      Alert.alert('Error', 'Failed to request health permissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);
    try {
      console.log('Saving health profile...');
      const healthService = HealthDataService.getInstance();
      await healthService.saveHealthProfile(healthProfile as HealthProfile);
      
      setCurrentStep('complete');
      setTimeout(() => {
        onComplete(true);
      }, 2000);
    } catch (error) {
      console.error('Error saving health profile:', error);
      Alert.alert('Error', 'Failed to save health profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete(true);
  };

  const renderWelcomeStep = () => (
    <ScrollView contentContainerStyle={styles.stepContainer}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.welcomeHeader}>
        <Animated.View style={[styles.welcomeIcon, pulseStyle]}>
          <Ionicons name="fitness" size={80} color={theme.colors.primary} />
        </Animated.View>
        <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
          Unlock Your Fitness Potential
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
          Connect your health data to get personalized insights, track your progress, and achieve your fitness goals faster.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.benefitsContainer}>
        <Text style={[styles.benefitsTitle, { color: theme.colors.text }]}>
          What You'll Get:
        </Text>
        
        {PERMISSION_ITEMS.map((item, index) => (
          <Animated.View 
            key={item.key}
            entering={FadeInDown.delay(300 + index * 100)}
            style={[styles.benefitCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={[styles.benefitIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.benefitDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.stepActions}>
        <Button
          text="Get Started"
          onPress={() => setCurrentStep('permissions')}
          style={styles.primaryButton}
        />
        {onSkip && (
          <Button
            text="Skip for Now"
            onPress={onSkip}
            variant="outline"
            style={styles.secondaryButton}
          />
        )}
      </Animated.View>
    </ScrollView>
  );

  const renderPermissionsStep = () => (
    <ScrollView contentContainerStyle={styles.stepContainer}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.stepHeader}>
        <Ionicons name="shield-checkmark" size={60} color={theme.colors.primary} />
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          Health Data Permissions
        </Text>
        <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
          We'll request access to your health data to provide personalized fitness insights. Your data stays private and secure.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.permissionsGrid}>
        {PERMISSION_ITEMS.map((item, index) => (
          <Animated.View 
            key={item.key}
            entering={FadeInDown.delay(300 + index * 100)}
            style={[styles.permissionCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={[styles.permissionIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={32} color={item.color} />
            </View>
            <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.permissionDescription, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
            <View style={styles.benefitsList}>
              {item.benefits.map((benefit, benefitIndex) => (
                <View key={benefitIndex} style={styles.benefitItem}>
                  <Ionicons name="checkmark" size={14} color={theme.colors.success} />
                  <Text style={[styles.benefitText, { color: theme.colors.textSecondary }]}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.stepActions}>
        <Button
          text={isLoading ? "Requesting Permissions..." : "Allow Health Data Access"}
          onPress={handleRequestPermissions}
          disabled={isLoading}
          style={styles.primaryButton}
        />
        <Button
          text="Back"
          onPress={() => setCurrentStep('welcome')}
          variant="outline"
          style={styles.secondaryButton}
        />
      </Animated.View>
    </ScrollView>
  );

  const renderProfileStep = () => (
    <ScrollView contentContainerStyle={styles.stepContainer}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.stepHeader}>
        <Ionicons name="person" size={60} color={theme.colors.primary} />
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          Complete Your Profile
        </Text>
        <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
          Help us personalize your fitness experience with a few quick details.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.profileForm}>
        <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>
            Basic Information
          </Text>
          
          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                Age
              </Text>
              <TouchableOpacity style={[styles.fieldInput, { backgroundColor: theme.colors.backgroundAlt, borderColor: theme.colors.border }]}>
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                  {healthProfile.age || 'Select age'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                Gender
              </Text>
              <TouchableOpacity style={[styles.fieldInput, { backgroundColor: theme.colors.backgroundAlt, borderColor: theme.colors.border }]}>
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                  {healthProfile.gender || 'Select gender'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                Height (cm)
              </Text>
              <TouchableOpacity style={[styles.fieldInput, { backgroundColor: theme.colors.backgroundAlt, borderColor: theme.colors.border }]}>
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                  {healthProfile.height || 'Enter height'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formField}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                Weight (kg)
              </Text>
              <TouchableOpacity style={[styles.fieldInput, { backgroundColor: theme.colors.backgroundAlt, borderColor: theme.colors.border }]}>
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                  {healthProfile.weight || 'Enter weight'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>
            Fitness Goals
          </Text>
          
          <View style={styles.goalsGrid}>
            {['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'General Fitness'].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalChip,
                  {
                    backgroundColor: healthProfile.fitnessGoals?.includes(goal) 
                      ? theme.colors.primary 
                      : theme.colors.backgroundAlt,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => {
                  const currentGoals = healthProfile.fitnessGoals || [];
                  const updatedGoals = currentGoals.includes(goal)
                    ? currentGoals.filter(g => g !== goal)
                    : [...currentGoals, goal];
                  setHealthProfile({ ...healthProfile, fitnessGoals: updatedGoals });
                }}
              >
                <Text style={[
                  styles.goalText,
                  {
                    color: healthProfile.fitnessGoals?.includes(goal) 
                      ? theme.colors.white 
                      : theme.colors.text
                  }
                ]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.stepActions}>
        <Button
          text={isLoading ? "Saving Profile..." : "Complete Setup"}
          onPress={handleCompleteProfile}
          disabled={isLoading}
          style={styles.primaryButton}
        />
        <Button
          text="Skip Profile"
          onPress={() => setCurrentStep('complete')}
          variant="outline"
          style={styles.secondaryButton}
        />
      </Animated.View>
    </ScrollView>
  );

  const renderCompleteStep = () => (
    <View style={[styles.stepContainer, styles.completeContainer]}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.completeContent}>
        <Animated.View style={[styles.completeIcon, pulseStyle]}>
          <Ionicons name="checkmark-circle" size={100} color={theme.colors.success} />
        </Animated.View>
        <Text style={[styles.completeTitle, { color: theme.colors.text }]}>
          All Set! 🎉
        </Text>
        <Text style={[styles.completeSubtitle, { color: theme.colors.textSecondary }]}>
          Your health data is now connected and ready to power your fitness journey.
        </Text>
        
        <View style={styles.completeFeatures}>
          <View style={styles.completeFeature}>
            <Ionicons name="analytics" size={24} color={theme.colors.primary} />
            <Text style={[styles.completeFeatureText, { color: theme.colors.text }]}>
              Personalized insights ready
            </Text>
          </View>
          <View style={styles.completeFeature}>
            <Ionicons name="trending-up" size={24} color={theme.colors.success} />
            <Text style={[styles.completeFeatureText, { color: theme.colors.text }]}>
              Progress tracking enabled
            </Text>
          </View>
          <View style={styles.completeFeature}>
            <Ionicons name="heart" size={24} color={theme.colors.error} />
            <Text style={[styles.completeFeatureText, { color: theme.colors.text }]}>
              Health monitoring active
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300)} style={styles.stepActions}>
        <Button
          text="Start Your Fitness Journey"
          onPress={handleComplete}
          style={styles.primaryButton}
        />
      </Animated.View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'permissions':
        return renderPermissionsStep();
      case 'profile':
        return renderProfileStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Progress Indicator */}
        <View style={[styles.progressContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.progressSteps}>
            {['welcome', 'permissions', 'profile', 'complete'].map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = ['welcome', 'permissions', 'profile', 'complete'].indexOf(currentStep) > index;
              
              return (
                <View key={step} style={styles.progressStep}>
                  <View style={[
                    styles.progressDot,
                    {
                      backgroundColor: isActive || isCompleted ? theme.colors.primary : theme.colors.border
                    }
                  ]} />
                  {index < 3 && (
                    <View style={[
                      styles.progressLine,
                      {
                        backgroundColor: isCompleted ? theme.colors.primary : theme.colors.border
                      }
                    ]} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {renderCurrentStep()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeIcon: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    marginBottom: 40,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  stepHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionsGrid: {
    marginBottom: 30,
  },
  permissionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  permissionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  benefitsList: {
    alignSelf: 'stretch',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  profileForm: {
    marginBottom: 30,
  },
  formCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  fieldValue: {
    fontSize: 16,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  completeIcon: {
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  completeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  completeFeatures: {
    alignSelf: 'stretch',
  },
  completeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  completeFeatureText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  stepActions: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 20,
  },
});