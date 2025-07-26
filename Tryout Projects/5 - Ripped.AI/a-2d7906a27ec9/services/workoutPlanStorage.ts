import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeeklyWorkoutPlan, WorkoutPlan } from './workoutGenerator';

const WEEKLY_PLANS_KEY = 'weekly_workout_plans';
const SINGLE_WORKOUTS_KEY = 'single_workouts';

export interface SavedWorkoutPlan extends WeeklyWorkoutPlan {
  savedAt: Date;
  isActive: boolean;
  progress: {
    completedWorkouts: number;
    totalWorkouts: number;
    currentWeek: number;
  };
}

export interface SavedSingleWorkout extends WorkoutPlan {
  savedAt: Date;
  timesCompleted: number;
  lastCompleted?: Date;
  personalBests: {
    exerciseId: string;
    bestWeight?: number;
    bestReps?: number;
    bestTime?: number;
  }[];
}

export class WorkoutPlanStorage {
  // Weekly Plans
  static async saveWeeklyPlan(plan: WeeklyWorkoutPlan): Promise<void> {
    try {
      const existingPlans = await this.getWeeklyPlans();
      
      // Deactivate other plans if this is being set as active
      const updatedPlans = existingPlans.map(p => ({ ...p, isActive: false }));
      
      const savedPlan: SavedWorkoutPlan = {
        ...plan,
        savedAt: new Date(),
        isActive: true,
        progress: {
          completedWorkouts: 0,
          totalWorkouts: plan.workouts.filter(w => !w.isRestDay).length,
          currentWeek: 1
        }
      };

      updatedPlans.push(savedPlan);
      
      await AsyncStorage.setItem(WEEKLY_PLANS_KEY, JSON.stringify(updatedPlans));
      console.log('Weekly plan saved successfully');
    } catch (error) {
      console.error('Error saving weekly plan:', error);
      throw error;
    }
  }

  static async getWeeklyPlans(): Promise<SavedWorkoutPlan[]> {
    try {
      const plansJson = await AsyncStorage.getItem(WEEKLY_PLANS_KEY);
      if (!plansJson) return [];
      
      const plans = JSON.parse(plansJson);
      return plans.map((plan: any) => ({
        ...plan,
        savedAt: new Date(plan.savedAt)
      }));
    } catch (error) {
      console.error('Error loading weekly plans:', error);
      return [];
    }
  }

  static async getActiveWeeklyPlan(): Promise<SavedWorkoutPlan | null> {
    try {
      const plans = await this.getWeeklyPlans();
      return plans.find(plan => plan.isActive) || null;
    } catch (error) {
      console.error('Error loading active weekly plan:', error);
      return null;
    }
  }

  static async updateWeeklyPlanProgress(
    planId: string, 
    progress: Partial<SavedWorkoutPlan['progress']>
  ): Promise<void> {
    try {
      const plans = await this.getWeeklyPlans();
      const planIndex = plans.findIndex(p => p.id === planId);
      
      if (planIndex !== -1) {
        plans[planIndex].progress = { ...plans[planIndex].progress, ...progress };
        await AsyncStorage.setItem(WEEKLY_PLANS_KEY, JSON.stringify(plans));
        console.log('Weekly plan progress updated');
      }
    } catch (error) {
      console.error('Error updating weekly plan progress:', error);
      throw error;
    }
  }

  static async deleteWeeklyPlan(planId: string): Promise<void> {
    try {
      const plans = await this.getWeeklyPlans();
      const filteredPlans = plans.filter(p => p.id !== planId);
      await AsyncStorage.setItem(WEEKLY_PLANS_KEY, JSON.stringify(filteredPlans));
      console.log('Weekly plan deleted successfully');
    } catch (error) {
      console.error('Error deleting weekly plan:', error);
      throw error;
    }
  }

  // Single Workouts
  static async saveSingleWorkout(workout: WorkoutPlan): Promise<void> {
    try {
      const existingWorkouts = await this.getSingleWorkouts();
      
      const savedWorkout: SavedSingleWorkout = {
        ...workout,
        savedAt: new Date(),
        timesCompleted: 0,
        personalBests: workout.exercises.map(ex => ({
          exerciseId: ex.id,
        }))
      };

      existingWorkouts.push(savedWorkout);
      
      await AsyncStorage.setItem(SINGLE_WORKOUTS_KEY, JSON.stringify(existingWorkouts));
      console.log('Single workout saved successfully');
    } catch (error) {
      console.error('Error saving single workout:', error);
      throw error;
    }
  }

