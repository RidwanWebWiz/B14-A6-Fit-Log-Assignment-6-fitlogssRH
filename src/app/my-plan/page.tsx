"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useWorkout } from '@/context/WorkoutContext';
import { workouts } from '@/lib/data';
import { toast } from 'sonner';

type SortOption = 'duration' | 'calories' | 'rating' | 'name';

function PlanContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'saved' ? 'saved' : 'plan';

  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>(initialTab);
  const [sortBy, setSortBy] = useState<SortOption>('duration');

  const { plan, saved, togglePlan, toggleSaved } = useWorkout();

  // Header stats calculated from Today's Plan
  const planItems = useMemo(() => {
    return workouts.filter((w) => plan.includes(w.id));
  }, [plan]);

  const totalExercises = planItems.length;
  const totalMinutes = planItems.reduce((acc, curr) => acc + curr.duration, 0);
  const totalCalories = planItems.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  // Active tab list items
  const rawItems = useMemo(() => {
    const ids = activeTab === 'plan' ? plan : saved;
    return workouts.filter((w) => ids.includes(w.id));
  }, [activeTab, plan, saved]);

  // Sort active list items
  const items = useMemo(() => {
    return [...rawItems].sort((a, b) => {
      if (sortBy === 'duration') return b.duration - a.duration;
      if (sortBy === 'calories') return b.caloriesBurned - a.caloriesBurned;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [rawItems, sortBy]);

  // Action Handlers with Cap & Toast logic
  const handleAddToPlanFromSaved = (id: number) => {
    if (plan.length >= 5) {
      toast.error("Today's plan is full! Maximum 5 lifts allowed.");
      return;
    }
    togglePlan(id);
    toast.success("Added to today's plan!");
  };

  const handleRemoveFromPlan = (id: number) => {
    togglePlan(id);
    toast.success("Workout marked as done and removed!");
  };

  const handleRemoveItem = (id: number) => {
    if (activeTab === 'plan') {
      togglePlan(id);
      toast.success("Removed from today's plan");
    } else {
      toggleSaved(id);
      toast.success("Removed from saved lifts");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 text-white">
      {/* Page Title & Subtitle */}
      <h1 className="text-3xl font-black uppercase tracking-tight mb-1">MY PLAN</h1>
      <p className="text-gray-400 text-xs mb-6">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      {/* Summary Stats Card */}
      <div className="bg-[#12141a] border border-gray-800/80 rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-gray-800/60">
        <div className="px-2 sm:px-4 first:pl-0">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Exercises</p>
          <p className="text-4xl font-black text-[#ccff00]">{totalExercises} <span className="text-xs text-gray-500 font-normal">/ 5 max</span></p>
        </div>
        <div className="px-2 sm:px-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Minutes</p>
          <p className="text-4xl font-black text-white">{totalMinutes}</p>
        </div>
        <div className="px-2 sm:px-6">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Calories</p>
          <p className="text-4xl font-black text-white">{totalCalories}</p>
        </div>
      </div>

      {/* Tab Switcher & Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Left Tabs */}
        <div className="flex items-center gap-1 bg-[#12141a] p-1 rounded-full border border-gray-800/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-5 py-2 rounded-full transition-all ${
              activeTab === 'plan'
                ? 'bg-[#1c2e05] text-[#ccff00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Today&apos;s Plan ({plan.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2 rounded-full transition-all ${
              activeTab === 'saved'
                ? 'bg-[#1c2e05] text-[#ccff00]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Saved ({saved.length})
          </button>
        </div>

        {/* Right Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <span>Sort By</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-32.5 bg-[#12141a] border-gray-800 text-white text-xs h-9">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#12141a] border-gray-800 text-white">
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="calories">Calories</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Workout Items List or Empty State */}
      {items.length === 0 ? (
        <div className="border border-dashed border-gray-800/90 rounded-2xl py-20 px-6 text-center flex flex-col items-center justify-center bg-[#0d0e12]">
          <h2 className="text-lg font-black uppercase tracking-wider text-white mb-2">
            NOTHING HERE YET
          </h2>
          <p className="text-xs text-gray-400 mb-6 max-w-sm">
            {activeTab === 'plan' 
              ? "Browse the library and add up to 5 lifts to get today moving."
              : "No saved lifts yet. Bookmark lifts from the library to review later."}
          </p>
          <Link
            href="/"
            className="bg-[#ccff00] text-black font-extrabold text-xs px-6 py-3 rounded-full hover:bg-[#b3e600] transition-colors"
          >
            Go to workouts
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((workout) => (
            <div
              key={workout.id}
              className="bg-[#12141a] border border-gray-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-gray-700/80 transition-colors"
            >
              {/* Left Info Section */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-[#0b0c0e] shrink-0 border border-gray-800/50">
                  <Image
                    src={workout.image}
                    alt={workout.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-black text-base uppercase tracking-tight text-white mb-0.5">
                    {workout.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{workout.equipment}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Image src="/assets/icons8-clock-24.png" alt="Duration" width={14} height={14} />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Image src="/assets/kcal.png" alt="Calories" width={14} height={14} />
                      {workout.caloriesBurned} kcal
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Image src="/assets/star.png" alt="Rating" width={14} height={14} />
                      {workout.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-800/60">
                <Link
                  href={`/workout/${workout.id}`}
                  className="px-4 py-2 rounded-full border border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 bg-[#0b0c0e] text-xs font-semibold transition-colors"
                >
                  View Details
                </Link>

                {activeTab === 'plan' ? (
                  <button
                    onClick={() => handleRemoveFromPlan(workout.id)}
                    className="px-4 py-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs hover:bg-[#b3e600] transition-colors flex items-center gap-1.5"
                  >
                    <span>✓</span>
                    <span>Mark as Done</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToPlanFromSaved(workout.id)}
                    className="px-4 py-2 rounded-full bg-[#ccff00] text-black font-extrabold text-xs hover:bg-[#b3e600] transition-colors"
                  >
                    + Add to Plan
                  </button>
                )}

                <button
                  onClick={() => handleRemoveItem(workout.id)}
                  className="text-gray-500 hover:text-gray-300 p-2 text-sm transition-colors ml-1"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-500">Loading plan...</div>}>
      <PlanContent />
    </Suspense>
  );
}