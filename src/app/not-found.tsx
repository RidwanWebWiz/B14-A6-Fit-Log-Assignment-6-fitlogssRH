import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 text-white">
      <h1 className="text-7xl font-black text-[#ccff00] mb-2">404</h1>
      <h2 className="text-xl font-bold uppercase tracking-tight mb-4">Page Not Found</h2>
      <p className="text-gray-400 text-xs max-w-sm mb-6">
        The lift or page you are looking for does not exist in the library.
      </p>
      <Link
        href="/"
        className="bg-[#ccff00] text-black font-extrabold text-xs uppercase px-5 py-3 rounded-lg hover:bg-[#b3e600] transition-colors"
      >
        Back to Workouts
      </Link>
    </div>
  );
}