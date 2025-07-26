import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { useTheme } from '../utils/theme.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PWA_PROMPT_DISMISSED_KEY = 'pwa_prompt_dismissed';

interface PWAInstallPromptProps {
  visible: boolean;
  onClose: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt && Platform.OS === 'web') {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA install outcome:', outcome);
      setDeferredPrompt(null);
    }
    onClose();
  };

  const handleDismiss = async () => {
    await AsyncStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
    onClose();
  };

  if (Platform.OS !== 'web' || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="download-outline" size={48} color={theme.colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Install Ripped.AI
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Install our app for a better experience with offline access, push notifications, and faster loading.
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="flash" size={20} color={theme.colors.accent} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Faster loading
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="wifi-off" size={20} color={theme.colors.accent} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Works offline
              </Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="notifications" size={20} color={theme.colors.accent} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Push notifications
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              text="Install App"
              onPress={handleInstall}
              variant="primary"
              style={styles.installButton}
            />
            <Button
              text="Maybe Later"
              onPress={handleDismiss}
              variant="ghost"
              style={styles.dismissButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  installButton: {
    width: '100%',
  },
  dismissButton: {
    width: '100%',
  },
});

export default PWAInstallPrompt;