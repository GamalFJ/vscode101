import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useTheme } from '../utils/theme.tsx';
import { buttonStyles, buttonTextStyles, animations } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Button({ 
  text, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = true
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 300,
    });
    opacity.value = withTiming(0.8, {
      duration: animations.timing.fast,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    opacity.value = withTiming(1, {
      duration: animations.timing.fast,
    });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      // Add haptic feedback
      runOnJS(onPress)();
    }
  };

  const getButtonStyles = () => {
    const baseStyles = [buttonStyles.base];
    
    // Add variant styles
    if (buttonStyles[variant]) {
      baseStyles.push(buttonStyles[variant]);
    }
    
    // Add size styles
    if (size !== 'medium' && buttonStyles[size]) {
      baseStyles.push(buttonStyles[size]);
    }
    
    // Add disabled styles
    if (disabled || loading) {
      baseStyles.push(buttonStyles.disabled);
    }
    
    // Add width styles
    if (!fullWidth) {
      baseStyles.push({ alignSelf: 'flex-start' });
    }
    
    return baseStyles;
  };

  const getTextStyles = () => {
    const baseStyles = [buttonTextStyles.base];
    
    // Add variant text styles
    if (buttonTextStyles[variant]) {
      baseStyles.push(buttonTextStyles[variant]);
    }
    
    // Add size text styles
    if (size !== 'medium' && buttonTextStyles[size]) {
      baseStyles.push(buttonTextStyles[size]);
    }
    
    return baseStyles;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.background} 
        />
      );
    }

    const textElement = (
      <Text style={[getTextStyles(), textStyle]}>
        {text}
      </Text>
    );

    if (!icon) {
      return textElement;
    }

    return (
      <>
        {iconPosition === 'left' && icon}
        {textElement}
        {iconPosition === 'right' && icon}
      </>
    );
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyles(), animatedStyle, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {renderContent()}
    </AnimatedTouchableOpacity>
  );
}