// API service for handling external data fetching
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ExerciseData {
  id: string;
  name: string;
  muscle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  equipment: string[];
}

export interface MachineData {
  id: string;
  name: string;
  exercises: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  setup: string[];
  safety: string[];
}

export interface WorkoutData {
  id: string;
  name: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Strength' | 'Cardio' | 'Flexibility' | 'HIIT';
  exercises: ExerciseData[];
  description: string;
}

export interface NutritionData {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'fats';
}

class ApiService {
  private baseUrl = 'https://api.ripped.ai'; // Placeholder URL

  async fetchExercises(): Promise<ApiResponse<ExerciseData[]>> {
    try {
      // Placeholder implementation - replace with actual API call
      console.log('Fetching exercises from API...');
      
      // Simulated API response
      const mockData: ExerciseData[] = [
        {
          id: '1',
          name: 'Bench Press',
          muscle: 'Chest',
          category: 'Strength',
          difficulty: 'Intermediate',
          description: 'Classic chest exercise using a barbell',
          instructions: ['Lie on bench', 'Grip barbell', 'Lower to chest', 'Press up'],
          equipment: ['Barbell', 'Bench']
        }
      ];

      return {
        data: mockData,
        success: true,
        message: 'Exercises fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch exercises'
      };
    }
  }

  async fetchMachines(): Promise<ApiResponse<MachineData[]>> {
    try {
      console.log('Fetching machines from API...');
      
      const mockData: MachineData[] = [
        {
          id: '1',
          name: 'Leg Press Machine',
          exercises: ['Leg Press', 'Calf Press'],
          difficulty: 'Beginner',
          description: 'Machine for lower body strength training',
          setup: ['Adjust seat', 'Set weight', 'Position feet'],
          safety: ['Keep back flat', 'Control the weight', 'Full range of motion']
        }
      ];

      return {
        data: mockData,
        success: true,
        message: 'Machines fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching machines:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch machines'
      };
    }
  }

  async fetchWorkouts(): Promise<ApiResponse<WorkoutData[]>> {
    try {
      console.log('Fetching workouts from API...');
      
      const mockData: WorkoutData[] = [
        {
          id: '1',
          name: 'Push Day',
          duration: 60,
          difficulty: 'Intermediate',
          type: 'Strength',
          exercises: [],
          description: 'Upper body pushing movements'
        }
      ];

      return {
        data: mockData,
        success: true,
        message: 'Workouts fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching workouts:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch workouts'
      };
    }
  }

  async fetchNutritionData(): Promise<ApiResponse<NutritionData[]>> {
    try {
      console.log('Fetching nutrition data from API...');
      
      const mockData: NutritionData[] = [
        {
          id: '1',
          name: 'Chicken Breast',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          category: 'protein'
        }
      ];

      return {
        data: mockData,
        success: true,
        message: 'Nutrition data fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      return {
        data: [],
        success: false,
        message: 'Failed to fetch nutrition data'
      };
    }
  }
}

export const apiService = new ApiService();