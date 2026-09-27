"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useWorkout } from '@/context/WorkoutContext';
import { workouts } from '@/lib/data';
import { toast } from 'sonner';

type Workout = typeof workouts[number];

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const { plan, saved, togglePlan, toggleSaved } = useWorkout();

  if (!workout) return null;

  const inPlan = plan.includes(workout.id);
  const isSaved = saved.includes(workout.id);
  const isPlanFull = !inPlan && plan.length >= 5;

  const handlePlanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlanFull) {
      toast.error("Today's plan is full! Maximum 5 lifts allowed.");
      return;
    }

    togglePlan(workout.id);
    if (inPlan) {
      toast.success("Removed from today's plan");
    } else {
      toast.success("Added to today's plan!");
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleSaved(workout.id);
    if (isSaved) {
      toast.success("Removed from saved lifts");
    } else {
      toast.success("Saved lift!");
    }
  };

  return (
    <div className="bg-[#12141a] rounded-2xl overflow-hidden border border-gray-800/80 hover:border-gray-700/80 transition-colors flex flex-col justify-between group">
      <Link href={`/workout/${workout.id || 1}`} className="block">
        {/* Top Image */}
        <div className="relative w-full h-48 bg-[#0b0c0e]">
          <Image
            src={workout.image || ''}
            alt={workout.name || 'Workout'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Card Body */}
        <div className="p-4 pb-2">
          {/* Muscle Group Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(workout.muscleGroups || []).map((group: string, idx: number) => (
              <span
                key={group || idx}
                className="bg-[#ccff00] text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider"
              >
                {group}
              </span>
            ))}
          </div>

          <h3 className="font-black text-lg mb-0.5 uppercase tracking-tight text-white group-hover:text-[#ccff00] transition-colors">
            {workout.name}
          </h3>

          <p className="text-gray-500 text-xs mb-4">{workout.equipment}</p>

          {/* Specs Bar */}
          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-2">
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
      </Link>

      {/* Bottom Action Buttons */}
      <div className="p-4 pt-2 flex items-center gap-2">
        {/* Add to Plan Button */}
        <button
          type="button"
          onClick={handlePlanClick}
          disabled={isPlanFull}
          className={`flex-1 py-2.5 px-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
            isPlanFull
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
              : inPlan
              ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
              : 'bg-[#ccff00] text-black border-[#ccff00] hover:bg-[#b3e600]'
          }`}
        >
          <Image
            src="/assets/calendar.png"
            alt="Calendar"
            width={14}
            height={14}
            className={inPlan || isPlanFull ? 'brightness-0 invert' : 'brightness-0'}
          />
          <span>
            {isPlanFull
              ? 'FULL (5/5)'
              : inPlan
              ? 'IN TODAY\'S PLAN'
              : 'ADD TO PLAN'}
          </span>
        </button>

        {/* Save for Later Button matching screenshots */}
        <button
          type="button"
          onClick={handleSaveClick}
          className={`flex-1 py-2.5 px-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
            isSaved
              ? 'bg-[#2b220a] border-yellow-500 text-yellow-500 hover:bg-[#3b2e0d]'
              : 'bg-[#22272c] border-gray-800 text-white hover:border-gray-700'
          }`}
        >
          <Image
            src="/assets/bookmark.png"
            alt="Bookmark"
            width={14}
            height={14}
            className={isSaved ? 'sepia-0 hue-rotate-30' : 'invert'}
          />
          <span>{isSaved ? 'SAVED' : 'SAVE FOR LATER'}</span>
        </button>
      </div>
    </div>
  );
}