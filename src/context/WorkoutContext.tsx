"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { workouts } from '@/lib/data';

type WorkoutContextType = {
  plan: number[];
  saved: number[];
  togglePlan: (id: number) => void;
  toggleSaved: (id: number) => void;
  planMetrics: { exercises: number; minutes: number; calories: number };
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const LOCAL_STORAGE_PLAN_KEY = "fitlog_plan";
const LOCAL_STORAGE_SAVED_KEY = "fitlog_saved";

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load stored data asynchronously to prevent synchronous cascading re-renders
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedPlan = localStorage.getItem(LOCAL_STORAGE_PLAN_KEY);
        const storedSaved = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);

        if (storedPlan) setPlan(JSON.parse(storedPlan));
        if (storedSaved) setSaved(JSON.parse(storedSaved));
      } catch (error) {
        console.error("Failed to load data from localStorage:", error);
      } finally {
        setIsHydrated(true);
      }
    });
  }, []);

  // Persist plan updates to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(LOCAL_STORAGE_PLAN_KEY, JSON.stringify(plan));
  }, [plan, isHydrated]);

  // Persist saved updates to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(saved));
  }, [saved, isHydrated]);

  const togglePlan = (id: number) => {
    setPlan(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSaved = (id: number) => {
    setSaved(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const planMetrics = plan.reduce(
    (acc, id) => {
      const workout = workouts.find(w => w.id === id);
      if (workout) {
        acc.exercises += 1;
        acc.minutes += workout.duration;
        acc.calories += workout.caloriesBurned;
      }
      return acc;
    },
    { exercises: 0, minutes: 0, calories: 0 }
  );

  return (
    <WorkoutContext.Provider value={{ plan, saved, togglePlan, toggleSaved, planMetrics }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};