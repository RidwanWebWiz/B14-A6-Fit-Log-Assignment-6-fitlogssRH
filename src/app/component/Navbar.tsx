"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useWorkout } from '@/context/WorkoutContext';

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = useWorkout();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0c0e]/90 backdrop-blur-md border-b border-gray-800/40 transition-all">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 text-white">
        
        <Link href="/" prefetch={false} className="flex items-center gap-2.5">
          <Image 
            src="/assets/logo.png" 
            alt="FitLog Logo" 
            width={28} 
            height={28} 
            className="object-contain"
          />
          <span className="font-black text-lg tracking-wider uppercase">FITLOG</span>
        </Link>

        
        <div className="flex items-center gap-1 bg-[#121418] p-1 rounded-full text-xs font-semibold border border-gray-800/60">
          <Link 
            href="/" 
            prefetch={false}
            className={`px-4 py-1.5 rounded-full transition-all ${
              pathname === '/' 
                ? 'bg-[#1c2e05] text-[#ccff00]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Workouts
          </Link>
          <Link 
            href="/my-plan" 
            prefetch={false}
            className={`px-4 py-1.5 rounded-full transition-all ${
              pathname === '/my-plan' 
                ? 'bg-[#1c2e05] text-[#ccff00]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Plan
          </Link>
        </div>

        
        <div className="flex items-center gap-5 text-xs text-gray-400 font-medium">
          <Link 
            href="/my-plan" 
            prefetch={false} 
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <span>Plan</span>
            <span className="bg-[#ccff00] text-black font-extrabold w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
              {plan.length}
            </span>
          </Link>
          <Link 
            href="/my-plan?tab=saved" 
            prefetch={false} 
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <span>Saved</span>
            <span className="bg-[#181a20] border border-gray-700/80 text-gray-300 font-bold w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
              {saved.length}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}