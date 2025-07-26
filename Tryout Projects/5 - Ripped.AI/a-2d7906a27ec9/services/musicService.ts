import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MusicPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface Playlist {
  id: string;
  name: string;
  platform: string;
  trackCount: number;
  duration: number;
  imageUrl?: string;
}

export interface MusicSettings {
  selectedPlatform?: string;
  selectedPlaylist?: string;
  autoPlayEnabled: boolean;
  volume: number;
}

const MUSIC_SETTINGS_KEY = '@music_settings';
const MUSIC_PLATFORMS_KEY = '@music_platforms';

class MusicService {
  private platforms: MusicPlatform[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      icon: 'musical-notes',
      color: '#1DB954',
      isConnected: false,
    },
    {
      id: 'youtube_music',
      name: 'YouTube Music',
      icon: 'play-circle',
      color: '#FF0000',
      isConnected: false,
    },
    {
      id: 'apple_music',
      name: 'Apple Music',
      icon: 'musical-note',
      color: '#FA243C',
      isConnected: false,
    },
  ];

  private settings: MusicSettings = {
    autoPlayEnabled: true,
    volume: 0.7,
  };

  async initialize(): Promise<void> {
    try {
      console.log('🎵 Initializing MusicService...');
      await this.loadSettings();
      await this.loadPlatforms();
      console.log('🎵 MusicService initialized successfully');
      console.log('🎵 Current settings:', this.settings);
      console.log('🎵 Connected platforms:', this.platforms.filter(p => p.isConnected).map(p => p.name));
    } catch (error) {
      console.error('❌ Failed to initialize MusicService:', error);
    }
  }

  async loadSettings(): Promise<MusicSettings> {
    try {
      const stored = await AsyncStorage.getItem(MUSIC_SETTINGS_KEY);
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
        console.log('🎵 Loaded music settings from storage:', this.settings);
      } else {
        console.log('🎵 No stored music settings found, using defaults');
      }
      return this.settings;
    } catch (error) {
      console.error('❌ Failed to load music settings:', error);
      return this.settings;
    }
  }

  async saveSettings(settings: Partial<MusicSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...settings };
      await AsyncStorage.setItem(MUSIC_SETTINGS_KEY, JSON.stringify(this.settings));
      console.log('✅ Music settings saved:', this.settings);
    } catch (error) {
      console.error('❌ Failed to save music settings:', error);
    }
  }

  async loadPlatforms(): Promise<MusicPlatform[]> {
    try {
      const stored = await AsyncStorage.getItem(MUSIC_PLATFORMS_KEY);
      if (stored) {
        const storedPlatforms = JSON.parse(stored);
        this.platforms = this.platforms.map(platform => {
          const stored = storedPlatforms.find((p: MusicPlatform) => p.id === platform.id);
          return stored ? { ...platform, ...stored } : platform;
        });
        console.log('🎵 Loaded platforms from storage:', this.platforms.map(p => ({ name: p.name, connected: p.isConnected })));
      } else {
        console.log('🎵 No stored platforms found, using defaults');
      }
      return this.platforms;
    } catch (error) {
      console.error('❌ Failed to load platforms:', error);
      return this.platforms;
    }
  }

  async savePlatforms(): Promise<void> {
    try {
      await AsyncStorage.setItem(MUSIC_PLATFORMS_KEY, JSON.stringify(this.platforms));
      console.log('✅ Music platforms saved');
    } catch (error) {
      console.error('❌ Failed to save platforms:', error);
    }
  }

  getPlatforms(): MusicPlatform[] {
    return this.platforms;
  }

  getSettings(): MusicSettings {
    return this.settings;
  }

  getConnectedPlatform(): MusicPlatform | undefined {
    const connected = this.platforms.find(p => p.isConnected && p.id === this.settings.selectedPlatform);
    if (connected) {
      console.log('🎵 Found connected platform:', connected.name);
    } else {
      console.log('🔇 No connected platform found');
    }
    return connected;
  }

  async connectPlatform(platformId: string): Promise<boolean> {
    try {
      const platform = this.platforms.find(p => p.id === platformId);
      if (!platform) {
        throw new Error(`Platform ${platformId} not found`);
      }

      console.log(`🎵 Initiating OAuth for ${platform.name}...`);
      
      // For now, simulate successful connection
      platform.isConnected = true;
      platform.accessToken = `mock_token_${platformId}_${Date.now()}`;
      platform.expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      // Set as selected platform if none selected
      if (!this.settings.selectedPlatform) {
        await this.saveSettings({ selectedPlatform: platformId });
      }

      await this.savePlatforms();
      console.log(`✅ Successfully connected to ${platform.name}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to connect to ${platformId}:`, error);
      return false;
    }
  }

  async disconnectPlatform(platformId: string): Promise<boolean> {
    try {
      const platform = this.platforms.find(p => p.id === platformId);
      if (!platform) {
        throw new Error(`Platform ${platformId} not found`);
      }

      platform.isConnected = false;
      platform.accessToken = undefined;
      platform.refreshToken = undefined;
      platform.expiresAt = undefined;

      // Clear selection if this was the selected platform
      if (this.settings.selectedPlatform === platformId) {
        await this.saveSettings({ selectedPlatform: undefined, selectedPlaylist: undefined });
      }

      await this.savePlatforms();
      console.log(`✅ Disconnected from ${platform.name}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to disconnect from ${platformId}:`, error);
      return false;
    }
  }

  async getPlaylists(platformId?: string): Promise<Playlist[]> {
    const targetPlatform = platformId || this.settings.selectedPlatform;
    if (!targetPlatform) {
      console.log('🔇 No platform specified for playlist fetch');
      return [];
    }

    const platform = this.platforms.find(p => p.id === targetPlatform);
    if (!platform || !platform.isConnected) {
      console.log(`🔇 Platform ${targetPlatform} not connected`);
      return [];
    }

    // Mock playlists - in real implementation, fetch from API
    const mockPlaylists: Playlist[] = [
      {
        id: `${targetPlatform}_workout_1`,
        name: 'High Energy Workout',
        platform: targetPlatform,
        trackCount: 25,
        duration: 90,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      },
      {
        id: `${targetPlatform}_workout_2`,
        name: 'Pump Up Mix',
        platform: targetPlatform,
        trackCount: 30,
        duration: 120,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      },
      {
        id: `${targetPlatform}_workout_3`,
        name: 'Beast Mode',
        platform: targetPlatform,
        trackCount: 20,
        duration: 75,
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
      },
      {
        id: `${targetPlatform}_cardio_1`,
        name: 'Cardio Blast',
        platform: targetPlatform,
        trackCount: 35,
        duration: 140,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      },
    ];

    console.log(`🎵 Fetched ${mockPlaylists.length} playlists from ${platform.name}`);
    return mockPlaylists;
  }

  async startPlaylist(playlistId: string): Promise<boolean> {
    try {
      const connectedPlatform = this.getConnectedPlatform();
      if (!connectedPlatform) {
        console.log('🔇 No connected music platform');
        return false;
      }

      if (!this.settings.autoPlayEnabled) {
        console.log('🔇 Auto-play is disabled');
        return false;
      }

      const playlists = await this.getPlaylists();
      const playlist = playlists.find(p => p.id === playlistId);
      
      if (!playlist) {
        console.log(`🔇 Playlist ${playlistId} not found`);
        return false;
      }

      // Simulate starting playlist
      console.log(`🎵 Starting playlist "${playlist.name}" on ${connectedPlatform.name}`);
      console.log(`📱 Platform: ${connectedPlatform.name}`);
      console.log(`🎶 Playlist: ${playlist.name} (${playlist.trackCount} tracks, ${playlist.duration} min)`);
      
      // In real implementation, this would call the platform's API to start playback
      return true;
    } catch (error) {
      console.error('❌ Failed to start playlist:', error);
      return false;
    }
  }

  async autoPlayWorkoutMusic(): Promise<boolean> {
    try {
      console.log('🎵 Attempting auto-play workout music...');
      
      if (!this.settings.autoPlayEnabled) {
        console.log('🔇 Auto-play disabled, skipping music');
        return false;
      }

      const connectedPlatform = this.getConnectedPlatform();
      if (!connectedPlatform) {
        console.log('🔇 No connected music platform for auto-play');
        return false;
      }

      let playlistId = this.settings.selectedPlaylist;
      
      // If no playlist selected, use the first workout playlist
      if (!playlistId) {
        console.log('🎵 No playlist selected, finding default workout playlist...');
        const playlists = await this.getPlaylists();
        const workoutPlaylist = playlists.find(p => 
          p.name.toLowerCase().includes('workout') || 
          p.name.toLowerCase().includes('pump') ||
          p.name.toLowerCase().includes('energy')
        );
        playlistId = workoutPlaylist?.id;
        console.log('🎵 Found default playlist:', workoutPlaylist?.name);
      }

      if (!playlistId) {
        console.log('🔇 No suitable playlist found for auto-play');
        return false;
      }

      const success = await this.startPlaylist(playlistId);
      if (success) {
        console.log('✅ Auto-play workout music started successfully');
      } else {
        console.log('❌ Auto-play workout music failed');
      }
      return success;
    } catch (error) {
      console.error('❌ Failed to auto-play workout music:', error);
      return false;
    }
  }

  async pauseMusic(): Promise<boolean> {
    try {
      const connectedPlatform = this.getConnectedPlatform();
      if (!connectedPlatform) {
        return false;
      }

      console.log(`⏸️ Pausing music on ${connectedPlatform.name}`);
      // In real implementation, call platform API to pause
      return true;
    } catch (error) {
      console.error('❌ Failed to pause music:', error);
      return false;
    }
  }

  async resumeMusic(): Promise<boolean> {
    try {
      const connectedPlatform = this.getConnectedPlatform();
      if (!connectedPlatform) {
        return false;
      }

      console.log(`▶️ Resuming music on ${connectedPlatform.name}`);
      // In real implementation, call platform API to resume
      return true;
    } catch (error) {
      console.error('❌ Failed to resume music:', error);
      return false;
    }
  }

  async stopMusic(): Promise<boolean> {
    try {
      const connectedPlatform = this.getConnectedPlatform();
      if (!connectedPlatform) {
        return false;
      }

      console.log(`⏹️ Stopping music on ${connectedPlatform.name}`);
      // In real implementation, call platform API to stop
      return true;
    } catch (error) {
      console.error('❌ Failed to stop music:', error);
      return false;
    }
  }
}

export default new MusicService();