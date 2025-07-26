import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

// Refined color palette - Dark Brown + Gold theme
export const colors = {
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
  shadow: 'rgba(0, 0, 0, 0.4)',     // Shadow color
};

// Standardized spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Standardized border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Typography system
export const typography = {
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_500Medium',
    semiBold: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_600SemiBold',
    bold: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto_700Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
    hero: 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Standardized button styles
export const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 6,
  },
  primary: {
    backgroundColor: colors.primary,
    boxShadow: `0px 4px 12px ${colors.primary}40`,
  },
  secondary: {
    backgroundColor: colors.secondary,
    boxShadow: `0px 4px 12px ${colors.secondary}40`,
  },
  accent: {
    backgroundColor: colors.accent,
    boxShadow: `0px 4px 12px ${colors.accent}40`,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: 'none',
    elevation: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    elevation: 0,
  },
  success: {
    backgroundColor: colors.success,
    boxShadow: `0px 4px 12px ${colors.success}40`,
  },
  warning: {
    backgroundColor: colors.warning,
    boxShadow: `0px 4px 12px ${colors.warning}40`,
  },
  error: {
    backgroundColor: colors.error,
    boxShadow: `0px 4px 12px ${colors.error}40`,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  disabled: {
    opacity: 0.6,
  },
});

// Button text styles
export const buttonTextStyles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primary: {
    color: colors.background,
  },
  secondary: {
    color: colors.background,
  },
  accent: {
    color: colors.background,
  },
  outline: {
    color: colors.primary,
  },
  ghost: {
    color: colors.primary,
  },
  success: {
    color: colors.white,
  },
  warning: {
    color: colors.white,
  },
  error: {
    color: colors.white,
  },
  small: {
    fontSize: typography.fontSize.md,
  },
  large: {
    fontSize: typography.fontSize.xl,
  },
});

// Common component styles
export const commonStyles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  
  // Cards and surfaces
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  // Typography
  title: {
    fontSize: typography.fontSize.display,
    fontWeight: '800',
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    lineHeight: typography.fontSize.display * typography.lineHeight.tight,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    lineHeight: typography.fontSize.xxl * typography.lineHeight.normal,
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },
  subheading: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },
  body: {
    fontSize: typography.fontSize.lg,
    fontWeight: '400',
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
  },
  bodySecondary: {
    fontSize: typography.fontSize.md,
    fontWeight: '400',
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  
  // Interactive elements
  touchable: {
    borderRadius: borderRadius.md,
  },
  touchableHighlight: {
    backgroundColor: colors.primaryContainer,
  },
  
  // Layout utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  
  // Spacing utilities
  marginXS: { margin: spacing.xs },
  marginSM: { margin: spacing.sm },
  marginMD: { margin: spacing.md },
  marginLG: { margin: spacing.lg },
  marginXL: { margin: spacing.xl },
  
  paddingXS: { padding: spacing.xs },
  paddingSM: { padding: spacing.sm },
  paddingMD: { padding: spacing.md },
  paddingLG: { padding: spacing.lg },
  paddingXL: { padding: spacing.xl },
  
  // Form elements
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: colors.primary,
    boxShadow: `0px 0px 0px 3px ${colors.primary}20`,
  },
  
  // Status indicators
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },
  badgeSuccess: {
    backgroundColor: colors.success + '20',
  },
  badgeWarning: {
    backgroundColor: colors.warning + '20',
  },
  badgeError: {
    backgroundColor: colors.error + '20',
  },
  badgePrimary: {
    backgroundColor: colors.primary + '20',
  },
  
  // Navigation
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerAction: {
    padding: spacing.sm,
  },
  
  // Empty states
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  emptyStateIcon: {
    marginBottom: spacing.lg,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  
  // Scroll view
  scrollView: {
    flex: 1,
  },
  
  // Section styles
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionAction: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  
  // Grid styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridItemText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  
  // Card styles
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
  },
  cardText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
  },
  
  // FAB styles
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    zIndex: 1000,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  
  // Shadows and elevation
  shadowSM: {
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  shadowMD: {
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  shadowLG: {
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 8,
  },
  shadowXL: {
    boxShadow: `0px 12px 32px ${colors.shadow}`,
    elevation: 12,
  },
});

// Animation presets
export const animations = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};