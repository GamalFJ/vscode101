import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../../components/Button';
import VersionInfo from '../../components/VersionInfo';
import { useTheme } from '../../utils/theme.tsx';
import { performanceMonitor } from '../../utils/performance';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'content' | 'legal' | 'marketing' | 'testing';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  automated?: boolean;
  checkFunction?: () => Promise<boolean>;
}

const CHECKLIST_STORAGE_KEY = 'launch_checklist_progress';

const initialChecklist: ChecklistItem[] = [
  // Technical
  {
    id: 'tech_1',
    title: 'App Performance Optimization',
    description: 'Ensure app loads quickly and runs smoothly on all devices',
    category: 'technical',
    priority: 'high',
    completed: false,
    automated: true,
    checkFunction: async () => {
      const summary = performanceMonitor.getSummary();
      return Object.keys(summary).length > 0;
    }
  },
  {
    id: 'tech_2',
    title: 'Error Handling & Logging',
    description: 'Implement comprehensive error boundaries and logging',
    category: 'technical',
    priority: 'high',
    completed: false,
  },
  {
    id: 'tech_3',
    title: 'Offline Functionality',
    description: 'Test app behavior when offline or with poor connectivity',
    category: 'technical',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'tech_4',
    title: 'Security Audit',
    description: 'Review API keys, data storage, and user privacy measures',
    category: 'technical',
    priority: 'high',
    completed: false,
  },
  {
    id: 'tech_5',
    title: 'Cross-Platform Testing',
    description: 'Test on iOS, Android, and Web platforms',
    category: 'technical',
    priority: 'high',
    completed: false,
  },

  // Content
  {
    id: 'content_1',
    title: 'Exercise Database Complete',
    description: 'Verify all exercises have proper descriptions and images',
    category: 'content',
    priority: 'high',
    completed: false,
  },
  {
    id: 'content_2',
    title: 'Nutrition Data Accuracy',
    description: 'Review nutritional information for accuracy',
    category: 'content',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'content_3',
    title: 'UI Copy Review',
    description: 'Proofread all text for grammar and clarity',
    category: 'content',
    priority: 'medium',
    completed: false,
  },

  // Legal
  {
    id: 'legal_1',
    title: 'Privacy Policy',
    description: 'Create and implement comprehensive privacy policy',
    category: 'legal',
    priority: 'high',
    completed: false,
  },
  {
    id: 'legal_2',
    title: 'Terms of Service',
    description: 'Draft and implement terms of service',
    category: 'legal',
    priority: 'high',
    completed: false,
  },
  {
    id: 'legal_3',
    title: 'Health Disclaimers',
    description: 'Add appropriate health and fitness disclaimers',
    category: 'legal',
    priority: 'high',
    completed: false,
  },

  // Marketing
  {
    id: 'marketing_1',
    title: 'App Store Listing',
    description: 'Create compelling app store descriptions and screenshots',
    category: 'marketing',
    priority: 'high',
    completed: false,
  },
  {
    id: 'marketing_2',
    title: 'Social Media Assets',
    description: 'Prepare promotional images and videos',
    category: 'marketing',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'marketing_3',
    title: 'Beta Testing Program',
    description: 'Recruit and manage beta testers',
    category: 'marketing',
    priority: 'medium',
    completed: false,
  },

  // Testing
  {
    id: 'testing_1',
    title: 'User Acceptance Testing',
    description: 'Conduct thorough testing with real users',
    category: 'testing',
    priority: 'high',
    completed: false,
  },
  {
    id: 'testing_2',
    title: 'Accessibility Testing',
    description: 'Ensure app is accessible to users with disabilities',
    category: 'testing',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'testing_3',
    title: 'Load Testing',
    description: 'Test app performance under heavy usage',
    category: 'testing',
    priority: 'medium',
    completed: false,
  },
];

