import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const deviceSizes = {
  small: 320,
  medium: 375,
  large: 414,
  tablet: 768,
};

export const isTablet = screenWidth >= deviceSizes.tablet;
export const isSmallDevice = screenWidth <= deviceSizes.small;
export const isLargeDevice = screenWidth >= deviceSizes.large;

export const getResponsiveSize = (size: number, factor: number = 0.8) => {
  if (isSmallDevice) {
    return size * factor;
  }
  if (isTablet) {
    return size * 1.2;
  }
  return size;
};

export const getResponsivePadding = (base: number) => {
  if (isSmallDevice) {
    return base * 0.8;
  }
  if (isTablet) {
    return base * 1.5;
  }
  return base;
};

export const getResponsiveFontSize = (size: number) => {
  if (isSmallDevice) {
    return size * 0.9;
  }
  if (isTablet) {
    return size * 1.1;
  }
  return size;
};

export const getColumns = (itemWidth: number, padding: number = 20) => {
  const availableWidth = screenWidth - (padding * 2);
  return Math.floor(availableWidth / itemWidth);
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const getStatusBarHeight = () => {
  if (isIOS) {
    return screenHeight >= 812 ? 44 : 20; // iPhone X and newer vs older
  }
  return 24; // Android
};

export const getSafeAreaPadding = () => {
  return {
    paddingTop: isIOS ? getStatusBarHeight() : 0,
    paddingBottom: isIOS && screenHeight >= 812 ? 34 : 0, // Home indicator
  };
};