import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemeProvider, useTheme } from '../utils/theme.tsx';
import { setupErrorLogging } from '../utils/errorLogger';
import HealthDataService from '../services/healthDataService';
import { commonStyles } from '../styles/commonStyles';
import ErrorBoundary from '../components/ErrorBoundary';
import SafeErrorBoundary from '../components/SafeErrorBoundary';
import { measureWebVitals, measureAppStartup } from '../utils/performance';

function RootLayoutContent() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // Safely access theme properties with fallbacks
  const backgroundColor = theme?.colors?.background || '#1A0F0A';
  const isDarkTheme = theme?.isDark !== false; // Default to dark if undefined

  return (
    <SafeAreaView style={[
      commonStyles.safeArea,
      { 
        backgroundColor,
        paddingTop: Platform.OS === 'android' ? insets.top : 0 
      }
    ]}>
      <StatusBar 
        style={isDarkTheme ? 'light' : 'dark'} 
        backgroundColor={backgroundColor} 
        translucent={false}
      />
      <ErrorBoundary>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor },
            animation: 'slide_from_right',
            animationDuration: 300,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="ai-trainer" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="timer" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="workout/create" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="workout/active" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="workout/details" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="exercise-library" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="workouts" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="progress" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="coach" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="product-details" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="health-onboarding" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="admin/launch-checklist" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
        </Stack>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');
        
        // Setup error logging
        setupErrorLogging();
        console.log('Error logging setup completed');
        
        // Add global error handler for property access errors
        if (Platform.OS === 'web') {
          window.addEventListener('error', (event) => {
            if (event.error?.message?.includes('Cannot read properties of undefined')) {
              console.error('Global property access error caught:', {
                message: event.error.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error.stack
              });
              // Prevent the error from crashing the app
              event.preventDefault();
            }
          });
          
          window.addEventListener('unhandledrejection', (event) => {
            if (event.reason?.message?.includes('Cannot read properties of undefined')) {
              console.error('Global unhandled promise rejection with property access error:', event.reason);
              event.preventDefault();
            }
          });
        }
        
        // Measure performance
        if (Platform.OS === 'web') {
          measureWebVitals();
          console.log('Web vitals measurement started');
        } else {
          measureAppStartup();
          console.log('App startup measurement started');
        }
        
        // Initialize health data service
        try {
          const healthService = HealthDataService.getInstance();
          await healthService.initialize();
          console.log('HealthDataService initialized successfully');
        } catch (healthError) {
          console.warn('HealthDataService initialization failed:', healthError);
          // Continue app initialization even if health data fails
        }
        
        console.log('App initialization completed successfully (notifications disabled)');
        setIsReady(true);
      } catch (error) {
        console.error('Error during app initialization:', error);
        setIsReady(true); // Still allow app to load
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      console.log('App cleanup completed (notifications disabled)');
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeErrorBoundary
          onError={(error, errorInfo) => {
            console.error('App-level error caught by SafeErrorBoundary:', error);
            console.error('Error info:', errorInfo);
          }}
        >
          <ErrorBoundary>
            <Animated.View 
              style={commonStyles.container}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(300)}
            >
              <RootLayoutContent />
            </Animated.View>
          </ErrorBoundary>
        </SafeErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}