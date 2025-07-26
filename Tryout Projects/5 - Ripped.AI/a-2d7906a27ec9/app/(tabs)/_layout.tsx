import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from '../../utils/theme.tsx';
import { commonStyles, spacing, borderRadius } from '../../styles/commonStyles';

const AnimatedTabs = Animated.createAnimatedComponent(Tabs);

export default function TabLayout() {
  const { theme } = useTheme();

  const tabBarStyle = {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  };

  const tabBarLabelStyle = {
    fontSize: 11,
    fontWeight: '600' as const,
    fontFamily: theme.fonts.medium,
    marginTop: 2,
  };

  const screenOptions = {
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.grey,
    tabBarStyle,
    tabBarLabelStyle,
    tabBarItemStyle: {
      borderRadius: borderRadius.md,
      marginHorizontal: 2,
      paddingVertical: 4,
    },
    headerStyle: {
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      fontWeight: '700' as const,
      fontSize: 18,
      fontFamily: theme.fonts.bold,
    },
    headerTitleAlign: 'center' as const,
    animation: 'shift' as const,
  };

  return (
    <AnimatedTabs
      screenOptions={screenOptions}
      entering={FadeInUp.duration(400)}
      exiting={FadeOutDown.duration(300)}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          headerTitle: 'My Workouts',
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'fitness' : 'fitness-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="exercise-library"
        options={{
          title: 'Exercises',
          headerTitle: 'Exercise Library',
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'library' : 'library-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="machine-library"
        options={{
          title: 'Machines',
          headerTitle: 'Machine Library',
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'hardware-chip' : 'hardware-chip-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          headerTitle: 'Nutrition Guide',
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'nutrition' : 'nutrition-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="gear-supplements"
        options={{
          title: 'Gear',
          headerTitle: 'Gear & Supplements',
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'storefront' : 'storefront-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'App Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <Ionicons 
                name={focused ? 'settings' : 'settings-outline'} 
                size={size} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
    </AnimatedTabs>
  );
}