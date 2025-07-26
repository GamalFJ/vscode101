import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../utils/theme.tsx';
import { commonStyles, spacing, borderRadius } from '../styles/commonStyles';

interface TimerProps {
  initialTime?: number;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  autoStart?: boolean;
  showControls?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Timer({
  initialTime = 60,
  onComplete,
  onTick,
  autoStart = false,
  showControls = true,
  size = 'medium'
}: TimerProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = useCallback(() => {
    if (initialTime > 0) {
      const progressValue = (initialTime - timeLeft) / initialTime;
      progress.value = withTiming(progressValue, { duration: 300 });
    }
  }, [initialTime, timeLeft, progress]);

  useEffect(() => {
    updateProgress();
  }, [timeLeft, initialTime]);

  useEffect(() => {
    if (autoStart && !isActive) {
      start();
    }
  }, [initialTime, autoStart, isActive]);

  useEffect(() => {
    if (isActive && !isPaused) {
      pulseScale.value = withSpring(1.05, {
        duration: 1000,
        dampingRatio: 0.8,
      });
    } else {
      pulseScale.value = withSpring(1, {
        duration: 300,
        dampingRatio: 0.8,
      });
    }
  }, [isActive, isPaused]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (onTick) {
            onTick(newTime);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    if (timeLeft <= 0 && isActive) {
      setIsActive(false);
      setIsPaused(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [timeLeft, isActive, onComplete]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 360}deg` }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(!isPaused);
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(initialTime);
    progress.value = 0;
  };

  const stop = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return theme.colors.error;
    if (timeLeft <= 30) return theme.colors.warning;
    return theme.colors.primary;
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { diameter: 80, fontSize: 16, iconSize: 16 };
      case 'large':
        return { diameter: 200, fontSize: 32, iconSize: 32 };
      default:
        return { diameter: 120, fontSize: 24, iconSize: 24 };
    }
  };

  const sizeConfig = getSizeConfig();
  const timerColor = getTimerColor();

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View
        style={[
          pulseStyle,
          {
            width: sizeConfig.diameter,
            height: sizeConfig.diameter,
            borderRadius: sizeConfig.diameter / 2,
            backgroundColor: theme.colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: timerColor,
            elevation: 4,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }
        ]}
      >
        <Text
          style={{
            fontSize: sizeConfig.fontSize,
            fontWeight: 'bold',
            color: timerColor,
            fontFamily: theme.fonts.bold,
          }}
        >
          {formatTime(timeLeft)}
        </Text>
        
        {timeLeft <= 0 && (
          <Text
            style={{
              fontSize: sizeConfig.fontSize * 0.5,
              color: theme.colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            Time's Up!
          </Text>
        )}
      </Animated.View>

      {showControls && (
        <View
          style={{
            flexDirection: 'row',
            marginTop: spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={reset}
            style={[
              commonStyles.iconButton,
              {
                backgroundColor: theme.colors.grey,
                marginRight: spacing.md,
              }
            ]}
          >
            <Ionicons name="refresh" size={sizeConfig.iconSize} color={theme.colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isActive ? pause : start}
            style={[
              commonStyles.iconButton,
              {
                backgroundColor: timerColor,
                width: sizeConfig.iconSize * 2.5,
                height: sizeConfig.iconSize * 2.5,
                borderRadius: sizeConfig.iconSize * 1.25,
                marginHorizontal: spacing.md,
              }
            ]}
          >
            <Ionicons
              name={isActive && !isPaused ? "pause" : "play"}
              size={sizeConfig.iconSize * 1.2}
              color={theme.colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={stop}
            style={[
              commonStyles.iconButton,
              {
                backgroundColor: theme.colors.error,
                marginLeft: spacing.md,
              }
            ]}
          >
            <Ionicons name="stop" size={sizeConfig.iconSize} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}