import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../utils/theme.tsx';
import CoachScreen from '../coach';

export default function CoachTabScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  console.log('CoachTabScreen rendered');

  return (
    <View style={styles.container}>
      <CoachScreen />
    </View>
  );
}