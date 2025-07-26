/**
 * Utility functions for safe property access and null checking
 * These functions help prevent "Cannot read properties of undefined" errors
 */

// Utility function to safely access nested object properties
export const safeGet = (obj: any, path: string, defaultValue: any = undefined) => {
  try {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.warn('Error accessing property path:', path, error);
    return defaultValue;
  }
};

// Utility function to safely check if an object has a property
export const safeHas = (obj: any, path: string): boolean => {
  try {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return false;
      }
      if (!(key in current)) {
        return false;
      }
      current = current[key];
    }
    
    return true;
  } catch (error) {
    console.warn('Error checking property path:', path, error);
    return false;
  }
};

// Utility function to safely access array elements
export const safeArrayGet = (arr: any[], index: number, defaultValue: any = undefined) => {
  try {
    if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
      return defaultValue;
    }
    
    const value = arr[index];
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.warn('Error accessing array index:', index, error);
    return defaultValue;
  }
};

// Utility function to validate object structure
export const validateObject = (obj: any, requiredFields: string[]): boolean => {
  try {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    
    return requiredFields.every(field => {
      const hasField = safeHas(obj, field);
      const value = safeGet(obj, field);
      return hasField && value !== null && value !== undefined;
    });
  } catch (error) {
    console.warn('Error validating object:', error);
    return false;
  }
};

// Utility function to safely parse JSON
export const safeJsonParse = (jsonString: string, defaultValue: any = null) => {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return defaultValue;
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Error parsing JSON:', error);
    return defaultValue;
  }
};

// Utility function to safely stringify JSON
export const safeJsonStringify = (obj: any, defaultValue: string = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('Error stringifying JSON:', error);
    return defaultValue;
  }
};

// Utility function to safely access function properties
export const safeCall = (fn: any, ...args: any[]) => {
  try {
    if (typeof fn === 'function') {
      return fn(...args);
    }
    console.warn('Attempted to call non-function:', fn);
    return undefined;
  } catch (error) {
    console.warn('Error calling function:', error);
    return undefined;
  }
};

// Utility function to safely filter arrays
export const safeFilter = (arr: any[], predicate: (item: any) => boolean, defaultValue: any[] = []) => {
  try {
    if (!Array.isArray(arr)) {
      console.warn('safeFilter called with non-array:', arr);
      return defaultValue;
    }
    
    return arr.filter(item => {
      try {
        return predicate(item);
      } catch (error) {
        console.warn('Error in filter predicate:', error);
        return false;
      }
    });
  } catch (error) {
    console.warn('Error filtering array:', error);
    return defaultValue;
  }
};

// Utility function to safely map arrays
export const safeMap = (arr: any[], mapper: (item: any, index: number) => any, defaultValue: any[] = []) => {
  try {
    if (!Array.isArray(arr)) {
      console.warn('safeMap called with non-array:', arr);
      return defaultValue;
    }
    
    return arr.map((item, index) => {
      try {
        return mapper(item, index);
      } catch (error) {
        console.warn('Error in map function:', error);
        return null;
      }
    }).filter(item => item !== null);
  } catch (error) {
    console.warn('Error mapping array:', error);
    return defaultValue;
  }
};

// Utility function to safely access nested arrays
export const safeNestedGet = (obj: any, path: string[], defaultValue: any = undefined) => {
  try {
    if (!obj || typeof obj !== 'object' || !Array.isArray(path)) {
      return defaultValue;
    }
    
    let result = obj;
    
    for (const key of path) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      
      if (typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.warn('Error accessing nested property:', path, error);
    return defaultValue;
  }
};

// Utility function to create safe object with default values
export const createSafeObject = (obj: any, defaults: Record<string, any>) => {
  try {
    const safeObj = { ...defaults };
    
    if (obj && typeof obj === 'object') {
      Object.keys(defaults).forEach(key => {
        if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined) {
          safeObj[key] = obj[key];
        }
      });
    }
    
    return safeObj;
  } catch (error) {
    console.warn('Error creating safe object:', error);
    return { ...defaults };
  }
};

// Utility function to safely merge objects
export const safeMerge = (...objects: any[]) => {
  try {
    const result = {};
    
    objects.forEach(obj => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (obj[key] !== null && obj[key] !== undefined) {
            (result as any)[key] = obj[key];
          }
        });
      }
    });
    
    return result;
  } catch (error) {
    console.warn('Error merging objects:', error);
    return {};
  }
};