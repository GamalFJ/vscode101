import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchKnowledge, getKnowledgeByTags } from '../data/coachKnowledge';
import OpenAI from 'openai';

const COACH_SESSIONS_KEY = 'coach_sessions';
const CURRENT_SESSION_KEY = 'current_coach_session';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export interface CoachMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'workout' | 'nutrition' | 'tip';
  metadata?: any;
}

export interface WorkoutRecommendation {
  name: string;
  exercises: string[];
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focus: string;
}

export interface CoachSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  messages: CoachMessage[];
  context: {
    userGoals?: string[];
    currentWorkout?: string;
    fitnessLevel?: string;
    preferences?: string[];
  };
}

class CoachService {
  private openai: OpenAI | null = null;
  private currentSession: CoachSession | null = null;

  constructor() {
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    try {
      if (OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: OPENAI_API_KEY,
        });
        console.log('OpenAI initialized successfully');
      } else {
        console.warn('OpenAI API key not found, using fallback responses');
      }
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
    }
  }

  async startNewSession(): Promise<CoachSession> {
    const session: CoachSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      lastActivity: new Date(),
      messages: [],
      context: {}
    };

    this.currentSession = session;
    await this.saveSession(session);
    
    // Add welcome message
    const welcomeMessage: CoachMessage = {
      id: Date.now().toString(),
      content: "Hi! I'm your AI fitness coach. I'm here to help you with workouts, nutrition, form tips, and answer any fitness questions you have. What would you like to work on today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };

    await this.addMessage(welcomeMessage);
    return session;
  }

  async getCurrentSession(): Promise<CoachSession | null> {
    if (this.currentSession) {
      return this.currentSession;
    }

    try {
      const sessionData = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        // Validate session structure
        if (parsed && typeof parsed === 'object' && parsed.id && Array.isArray(parsed.messages)) {
          this.currentSession = {
            id: parsed.id || Date.now().toString(),
            startTime: parsed.startTime ? new Date(parsed.startTime) : new Date(),
            lastActivity: parsed.lastActivity ? new Date(parsed.lastActivity) : new Date(),
            messages: Array.isArray(parsed.messages) ? parsed.messages.map((msg: any) => ({
              id: msg?.id || Date.now().toString(),
              content: msg?.content || '',
              isUser: typeof msg?.isUser === 'boolean' ? msg.isUser : false,
              timestamp: msg?.timestamp ? new Date(msg.timestamp) : new Date(),
              type: msg?.type || 'text',
              metadata: msg?.metadata
            })) : [],
            context: parsed.context || {}
          };
          return this.currentSession;
        }
      }
    } catch (error) {
      console.error('Error loading current session:', error);
    }

    return null;
  }

  async addMessage(message: CoachMessage): Promise<void> {
    if (!this.currentSession) {
      await this.startNewSession();
    }

    if (this.currentSession && message) {
      // Ensure message has required properties
      const safeMessage: CoachMessage = {
        id: message?.id || Date.now().toString(),
        content: message?.content || '',
        isUser: typeof message?.isUser === 'boolean' ? message.isUser : false,
        timestamp: message?.timestamp instanceof Date ? message.timestamp : new Date(),
        type: message?.type || 'text',
        metadata: message?.metadata || undefined
      };

      this.currentSession.messages = this.currentSession.messages || [];
      this.currentSession.messages.push(safeMessage);
      this.currentSession.lastActivity = new Date();
      await this.saveSession(this.currentSession);
    }
  }

  async sendMessage(userMessage: string): Promise<CoachMessage> {
    // Comprehensive validation of input message
    const safeUserMessage = userMessage && typeof userMessage === 'string' ? userMessage.trim() : '';
    
    if (!safeUserMessage) {
      console.warn('Empty or invalid user message provided to sendMessage:', userMessage);
      throw new Error('Invalid user message provided');
    }
    
    console.log('Processing coach message:', safeUserMessage);

    // Add user message
    const userMsg: CoachMessage = {
      id: Date.now().toString(),
      content: safeUserMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    await this.addMessage(userMsg);

    // Generate AI response
    let responseContent = '';
    let responseType: 'text' | 'workout' | 'nutrition' | 'tip' = 'text';
    let metadata: any = undefined;

    try {
      if (this.openai) {
        // Use OpenAI for response
        const response = await this.generateOpenAIResponse(safeUserMessage);
        
        // Comprehensive null checks for OpenAI response
        if (response && typeof response === 'object') {
          responseContent = response?.content && typeof response.content === 'string' ? response.content : "I'm sorry, I couldn't generate a response right now.";
          responseType = response?.type && ['text', 'workout', 'nutrition', 'tip'].includes(response.type) ? response.type : 'text';
          metadata = response?.metadata || undefined;
        } else {
          console.warn('Invalid response from OpenAI:', response);
          responseContent = "I'm sorry, I couldn't generate a response right now.";
        }
      } else {
        // Use fallback knowledge base
        const response = this.generateFallbackResponse(safeUserMessage);
        
        // Comprehensive null checks for fallback response
        if (response && typeof response === 'object') {
          responseContent = response?.content && typeof response.content === 'string' ? response.content : "I'm here to help with your fitness questions!";
          responseType = response?.type && ['text', 'workout', 'nutrition', 'tip'].includes(response.type) ? response.type : 'text';
          metadata = response?.metadata || undefined;
        } else {
          console.warn('Invalid fallback response:', response);
          responseContent = "I'm here to help with your fitness questions!";
        }
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      responseContent = "I'm having trouble processing that right now. Could you try rephrasing your question?";
      responseType = 'text';
      metadata = undefined;
    }

    const aiResponse: CoachMessage = {
      id: (Date.now() + 1).toString(),
      content: responseContent,
      isUser: false,
      timestamp: new Date(),
      type: responseType,
      metadata
    };

    await this.addMessage(aiResponse);
    return aiResponse;
  }

  private async generateOpenAIResponse(userMessage: string): Promise<{
    content: string;
    type: 'text' | 'workout' | 'nutrition' | 'tip';
    metadata?: any;
  }> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    // Validate userMessage parameter
    const safeUserMessage = userMessage && typeof userMessage === 'string' ? userMessage.trim() : '';
    if (!safeUserMessage) {
      throw new Error('Invalid user message for OpenAI');
    }

    const systemPrompt = `You are an expert AI fitness coach. You help users with:
    - Workout routines and exercise form
    - Nutrition advice and meal planning
    - Fitness goals and motivation
    - Equipment usage and safety
    - Recovery and injury prevention

    Keep responses helpful, encouraging, and practical. If asked about workouts, you can suggest specific exercises. For nutrition, provide balanced advice. Always prioritize safety.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: safeUserMessage }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      // Comprehensive null checks for OpenAI completion response
      if (!completion || typeof completion !== 'object') {
        console.warn('Invalid completion object from OpenAI:', completion);
        throw new Error('Invalid OpenAI completion response');
      }

      if (!Array.isArray(completion?.choices) || completion.choices.length === 0) {
        console.warn('No choices in OpenAI completion:', completion);
        throw new Error('No choices in OpenAI response');
      }

      const firstChoice = completion.choices[0];
      if (!firstChoice || typeof firstChoice !== 'object') {
        console.warn('Invalid first choice from OpenAI:', firstChoice);
        throw new Error('Invalid first choice in OpenAI response');
      }

      const message = firstChoice?.message;
      if (!message || typeof message !== 'object') {
        console.warn('Invalid message in OpenAI choice:', message);
        throw new Error('Invalid message in OpenAI choice');
      }

      const content = message?.content && typeof message.content === 'string' ? message.content : 'I apologize, but I couldn\'t generate a response right now.';
      
      // Determine response type based on content
      let type: 'text' | 'workout' | 'nutrition' | 'tip' = 'text';
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('workout') || lowerContent.includes('exercise')) {
        type = 'workout';
      } else if (lowerContent.includes('nutrition') || lowerContent.includes('food') || lowerContent.includes('diet')) {
        type = 'nutrition';
      } else if (lowerContent.includes('tip') || lowerContent.includes('advice')) {
        type = 'tip';
      }

      return { content, type };
    } catch (error) {
      console.error('Error in OpenAI API call:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  }

  private generateFallbackResponse(userMessage: string): {
    content: string;
    type: 'text' | 'workout' | 'nutrition' | 'tip';
    metadata?: any;
  } {
    const lowerMessage = userMessage.toLowerCase();

    // Workout-related responses
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('training')) {
      const workoutResponses: string[] = [
        "For a great full-body workout, try combining squats, push-ups, and planks. Start with 3 sets of 10-15 reps each.",
        "If you're looking to build strength, focus on compound movements like deadlifts, bench press, and rows. These work multiple muscle groups efficiently.",
        "For beginners, I recommend starting with bodyweight exercises: push-ups, squats, lunges, and planks. Master these before adding weights.",
        "A good workout routine includes both strength training and cardio. Aim for 3-4 strength sessions and 2-3 cardio sessions per week.",
        "Remember to warm up before exercising and cool down afterward. This helps prevent injury and improves recovery."
      ];
      
      return {
        content: workoutResponses[Math.floor(Math.random() * workoutResponses.length)],
        type: 'workout'
      };
    }

    // Nutrition-related responses
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      const nutritionResponses: string[] = [
        "Focus on whole foods: lean proteins, complex carbohydrates, healthy fats, and plenty of vegetables. This provides the nutrients your body needs for optimal performance.",
        "For muscle building, aim for 0.8-1g of protein per pound of body weight daily. Good sources include chicken, fish, eggs, beans, and Greek yogurt.",
        "Stay hydrated! Aim for at least 8 glasses of water daily, more if you're active. Proper hydration supports performance and recovery.",
        "Pre-workout: eat a small snack with carbs and protein 30-60 minutes before exercising. Post-workout: refuel within 2 hours with protein and carbs.",
        "Don't skip meals! Eating regularly helps maintain energy levels and supports your fitness goals. Focus on balanced meals with all macronutrients."
      ];
      
      return {
        content: nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)],
        type: 'nutrition'
      };
    }

    // Form and technique responses
    if (lowerMessage.includes('form') || lowerMessage.includes('technique') || lowerMessage.includes('how to')) {
      const formResponses: string[] = [
        "Proper form is crucial for safety and effectiveness. Start with lighter weights to master the movement pattern before increasing load.",
        "For squats: keep your chest up, knees tracking over toes, and weight in your heels. Descend until thighs are parallel to the ground.",
        "For push-ups: maintain a straight line from head to heels, hands under shoulders, and lower until chest nearly touches the ground.",
        "For deadlifts: keep the bar close to your body, chest up, and drive through your heels. Your back should remain neutral throughout.",
        "If you're unsure about form, consider working with a trainer or using mirrors to check your technique. Quality over quantity always!"
      ];
      
      return {
        content: formResponses[Math.floor(Math.random() * formResponses.length)],
        type: 'tip'
      };
    }

    // General fitness responses
    const generalResponses: string[] = [
      "Consistency is key in fitness! Even 20-30 minutes of activity daily can make a significant difference in your health and well-being.",
      "Listen to your body. Rest days are just as important as workout days for recovery and preventing burnout.",
      "Set realistic, specific goals. Instead of 'get fit,' try 'do 10 push-ups' or 'walk 30 minutes daily.' Small wins build momentum!",
      "Track your progress! Whether it's reps, weight, or how you feel, monitoring improvements helps maintain motivation.",
      "Remember, fitness is a journey, not a destination. Celebrate small victories and be patient with yourself as you build healthy habits."
    ];

    return {
      content: generalResponses[Math.floor(Math.random() * generalResponses.length)],
      type: 'text'
    };
  }

  async getSessionHistory(): Promise<CoachSession[]> {
    try {
      const sessionsData = await AsyncStorage.getItem(COACH_SESSIONS_KEY);
      if (sessionsData && typeof sessionsData === 'string') {
        const parsed = JSON.parse(sessionsData);
        // Ensure we return an array of valid sessions
        if (Array.isArray(parsed)) {
          return parsed.filter(session => 
            session && 
            typeof session === 'object' && 
            session.id && 
            Array.isArray(session.messages)
          );
        }
      }
    } catch (error) {
      console.error('Error loading session history:', error);
    }
    return [];
  }

  private async saveSession(session: CoachSession): Promise<void> {
    try {
      if (!session || typeof session !== 'object') {
        console.warn('Invalid session object for saving:', session);
        return;
      }

      // Ensure session has required properties
      const safeSession: CoachSession = {
        id: session?.id || Date.now().toString(),
        startTime: session?.startTime instanceof Date ? session.startTime : new Date(),
        lastActivity: session?.lastActivity instanceof Date ? session.lastActivity : new Date(),
        messages: Array.isArray(session?.messages) ? session.messages : [],
        context: session?.context || {}
      };

      // Save current session
      await AsyncStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(safeSession));
      
      // Update session history
      const sessions = await this.getSessionHistory();
      const existingIndex = sessions.findIndex(s => s?.id === safeSession.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = safeSession;
      } else {
        sessions.push(safeSession);
      }
      
      // Keep only last 10 sessions
      const recentSessions = sessions.slice(-10);
      await AsyncStorage.setItem(COACH_SESSIONS_KEY, JSON.stringify(recentSessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async clearCurrentSession(): Promise<void> {
    try {
      this.currentSession = null;
      await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Error clearing current session:', error);
    }
  }

  async clearAllSessions(): Promise<void> {
    try {
      this.currentSession = null;
      await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
      await AsyncStorage.removeItem(COACH_SESSIONS_KEY);
    } catch (error) {
      console.error('Error clearing all sessions:', error);
    }
  }
}

export default new CoachService();