  static async getSingleWorkouts(): Promise<SavedSingleWorkout[]> {
    try {
      const workoutsJson = await AsyncStorage.getItem(SINGLE_WORKOUTS_KEY);
      if (!workoutsJson) return [];
      
      const workouts = JSON.parse(workoutsJson);
      return workouts.map((workout: any) => ({
        ...workout,
        savedAt: new Date(workout.savedAt),
        lastCompleted: workout.lastCompleted ? new Date(workout.lastCompleted) : undefined
      }));
    } catch (error) {
      console.error('Error loading single workouts:', error);
      return [];
    }
  }

  static async updateWorkoutCompletion(workoutId: string): Promise<void> {
    try {
      const workouts = await this.getSingleWorkouts();
      const workoutIndex = workouts.findIndex(w => w.id === workoutId);
      
      if (workoutIndex !== -1) {
        workouts[workoutIndex].timesCompleted += 1;
        workouts[workoutIndex].lastCompleted = new Date();
        await AsyncStorage.setItem(SINGLE_WORKOUTS_KEY, JSON.stringify(workouts));
        console.log('Workout completion updated');
      }
    } catch (error) {
      console.error('Error updating workout completion:', error);
      throw error;
    }
  }

  static async updatePersonalBest(
    workoutId: string,
    exerciseId: string,
    bestData: { weight?: number; reps?: number; time?: number }
  ): Promise<void> {
    try {
      const workouts = await this.getSingleWorkouts();
      const workoutIndex = workouts.findIndex(w => w.id === workoutId);
      
      if (workoutIndex !== -1) {
        const workout = workouts[workoutIndex];
        const bestIndex = workout.personalBests.findIndex(pb => pb.exerciseId === exerciseId);
        
        if (bestIndex !== -1) {
          workout.personalBests[bestIndex] = { 
            ...workout.personalBests[bestIndex], 
            ...bestData 
          };
        } else {
          workout.personalBests.push({ exerciseId, ...bestData });
        }
        
        await AsyncStorage.setItem(SINGLE_WORKOUTS_KEY, JSON.stringify(workouts));
        console.log('Personal best updated');
      }
    } catch (error) {
      console.error('Error updating personal best:', error);
      throw error;
    }
  }

  static async deleteSingleWorkout(workoutId: string): Promise<void> {
    try {
      const workouts = await this.getSingleWorkouts();
      const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
      await AsyncStorage.setItem(SINGLE_WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
      console.log('Single workout deleted successfully');
    } catch (error) {
      console.error('Error deleting single workout:', error);
      throw error;
    }
  }

  // Utility methods
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([WEEKLY_PLANS_KEY, SINGLE_WORKOUTS_KEY]);
      console.log('All workout data cleared');
    } catch (error) {
      console.error('Error clearing workout data:', error);
      throw error;
    }
  }

  static async getWorkoutStats(): Promise<{
    totalWeeklyPlans: number;
    totalSingleWorkouts: number;
    totalCompletedWorkouts: number;
    activeWeeklyPlan: SavedWorkoutPlan | null;
  }> {
    try {
      const [weeklyPlans, singleWorkouts] = await Promise.all([
        this.getWeeklyPlans(),
        this.getSingleWorkouts()
      ]);

      const totalCompletedWorkouts = singleWorkouts.reduce(
        (total, workout) => total + workout.timesCompleted, 
        0
      );

      const activeWeeklyPlan = weeklyPlans.find(plan => plan.isActive) || null;

      return {
        totalWeeklyPlans: weeklyPlans.length,
        totalSingleWorkouts: singleWorkouts.length,
        totalCompletedWorkouts,
        activeWeeklyPlan
      };
    } catch (error) {
      console.error('Error getting workout stats:', error);
      return {
        totalWeeklyPlans: 0,
        totalSingleWorkouts: 0,
        totalCompletedWorkouts: 0,
        activeWeeklyPlan: null
      };
    }
  }
}