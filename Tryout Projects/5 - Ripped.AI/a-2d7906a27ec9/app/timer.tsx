import { Text, View, TouchableOpacity, TextInput, Alert, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../components/Button';
import { commonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface TimerPreset {
  name: string;
  duration: number;
  type: 'rest' | 'work' | 'custom';
}

interface WorkoutSchedule {
  id: string;
  days: string[];
  time: string;
  workoutType: string;
  isActive: boolean;
  createdAt: Date;
}

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const presets: TimerPreset[] = [
    { name: 'Quick Rest', duration: 30, type: 'rest' },
    { name: 'Standard Rest', duration: 60, type: 'rest' },
    { name: 'Long Rest', duration: 90, type: 'rest' },
    { name: 'Strength Rest', duration: 180, type: 'rest' },
    { name: 'HIIT Work', duration: 45, type: 'work' },
    { name: 'Plank Hold', duration: 60, type: 'work' },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const showTimerAlert = useCallback(() => {
    // Show browser alert or React Native alert since notifications are disabled
    Alert.alert(
      'Timer Finished!',
      'Your workout timer has completed.',
      [{ text: 'OK', onPress: () => console.log('Timer finished') }]
    );
  }, []);

  const loadSchedules = useCallback(async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem('workoutSchedules');
      if (storedSchedules) {
        const parsedSchedules = JSON.parse(storedSchedules);
        setSchedules(parsedSchedules);
        console.log('Loaded schedules:', parsedSchedules);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            showTimerAlert();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft, showTimerAlert]);

  const saveSchedules = async (newSchedules: WorkoutSchedule[]) => {
    try {
      await AsyncStorage.setItem('workoutSchedules', JSON.stringify(newSchedules));
      setSchedules(newSchedules);
      console.log('Schedules saved:', newSchedules);
    } catch (error) {
      console.error('Error saving schedules:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    setInitialTime(duration);
    setIsActive(true);
    setIsPaused(false);
    console.log('Timer started for', duration, 'seconds');
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
    console.log('Timer paused/resumed');
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(initialTime);
    console.log('Timer reset');
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(0);
    setInitialTime(0);
    console.log('Timer stopped');
  };

  const startCustomTimer = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds > 0) {
      startTimer(totalSeconds);
      setCustomMinutes('');
      setCustomSeconds('');
    } else {
      Alert.alert('Invalid Time', 'Please enter a valid time duration.');
    }
  };

  const getProgressPercentage = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getTimerColor = () => {
    if (!isActive) return colors.textSecondary;
    if (timeLeft <= 10) return colors.error;
    if (timeLeft <= 30) return colors.warning;
    return colors.primary;
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 20, textAlign: 'center', marginBottom: 0 }]}>
          Workout Timer
        </Text>
        <TouchableOpacity onPress={() => setShowScheduler(true)}>
          <Ionicons name="calendar" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[commonStyles.content, { justifyContent: 'flex-start', paddingTop: 20 }]}>
          {/* Timer Display */}
          <View style={{ alignItems: 'center', marginVertical: 40 }}>
            {/* Progress Circle */}
            <View style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              borderWidth: 8,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              backgroundColor: colors.backgroundAlt,
            }}>
              {/* Progress Arc - simplified representation */}
              <View style={{
                position: 'absolute',
                top: -4,
                left: -4,
                width: 258,
                height: 258,
                borderRadius: 129,
                borderWidth: 8,
                borderColor: 'transparent',
                borderTopColor: getTimerColor(),
                transform: [{ rotate: `${(getProgressPercentage() * 3.6)}deg` }],
              }} />
              
              <Text style={{
                fontSize: 48,
                fontWeight: '700',
                color: getTimerColor(),
                textAlign: 'center',
              }}>
                {formatTime(timeLeft)}
              </Text>
              
              {isActive && (
                <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
                  {isPaused ? 'Paused' : 'Running'}
                </Text>
              )}
            </View>
          </View>

          {/* Timer Controls */}
          {timeLeft > 0 && (
            <View style={commonStyles.section}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: isPaused ? colors.success : colors.warning,
                    borderRadius: 50,
                    padding: 16,
                    minWidth: 80,
                    alignItems: 'center',
                  }}
                  onPress={pauseTimer}
                >
                  <Ionicons 
                    name={isPaused ? 'play' : 'pause'} 
                    size={24} 
                    color="white" 
                  />
                  <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: colors.accent,
                    borderRadius: 50,
                    padding: 16,
                    minWidth: 80,
                    alignItems: 'center',
                  }}
                  onPress={resetTimer}
                >
                  <Ionicons name="refresh" size={24} color="white" />
                  <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>
                    Reset
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: colors.error,
                    borderRadius: 50,
                    padding: 16,
                    minWidth: 80,
                    alignItems: 'center',
                  }}
                  onPress={stopTimer}
                >
                  <Ionicons name="stop" size={24} color="white" />
                  <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>
                    Stop
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Custom Timer Input */}
          {timeLeft === 0 && (
            <View style={commonStyles.section}>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 16 }]}>
                Custom Timer
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 18,
                    textAlign: 'center',
                    width: 60,
                    marginRight: 8,
                    backgroundColor: colors.backgroundAlt,
                    color: colors.text,
                  }}
                  placeholder="00"
                  placeholderTextColor={colors.textSecondary}
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={[commonStyles.text, { marginRight: 8 }]}>min</Text>
                
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 18,
                    textAlign: 'center',
                    width: 60,
                    marginRight: 8,
                    backgroundColor: colors.backgroundAlt,
                    color: colors.text,
                  }}
                  placeholder="00"
                  placeholderTextColor={colors.textSecondary}
                  value={customSeconds}
                  onChangeText={setCustomSeconds}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={commonStyles.text}>sec</Text>
              </View>
              
              <Button
                text="Start Custom Timer"
                onPress={startCustomTimer}
                style={{ backgroundColor: colors.primary }}
              />
            </View>
          )}

          {/* Preset Timers */}
          {timeLeft === 0 && (
            <View style={commonStyles.section}>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 16 }]}>
                Quick Start
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                {presets.map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      backgroundColor: preset.type === 'work' ? colors.success : colors.primary,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      minWidth: 100,
                      alignItems: 'center',
                    }}
                    onPress={() => startTimer(preset.duration)}
                  >
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                      {preset.name}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>
                      {formatTime(preset.duration)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Notification status info */}
          <View style={[commonStyles.section, { backgroundColor: colors.backgroundAlt, padding: 16, borderRadius: 12 }]}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 14 }]}>
              <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
              {' '}Timer alerts will show as in-app notifications. Background notifications have been disabled.
            </Text>
          </View>

          {/* Current Schedules */}
          {schedules.length > 0 && (
            <View style={commonStyles.section}>
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 16 }]}>
                Your Workout Schedule
              </Text>
              {schedules.map((schedule) => (
                <View key={schedule.id} style={commonStyles.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        {schedule.workoutType}
                      </Text>
                      <Text style={commonStyles.textSecondary}>
                        {schedule.days.join(', ')} at {schedule.time}
                      </Text>
                    </View>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: schedule.isActive ? colors.success : colors.textSecondary,
                    }} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Routine Scheduler Modal */}
      <RoutineScheduler
        visible={showScheduler}
        onClose={() => setShowScheduler(false)}
        onSave={saveSchedules}
        existingSchedules={schedules}
      />
    </View>
  );
}

