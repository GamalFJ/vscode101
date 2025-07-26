import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import { router } from 'expo-router';

interface AIResponse {
  content: string;
  timestamp: Date;
  isUser?: boolean;
}

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

const generateQuickResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('workout') || lowerInput.includes('exercise')) {
    return "I can help you create a personalized workout! Would you like a quick routine for upper body, lower body, or full body? Or should we head to the full AI Trainer for a detailed plan?";
  } else if (lowerInput.includes('nutrition') || lowerInput.includes('diet')) {
    return "Great question about nutrition! For detailed meal planning and dietary advice, I recommend using the full AI Trainer. Would you like me to take you there?";
  } else if (lowerInput.includes('beginner') || lowerInput.includes('start')) {
    return "Perfect! For beginners, I recommend starting with bodyweight exercises 2-3 times per week. Would you like me to create a simple routine or take you to the AI Trainer for a comprehensive plan?";
  } else {
    return "I'm here to help with your fitness journey! For detailed guidance, let's use the full AI Trainer. Would you like me to take you there, or do you have a quick question I can answer?";
  }
};

export default function AIAssistant({ visible, onClose }: AIAssistantProps) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<AIResponse[]>([
    {
      content: "Hi! I'm your AI fitness assistant. For quick questions, ask me here. For detailed conversations and personalized guidance, try the Coach chat interface!",
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setIsLoading(true);

    // Add user message
    const userResponse: AIResponse = {
      content: userMessage,
      timestamp: new Date(),
      isUser: true
    };
    setMessages(prev => [...prev, userResponse]);

    // Generate AI response
    setTimeout(() => {
      const aiResponse: AIResponse = {
        content: generateQuickResponse(userMessage),
        timestamp: new Date(),
        isUser: false
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleOpenFullTrainer = () => {
    onClose();
    router.push('/ai-trainer');
  };

  const handleOpenCoach = () => {
    onClose();
    router.push('/coach');
  };

  const quickActions = [
    { text: 'Quick Workout', action: () => setUserInput('Create a quick 15-minute workout') },
    { text: 'Nutrition Tips', action: () => setUserInput('Give me nutrition advice') },
    { text: 'Beginner Help', action: () => setUserInput('I\'m a beginner, where should I start?') },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[commonStyles.header, { paddingTop: 60 }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { fontSize: 18, marginBottom: 0 }]}>
            AI Assistant
          </Text>
          <TouchableOpacity onPress={handleOpenFullTrainer}>
            <Ionicons name="expand" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={[commonStyles.section, { paddingTop: 0 }]}>
          <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 12 }]}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: colors.backgroundAlt,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={action.action}
              >
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
          {messages.map((message, index) => (
            <View 
              key={index} 
              style={[
                {
                  backgroundColor: message.isUser ? colors.primary : colors.backgroundAlt,
                  borderRadius: 16,
                  padding: 16,
                  marginVertical: 4,
                  maxWidth: '80%',
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                }
              ]}
            >
              <Text style={[
                commonStyles.text, 
                { fontSize: 14 },
                message.isUser ? { color: 'white' } : { color: colors.text }
              ]}>
                {message.content}
              </Text>
              <Text style={[
                commonStyles.textSecondary, 
                { fontSize: 10, marginTop: 4 },
                message.isUser ? { color: 'rgba(255,255,255,0.7)' } : {}
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={{
              backgroundColor: colors.backgroundAlt,
              borderRadius: 16,
              padding: 16,
              marginVertical: 4,
              maxWidth: '80%',
              alignSelf: 'flex-start',
            }}>
              <Text style={[commonStyles.text, { fontSize: 14, fontStyle: 'italic' }]}>
                Thinking...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[commonStyles.section, { paddingBottom: 0 }]}>
          <Button
            text="Open Coach Chat"
            onPress={handleOpenCoach}
            variant="primary"
            style={{ marginBottom: 8 }}
          />
          <Button
            text="Open Full AI Trainer"
            onPress={handleOpenFullTrainer}
            variant="secondary"
            style={{ marginBottom: 8 }}
          />
        </View>

        {/* Input Area */}
        <View style={{ 
          flexDirection: 'row', 
          paddingHorizontal: 20, 
          paddingVertical: 16, 
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          alignItems: 'center'
        }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginRight: 12,
              fontSize: 14,
              color: colors.text,
              backgroundColor: colors.backgroundAlt,
            }}
            placeholder="Ask a quick question..."
            placeholderTextColor={colors.textSecondary}
            value={userInput}
            onChangeText={setUserInput}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 20,
              padding: 10,
              opacity: userInput.trim() && !isLoading ? 1 : 0.5,
            }}
            onPress={handleSendMessage}
            disabled={!userInput.trim() || isLoading}
          >
            <Ionicons name="send" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}