import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundAlt: string;
    text: string;
    textSecondary: string;
    grey: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    border: string;
    white: string;
    surface: string;
    onSurface: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    overlay: string;
    shadow: string;
  };
  isDark: boolean;
  fonts: {
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#B8860B',       // Dark Goldenrod
    secondary: '#D4AF37',     // Gold
    accent: '#CD853F',        // Peru
    background: '#FEFCF8',    // Warm white
    backgroundAlt: '#F5F2ED', // Light warm grey
    text: '#2F1B14',          // Dark Brown
    textSecondary: '#5D4E37', // Dark Olive Brown
    grey: '#8B7355',          // Warm grey
    card: '#FFFFFF',          // White
    success: '#2E7D32',       // Green
    warning: '#F57C00',       // Orange
    error: '#D32F2F',         // Red
    border: '#E0D5C7',        // Light brown border
    white: '#FFFFFF',         // Pure white
    surface: '#FFFFFF',       // Surface color
    onSurface: '#2F1B14',     // Text on surface
    primaryContainer: '#F4E4BC', // Light gold container
    onPrimaryContainer: '#2F1B14', // Text on primary container
    overlay: 'rgba(47, 27, 20, 0.8)', // Light overlay
    shadow: 'rgba(0, 0, 0, 0.2)',     // Light shadow
  },
  isDark: false,
  fonts: {
    regular: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_500Medium',
    semiBold: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_600SemiBold',
    bold: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_700Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#D4AF37',       // Gold
    secondary: '#B8860B',     // Dark Goldenrod
    accent: '#F4A460',        // Sandy Brown
    background: '#1A0F0A',    // Very dark brown
    backgroundAlt: '#2F1B14', // Dark brown
    text: '#F5DEB3',          // Wheat (light text for dark background)
    textSecondary: '#DEB887', // Burlywood (secondary light text)
    grey: '#8B7355',          // Warm grey
    card: '#2F1B14',          // Dark card background
    success: '#4CAF50',       // Green
    warning: '#FF9800',       // Orange
    error: '#F44336',         // Red
    border: '#3D2817',        // Dark border
    white: '#FFFFFF',         // Pure white for contrast
    surface: '#2F1B14',       // Surface color
    onSurface: '#F5DEB3',     // Text on surface
    primaryContainer: '#3D2817', // Dark gold container
    onPrimaryContainer: '#F5DEB3', // Text on primary container
    overlay: 'rgba(26, 15, 10, 0.8)', // Dark overlay
    shadow: 'rgba(0, 0, 0, 0.4)',     // Dark shadow
  },
  isDark: true,
  fonts: {
    regular: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_500Medium',
    semiBold: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_600SemiBold',
    bold: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_700Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme must be used within a ThemeProvider');
    // Return a default theme to prevent crashes
    return {
      theme: darkTheme,
      toggleTheme: () => {
        console.warn('toggleTheme called outside of ThemeProvider');
      },
      isDark: true
    };
  }
  
  // Ensure context has all required properties with safe fallbacks
  const safeTheme = context?.theme || darkTheme;
  const safeToggleTheme = context?.toggleTheme || (() => console.warn('toggleTheme not available'));
  const safeIsDark = typeof context?.isDark === 'boolean' ? context.isDark : true;
  
  // Double-check that theme has all required properties
  if (!safeTheme?.colors || !safeTheme?.fonts || !safeTheme?.spacing || !safeTheme?.borderRadius) {
    console.warn('Theme object is missing required properties, using fallback');
    return {
      theme: darkTheme,
      toggleTheme: safeToggleTheme,
      isDark: safeIsDark
    };
  }
  
  return {
    theme: safeTheme,
    toggleTheme: safeToggleTheme,
    isDark: safeIsDark
  };
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const THEME_STORAGE_KEY = 'app_theme_preference';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        if (Platform.OS === 'web') {
          const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
          if (savedTheme) {
            setIsDark(savedTheme === 'dark');
          }
        } else {
          const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
          if (savedTheme) {
            setIsDark(savedTheme === 'dark');
          }
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    try {
      // Save theme preference
      const themeValue = newIsDark ? 'dark' : 'light';
      if (Platform.OS === 'web') {
        localStorage.setItem(THEME_STORAGE_KEY, themeValue);
      } else {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, themeValue);
      }
      console.log('Theme preference saved:', themeValue);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Don't render until theme is loaded to prevent flashing
  if (isLoading) {
    return null;
  }

  const theme = isDark ? darkTheme : lightTheme;

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    isDark
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export theme objects for direct use if needed
export { lightTheme as light, darkTheme as dark };

// Helper function to get theme colors safely
export const getThemeColors = (isDark: boolean = true) => {
  return isDark ? darkTheme.colors : lightTheme.colors;
};

// Helper function to get theme spacing safely
export const getThemeSpacing = () => {
  return lightTheme.spacing; // Spacing is the same for both themes
};

// Helper function to get theme border radius safely
export const getThemeBorderRadius = () => {
  return lightTheme.borderRadius; // Border radius is the same for both themes
};

// Import safe access utilities
import { safeGet, safeHas, validateObject, createSafeObject } from './safeAccess';