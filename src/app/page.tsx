"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import WorkoutCard from './component/WorkoutCard'; // adjust path if needed (e.g., '@/components/WorkoutCard')
import { workouts } from '@/lib/data';

const CATEGORIES = ["ALL", "CHEST", "BACK", "LEGS", "SHOULDERS", "ARMS", "CORE"];

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesSearch =
        workout.name.toLowerCase().includes(search.toLowerCase()) ||
        workout.description.toLowerCase().includes(search.toLowerCase()) ||
        workout.equipment.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' ||
        workout.muscleGroups.some(
          (mg) => mg.toUpperCase() === selectedCategory
        );

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#181a20] border border-gray-800/80 rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Text & CTA */}
        <div className="flex-1 max-w-xl">
          <span className="text-[#ccff00] text-xs font-bold uppercase tracking-widest mb-4 block">
            WORKOUT LIBRARY
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-[1.05] tracking-tight mb-4 text-white">
            TRAIN WITH INTENT. LOG EVERY SET.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
  FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
</p>
          <a
            href="#library"
            className="inline-block bg-[#ccff00] text-black font-bold text-xs uppercase px-6 py-3.5 rounded-lg hover:bg-[#b3e600] transition-colors tracking-wide"
          >
            BROWSE WORKOUTS
          </a>
        </div>

        {/* Right Column: Banner Graphic */}
        <div className="w-full md:w-auto flex justify-center items-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image
              src="/assets/banner.png"
              alt="Gym Equipment Graphic"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Library Header & Controls */}
      <div id="library" className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">The Library</h2>
            <p className="text-gray-500 text-sm">Twelve lifts covering every major muscle group.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search lifts or equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#12141a] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Muscle Group Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#ccff00] text-black'
                  : 'bg-[#12141a] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Grid / Empty Search Results */}
      {filteredWorkouts.length === 0 ? (
        <div className="border border-dashed border-gray-800 rounded-2xl p-12 text-center bg-[#0d0e12]">
          <p className="text-sm text-gray-400 mb-3">
  No workouts found matching &quot;{search}&quot;.
</p>1
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
            }}
            className="text-xs text-[#ccff00] underline font-bold uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}