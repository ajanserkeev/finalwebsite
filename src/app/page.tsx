'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  Star,
  CheckCircle2,
  ArrowRight,
  Users,
  Calendar,
  Award,
  MapPin,
  Compass,
  Mountain,
  Footprints,
  Tent,
  Sun,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  REGION_META,
  ACTIVITY_META,
  KyrgyzstanRegion,
  ActivityType,
  formatMoney,
  formatShortDate,
} from '@/types/marketplace';
import { TourCard } from '@/components/TourCard';

const CATEGORY_TABS: { id: 'all' | ActivityType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Experiences', icon: Sparkles },
  { id: 'jeep-4wd', label: '4WD Expeditions', icon: Compass },
  { id: 'horseback', label: 'Horseback Treks', icon: Mountain },
  { id: 'trekking', label: 'Alpine Trekking', icon: Footprints },
  { id: 'cultural-yurt', label: 'Yurt & Eagle Culture', icon: Tent },
  { id: 'day-trip', label: '1-Day Trips', icon: Sun },
];

export default function HomePage() {
  const router = useRouter();
  const { organizers, tours, departures, reviews, currency } = useMarketplace();

  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | ActivityType>('all');

  const verifiedOrganizers = organizers.filter(
    (o) => o.isVerified && o.verificationStatus === 'verified'
  );
  const verifiedOrganizerIds = new Set(verifiedOrganizers.map((o) => o.id));
  const publishedTours = tours.filter(
    (t) => t.status === 'published' && verifiedOrganizerIds.has(t.organizerId)
  );

  const visibleFeaturedTours =
    activeCategoryTab === 'all'
      ? publishedTours
      : publishedTours.filter((t) => t.activityTypes.includes(activeCategoryTab));

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText.trim()) params.set('q', searchText.trim());
    if (selectedRegion !== 'all') params.set('region', selectedRegion);
    if (selectedActivity !== 'all') params.set('activity', selectedActivity);
    const qs = params.toString();
    router.push(qs ? `/tours?${qs}` : '/tours');
  };

  return (
    <div className="bg-white">
      {/* Viator Editorial Full-Bleed Hero */}
      <section className="relative min-h-[540px] sm:min-h-[580px] flex items-center overflow-hidden bg-gray-900">
        <img
          src="/images/hero-song-kul.jpg"
          alt="Song-Kul Alpine Lake and traditional felt yurts in Kyrgyzstan"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full text-center space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Direct from Verified Kyrgyz Organizers · Same Price as Direct (0% Markup)
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-sm">
              Do more in Kyrgyzstan
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Book small-group yurt camps, 4WD expeditions, and alpine treks directly with licensed local operators. Reserve today with a 20% deposit & free cancellation.
            </p>
          </div>

          {/* Viator Iconic Unified Pill Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-full p-2.5 md:p-2 shadow-2xl border border-white/40 flex flex-col md:flex-row items-stretch md:items-center gap-2 text-left"
          >
            <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 md:py-2">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="hero-search-input"
                  className="block text-[10px] font-bold uppercase tracking-wider text-gray-500"
                >
                  Where to?
                </label>
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Song-Kul, Ala-Kul, Karakol, horseback..."
                  className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-9 bg-gray-200" />

            <div className="md:w-52 px-4 py-2 border-t md:border-t-0 border-gray-100">
              <label
                htmlFor="hero-region-select"
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500"
              >
                Region
              </label>
              <select
                id="hero-region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">All Kyrgyzstan</option>
                {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((reg) => (
                  <option key={reg} value={reg}>
                    {REGION_META[reg].name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:block w-px h-9 bg-gray-200" />

            <div className="md:w-48 px-4 py-2 border-t md:border-t-0 border-gray-100">
              <label
                htmlFor="hero-activity-select"
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500"
              >
                Tour Style
              </label>
              <select
                id="hero-activity-select"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full text-sm font-semibold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">Any Style</option>
                {(Object.keys(ACTIVITY_META) as ActivityType[]).map((act) => (
                  <option key={act} value={act}>
                    {ACTIVITY_META[act].shortLabel}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 rounded-2xl md:rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-display font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Popular Quick Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-white/75 font-medium mr-1">Trending:</span>
            {[
              { label: 'Song-Kul Yurts', href: '/tours?region=song-kul' },
              { label: 'Ala-Kul Glacier Trek', href: '/tours?region=karakol' },
              { label: 'Kel-Suu Canyon', href: '/tours?region=kel-suu' },
              { label: 'Horseback Riding', href: '/tours?activity=horseback' },
              { label: 'Bishkek Day Trips', href: '/tours?activity=day-trip' },
            ].map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/20 text-white font-semibold transition"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Viator Clean 4-Pillar Trust Strip */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: '0% Markup Direct Price',
                desc: 'Pay the exact same price as booking directly with the Kyrgyz organizer.',
              },
              {
                icon: Calendar,
                title: 'Reserve Now, Pay Later',
                desc: 'Lock your seat with a 20% deposit; pay 80% directly to your organizer on Day 1.',
              },
              {
                icon: Users,
                title: 'Open Local Organizers',
                desc: 'See the real licensed company, 4WD fleet, and guides before you book.',
              },
              {
                icon: Award,
                title: '100% Verified Reviews',
                desc: 'Every review comes exclusively from travelers who completed the trip.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#E6F5F0] text-[#008768] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-sm text-gray-900">
                      {item.title}
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top-Rated Kyrgyzstan Tours + Interactive Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Top Experiences in Kyrgyzstan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Handpicked multi-day expeditions and day trips at verified direct organizer prices.
            </p>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008768] hover:text-[#006B52] shrink-0"
          >
            See all {publishedTours.length} experiences
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Viator Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeCategoryTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                  active
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-[#008768]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {visibleFeaturedTours.length === 0 ? (
          <div className="p-10 rounded-2xl border border-gray-200 bg-gray-50 text-center space-y-2">
            <p className="font-bold text-gray-900 text-sm">
              No published tours in this category right now.
            </p>
            <button
              onClick={() => setActiveCategoryTab('all')}
              className="text-xs font-bold text-[#008768] hover:underline cursor-pointer"
            >
              Show all experiences
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleFeaturedTours.map((tour) => {
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
      </section>

      {/* Viator Pastel Mint Free Cancellation & Direct-Price Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-[#E6F5F0] px-6 sm:px-12 py-10 sm:py-12 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#006B52] text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#008768]" />
            Keep travel flexible
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#003322]">
            Free cancellation & 20% deposit lock
          </h2>
          <p className="text-sm sm:text-base text-[#004F32]/85 max-w-2xl mx-auto leading-relaxed">
            Reserve your spot in a guaranteed group departure for just 20% online. Cancel up to 15 days in advance for a 100% deposit refund — and pay the remaining 80% directly to your local Kyrgyz organizer when you arrive.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tours"
              className="px-6 py-3 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-display font-bold text-sm transition shadow-sm"
            >
              Explore Guaranteed Departures
            </Link>
            <Link
              href="/organizers"
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-[#004F32] font-display font-bold text-sm border border-[#008768]/20 transition"
            >
              Compare Local Organizers
            </Link>
          </div>
        </div>
      </section>

      {/* Top Destinations in Kyrgyzstan (All 7 Regions) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Top Destinations in Kyrgyzstan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              From 3,016m nomadic pastures at Song-Kul to 7,134m Lenin Peak basecamp.
            </p>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008768] hover:text-[#006B52]"
          >
            All destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* First Row: 4 Primary Iconic Regions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(Object.keys(REGION_META) as KyrgyzstanRegion[]).slice(0, 4).map((regKey) => {
            const meta = REGION_META[regKey];
            const matchingTours = publishedTours.filter((t) => t.regions.includes(regKey));
            const minPrice =
              matchingTours.length > 0
                ? Math.min(...matchingTours.map((t) => t.basePriceUsd))
                : 85;

            return (
              <Link
                key={regKey}
                href={`/tours?region=${regKey}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={meta.imageUrl}
                  alt={meta.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-xs text-white text-[11px] font-semibold">
                    <MapPin className="w-3 h-3 text-emerald-300" />
                    {meta.altitude}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="font-display font-extrabold text-lg leading-tight">
                    {meta.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">{meta.tagline}</p>
                  <div className="pt-1.5 flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300">
                      From {formatMoney(minPrice, currency)}
                    </span>
                    <span className="text-white/90">
                      {matchingTours.length} {matchingTours.length === 1 ? 'tour' : 'tours'} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Second Row: 3 Additional Regions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(Object.keys(REGION_META) as KyrgyzstanRegion[]).slice(4).map((regKey) => {
            const meta = REGION_META[regKey];
            const matchingTours = publishedTours.filter((t) => t.regions.includes(regKey));
            const minPrice =
              matchingTours.length > 0
                ? Math.min(...matchingTours.map((t) => t.basePriceUsd))
                : 85;

            return (
              <Link
                key={regKey}
                href={`/tours?region=${regKey}`}
                className="group relative h-52 rounded-2xl overflow-hidden bg-gray-100 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={meta.imageUrl}
                  alt={meta.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {meta.altitude}
                  </div>
                  <h3 className="font-display font-extrabold text-lg leading-tight">
                    {meta.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-white/80 line-clamp-1 mr-2">{meta.tagline}</span>
                    <span className="font-bold text-white shrink-0">
                      From {formatMoney(minPrice, currency)} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Verified Local Kyrgyz Organizers (Clean Light Editorial Showcase) */}
      <section className="bg-[#F7F8F9] border-y border-gray-200/80 mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008768]">
                100% Open Organizer Transparency
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Book Directly with Licensed Kyrgyz Operators
              </h2>
              <p className="text-sm text-gray-600 mt-1.5">
                Unlike opaque resellers, we show every tour operator’s license, local 4WD fleet, guides, travelers hosted, and real reviews upfront.
              </p>
            </div>
            <Link
              href="/organizers"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008768] hover:text-[#006B52] shrink-0"
            >
              View all organizers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedOrganizers.map((org) => {
              const orgTours = publishedTours.filter((t) => t.organizerId === org.id);
              return (
                <div
                  key={org.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="h-28 relative overflow-hidden bg-gray-100">
                    <img
                      src={org.coverUrl}
                      alt={org.brandName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#006B52] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008768]" />
                      Verified · {org.baseCity}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 -mt-10 relative z-10">
                        <img
                          src={org.logoUrl}
                          alt={org.brandName}
                          className="w-14 h-14 rounded-2xl object-cover border-[3px] border-white shadow-md bg-white shrink-0"
                        />
                        <div className="pt-5 min-w-0">
                          <Link
                            href={`/organizers/${org.slug}`}
                            className="font-display font-bold text-base text-gray-900 hover:text-[#008768] transition block truncate"
                          >
                            {org.brandName}
                          </Link>
                          <div className="text-[11px] text-gray-500 truncate">
                            Est. {org.foundedYear} · {org.languages.join(', ')}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                        {org.bio}
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-sm font-extrabold text-gray-900 flex items-center justify-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-[#008768] text-[#008768]" />
                            {org.ratingAvg.toFixed(1)}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {org.reviewsCount} reviews
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="text-sm font-extrabold text-gray-900">
                            {org.toursSoldCount}
                          </div>
                          <div className="text-[10px] text-gray-500">Tours Sold</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F0FAF6] border border-[#008768]/15">
                          <div className="text-sm font-extrabold text-[#006B52]">
                            {org.peopleSignedUpCount}
                          </div>
                          <div className="text-[10px] text-[#006B52]">Travelers</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/organizers/${org.slug}`}
                        className="text-xs font-bold text-[#008768] hover:text-[#006B52] inline-flex items-center gap-1"
                      >
                        See {orgTours.length} {orgTours.length === 1 ? 'tour' : 'tours'} & reviews
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[11px] font-semibold text-gray-400">
                        0% Markup
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Verified Traveler Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008768]">
              <CheckCircle2 className="w-4 h-4" />
              Verified Bookings Only
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              What Real Travelers Say
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => {
            const tour = tours.find((t) => t.id === rev.tourId);
            const org = organizers.find((o) => o.id === rev.organizerId);
            return (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.ratingOverall }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#008768] text-[#008768]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {formatShortDate(rev.tripDate)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    “{rev.comment}”
                  </p>

                  {rev.photos.length > 0 && (
                    <div className="flex gap-2">
                      {rev.photos.slice(0, 2).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Verified traveler photo"
                          className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">
                      {rev.authorName}{' '}
                      <span className="font-normal text-gray-500">· {rev.authorCountry}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#008768] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                  {tour && (
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="block text-xs font-semibold text-gray-600 hover:text-[#008768] truncate"
                    >
                      {tour.title}
                    </Link>
                  )}
                  {org && (
                    <Link
                      href={`/organizers/${org.slug}`}
                      className="block text-[11px] font-bold text-[#008768] hover:underline"
                    >
                      Hosted by {org.brandName}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tour Operator Partner Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-[#0C1D17] text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Building2 className="w-4 h-4" />
              For Kyrgyzstan Tour Operators & Local Guides
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              Grow your group bookings with real-time seat & manifest tools
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Get your own verified organizer storefront, track tours sold and total travelers signed up in real time, sync seat quotas in one click, and export participant manifests for your mountain guides.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/partner"
              className="px-6 py-3.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-display font-bold text-sm transition inline-flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Open Partner Portal
            </Link>
            <Link
              href="/admin"
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-display font-bold text-sm transition"
            >
              Platform Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
