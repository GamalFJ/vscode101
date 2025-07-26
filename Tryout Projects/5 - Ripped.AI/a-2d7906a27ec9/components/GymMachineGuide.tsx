import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

interface GymMachineGuideProps {
  machineName: string;
  exercises: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Get machine diagram
const getMachineDiagram = (machineName: string): string => {
  const diagramMap: { [key: string]: string } = {
    'Bench Press Station': `
    BENCH PRESS STATION
    ===================
    
         Safety Bars
    ┌─────────────────┐
    │  ▬▬▬▬▬▬▬▬▬▬▬▬  │ ← Barbell
    │                 │
    │ ═══════════════ │ ← Bench
    │                 │
    └─────────────────┘
    
    Key Parts:
    • Barbell rack at shoulder height
    • Adjustable safety bars
    • Flat/incline bench
    • Weight plate storage
    `,
    'Squat Rack': `
    SQUAT RACK
    ==========
    
    ┌─────────────────┐
    │  ▬▬▬▬▬▬▬▬▬▬▬▬  │ ← Barbell
    │                 │
    │     Safety      │
    │  ▬▬▬▬▬▬▬▬▬▬▬▬  │ ← Bars
    │                 │
    └─────────────────┘
    
    Key Parts:
    • J-hooks for barbell
    • Adjustable safety bars
    • Pull-up bar on top
    • Weight plate storage
    `,
    'Cable Machine': `
    CABLE MACHINE
    =============
    
    ┌─────────────────┐
    │       ●         │ ← Pulley
    │       │         │
    │       │         │ ← Cable
    │    ▬▬▬▬▬▬▬     │ ← Handle
    │                 │
    │  Weight Stack   │
    │  ████████████   │
    └─────────────────┘
    
    Key Parts:
    • Adjustable pulleys
    • Various handles/attachments
    • Weight stack selection
    • Cable system
    `,
    'Leg Press Machine': `
    LEG PRESS MACHINE
    =================
    
         Weight Plates
    ┌─────────────────┐
    │  ████████████   │
    │        ╱        │ ← Foot Plate
    │      ╱          │
    │    ╱            │ ← Seat
    │  ╱              │
    └─────────────────┘
    
    Key Parts:
    • Angled foot plate
    • Sliding seat
    • Weight loading posts
    • Safety handles
    `,
    'Lat Pulldown Machine': `
    LAT PULLDOWN
    ============
    
    ┌─────────────────┐
    │       ●         │ ← Pulley
    │       │         │
    │    ▬▬▬▬▬▬▬     │ ← Bar
    │                 │
    │    ═══════      │ ← Seat
    │    ███████      │ ← Thigh Pads
    │  Weight Stack   │
    └─────────────────┘
    
    Key Parts:
    • Overhead pulley system
    • Wide grip bar
    • Adjustable thigh pads
    • Weight stack selection
    `
  };

  return diagramMap[machineName] || `
    GYM MACHINE
    ===========
    
    This machine is used for various
    strength training exercises.
    
    Ask gym staff for:
    • Proper setup instructions
    • Safety guidelines
    • Exercise demonstrations
    • Weight recommendations
  `;
};

// Get machine setup instructions
const getMachineSetup = (machineName: string): string[] => {
  const setupMap: { [key: string]: string[] } = {
    'Bench Press Station': [
      'Adjust bench to desired angle (flat, incline, or decline)',
      'Set safety bars just below your lowest chest position',
      'Load weight plates evenly on both sides of barbell',
      'Ensure barbell is centered and secure on rack',
      'Check that bench is stable and locked in position'
    ],
    'Squat Rack': [
      'Set J-hooks at shoulder height when standing',
      'Position safety bars at your lowest squat depth',
      'Load weight plates evenly on barbell',
      'Ensure barbell is centered and balanced',
      'Clear the area around the rack of obstacles'
    ],
    'Cable Machine': [
      'Select appropriate weight on weight stack',
      'Adjust pulley height for your exercise',
      'Attach the correct handle or bar',
      'Check that cable moves smoothly',
      'Ensure weight stack pin is fully inserted'
    ],
    'Leg Press Machine': [
      'Adjust seat position for your leg length',
      'Load weight plates evenly on both sides',
      'Ensure safety handles are accessible',
      'Check that foot plate moves smoothly',
      'Set appropriate range of motion stops if available'
    ],
    'Lat Pulldown Machine': [
      'Adjust thigh pads to secure your legs',
      'Select weight on weight stack',
      'Grip the bar with hands wider than shoulders',
      'Ensure you can reach the bar comfortably',
      'Check that cable moves smoothly through pulley'
    ]
  };

  return setupMap[machineName] || [
    'Read any posted instructions on the machine',
    'Ask gym staff for setup assistance',
    'Start with lighter weight to test the machine',
    'Ensure all safety features are engaged',
    'Check that the machine is clean and functional'
  ];
};

// Get safety tips for machine
const getMachineSafety = (machineName: string): string[] => {
  const safetyMap: { [key: string]: string[] } = {
    'Bench Press Station': [
      'Always use safety bars or have a spotter',
      'Keep feet planted firmly on the ground',
      'Never lift alone with heavy weight',
      'Ensure barbell is evenly loaded',
      'Warm up with lighter weights first'
    ],
    'Squat Rack': [
      'Set safety bars at proper height',
      'Always re-rack the weight properly',
      'Keep the bar centered on your back',
      'Never walk backwards more than necessary',
      'Use proper lifting technique'
    ],
    'Cable Machine': [
      'Check cable for fraying or damage',
      'Control the weight throughout the movement',
      'Never let the weight stack slam down',
      'Keep proper form throughout the exercise',
      'Be aware of others around the machine'
    ],
    'Leg Press Machine': [
      'Never lock your knees completely',
      'Keep your back flat against the seat',
      'Use the safety handles when needed',
      'Control the weight on both up and down phases',
      'Don&apos;t go too deep if you have knee issues'
    ],
    'Lat Pulldown Machine': [
      'Don&apos;t pull the bar behind your neck',
      'Keep your torso upright',
      'Control the weight on the way up',
      'Ensure thigh pads are secure',
      'Use a full range of motion'
    ]
  };

  return safetyMap[machineName] || [
    'Read all safety instructions posted on machine',
    'Start with light weight to learn the movement',
    'Ask for help if you&apos;re unsure about anything',
    'Never use damaged equipment',
    'Always maintain control of the weight'
  ];
};

export default function GymMachineGuide({ machineName, exercises, difficulty }: GymMachineGuideProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagram' | 'setup' | 'safety' | 'exercises'>('diagram');

  const machineDiagram = getMachineDiagram(machineName);
  const setupInstructions = getMachineSetup(machineName);
  const safetyTips = getMachineSafety(machineName);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.warning;
      case 'Advanced': return colors.error;
      default: return colors.primary;
    }
  };

  console.log('GymMachineGuide rendered for:', machineName);

  return (
    <View>
      {/* Machine Preview Card */}
      <TouchableOpacity 
        style={[commonStyles.card, styles.previewCard]}
        onPress={() => {
          console.log('Opening machine guide for:', machineName);
          setShowModal(true);
        }}
      >
        <View style={styles.previewContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="barbell" size={32} color={colors.primary} />
          </View>
          
          <View style={styles.previewTextContainer}>
            <View style={styles.titleRow}>
              <Text style={[commonStyles.text, styles.machineTitle]}>
                {machineName}
              </Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
                <Text style={styles.difficultyText}>
                  {difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={[commonStyles.textSecondary, styles.exerciseCount]}>
              {exercises.length} exercises available
            </Text>
            
            <View style={styles.actionRow}>
              <Ionicons name="construct" size={16} color={colors.primary} />
              <Text style={[commonStyles.textSecondary, styles.actionText]}>
                Tap to view machine guide
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Machine Guide Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[commonStyles.header, { backgroundColor: colors.primary }]}>
            <TouchableOpacity onPress={() => {
              console.log('Closing machine guide');
              setShowModal(false);
            }}>
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={[commonStyles.title, { fontSize: 18, color: colors.white, marginBottom: 0 }]}>
              Machine Guide
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Machine Title */}
          <View style={styles.modalHeader}>
            <Text style={[commonStyles.title, styles.modalTitle]}>
              {machineName}
            </Text>
            <Text style={[commonStyles.textSecondary, styles.modalSubtitle]}>
              Difficulty: {difficulty}
            </Text>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'diagram', label: 'Diagram', icon: 'analytics' },
              { key: 'setup', label: 'Setup', icon: 'settings' },
              { key: 'safety', label: 'Safety', icon: 'shield' },
              { key: 'exercises', label: 'Exercises', icon: 'list' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  { backgroundColor: activeTab === tab.key ? colors.primary : 'transparent' }
                ]}
                onPress={() => {
                  console.log('Switching to tab:', tab.key);
                  setActiveTab(tab.key as any);
                }}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={20} 
                  color={activeTab === tab.key ? colors.white : colors.textSecondary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? colors.white : colors.textSecondary }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
            {activeTab === 'diagram' && (
              <View style={commonStyles.section}>
                <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                  Machine Diagram
                </Text>
                
                <View style={[commonStyles.card, styles.diagramCard]}>
                  <Text style={styles.diagramText}>
                    {machineDiagram}
                  </Text>
                </View>

                <View style={[commonStyles.card, styles.infoCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Understanding the Machine
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Study the diagram above to familiarize yourself with the key components of the {machineName}.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'setup' && (
              <View style={commonStyles.section}>
                <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                  Machine Setup
                </Text>
                
                {setupInstructions.map((instruction, index) => (
                  <View key={index} style={[commonStyles.card, { marginBottom: 12 }]}>
                    <View style={styles.instructionRow}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={[commonStyles.text, { flex: 1 }]}>
                        {instruction}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={[commonStyles.card, styles.tipCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="bulb" size={20} color={colors.warning} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        First Time Using This Machine?
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Don&apos;t hesitate to ask gym staff for a demonstration. They&apos;re there to help you use equipment safely and effectively.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'safety' && (
              <View style={commonStyles.section}>
                <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                  Safety Guidelines
                </Text>
                
                {safetyTips.map((tip, index) => (
                  <View key={index} style={[commonStyles.card, { marginBottom: 12 }]}>
                    <View style={styles.safetyRow}>
                      <Ionicons name="shield-checkmark" size={20} color={colors.success} style={styles.infoIcon} />
                      <Text style={[commonStyles.text, { flex: 1 }]}>
                        {tip}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={[commonStyles.card, styles.warningCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="warning" size={20} color={colors.white} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, styles.warningTitle]}>
                        Important Safety Reminder
                      </Text>
                      <Text style={[commonStyles.text, styles.warningText]}>
                        If you&apos;re unsure about proper form or machine operation, always ask for help. It&apos;s better to learn correctly than risk injury.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'exercises' && (
              <View style={commonStyles.section}>
                <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                  Exercises You Can Do
                </Text>
                
                {exercises.map((exercise, index) => (
                  <View key={index} style={[commonStyles.card, { marginBottom: 12 }]}>
                    <View style={styles.exerciseRow}>
                      <Ionicons name="fitness" size={20} color={colors.primary} style={styles.infoIcon} />
                      <Text style={[commonStyles.text, { flex: 1, fontWeight: '600' }]}>
                        {exercise}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                    </View>
                  </View>
                ))}

                <View style={[commonStyles.card, styles.infoCard]}>
                  <View style={styles.infoRow}>
                    <Ionicons name="school" size={20} color={colors.primary} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        Learning Progression
                      </Text>
                      <Text style={[commonStyles.textSecondary]}>
                        Start with basic exercises and lighter weights. Master the form before progressing to more advanced movements.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  previewCard: {
    marginBottom: 16,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  previewTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  machineTitle: {
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  exerciseCount: {
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
  },
  modalHeader: {
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  diagramCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    marginBottom: 16,
  },
  diagramText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: colors.backgroundAlt,
  },
  tipCard: {
    backgroundColor: colors.backgroundAlt,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginTop: 16,
  },
  warningCard: {
    backgroundColor: colors.error,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningTitle: {
    color: colors.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    color: colors.white,
    fontSize: 14,
  },
});