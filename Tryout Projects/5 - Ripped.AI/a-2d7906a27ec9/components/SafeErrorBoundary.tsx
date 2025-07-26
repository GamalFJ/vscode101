import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, commonStyles } from '../styles/commonStyles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorId: string;
}

class SafeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error details
    console.error('SafeErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }

    // Log specific information about property access errors
    if (error.message && error.message.includes('Cannot read properties of undefined')) {
      console.error('Property access error detected:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleReload = () => {
    // For web, reload the page
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    } else {
      // For native, just retry
      this.handleRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons 
              name="warning" 
              size={64} 
              color={colors?.error || '#D32F2F'} 
              style={styles.errorIcon}
            />
            
            <Text style={styles.errorTitle}>
              Oops! Something went wrong
            </Text>
            
            <Text style={styles.errorMessage}>
              {this.state.error?.message?.includes('Cannot read properties of undefined') 
                ? 'A data loading error occurred. This usually resolves itself quickly.'
                : 'An unexpected error occurred in the app.'
              }
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                text="Try Again"
                onPress={this.handleRetry}
                variant="primary"
                style={styles.retryButton}
              />
              
              <Button
                text="Reload App"
                onPress={this.handleReload}
                variant="secondary"
                style={styles.reloadButton}
              />
            </View>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>
                  Error: {this.state.error.message}
                </Text>
                <Text style={styles.debugText}>
                  Stack: {this.state.error.stack}
                </Text>
                {this.state.errorInfo?.componentStack && (
                  <Text style={styles.debugText}>
                    Component Stack: {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background || '#FEFCF8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors?.text || '#2F1B14',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: colors?.textSecondary || '#5D4E37',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  retryButton: {
    flex: 1,
  },
  reloadButton: {
    flex: 1,
  },
  debugContainer: {
    backgroundColor: colors?.backgroundAlt || '#F5F2ED',
    borderRadius: 8,
    padding: 16,
    maxHeight: 200,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors?.text || '#2F1B14',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: colors?.textSecondary || '#5D4E37',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});

export default SafeErrorBoundary;