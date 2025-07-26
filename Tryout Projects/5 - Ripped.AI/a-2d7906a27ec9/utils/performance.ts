import React from 'react';
import { Platform } from 'react-native';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private startTime: number = Date.now();

  // Measure app startup time
  measureAppStartup() {
    if (Platform.OS !== 'web') {
      const startupTime = Date.now() - this.startTime;
      this.addMetric('app_startup', startupTime);
      console.log(`App startup time: ${startupTime}ms`);
    }
  }

  // Measure component render time
  measureRender(componentName: string, renderTime: number) {
    this.addMetric(`render_${componentName}`, renderTime);
    console.log(`${componentName} render time: ${renderTime}ms`);
  }

  // Measure API call time
  measureApiCall(endpoint: string, duration: number) {
    this.addMetric(`api_${endpoint}`, duration);
    console.log(`API call ${endpoint}: ${duration}ms`);
  }

  // Add custom metric
  addMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  // Get metrics by name
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  // Get average for a metric
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics = [];
  }

  // Get performance summary
  getSummary() {
    const summary: { [key: string]: { count: number; average: number; latest: number } } = {};
    
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, average: 0, latest: 0 };
      }
      summary[metric.name].count++;
      summary[metric.name].latest = metric.value;
    });

    // Calculate averages
    Object.keys(summary).forEach(name => {
      summary[name].average = this.getAverageMetric(name);
    });

    return summary;
  }
}

// Web Vitals measurement for web platform
export const measureWebVitals = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Measure First Contentful Paint
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const paintEntries = window.performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          performanceMonitor.addMetric('fcp', entry.startTime);
          console.log(`First Contentful Paint: ${entry.startTime}ms`);
        }
      });
    }

    // Measure Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            performanceMonitor.addMetric('lcp', lastEntry.startTime);
            console.log(`Largest Contentful Paint: ${lastEntry.startTime}ms`);
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP measurement not supported:', error);
      }
    }

    // Measure Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          performanceMonitor.addMetric('cls', clsValue);
          console.log(`Cumulative Layout Shift: ${clsValue}`);
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS measurement not supported:', error);
      }
    }
  }
};

// HOC for measuring component render time
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const PerformanceTrackedComponent = React.forwardRef<any, P>((props, ref) => {
    const renderStart = React.useRef<number>(0);

    React.useEffect(() => {
      renderStart.current = Date.now();
    });

    React.useLayoutEffect(() => {
      const renderTime = Date.now() - renderStart.current;
      performanceMonitor.measureRender(displayName, renderTime);
    });

    return React.createElement(WrappedComponent, { ...props, ref });
  });

  // Set display name to fix lint error
  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${displayName})`;

  return PerformanceTrackedComponent;
};

// Hook for measuring custom performance
export const usePerformanceTracking = (name: string) => {
  const startTime = React.useRef<number>(0);

  const start = React.useCallback(() => {
    startTime.current = Date.now();
  }, []);

  const end = React.useCallback(() => {
    const duration = Date.now() - startTime.current;
    performanceMonitor.addMetric(name, duration);
    return duration;
  }, [name]);

  return { start, end };
};

// Measure app startup time
export const measureAppStartup = () => {
  performanceMonitor.measureAppStartup();
};

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;