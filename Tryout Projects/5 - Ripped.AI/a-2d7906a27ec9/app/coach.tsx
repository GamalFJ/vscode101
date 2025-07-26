import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../utils/theme.tsx';
import Button from '../components/Button';
import CoachService, { CoachMessage, CoachSession, WorkoutRecommendation } from '../services/coachService';

interface QuickSuggestion {
  id: string;
  text: string;
  category: 'workout' | 'nutrition' | 'recovery' | 'general' | 'form' | 'progress';
  icon: string;
}

export default function CoachScreen() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<CoachSession | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  const quickSuggestions: QuickSuggestion[] = [
    { id: '1', text: 'How do I improve my bench press?', category: 'form', icon: 'barbell' },
    { id: '2', text: 'What should I eat after a workout?', category: 'nutrition', icon: 'nutrition' },
    { id: '3', text: 'Create a beginner workout plan', category: 'workout', icon: 'fitness' },
    { id: '4', text: 'How much rest between sets?', category: 'recovery', icon: 'time' },
    { id: '5', text: 'Tips for staying motivated', category: 'general', icon: 'heart' },
    { id: '6', text: 'How to track my progress?', category: 'progress', icon: 'trending-up' },
  ];

  // Memoize the initialization function
  const initializeCoach = useCallback(async () => {
    try {
      console.log('Initializing coach session...');
      let session = await CoachService.getCurrentSession();
      
      if (!session) {
        session = await CoachService.startNewSession();
        console.log('Started new coach session:', session.id);
      } else {
        console.log('Loaded existing coach session:', session.id);
      }
      
      setCurrentSession(session);
      setMessages(session.messages);
    } catch (error) {
      console.error('Error initializing coach:', error);
      Alert.alert('Error', 'Failed to initialize AI coach. Please try again.');
    }
  }, []);

  useEffect(() => {
    initializeCoach();
  }, []);

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping, typingAnimation]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Add haptic feedback
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }

      console.log('Sending message to coach:', userMessage);
      const response = await CoachService.sendMessage(userMessage);
      
      // Update messages from the current session
      const updatedSession = await CoachService.getCurrentSession();
      if (updatedSession) {
        setMessages(updatedSession.messages);
        setCurrentSession(updatedSession);
      }

      console.log('Received coach response:', response.content);
      
      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error sending message to coach:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion: QuickSuggestion) => {
    setInputText(suggestion.text);
  };

  const getFollowUpSuggestions = (): QuickSuggestion[] => {
    if (messages.length === 0) return quickSuggestions.slice(0, 3);
    
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.isUser) return quickSuggestions.slice(0, 3);
    
    // Return suggestions based on the last AI response type
    switch (lastMessage.type) {
      case 'workout':
        return quickSuggestions.filter(s => s.category === 'form' || s.category === 'recovery');
      case 'nutrition':
        return quickSuggestions.filter(s => s.category === 'workout' || s.category === 'recovery');
      default:
        return quickSuggestions.slice(0, 3);
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'workout': return theme.colors.primary;
      case 'nutrition': return theme.colors.success;
      case 'recovery': return theme.colors.warning;
      case 'form': return theme.colors.accent;
      case 'progress': return theme.colors.secondary;
      default: return theme.colors.textSecondary;
    }
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create_workout':
        router.push('/workout/create');
        break;
      case 'view_exercises':
        router.push('/(tabs)/exercise-library');
        break;
      case 'nutrition_advice':
        router.push('/(tabs)/nutrition');
        break;
      case 'clear_chat':
        Alert.alert(
          'Clear Chat',
          'Are you sure you want to clear this conversation?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear', 
              style: 'destructive',
              onPress: async () => {
                await CoachService.clearCurrentSession();
                setMessages([]);
                setCurrentSession(null);
                await initializeCoach();
              }
            }
          ]
        );
        break;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
            AI Fitness Coach
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.white + 'CC' }]}>
            Your personal training assistant
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleQuickAction('clear_chat')}>
          <Ionicons name="refresh" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: message.isUser 
                    ? theme.colors.primary 
                    : theme.colors.card,
                  borderColor: message.isUser 
                    ? theme.colors.primary 
                    : theme.colors.border,
                }
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color: message.isUser 
                      ? theme.colors.white 
                      : theme.colors.text
                  }
                ]}
              >
                {message.content}
              </Text>
              
              {message.type && message.type !== 'text' && !message.isUser && (
                <View style={[styles.messageTypeBadge, { backgroundColor: getCategoryColor(message.type) }]}>
                  <Text style={[styles.messageTypeText, { color: theme.colors.white }]}>
                    {message.type.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text
              style={[
                styles.messageTime,
                {
                  color: theme.colors.textSecondary,
                  textAlign: message.isUser ? 'right' : 'left'
                }
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Animated.View style={[styles.typingIndicator, { opacity: typingAnimation }]}>
                <Text style={[styles.messageText, { color: theme.colors.textSecondary }]}>
                  Coach is typing...
                </Text>
              </Animated.View>
            </View>
          </View>
        )}

        {/* Quick Suggestions */}
        {messages.length > 0 && !isLoading && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: theme.colors.textSecondary }]}>
              Quick suggestions:
            </Text>
            <View style={styles.suggestionsGrid}>
              {getFollowUpSuggestions().map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={[styles.suggestionChip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                  onPress={() => handleQuickSuggestion(suggestion)}
                >
                  <Ionicons 
                    name={suggestion.icon as any} 
                    size={16} 
                    color={getCategoryColor(suggestion.category)}
                    style={styles.suggestionIcon}
                  />
                  <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                    {suggestion.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Initial Quick Actions */}
        {messages.length <= 1 && (
          <View style={styles.quickActionsContainer}>
            <Text style={[styles.quickActionsTitle, { color: theme.colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={[styles.quickActionCard, { backgroundColor: theme.colors.card }]}
                onPress={() => handleQuickAction('create_workout')}
              >
                <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
                <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                  Create Workout
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickActionCard, { backgroundColor: theme.colors.card }]}
                onPress={() => handleQuickAction('view_exercises')}
              >
                <Ionicons name="library" size={32} color={theme.colors.primary} />
                <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                  Exercise Library
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickActionCard, { backgroundColor: theme.colors.card }]}
                onPress={() => handleQuickAction('nutrition_advice')}
              >
                <Ionicons name="nutrition" size={32} color={theme.colors.primary} />
                <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                  Nutrition Guide
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        {/* Quick Suggestions Row */}
        {messages.length === 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.quickSuggestionsScroll}
            contentContainerStyle={styles.quickSuggestionsContent}
          >
            {quickSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={[styles.quickSuggestionChip, { backgroundColor: theme.colors.backgroundAlt, borderColor: theme.colors.border }]}
                onPress={() => handleQuickSuggestion(suggestion)}
              >
                <Ionicons 
                  name={suggestion.icon as any} 
                  size={14} 
                  color={getCategoryColor(suggestion.category)}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.quickSuggestionText, { color: theme.colors.text }]}>
                  {suggestion.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.colors.backgroundAlt,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }
            ]}
            placeholder="Ask me anything about fitness..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() && !isLoading ? theme.colors.primary : theme.colors.textSecondary
              }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons 
              name={isLoading ? "hourglass" : "send"} 
              size={20} 
              color={theme.colors.white} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  messageTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionsContainer: {
    marginTop: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionIcon: {
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    minWidth: 100,
    flex: 1,
    maxWidth: '30%',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  quickSuggestionsScroll: {
    marginBottom: 12,
  },
  quickSuggestionsContent: {
    paddingRight: 20,
  },
  quickSuggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  quickSuggestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});