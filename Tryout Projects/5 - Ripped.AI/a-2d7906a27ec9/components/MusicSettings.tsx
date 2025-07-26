import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme.tsx';
import Button from './Button';
import MusicService, { MusicPlatform, Playlist, MusicSettings as MusicSettingsType } from '../services/musicService';

interface MusicSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function MusicSettings({ visible, onClose }: MusicSettingsProps) {
  const { theme } = useTheme();
  const [platforms, setPlatforms] = useState<MusicPlatform[]>([]);
  const [settings, setSettings] = useState<MusicSettingsType>({
    autoPlayEnabled: true,
    volume: 0.7,
  });
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    try {
      setLoading(true);
      await MusicService.initialize();
      const [loadedPlatforms, loadedSettings] = await Promise.all([
        MusicService.loadPlatforms(),
        MusicService.loadSettings(),
      ]);
      setPlatforms(loadedPlatforms);
      setSettings(loadedSettings);

      // Load playlists if there's a connected platform
      const connectedPlatform = loadedPlatforms.find(p => p.isConnected);
      if (connectedPlatform) {
        const loadedPlaylists = await MusicService.getPlaylists(connectedPlatform.id);
        setPlaylists(loadedPlaylists);
      }
    } catch (error) {
      console.error('Failed to load music data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = async (platform: MusicPlatform) => {
    try {
      setLoading(true);
      
      if (platform.isConnected) {
        const success = await MusicService.disconnectPlatform(platform.id);
        if (success) {
          Alert.alert(
            'Disconnected',
            `Successfully disconnected from ${platform.name}`,
            [{ text: 'OK' }]
          );
          await loadData();
        }
      } else {
        Alert.alert(
          'Connect to ' + platform.name,
          'This will open the OAuth flow to connect your account. For now, this is simulated.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Connect',
              onPress: async () => {
                const success = await MusicService.connectPlatform(platform.id);
                if (success) {
                  Alert.alert(
                    'Connected!',
                    `Successfully connected to ${platform.name}. You can now select playlists for your workouts.`,
                    [{ text: 'OK' }]
                  );
                  await loadData();
                } else {
                  Alert.alert('Error', `Failed to connect to ${platform.name}`);
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Failed to toggle platform:', error);
      Alert.alert('Error', 'Failed to update platform connection');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPlayToggle = async (value: boolean) => {
    try {
      await MusicService.saveSettings({ autoPlayEnabled: value });
      setSettings(prev => ({ ...prev, autoPlayEnabled: value }));
      console.log('Auto-play toggled:', value);
    } catch (error) {
      console.error('Failed to toggle auto-play:', error);
    }
  };

  const handlePlaylistSelect = async (playlist: Playlist) => {
    try {
      await MusicService.saveSettings({ selectedPlaylist: playlist.id });
      setSettings(prev => ({ ...prev, selectedPlaylist: playlist.id }));
      setShowPlaylists(false);
      Alert.alert(
        'Playlist Selected',
        `"${playlist.name}" will now auto-play when you start workouts.`,
        [{ text: 'OK' }]
      );
      console.log('Selected playlist:', playlist.name);
    } catch (error) {
      console.error('Failed to select playlist:', error);
    }
  };

  const testPlaylist = async () => {
    try {
      const success = await MusicService.autoPlayWorkoutMusic();
      if (success) {
        Alert.alert(
          'Music Started! 🎵',
          'Your workout playlist is now playing. Check the console for details.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Music Available',
          'Please connect a music platform and select a playlist first.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Failed to test playlist:', error);
    }
  };

  const connectedPlatform = platforms.find(p => p.isConnected);
  const selectedPlaylist = playlists.find(p => p.id === settings.selectedPlaylist);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontFamily: theme.fonts.medium,
    },
    platformCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    platformLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    platformIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    platformInfo: {
      flex: 1,
    },
    platformName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    platformStatus: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    connectedStatus: {
      color: theme.colors.success,
    },
    settingCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    playlistCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    playlistImage: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.backgroundAlt,
    },
    playlistInfo: {
      flex: 1,
    },
    playlistName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
    playlistDetails: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontFamily: theme.fonts.regular,
    },
    selectedBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    selectedText: {
      color: theme.colors.background,
      fontSize: 12,
      fontWeight: '600',
      fontFamily: theme.fonts.medium,
    },
    emptyState: {
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontFamily: theme.fonts.regular,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Music Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Music Platforms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Streaming Platforms</Text>
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                style={styles.platformCard}
                onPress={() => handlePlatformToggle(platform)}
                disabled={loading}
              >
                <View style={styles.platformLeft}>
                  <View style={[styles.platformIcon, { backgroundColor: platform.color }]}>
                    <Ionicons 
                      name={platform.icon as any} 
                      size={20} 
                      color={theme.colors.background} 
                    />
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={[
                      styles.platformStatus,
                      platform.isConnected && styles.connectedStatus
                    ]}>
                      {platform.isConnected ? 'Connected' : 'Not connected'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={platform.isConnected}
                  onValueChange={() => handlePlatformToggle(platform)}
                  trackColor={{ 
                    false: theme.colors.border, 
                    true: platform.color + '80' 
                  }}
                  thumbColor={platform.isConnected ? platform.color : theme.colors.grey}
                  disabled={loading}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Auto-play Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Playback Settings</Text>
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingText}>Auto-play Music</Text>
                  <Text style={styles.settingDescription}>
                    Automatically start your selected playlist when workouts begin
                  </Text>
                </View>
                <Switch
                  value={settings.autoPlayEnabled}
                  onValueChange={handleAutoPlayToggle}
                  trackColor={{ 
                    false: theme.colors.border, 
                    true: theme.colors.primary + '80' 
                  }}
                  thumbColor={settings.autoPlayEnabled ? theme.colors.primary : theme.colors.grey}
                />
              </View>
            </View>
          </View>

          {/* Playlist Selection */}
          {connectedPlatform && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Workout Playlist</Text>
              <View style={styles.settingCard}>
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={() => setShowPlaylists(true)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingText}>
                      {selectedPlaylist ? selectedPlaylist.name : 'Select Playlist'}
                    </Text>
                    <Text style={styles.settingDescription}>
                      {selectedPlaylist 
                        ? `${selectedPlaylist.trackCount} tracks • ${selectedPlaylist.duration} min`
                        : 'Choose a playlist for your workouts'
                      }
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>

              {/* Test Button */}
              <Button
                text="Test Playlist 🎵"
                onPress={testPlaylist}
                style={{ 
                  backgroundColor: connectedPlatform.color,
                  marginTop: theme.spacing.md,
                }}
                textStyle={{ color: theme.colors.background }}
              />
            </View>
          )}

          {!connectedPlatform && (
            <View style={styles.emptyState}>
              <Ionicons 
                name="musical-notes-outline" 
                size={48} 
                color={theme.colors.textSecondary} 
                style={{ marginBottom: theme.spacing.md }}
              />
              <Text style={styles.emptyText}>
                Connect a music streaming platform to enable auto-play during workouts
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Playlist Selection Modal */}
        <Modal visible={showPlaylists} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select Playlist</Text>
              <TouchableOpacity onPress={() => setShowPlaylists(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.content}>
              {playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.playlistCard}
                  onPress={() => handlePlaylistSelect(playlist)}
                >
                  <Image 
                    source={{ uri: playlist.imageUrl }} 
                    style={styles.playlistImage}
                    defaultSource={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop' }}
                  />
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.playlistDetails}>
                      {playlist.trackCount} tracks • {playlist.duration} min
                    </Text>
                  </View>
                  {settings.selectedPlaylist === playlist.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedText}>Selected</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}