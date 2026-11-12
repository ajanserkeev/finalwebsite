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
  Compass,
  Award,
  Building2,
  SlidersHorizontal,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  REGION_META,
  ACTIVITY_META,
  KyrgyzstanRegion,
  ActivityType,
  formatMoney,
} from '@/types/marketplace';
import { TourCard } from '@/components/TourCard';

/** S-001: Home & Kyrgyzstan Destination Discovery */
export default function HomePage() {
  const router = useRouter();
  const { organizers, tours, departures, reviews, currency, setActivePartnerId } =
    useMarketplace();

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  // R-013: Only published tours from verified organizers appear publicly
  const verifiedOrganizerIds = new Set(
    organizers.filter((o) => o.isVerified && o.verificationStatus === 'verified').map((o) => o.id)
  );
  const publishedTours = tours.filter(
    (t) => t.status === 'published' && verifiedOrganizerIds.has(t.organizerId)
  );

  const verifiedOrganizers = organizers.filter(
    (o) => o.isVerified && o.verificationStatus === 'verified'
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedRegion !== 'all') params.set('region', selectedRegion);
    if (selectedActivity !== 'all') params.set('activity', selectedActivity);
    if (selectedDuration !== 'all') params.set('duration', selectedDuration);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Banner with 4-Field Search & Direct-Price Guarantee */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80"
            alt="Kyrgyzstan Alpine Mountains & Song-Kul Yurts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              Kyrgyzstan Tour Bridge Aggregator · 100% Direct Organizer Prices
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Book Kyrgyzstan Tours Directly with Verified Local Organizers.{' '}
              <span className="text-teal-400">Zero Markups.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              See the real local organizer upfront, read verified reviews from real travelers, lock your seat with a{' '}
              <strong className="text-white">20% online reservation deposit</strong>, and pay the remaining balance directly to your organizer on arrival in Bishkek, Karakol, or Osh.
            </p>
          </div>

          {/* C-001 Hero Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white text-slate-900 p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-5xl"
          >
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1. Kyrgyzstan Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none mt-0.5"
              >
                <option value="all">All Regions of Kyrgyzstan</option>
                {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((reg) => (
                  <option key={reg} value={reg}>
                    {REGION_META[reg].name} ({REGION_META[reg].altitude})
                  </option>
                ))}
              </select>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                2. Tour Style / Activity
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none mt-0.5"
              >
                <option value="all">All Activities</option>
                {(Object.keys(ACTIVITY_META) as ActivityType[]).map((act) => (
                  <option key={act} value={act}>
                    {ACTIVITY_META[act].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                3. Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none mt-0.5"
              >
                <option value="all">Any Duration (1–10+ Days)</option>
                <option value="1">1-Day Excursions</option>
                <option value="2-5">2–5 Days (Short Expeditions)</option>
                <option value="6+">6–10 Days (Grand Circuits)</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl px-6 py-3.5 shadow-md transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Explore {publishedTours.length} Direct Tours
            </button>
          </form>

          {/* Trust Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl text-xs text-slate-200 pt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Same Price as Direct</strong> (0% OTA Markup)
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/15">
              <Users className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Open Organizer Identity</strong> Before Booking
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/15">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>100% Verified Reviews</strong> by Real Tourists
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/15">
              <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>20% Online Deposit</strong> · Free Cancellation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Role Showcase Banner (For Evaluator / Founder) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl border border-teal-200 shadow-lg p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                1. Public Tourist Bridge
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                Open Organizers & Direct Prices
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Compare group dates, inspect the real Kyrgyz tour company, and book with a 20% deposit.
              </p>
            </div>
            <Link
              href="/tours"
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shrink-0 hover:bg-slate-800"
            >
              Browse
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                2. Tour Operator Dedicated Page
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                Tours Sold & People Signed Up
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Partner dashboard tracking bookings sold, total participants signed up, seat quotas & manifests.
              </p>
            </div>
            <Link
              href="/partner"
              className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold shrink-0 hover:bg-teal-700 flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              Partner Portal
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                3. Separate Admin Panel
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                KYC, Price Parity & Escrow Ledger
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Verify operators, audit direct-price parity, manage commissions & process deposit refunds.
              </p>
            </div>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold shrink-0 hover:bg-amber-700 flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Admin Panel
            </Link>
          </div>
        </div>
      </section>

      {/* Kyrgyzstan Destination Regions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Explore by Destination
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Iconic Regions of Kyrgyzstan
            </h2>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            View All Regions & Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="group relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-xs"
              >
                <img
                  src={meta.imageUrl}
                  alt={meta.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-400" />
                    {meta.altitude}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-teal-600/90">
                    {matchingTours.length} {matchingTours.length === 1 ? 'tour' : 'tours'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="font-extrabold text-lg leading-tight group-hover:text-teal-300 transition">
                    {meta.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{meta.tagline}</p>
                  <div className="text-xs font-bold text-teal-400 pt-1">
                    Direct from {formatMoney(minPrice, currency)} →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tours with Open Organizer & Direct Price */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              0% Markup · Direct from Organizers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Top-Rated Tours in Kyrgyzstan
            </h2>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            Filter All {publishedTours.length} Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedTours.map((tour) => {
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
      </section>

      {/* Open Verified Organizers Showcase (C-003) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Full Transparency (Unlike Opaque OTAs)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Meet Your Verified Local Kyrgyz Organizers
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                We never hide the tour operator. Inspect every organizer’s legal registration, 4WD fleet, mountain guides, total travelers hosted, and verified tourist reviews before you book.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedOrganizers.map((org) => {
              const orgTours = publishedTours.filter((t) => t.organizerId === org.id);
              return (
                <div
                  key={org.id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={org.logoUrl}
                        alt={org.brandName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-400 shrink-0"
                      />
                      <div>
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified Kyrgyz Operator · {org.baseCity}
                        </div>
                        <Link
                          href={`/organizers/${org.slug}`}
                          className="block font-bold text-lg text-white hover:text-teal-300 transition"
                        >
                          {org.brandName}
                        </Link>
                        <div className="text-[11px] text-slate-400">{org.legalName}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {org.bio}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                        <div className="text-sm font-extrabold text-amber-400 flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {org.ratingAvg.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {org.reviewsCount} reviews
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                        <div className="text-sm font-extrabold text-white">
                          {org.toursSoldCount}
                        </div>
                        <div className="text-[10px] text-slate-400">Tours Sold</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                        <div className="text-sm font-extrabold text-teal-400">
                          {org.peopleSignedUpCount}
                        </div>
                        <div className="text-[10px] text-slate-400">Travelers Signed Up</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2">
                    <Link
                      href={`/organizers/${org.slug}`}
                      className="text-xs font-bold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1"
                    >
                      View {orgTours.length} Tours & {org.reviewsCount} Reviews
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/partner"
                      onClick={() => setActivePartnerId(org.id)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition"
                    >
                      View Operator Dashboard
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How the Direct-Price Bridge Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Inspired by Bolshaya Strana & Viator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How Direct-Price Booking Works
          </h2>
          <p className="text-sm text-slate-600">
            Why pay 25–30% more on global OTAs when you can book directly with verified Kyrgyz organizers at their official price?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Compare Open Organizers',
              desc: 'Every tour openly shows the real local Kyrgyz operator, their license, guide team, and verified reviews from past travelers.',
            },
            {
              step: '02',
              title: '100% Direct Price Parity',
              desc: 'Contractually guaranteed to match the organizer’s own website/Instagram price with 0% markup added on top.',
            },
            {
              step: '03',
              title: 'Pay Only 20% Deposit Online',
              desc: 'Lock your seats in a guaranteed departure group via Visa, Mastercard, Finik, or MBANK QR. Free cancellation up to 15 days prior.',
            },
            {
              step: '04',
              title: 'Pay 80% Balance on Arrival',
              desc: 'Your organizer receives your manifest immediately in their Partner Portal, and you pay the remaining 80% directly when your tour begins.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="text-xs font-extrabold text-teal-600 bg-teal-50 w-8 h-8 rounded-lg flex items-center justify-center">
                {item.step}
              </div>
              <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Verified Tourist Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              100% Completed-Booking Gated (Rule R-007)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Recent Verified Tourist Reviews
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
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {rev.authorName}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          ({rev.authorCountry})
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Tourist · Trip {rev.tripDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.ratingOverall }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-4">
                    “{rev.comment}”
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                  {tour && (
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="block font-semibold text-slate-900 hover:text-teal-700 line-clamp-1"
                    >
                      Tour: {tour.title}
                    </Link>
                  )}
                  {org && (
                    <Link
                      href={`/organizers/${org.slug}`}
                      className="block text-teal-700 hover:underline font-medium"
                    >
                      Organizer: {org.brandName} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

