'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  REGION_META,
  ACTIVITY_META,
  DIFFICULTY_META,
  COMFORT_META,
  KyrgyzstanRegion,
  ActivityType,
  DifficultyLevel,
  ComfortLevel,
} from '@/types/marketplace';
import { TourCard } from '@/components/TourCard';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get('region') || 'all';
  const initialActivity = searchParams.get('activity') || 'all';
  const initialDuration = searchParams.get('duration') || 'all';

  const { organizers, tours, departures } = useMarketplace();

  const [regionFilter, setRegionFilter] = useState<string>(initialRegion);
  const [activityFilter, setActivityFilter] = useState<string>(initialActivity);
  const [durationFilter, setDurationFilter] = useState<string>(initialDuration);
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'all'>('all');
  const [comfortFilter, setComfortFilter] = useState<string>('all');
  const [organizerFilter, setOrganizerFilter] = useState<string>('all');
  const [guaranteedOnly, setGuaranteedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const verifiedOrganizers = organizers.filter(
    (o) => o.isVerified && o.verificationStatus === 'verified'
  );
  const verifiedOrgIds = new Set(verifiedOrganizers.map((o) => o.id));

  // R-013: Only published tours from verified organizers
  const filteredTours = tours
    .filter((t) => t.status === 'published' && verifiedOrgIds.has(t.organizerId))
    .filter((t) => {
      if (regionFilter !== 'all' && !t.regions.includes(regionFilter as KyrgyzstanRegion)) {
        return false;
      }
      if (activityFilter !== 'all' && !t.activityTypes.includes(activityFilter as ActivityType)) {
        return false;
      }
      if (durationFilter === '1' && t.durationDays !== 1) return false;
      if (durationFilter === '2-5' && (t.durationDays < 2 || t.durationDays > 5)) return false;
      if (durationFilter === '6+' && t.durationDays < 6) return false;
      if (difficultyFilter !== 'all' && t.difficultyLevel !== difficultyFilter) return false;
      if (comfortFilter !== 'all' && t.comfortLevel !== comfortFilter) return false;
      if (organizerFilter !== 'all' && t.organizerId !== organizerFilter) return false;
      if (guaranteedOnly) {
        const hasGuaranteedDep = departures.some(
          (d) =>
            d.tourId === t.id &&
            d.isGuaranteed &&
            (d.status === 'open' || d.status === 'guaranteed') &&
            d.seatsRemaining > 0
        );
        if (!hasGuaranteedDep) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceUsd - b.basePriceUsd;
      if (sortBy === 'price-desc') return b.basePriceUsd - a.basePriceUsd;
      if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
      return b.reviewsCount - a.reviewsCount;
    });

  const resetFilters = () => {
    setRegionFilter('all');
    setActivityFilter('all');
    setDurationFilter('all');
    setDifficultyFilter('all');
    setComfortFilter('all');
    setOrganizerFilter('all');
    setGuaranteedOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Catalog Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700">
            <ShieldCheck className="w-4 h-4" />
            Direct Prices from Verified Kyrgyz Tour Organizers · 0% Markup
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Kyrgyzstan Tours & Expeditions ({filteredTours.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare routes, difficulty, yurt/hotel comfort levels, and open organizer profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="popular">Most Popular & Reviewed</option>
            <option value="rating">Highest Verified Rating</option>
            <option value="price-asc">Direct Price: Low to High</option>
            <option value="price-desc">Direct Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* C-001 Filter Sidebar */}
        <aside className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-teal-600" />
              Filter Tours
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs text-teal-700 hover:underline font-semibold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Guaranteed Departures Toggle (R-004) */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Guaranteed Departures Only
            </span>
            <input
              type="checkbox"
              checked={guaranteedOnly}
              onChange={(e) => setGuaranteedOnly(e.target.checked)}
              className="rounded border-amber-300 text-teal-600 focus:ring-teal-500"
            />
          </label>

          {/* Region Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Destination Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
            >
              <option value="all">All Regions</option>
              {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((reg) => (
                <option key={reg} value={reg}>
                  {REGION_META[reg].name}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Activity / Tour Style
            </label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
            >
              <option value="all">All Activities</option>
              {(Object.keys(ACTIVITY_META) as ActivityType[]).map((act) => (
                <option key={act} value={act}>
                  {ACTIVITY_META[act].label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Duration
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Any' },
                { id: '1', label: '1 Day' },
                { id: '2-5', label: '2–5 Days' },
                { id: '6+', label: '6+ Days' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDurationFilter(d.id)}
                  className={`py-1.5 px-2 rounded-lg font-semibold border transition ${
                    durationFilter === d.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level (1-5) Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Physical Difficulty (1–5)
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) =>
                setDifficultyFilter(
                  e.target.value === 'all' ? 'all' : (Number(e.target.value) as DifficultyLevel)
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
            >
              <option value="all">Any Difficulty</option>
              {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {DIFFICULTY_META[lvl].label}
                </option>
              ))}
            </select>
          </div>

          {/* Comfort Level Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Accommodation & Comfort Level
            </label>
            <select
              value={comfortFilter}
              onChange={(e) => setComfortFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
            >
              <option value="all">Any Comfort Level</option>
              {(Object.keys(COMFORT_META) as ComfortLevel[]).map((cmf) => (
                <option key={cmf} value={cmf}>
                  {COMFORT_META[cmf].label}
                </option>
              ))}
            </select>
          </div>

          {/* Open Organizer Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Verified Local Organizer
            </label>
            <select
              value={organizerFilter}
              onChange={(e) => setOrganizerFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50"
            >
              <option value="all">All Verified Organizers</option>
              {verifiedOrganizers.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.brandName} ({org.baseCity})
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Tour Results Grid */}
        <div className="lg:col-span-3">
          {filteredTours.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <h3 className="font-bold text-lg text-slate-900">
                No Kyrgyzstan tours match all selected filters
              </h3>
              <p className="text-xs text-slate-500">
                Try relaxing the difficulty, comfort, or region filter to see all available direct-price tours.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTours.map((tour) => {
                const org = organizers.find((o) => o.id === tour.organizerId)!;
                const tourDeps = departures.filter((d) => d.tourId === tour.id);
                return (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    organizer={org}
                    departures={tourDeps}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ToursCatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading tours...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

