import Link from 'next/link';
import { Mountain, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-5 bg-white">
      <div className="w-16 h-16 rounded-2xl bg-[#E6F5F0] text-[#008768] flex items-center justify-center">
        <Mountain className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="font-display text-3xl font-extrabold text-gray-900">
          Page not found
        </h1>
        <p className="text-sm text-gray-600">
          The Kyrgyzstan tour or page you’re looking for may have moved. Explore our verified local expeditions instead.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold transition"
        >
          Browse Kyrgyzstan Tours
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-full border border-gray-300 hover:border-gray-900 text-gray-800 text-sm font-bold transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