// Routine Scheduler Component
interface RoutineSchedulerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedules: WorkoutSchedule[]) => void;
  existingSchedules: WorkoutSchedule[];
}

function RoutineScheduler({ visible, onClose, onSave, existingSchedules }: RoutineSchedulerProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [workoutType, setWorkoutType] = useState('General Workout');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workoutTypes = ['General Workout', 'Strength Training', 'Cardio', 'HIIT', 'Flexibility', 'Recovery'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const saveSchedule = () => {
    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day.');
      return;
    }

    const newSchedule: WorkoutSchedule = {
      id: Date.now().toString(),
      days: selectedDays,
      time: selectedTime,
      workoutType,
      isActive: true,
      createdAt: new Date(),
    };

    const updatedSchedules = [...existingSchedules, newSchedule];
    onSave(updatedSchedules);
    
    // Reset form
    setSelectedDays([]);
    setSelectedTime('09:00');
    setWorkoutType('General Workout');
    
    Alert.alert('Success', 'Workout schedule saved! Note: Push notifications are disabled.');
    onClose();
  };

  const deleteSchedule = (scheduleId: string) => {
    const updatedSchedules = existingSchedules.filter(s => s.id !== scheduleId);
    onSave(updatedSchedules);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={commonStyles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 0 }]}>
            Routine Scheduler
          </Text>
          <TouchableOpacity onPress={saveSchedule}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={{ padding: 20 }}>
          {/* Workout Type Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Workout Type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {workoutTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    backgroundColor: workoutType === type ? colors.primary : colors.backgroundAlt,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: workoutType === type ? colors.primary : colors.border,
                  }}
                  onPress={() => setWorkoutType(type)}
                >
                  <Text style={{
                    color: workoutType === type ? colors.background : colors.text,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Days Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Select Days</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={{
                    backgroundColor: selectedDays.includes(day) ? colors.primary : colors.backgroundAlt,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: selectedDays.includes(day) ? colors.primary : colors.border,
                    minWidth: 80,
                    alignItems: 'center',
                  }}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={{
                    color: selectedDays.includes(day) ? colors.background : colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Preferred Time</Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.backgroundAlt,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[commonStyles.text, { fontSize: 18 }]}>{selectedTime}</Text>
              <Ionicons name="time" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Time Picker Options */}
          {showTimePicker && (
            <View style={{ marginBottom: 24 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Quick Times</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['06:00', '07:00', '08:00', '09:00', '12:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={{
                      backgroundColor: selectedTime === time ? colors.primary : colors.backgroundAlt,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: selectedTime === time ? colors.primary : colors.border,
                    }}
                    onPress={() => {
                      setSelectedTime(time);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={{
                      color: selectedTime === time ? colors.background : colors.text,
                      fontSize: 14,
                    }}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Existing Schedules */}
          {existingSchedules.length > 0 && (
            <View>
              <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Current Schedules</Text>
              {existingSchedules.map((schedule) => (
                <View key={schedule.id} style={[commonStyles.card, { marginBottom: 12 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                        {schedule.workoutType}
                      </Text>
                      <Text style={[commonStyles.textSecondary, { marginBottom: 2 }]}>
                        {schedule.days.join(', ')}
                      </Text>
                      <Text style={commonStyles.textSecondary}>
                        {schedule.time}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteSchedule(schedule.id)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="trash" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}