import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme.tsx';
import MusicSettings from '../../components/MusicSettings';
import HealthDataService, { HealthPermissions } from '../../services/healthDataService';
import VersionInfo from '../../components/VersionInfo';
import { performanceMonitor } from '../../utils/performance';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [musicSettingsVisible, setMusicSettingsVisible] = useState(false);
  const [healthPermissions, setHealthPermissions] = useState<HealthPermissions | null>(null);
  const [adminTapCount, setAdminTapCount] = useState(0);

  useEffect(() => {
    loadHealthPermissions();
  }, []);

  const loadHealthPermissions = async () => {
    try {
      const healthService = HealthDataService.getInstance();
      const permissions = await healthService.getPermissions();
      setHealthPermissions(permissions);
    } catch (error) {
      console.error('Error loading health permissions:', error);
    }
  };

  const handleSettingPress = (action: string) => {
    switch (action) {
      case 'music':
        setMusicSettingsVisible(true);
        break;
      case 'health':
        router.push('/health-onboarding');
        break;
      case 'notifications':
        Alert.alert(
          'Notification Settings',
          'Notification preferences can be managed in your device settings.',
          [{ text: 'OK' }]
        );
        break;
      case 'privacy':
        Alert.alert(
          'Privacy Policy',
          'Privacy policy would be displayed here in a production app.',
          [{ text: 'OK' }]
        );
        break;
      case 'terms':
        Alert.alert(
          'Terms of Service',
          'Terms of service would be displayed here in a production app.',
          [{ text: 'OK' }]
        );
        break;
      case 'support':
        Alert.alert(
          'Support',
          'Contact support at support@ripped.ai or visit our help center.',
          [{ text: 'OK' }]
        );
        break;
      case 'performance':
        performanceMonitor.logSummary();
        Alert.alert(
          'Performance Report',
          'Performance metrics have been logged to console.',
          [{ text: 'OK' }]
        );
        break;
      default:
        console.log('Unknown setting action:', action);
    }
  };

  const handleExportHealthData = async () => {
    try {
      const healthService = HealthDataService.getInstance();
      const data = await healthService.exportAllData();
      console.log('Exported health data:', data);
      Alert.alert(
        'Data Exported',
        'Your health data has been exported to console. In production, this would be saved to a file.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting health data:', error);
      Alert.alert('Error', 'Failed to export health data.');
    }
  };

  const handleClearHealthData = async () => {
    Alert.alert(
      'Clear Health Data',
      'Are you sure you want to clear all health data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const healthService = HealthDataService.getInstance();
              await healthService.clearAllData();
              await loadHealthPermissions();
              Alert.alert('Success', 'Health data cleared successfully.');
            } catch (error) {
              console.error('Error clearing health data:', error);
              Alert.alert('Error', 'Failed to clear health data.');
            }
          },
        },
      ]
    );
  };

  const handleVersionTap = () => {
    setAdminTapCount(prev => prev + 1);
    if (adminTapCount >= 6) {
      setAdminTapCount(0);
      router.push('/admin/launch-checklist');
    }
  };

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'moon',
          title: 'Dark Mode',
          subtitle: 'Toggle dark/light theme',
          action: 'theme',
          hasSwitch: true,
          switchValue: isDark,
          onSwitchChange: toggleTheme,
        },
        {
          icon: 'musical-notes',
          title: 'Music Integration',
          subtitle: 'Connect Spotify, Apple Music, or YouTube',
          action: 'music',
          hasArrow: true,
        },
        {
          icon: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage workout reminders and alerts',
          action: 'notifications',
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Health & Data',
      items: [
        {
          icon: 'heart',
          title: 'Health Data Sync',
          subtitle: healthPermissions?.granted 
            ? 'Connected to health services' 
            : 'Connect Apple Health or Google Fit',
          action: 'health',
          hasArrow: true,
          status: healthPermissions?.granted ? 'connected' : 'disconnected',
        },
        {
          icon: 'download',
          title: 'Export Health Data',
          subtitle: 'Download your fitness data',
          action: 'export',
          onPress: handleExportHealthData,
        },
        {
          icon: 'trash',
          title: 'Clear Health Data',
          subtitle: 'Remove all stored health information',
          action: 'clear',
          onPress: handleClearHealthData,
          destructive: true,
        },
      ],
    },
    {
      title: 'Support & Legal',
      items: [
        {
          icon: 'help-circle',
          title: 'Help & Support',
          subtitle: 'Get help or contact support',
          action: 'support',
          hasArrow: true,
        },
        {
          icon: 'shield-checkmark',
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          action: 'privacy',
          hasArrow: true,
        },
        {
          icon: 'document-text',
          title: 'Terms of Service',
          subtitle: 'Terms and conditions',
          action: 'terms',
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Advanced',
      items: [
        {
          icon: 'speedometer',
          title: 'Performance Report',
          subtitle: 'View app performance metrics',
          action: 'performance',
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              {section.title}
            </Text>
            
            <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={item.onPress || (() => handleSettingPress(item.action))}
                  disabled={item.hasSwitch}
                >
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: item.destructive ? theme.colors.error : theme.colors.primary }
                    ]}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="white"
                      />
                    </View>
                    
                    <View style={styles.settingText}>
                      <Text style={[
                        styles.settingTitle,
                        { 
                          color: item.destructive ? theme.colors.error : theme.colors.text 
                        }
                      ]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.settingRight}>
                    {item.status && (
                      <View style={[
                        styles.statusIndicator,
                        { 
                          backgroundColor: item.status === 'connected' 
                            ? theme.colors.success 
                            : theme.colors.warning 
                        }
                      ]}>
                        <Text style={styles.statusText}>
                          {item.status === 'connected' ? 'ON' : 'OFF'}
                        </Text>
                      </View>
                    )}
                    
                    {item.hasSwitch && (
                      <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitchChange}
                        trackColor={{
                          false: theme.colors.border,
                          true: theme.colors.primary,
                        }}
                        thumbColor="white"
                      />
                    )}
                    
                    {item.hasArrow && (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        {/* Version Info */}
        <TouchableOpacity onPress={handleVersionTap} style={styles.versionContainer}>
          <VersionInfo />
          <Text style={[styles.appName, { color: theme.colors.textSecondary }]}>
            Ripped.AI
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Music Settings Modal */}
      <MusicSettings
        visible={musicSettingsVisible}
        onClose={() => setMusicSettingsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 24,
  },
  appName: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default SettingsScreen;