export default function LaunchChecklistScreen() {
  const { theme } = useTheme();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['technical']));

  const loadChecklistProgress = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        const savedProgress = JSON.parse(saved);
        const updatedChecklist = initialChecklist.map(item => ({
          ...item,
          completed: savedProgress[item.id] || false
        }));
        setChecklist(updatedChecklist);
      }
    } catch (error) {
      console.error('Error loading checklist progress:', error);
    }
  }, []);

  useEffect(() => {
    loadChecklistProgress();
  }, []);

  const saveChecklistProgress = useCallback(async (updatedChecklist: ChecklistItem[]) => {
    try {
      const progress: { [key: string]: boolean } = {};
      updatedChecklist.forEach(item => {
        progress[item.id] = item.completed;
      });
      await AsyncStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving checklist progress:', error);
    }
  }, []);

  const runAutomatedChecks = useCallback(async () => {
    const updatedChecklist = [...checklist];
    let hasChanges = false;

    for (const item of updatedChecklist) {
      if (item && item.automated && typeof item.checkFunction === 'function') {
        try {
          const result = await item.checkFunction();
          if (item.completed !== result) {
            item.completed = result;
            hasChanges = true;
          }
        } catch (error) {
          console.error(`Error running automated check for ${item.id}:`, error);
        }
      }
    }

    if (hasChanges) {
      setChecklist(updatedChecklist);
      await saveChecklistProgress(updatedChecklist);
    }
  }, [checklist, saveChecklistProgress]);

  const toggleItem = useCallback(async (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    await saveChecklistProgress(updatedChecklist);
  }, [checklist, saveChecklistProgress]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCompletionStats = () => {
    const total = checklist.length;
    const completed = checklist.filter(item => item.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const getCategoryStats = (category: string) => {
    const categoryItems = checklist.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.completed).length;
    return { total: categoryItems.length, completed };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.grey;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return 'code-slash';
      case 'content': return 'document-text';
      case 'legal': return 'shield-checkmark';
      case 'marketing': return 'megaphone';
      case 'testing': return 'bug';
      default: return 'checkmark-circle';
    }
  };

  const exportChecklist = async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        checklist: checklist,
        stats: getCompletionStats()
      };
      
      // In a real app, you'd implement actual export functionality
      Alert.alert(
        'Export Checklist',
        'Checklist data prepared for export. In production, this would save to file or send via email.',
        [{ text: 'OK' }]
      );
      
      console.log('Export data:', JSON.stringify(exportData, null, 2));
    } catch (error) {
      console.error('Error exporting checklist:', error);
      Alert.alert('Error', 'Failed to export checklist');
    }
  };

  const stats = getCompletionStats();
  const categories = ['technical', 'content', 'legal', 'marketing', 'testing'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Launch Checklist
        </Text>
        <TouchableOpacity
          onPress={exportChecklist}
          style={styles.exportButton}
        >
          <Ionicons name="download" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <View style={[styles.progressCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: theme.colors.text }]}>
            Overall Progress
          </Text>
          <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
            {stats.percentage}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.primary,
                width: `${stats.percentage}%`
              }
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          {stats.completed} of {stats.total} items completed
        </Text>
        
        <View style={styles.actionButtons}>
          <Button
            text="Run Automated Checks"
            onPress={runAutomatedChecks}
            variant="secondary"
            size="small"
          />
        </View>
      </View>

      {/* Checklist */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {categories.map(category => {
          const categoryStats = getCategoryStats(category);
          const isExpanded = expandedCategories.has(category);
          const categoryItems = checklist.filter(item => item.category === category);

          return (
            <View key={category} style={[styles.categoryCard, { backgroundColor: theme.colors.card }]}>
              <TouchableOpacity
                onPress={() => toggleCategory(category)}
                style={styles.categoryHeader}
              >
                <View style={styles.categoryInfo}>
                  <Ionicons
                    name={getCategoryIcon(category) as any}
                    size={24}
                    color={theme.colors.primary}
                    style={styles.categoryIcon}
                  />
                  <View>
                    <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <Text style={[styles.categoryStats, { color: theme.colors.textSecondary }]}>
                      {categoryStats.completed}/{categoryStats.total} completed
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.categoryItems}>
                  {categoryItems.map(item => (
                    <View key={item.id} style={[styles.checklistItem, { borderBottomColor: theme.colors.border }]}>
                      <View style={styles.itemHeader}>
                        <Switch
                          value={item.completed}
                          onValueChange={() => toggleItem(item.id)}
                          trackColor={{
                            false: theme.colors.border,
                            true: theme.colors.primary
                          }}
                          thumbColor={item.completed ? theme.colors.white : theme.colors.grey}
                        />
                        <View style={styles.itemInfo}>
                          <View style={styles.itemTitleRow}>
                            <Text style={[
                              styles.itemTitle,
                              {
                                color: item.completed ? theme.colors.textSecondary : theme.colors.text,
                                textDecorationLine: item.completed ? 'line-through' : 'none'
                              }
                            ]}>
                              {item.title}
                            </Text>
                            <View style={styles.itemBadges}>
                              {item.automated && (
                                <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
                                  <Text style={[styles.badgeText, { color: theme.colors.white }]}>
                                    AUTO
                                  </Text>
                                </View>
                              )}
                              <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
                                <Text style={[styles.badgeText, { color: theme.colors.white }]}>
                                  {item.priority.toUpperCase()}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]}>
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <VersionInfo showBuildNumber={true} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  exportButton: {
    padding: 8,
  },
  progressCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  categoryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryStats: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryItems: {
    paddingBottom: 8,
  },
  checklistItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  itemBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
  },
});