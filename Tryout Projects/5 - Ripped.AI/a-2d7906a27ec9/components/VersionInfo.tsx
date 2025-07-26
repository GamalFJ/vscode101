import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import { useTheme } from '../utils/theme.tsx';

interface VersionInfoProps {
  showBuildNumber?: boolean;
  style?: any;
}

const VersionInfo: React.FC<VersionInfoProps> = ({ showBuildNumber = true, style }) => {
  const { theme } = useTheme();

  const getVersionInfo = () => {
    const version = Constants.expoConfig?.version || '1.0.0';
    const buildNumber = Application.nativeBuildVersion || '1';
    
    if (showBuildNumber) {
      return `v${version} (${buildNumber})`;
    }
    return `v${version}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
        {getVersionInfo()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default VersionInfo;