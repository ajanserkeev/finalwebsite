'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Search,
  X,
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
  formatMoney,
} from '@/types/marketplace';
import { TourCard } from '@/components/TourCard';

function CatalogContent() {
  const searchParams = useSearchParams();
  const { organizers, tours, departures, currency } = useMarketplace();

  const [queryText, setQueryText] = useState<string>(searchParams.get('q') || '');
  const [regionFilter, setRegionFilter] = useState<string>(searchParams.get('region') || 'all');
  const [activityFilter, setActivityFilter] = useState<string>(
    searchParams.get('activity') || 'all'
  );
  const [durationFilter, setDurationFilter] = useState<string>(
    searchParams.get('duration') || 'all'
  );
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'all'>('all');
  const [comfortFilter, setComfortFilter] = useState<string>('all');
  const [organizerFilter, setOrganizerFilter] = useState<string>('all');
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(1500);
  const [guaranteedOnly, setGuaranteedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating' | 'duration'>('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sync URL query params reactively whenever user clicks Navbar/Footer region links
  useEffect(() => {
    setQueryText(searchParams.get('q') || '');
    setRegionFilter(searchParams.get('region') || 'all');
    setActivityFilter(searchParams.get('activity') || 'all');
    setDurationFilter(searchParams.get('duration') || 'all');
  }, [searchParams]);

  const verifiedOrganizers = organizers.filter(
    (o) => o.isVerified && o.verificationStatus === 'verified'
  );
  const verifiedOrgIds = new Set(verifiedOrganizers.map((o) => o.id));

  const publishedTours = tours.filter(
    (t) => t.status === 'published' && verifiedOrgIds.has(t.organizerId)
  );

  const qLower = queryText.trim().toLowerCase();

  const filteredTours = publishedTours
    .filter((t) => {
      if (qLower) {
        const org = organizers.find((o) => o.id === t.organizerId);
        const regionNames = t.regions
          .map((r) => `${REGION_META[r]?.name || ''} ${REGION_META[r]?.nameRu || ''}`)
          .join(' ')
          .toLowerCase();
        const hay = `${t.title} ${t.subtitle} ${t.routeSummary} ${regionNames} ${
          org?.brandName || ''
        }`.toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
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
      if (t.basePriceUsd > maxPriceUsd) return false;
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
      if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg || b.reviewsCount - a.reviewsCount;
      if (sortBy === 'duration') return a.durationDays - b.durationDays;
      return b.reviewsCount - a.reviewsCount || b.ratingAvg - a.ratingAvg;
    });

  const activeFiltersCount = [
    queryText.trim() !== '',
    regionFilter !== 'all',
    activityFilter !== 'all',
    durationFilter !== 'all',
    difficultyFilter !== 'all',
    comfortFilter !== 'all',
    organizerFilter !== 'all',
    maxPriceUsd < 1500,
    guaranteedOnly,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setQueryText('');
    setRegionFilter('all');
    setActivityFilter('all');
    setDurationFilter('all');
    setDifficultyFilter('all');
    setComfortFilter('all');
    setOrganizerFilter('all');
    setMaxPriceUsd(1500);
    setGuaranteedOnly(false);
  };

  const regionTitle =
    regionFilter !== 'all' && REGION_META[regionFilter as KyrgyzstanRegion]
      ? `${REGION_META[regionFilter as KyrgyzstanRegion].name} Tours`
      : 'All Kyrgyzstan Tours & Expeditions';

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h2 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#008768]" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-extrabold">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-[#008768] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">Keyword Search</label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Yurt, eagle, Ala-Kul..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#008768]"
          />
          {queryText && (
            <button
              type="button"
              onClick={() => setQueryText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Guaranteed Departures Toggle */}
      <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F0FAF6] border border-[#008768]/20 cursor-pointer">
        <span className="text-xs font-bold text-[#004F32] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#008768]" />
          Guaranteed Departures Only
        </span>
        <input
          type="checkbox"
          checked={guaranteedOnly}
          onChange={(e) => setGuaranteedOnly(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[#008768] focus:ring-[#008768]"
        />
      </label>

      {/* Max Direct Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-gray-800">Max Direct Price</label>
          <span className="text-xs font-extrabold text-[#008768]">
            {maxPriceUsd >= 1500 ? 'Any price' : `Up to ${formatMoney(maxPriceUsd, currency)}`}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={1500}
          step={50}
          value={maxPriceUsd}
          onChange={(e) => setMaxPriceUsd(Number(e.target.value))}
          className="w-full accent-[#008768] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-0.5">
          <span>{formatMoney(100, currency)}</span>
          <span>{formatMoney(1500, currency)}+</span>
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">Destination Region</label>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#008768]"
        >
          <option value="all">All Regions of Kyrgyzstan</option>
          {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((reg) => (
            <option key={reg} value={reg}>
              {REGION_META[reg].name}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Style */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">Experience Style</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActivityFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              activityFilter === 'all'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {(Object.keys(ACTIVITY_META) as ActivityType[]).map((act) => (
            <button
              key={act}
              type="button"
              onClick={() => setActivityFilter(act)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                activityFilter === act
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              {ACTIVITY_META[act].shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">Duration</label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Any length' },
            { id: '1', label: '1 Day' },
            { id: '2-5', label: '2–5 Days' },
            { id: '6+', label: '6+ Days' },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDurationFilter(d.id)}
              className={`py-2 px-2.5 rounded-xl font-semibold border transition cursor-pointer ${
                durationFilter === d.id
                  ? 'bg-[#008768] text-white border-[#008768]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">Physical Difficulty</label>
        <select
          value={difficultyFilter}
          onChange={(e) =>
            setDifficultyFilter(
              e.target.value === 'all' ? 'all' : (Number(e.target.value) as DifficultyLevel)
            )
          }
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#008768]"
        >
          <option value="all">Any Difficulty (1–5)</option>
          {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => (
            <option key={lvl} value={lvl}>
              {DIFFICULTY_META[lvl].label}
            </option>
          ))}
        </select>
      </div>

      {/* Comfort Level */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">
          Accommodation & Yurts
        </label>
        <select
          value={comfortFilter}
          onChange={(e) => setComfortFilter(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#008768]"
        >
          <option value="all">Any Accommodation</option>
          {(Object.keys(COMFORT_META) as ComfortLevel[]).map((cmf) => (
            <option key={cmf} value={cmf}>
              {COMFORT_META[cmf].label}
            </option>
          ))}
        </select>
      </div>

      {/* Organizer Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-800 mb-2">
          Local Tour Organizer
        </label>
        <select
          value={organizerFilter}
          onChange={(e) => setOrganizerFilter(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-[#008768]"
        >
          <option value="all">All Verified Organizers</option>
          {verifiedOrganizers.map((org) => (
            <option key={org.id} value={org.id}>
              {org.brandName} ({org.baseCity})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Viator Crisp Catalog Header */}
      <div className="border-b border-gray-200 bg-[#F7F8F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008768]">
            <ShieldCheck className="w-4 h-4" />
            Direct Organizer Prices · 0% Markup · Verified Reviews
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {regionTitle}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredTours.length}{' '}
                {filteredTours.length === 1 ? 'experience' : 'experiences'} available · Book with 20% deposit & free cancellation
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Mobile Filters Toggle */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-900 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#008768]" />
                Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
              </button>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs font-semibold text-gray-500 hidden sm:inline">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2.5 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-[#008768] cursor-pointer"
                >
                  <option value="popular">Recommended</option>
                  <option value="rating">Traveler Rating</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="duration">Duration: Shortest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {queryText.trim() && (
                <button
                  type="button"
                  onClick={() => setQueryText('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-300 text-xs font-semibold text-gray-800 hover:border-gray-900 cursor-pointer"
                >
                  “{queryText}” <X className="w-3 h-3" />
                </button>
              )}
              {regionFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setRegionFilter('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-bold cursor-pointer"
                >
                  {REGION_META[regionFilter as KyrgyzstanRegion]?.name} <X className="w-3 h-3" />
                </button>
              )}
              {activityFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActivityFilter('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-bold cursor-pointer"
                >
                  {ACTIVITY_META[activityFilter as ActivityType]?.shortLabel}{' '}
                  <X className="w-3 h-3" />
                </button>
              )}
              {durationFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setDurationFilter('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-bold cursor-pointer"
                >
                  {durationFilter === '1'
                    ? '1 Day'
                    : durationFilter === '2-5'
                    ? '2–5 Days'
                    : '6+ Days'}{' '}
                  <X className="w-3 h-3" />
                </button>
              )}
              {guaranteedOnly && (
                <button
                  type="button"
                  onClick={() => setGuaranteedOnly(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-bold cursor-pointer"
                >
                  Guaranteed Only <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 underline ml-1 cursor-pointer"
              >
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white rounded-2xl border border-gray-200 p-5 sticky top-28">
            {FilterPanel}
          </aside>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {filteredTours.length === 0 ? (
              <div className="bg-gray-50 rounded-3xl border border-gray-200 p-14 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900">
                  No matching Kyrgyzstan experiences
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Try widening your budget, removing a region filter, or resetting filters to explore all direct-price tours.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold transition cursor-pointer"
                >
                  Show All {publishedTours.length} Experiences
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTours.map((tour) => {
                  const org = organizers.find((o) => o.id === tour.organizerId);
                  if (!org) return null;
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

      {/* Mobile Slide-Up / Slide-Over Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <span className="font-display font-bold text-base text-gray-900">
                Filter Experiences
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{FilterPanel}</div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-full bg-[#008768] text-white font-bold text-sm cursor-pointer"
              >
                Show {filteredTours.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToursCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
          Loading Kyrgyzstan experiences...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
