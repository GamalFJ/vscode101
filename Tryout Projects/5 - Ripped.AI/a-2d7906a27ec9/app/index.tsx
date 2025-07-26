import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface DashboardStats {
  workoutsThisWeek: number;
  totalWorkoutTime: number;
  currentStreak: number;
  nextWorkout: string;
}

interface QuickTip {
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'recovery';
}

export default function MainScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    workoutsThisWeek: 3,
    totalWorkoutTime: 245,
    currentStreak: 7,
    nextWorkout: 'Push Day - Upper Body'
  });

  const [quickTips] = useState<QuickTip[]>([
    {
      title: 'Stay Hydrated',
      description: 'Drink water before, during, and after your workout to maintain peak performance.',
      category: 'nutrition'
    },
    {
      title: 'Progressive Overload',
      description: 'Gradually increase weight, reps, or sets to continue building strength.',
      category: 'exercise'
    },
    {
      title: 'Rest Days Matter',
      description: 'Allow 48-72 hours between training the same muscle groups for optimal recovery.',
      category: 'recovery'
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return colors.success;
      case 'exercise': return colors.primary;
      case 'recovery': return colors.warning;
      default: return colors.primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return 'nutrition';
      case 'exercise': return 'barbell';
      case 'recovery': return 'bed';
      default: return 'information-circle';
    }
  };

  console.log('Dashboard loaded with stats:', stats);

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <View>
          <Text style={[commonStyles.title, { fontSize: 24, textAlign: 'left', marginBottom: 4 }]}>
            FitTrainer AI
          </Text>
          <Text style={commonStyles.textSecondary}>
            Your personal fitness companion
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>This Week</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={[commonStyles.card, { flex: 1, marginRight: 8 }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                WORKOUTS
              </Text>
              <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
                {stats.workoutsThisWeek}
              </Text>
            </View>
            <View style={[commonStyles.card, { flex: 1, marginLeft: 8 }]}>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                STREAK
              </Text>
              <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
                {stats.currentStreak} days
              </Text>
            </View>
          </View>
          
          <View style={commonStyles.card}>
            <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
              TOTAL TIME THIS WEEK
            </Text>
            <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
              {Math.floor(stats.totalWorkoutTime / 60)}h {stats.totalWorkoutTime % 60}m
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={[commonStyles.card, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/workout/quick-start')}
          >
            <View style={commonStyles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="play-circle" size={24} color="white" style={{ marginRight: 12 }} />
                <View>
                  <Text style={[commonStyles.text, { color: 'white', fontWeight: '600' }]}>
                    Start Quick Workout
                  </Text>
                  <Text style={[commonStyles.textSecondary, { color: 'rgba(255,255,255,0.8)' }]}>
                    Begin a workout now
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={commonStyles.card}
            onPress={() => router.push('/exercise-library')}
          >
            <View style={commonStyles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="library" size={24} color={colors.accent} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    Exercise Library
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Visual guides & video demonstrations
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={commonStyles.card}
            onPress={() => router.push('/workout/create')}
          >
            <View style={commonStyles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="create" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    Create Custom Routine
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Design your own workout
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={commonStyles.card}
            onPress={() => router.push('/ai-trainer')}
          >
            <View style={commonStyles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="sparkles" size={24} color={colors.accent} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    AI Trainer
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Get personalized recommendations
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Next Workout */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Up Next</Text>
          <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
            <View style={commonStyles.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {stats.nextWorkout}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    Scheduled for tomorrow
                  </Text>
                </View>
              </View>
              <Button
                text="Start Now"
                onPress={() => router.push('/workout/quick-start')}
                style={{ backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, width: 'auto' }}
                textStyle={{ fontSize: 14 }}
              />
            </View>
          </View>
        </View>

        {/* Daily Tips */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Fitness Tips</Text>
          {quickTips.map((tip, index) => (
            <View key={index} style={commonStyles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <View 
                  style={{ 
                    backgroundColor: getCategoryColor(tip.category), 
                    borderRadius: 20, 
                    padding: 8, 
                    marginRight: 12 
                  }}
                >
                  <Ionicons name={getCategoryIcon(tip.category) as any} size={16} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                    {tip.title}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    {tip.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={commonStyles.tabBar}>
        <TouchableOpacity style={[commonStyles.tab, commonStyles.activeTab]}>
          <Ionicons name="home" size={24} color={colors.primary} />
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4, color: colors.primary }]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={commonStyles.tab} onPress={() => router.push('/workouts')}>
          <Ionicons name="barbell" size={24} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
            Workouts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={commonStyles.tab} onPress={() => router.push('/exercise-library')}>
          <Ionicons name="library" size={24} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
            Exercises
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={commonStyles.tab} onPress={() => router.push('/progress')}>
          <Ionicons name="stats-chart" size={24} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
            Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={commonStyles.tab} onPress={() => router.push('/ai-trainer')}>
          <Ionicons name="sparkles" size={24} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
            AI Trainer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}