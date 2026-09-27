"use client";
import { useWorkout } from '@/context/WorkoutContext';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { workouts } from '@/lib/data';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Workout = typeof workouts[number];

export default function WorkoutDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const workout: Workout | undefined = workouts.find((w) => w.id === parseInt(resolvedParams.id));
  const { plan, saved, togglePlan, toggleSaved } = useWorkout();

  if (!workout) return notFound();

  const inPlan = plan.includes(workout.id);
  const inSaved = saved.includes(workout.id);
  const isPlanFull = plan.length >= 5 && !inPlan;

  const handlePlanToggle = () => {
    if (isPlanFull) {
      toast.error("Today's plan is full! Maximum 5 lifts allowed.");
      return;
    }
    togglePlan(workout.id);
    toast.success(inPlan ? "Removed from today's plan" : "Added to today's plan!");
  };

  const handleSavedToggle = () => {
    toggleSaved(workout.id);
    toast.success(inSaved ? "Removed from saved lifts" : "Saved for later!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-2 text-white max-w-5xl mx-auto items-start">
      {/* Left Column: Compact Workout Image */}
      <div className="relative w-full h-120 rounded-2xl overflow-hidden bg-[#12141a] border border-gray-800/50">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Right Column: Workout Details */}
      <div className="flex flex-col justify-between">
        <div>
          {/* Header Title & Description */}
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
            {workout.name}
          </h1>
          <p className="text-gray-400 text-xs leading-relaxed mb-3">
            {workout.description}
          </p>

          {/* Muscle Group Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {workout.muscleGroups.map((group, idx) => (
              <span
                key={idx}
                className="bg-[#ccff00] text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
              >
                {group}
              </span>
            ))}
          </div>

          {/* Specs Table Card */}
          <div className="bg-[#12141a] border border-gray-800/80 rounded-xl p-3.5 mb-4 space-y-2 text-[11px]">
            <div className="flex justify-between items-center border-b border-gray-800/60 pb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">EQUIPMENT</span>
              <span className="text-gray-200 font-semibold">{workout.equipment}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-800/60 pb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">DIFFICULTY</span>
              <span className="text-gray-200 font-semibold">{workout.difficulty}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-800/60 pb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">SETS</span>
              <span className="text-gray-200 font-semibold">{workout.sets}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-800/60 pb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">REPS</span>
              <span className="text-gray-200 font-semibold">{workout.reps}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-800/60 pb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">DURATION</span>
              <span className="text-gray-200 font-semibold">{workout.duration} min</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-800/60 pb-1.5">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">CALORIES</span>
              <span className="text-gray-200 font-semibold">{workout.caloriesBurned} kcal</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">RATING</span>
              <span className="text-gray-200 font-semibold">{workout.rating}</span>
            </div>
          </div>

          {/* Instructions List */}
          <div className="mb-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-white mb-2">
              INSTRUCTIONS
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-400 leading-normal">
              {workout.instructions.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons with Custom Image Icons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handlePlanToggle}
            disabled={isPlanFull}
            className={`font-extrabold text-[11px] uppercase transition-colors ${
              isPlanFull
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : inPlan
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#ccff00] text-black hover:bg-[#b3e600]'
            }`}
          >
            <Image
              src="/assets/calendar.png"
              alt="Calendar"
              width={14}
              height={14}
              className={inPlan ? 'brightness-0 invert' : ''}
            />
            <span>
              {isPlanFull
                ? 'Plan Full (5/5)'
                : inPlan
                ? "In today's plan"
                : "Add to today's plan"}
            </span>
          </Button>

          <Button
            onClick={handleSavedToggle}
            variant="outline"
            className={`font-bold text-[11px] uppercase transition-colors ${
              inSaved
                ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                : 'border-gray-800 text-gray-300 hover:border-gray-600 bg-[#12141a]'
            }`}
          >
            <Image
              src="/assets/bookmark.png"
              alt="Bookmark"
              width={14}
              height={14}
            />
            <span>{inSaved ? 'Saved' : 'Save for later'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}