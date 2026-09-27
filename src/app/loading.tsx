export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <div className="w-10 h-10 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
        Loading workouts...
      </p>
    </div>
  );
}