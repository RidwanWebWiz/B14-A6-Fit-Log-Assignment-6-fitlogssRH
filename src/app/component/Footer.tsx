import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c0e] border-t border-gray-800/60 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        {/* Left: Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image 
            src="/assets/logo.png" 
            alt="FitLog Logo" 
            width={24} 
            height={24} 
            className="object-contain"
          />
          <span className="font-black text-base tracking-wider uppercase text-white">
            FITLOG
          </span>
        </Link>

        {/* Right: Copyright & Tagline */}
        <p className="text-xs text-gray-400 font-medium tracking-tight">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}