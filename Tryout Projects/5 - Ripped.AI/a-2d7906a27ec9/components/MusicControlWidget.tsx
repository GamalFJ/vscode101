import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme.tsx';
import MusicService, { MusicPlatform } from '../services/musicService';

interface MusicControlWidgetProps {
  visible: boolean;
  onToggleVisibility?: () => void;
}

export default function MusicControlWidget({ visible, onToggleVisibility }: MusicControlWidgetProps) {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [connectedPlatform, setConnectedPlatform] = useState<MusicPlatform | undefined>();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadPlatformInfo();
  }, []);

  useEffect(() => {
    if (visible && isPlaying) {
      // Start pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [visible, isPlaying, pulseAnim]);

  const loadPlatformInfo = async () => {
    try {
      await MusicService.initialize();
      const platform = MusicService.getConnectedPlatform();
      setConnectedPlatform(platform);
    } catch (error) {
      console.error('Failed to load platform info:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await MusicService.pauseMusic();
        setIsPlaying(false);
      } else {
        await MusicService.resumeMusic();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to toggle playback:', error);
    }
  };

  const handleStop = async () => {
    try {
      await MusicService.stopMusic();
      setIsPlaying(false);
      if (onToggleVisibility) {
        onToggleVisibility();
      }
    } catch (error) {
      console.error('Failed to stop music:', error);
    }
  };

  if (!visible || !connectedPlatform) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: connectedPlatform.color + '40',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: connectedPlatform.color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    musicIcon: {
      marginRight: theme.spacing.sm,
    },
    textContainer: {
      flex: 1,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    platformText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    controlButton: {
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Animated.View style={[styles.musicIcon, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons 
            name={connectedPlatform.icon as any} 
            size={20} 
            color={connectedPlatform.color} 
          />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.statusText}>
            {isPlaying ? 'Now Playing' : 'Paused'}
          </Text>
          <Text style={styles.platformText}>
            {connectedPlatform.name} • Workout Playlist
          </Text>
        </View>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePlayPause}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={20} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleStop}
        >
          <Ionicons 
            name="stop" 
            size={18} 
            color={theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}