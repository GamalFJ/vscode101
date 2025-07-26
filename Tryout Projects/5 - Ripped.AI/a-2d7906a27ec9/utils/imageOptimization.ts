import { Platform } from 'react-native';

export interface OptimizedImageProps {
  uri: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const getOptimizedImageUri = ({
  uri,
  width,
  height,
  quality = 80,
  format = 'webp'
}: OptimizedImageProps): string => {
  // For web, we can use URL parameters for image optimization
  if (Platform.OS === 'web' && uri.includes('unsplash.com')) {
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    params.append('fm', format);
    params.append('fit', 'crop');
    
    return `${uri}?${params.toString()}`;
  }
  
  // For native platforms, return original URI
  // In production, you might want to implement server-side image optimization
  return uri;
};

export const preloadImage = (uri: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = uri;
    } else {
      // For React Native, you can use Image.prefetch
      // Image.prefetch(uri).then(resolve).catch(reject);
      resolve(); // Fallback
    }
  });
};

export const getImageDimensions = (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'web') {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = uri;
    } else {
      // For React Native, you can use Image.getSize
      // Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
      resolve({ width: 300, height: 200 }); // Fallback
    }
  });
};