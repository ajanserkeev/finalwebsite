'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Building2,
  ExternalLink,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  DIFFICULTY_META,
  COMFORT_META,
  REGION_META,
  TourDeparture,
  formatMoney,
} from '@/types/marketplace';
import { BookingModal } from '@/components/BookingModal';

/** S-003: Tour Detail Page with Open Organizer, Direct-Price Guarantee, Departure Matrix & Verified Reviews */
export default function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    organizers,
    tours,
    departures,
    reviews,
    currency,
    submitVerifiedReview,
    submitPriceMatchClaim,
    setActivePartnerId,
  } = useMarketplace();

  const tour = tours.find((t) => t.slug === slug);

  const [selectedDeparture, setSelectedDeparture] = useState<TourDeparture | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });

  // Verified Review Form State (R-007)
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTokenInput, setReviewTokenInput] = useState('REV-TEST-DEMO');
  const [ratingOverall, setRatingOverall] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [ratingGuide, setRatingGuide] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [ratingAccommodation, setRatingAccommodation] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [ratingTransport, setRatingTransport] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState<{ ok?: boolean; msg?: string } | null>(null);

  // Price Match Claim Modal State (R-002)
  const [showPriceClaim, setShowPriceClaim] = useState(false);
  const [claimName, setClaimName] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [claimPrice, setClaimPrice] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Tour Not Found</h1>
        <Link
          href="/tours"
          className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
        >
          Back to Kyrgyzstan Tours
        </Link>
      </div>
    );
  }

  const organizer = organizers.find((o) => o.id === tour.organizerId)!;
  const tourDepartures = departures
    .filter((d) => d.tourId === tour.id)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const bookableDepartures = tourDepartures.filter(
    (d) => (d.status === 'open' || d.status === 'guaranteed') && d.seatsRemaining > 0
  );

  const activeDeparture = selectedDeparture || bookableDepartures[0] || tourDepartures[0];
  const tourReviews = reviews.filter((r) => r.tourId === tour.id);
  const allOrganizerReviews = reviews.filter((r) => r.organizerId === organizer.id);

  const diffMeta = DIFFICULTY_META[tour.difficultyLevel];
  const comfortMeta = COMFORT_META[tour.comfortLevel];

  const activePriceUsd = activeDeparture ? activeDeparture.priceUsd : tour.basePriceUsd;
  const depositUsd = Math.round((activePriceUsd * tour.depositPercent) / 100);
  const balanceUsd = activePriceUsd - depositUsd;

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const expandAllDays = () => {
    const all: Record<number, boolean> = {};
    tour.itineraryDays.forEach((d) => {
      all[d.dayNumber] = true;
    });
    setExpandedDays(all);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus(null);
    if (reviewComment.trim().length < 15) {
      setReviewStatus({
        ok: false,
        msg: 'Please write at least 15 characters describing your tour experience.',
      });
      return;
    }

    const res = submitVerifiedReview({
      tokenOrCode: reviewTokenInput,
      ratingOverall,
      ratingGuide,
      ratingAccommodation,
      ratingTransport,
      comment: reviewComment.trim(),
    });

    if (!res.ok) {
      setReviewStatus({ ok: false, msg: res.error });
    } else {
      setReviewStatus({
        ok: true,
        msg: 'Verified Tourist Review published! Both the Tour rating and Organizer rating have been updated (Rule R-008).',
      });
      setReviewComment('');
    }
  };

  const handlePriceClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPriceMatchClaim({
      tourId: tour.id,
      organizerId: organizer.id,
      touristName: claimName.trim() || 'Traveler',
      touristEmail: claimEmail.trim() || 'traveler@example.com',
      competitorUrl: claimUrl.trim() || organizer.directSiteUrl,
      claimedPriceUsd: Number(claimPrice) || tour.basePriceUsd - 20,
      notes: claimNotes.trim() || 'Direct organizer price parity request',
    });
    setClaimSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb & Top Title */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-teal-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-teal-700">
            Kyrgyzstan Tours
          </Link>
          <span>/</span>
          <Link
            href={`/organizers/${organizer.slug}`}
            className="font-semibold text-teal-700 hover:underline"
          >
            {organizer.brandName}
          </Link>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-600 text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                Direct Organizer Price · 0% Markup
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${diffMeta.colorClass}`}
              >
                {diffMeta.label}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-800">
                {comfortMeta.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {tour.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{tour.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <div>
              <div className="font-extrabold text-base text-slate-900">
                {tour.reviewsCount > 0
                  ? `${tour.ratingAvg.toFixed(2)} / 5.0`
                  : `${organizer.ratingAvg.toFixed(2)} Organizer Rating`}
              </div>
              <a
                href="#reviews"
                className="text-xs text-teal-700 hover:underline font-medium"
              >
                {tour.reviewsCount} tour reviews · {organizer.reviewsCount} total for organizer
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-72 sm:h-96 rounded-2xl overflow-hidden">
        <div className="md:col-span-2 h-full bg-slate-200">
          <img
            src={tour.heroImageUrl}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          <img
            src={tour.galleryUrls[1] || tour.heroImageUrl}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <img
            src={tour.galleryUrls[2] || tour.heroImageUrl}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main 2-Column Layout: Left Details + Right Sticky Booking & Open Organizer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> Duration
              </div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">
                {tour.durationDays} {tour.durationDays === 1 ? 'Day' : 'Days'} /{' '}
                {Math.max(0, tour.durationDays - 1)} Nights
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-600" /> Group Size
              </div>
              <div className="font-bold text-sm text-slate-900 mt-0.5">
                Max {tour.maxGroupSize} travelers (Min {tour.minParticipants})
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> Regions
              </div>
              <div className="font-bold text-xs text-slate-900 mt-0.5 line-clamp-1">
                {tour.regions.map((r) => REGION_META[r]?.name || r).join(', ')}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> Free Cancellation
              </div>
              <div className="font-bold text-sm text-emerald-700 mt-0.5">
                Up to {tour.freeCancellationDays} days before start
              </div>
            </div>
          </div>

          {/* Route Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <h2 className="font-bold text-base text-slate-900">Route Overview</h2>
            <p className="text-xs sm:text-sm font-medium text-teal-800 bg-teal-50/80 p-3.5 rounded-xl border border-teal-200">
              {tour.routeSummary}
            </p>
          </div>

          {/* Day-by-Day Itinerary Accordion */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-xl text-slate-900">
                Day-by-Day Itinerary ({tour.itineraryDays.length} Days)
              </h2>
              <button
                onClick={expandAllDays}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Expand All Days
              </button>
            </div>

            <div className="space-y-3">
              {tour.itineraryDays.map((day) => {
                const isOpen = !!expandedDays[day.dayNumber];
                return (
                  <div
                    key={day.dayNumber}
                    className="rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleDay(day.dayNumber)}
                      aria-expanded={isOpen}
                      className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-xs font-extrabold">
                          Day {day.dayNumber}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{day.title}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white space-y-3 text-xs sm:text-sm text-slate-700 border-t border-slate-200">
                        <p className="leading-relaxed">{day.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                          {day.drivingHours && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                Distance & Logistics
                              </span>
                              <span className="font-semibold text-slate-800">
                                {day.distanceKm ? `${day.distanceKm} km · ` : ''}
                                {day.drivingHours}
                              </span>
                            </div>
                          )}
                          {day.maxAltitudeM && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                Max Altitude
                              </span>
                              <span className="font-semibold text-slate-800">
                                {day.maxAltitudeM.toLocaleString()}m above sea level
                              </span>
                            </div>
                          )}
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Meals Included
                            </span>
                            <span className="font-semibold text-teal-700">
                              {day.meals.length > 0 ? day.meals.join(' + ') : 'None'}
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950">
                          <strong>Overnight & Comfort:</strong> {day.accommodation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Accommodation & 4WD Transport Reality Breakdown (Solves Finding B-005) */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-extrabold text-xl text-slate-900">
              Accommodation, Yurt Comfort & 4WD Transport Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">
                  Accommodation ({comfortMeta.label})
                </div>
                <p className="text-slate-600 leading-relaxed">{tour.accommodationDetails}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">Vehicles & Mountain Logistics</div>
                <p className="text-slate-600 leading-relaxed">{tour.transportDetails}</p>
              </div>
            </div>
          </section>

          {/* Included vs. Not Included */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Included in Direct Price
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {tour.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                Not Included (Paid Separately)
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {tour.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* C-004: Group Departure Dates & Seat Quota Matrix */}
          <section
            id="departures"
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Real-Time Group Quotas (Component C-004)
                </span>
                <h2 className="font-extrabold text-xl text-slate-900 mt-0.5">
                  Scheduled Group Departure Dates & Available Seats
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Pay only {tour.depositPercent}% deposit today to lock your seat
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs">
                    <th className="py-3 px-3">Start → End Date</th>
                    <th className="py-3 px-3">Guide Languages</th>
                    <th className="py-3 px-3">Group Status & Seats Left</th>
                    <th className="py-3 px-3">Direct Price / Deposit</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tourDepartures.map((dep) => {
                    const depDeposit = Math.round((dep.priceUsd * tour.depositPercent) / 100);
                    const isBookable =
                      (dep.status === 'open' || dep.status === 'guaranteed') &&
                      dep.seatsRemaining > 0;
                    const isSelected = activeDeparture?.id === dep.id;

                    return (
                      <tr
                        key={dep.id}
                        className={`transition ${
                          isSelected ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          <div>{dep.startDate}</div>
                          <div className="text-xs font-normal text-slate-500">
                            to {dep.endDate}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {dep.guideLanguages.map((lang) => (
                              <span
                                key={lang}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            {dep.status === 'sold_out' || dep.seatsRemaining === 0 ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                                Sold Out (0 of {dep.maxSeats} left)
                              </span>
                            ) : dep.status === 'completed' ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                                Completed ({dep.bookedSeats} travelers)
                              </span>
                            ) : (
                              <>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`font-bold text-xs ${
                                      dep.seatsRemaining <= 3
                                        ? 'text-amber-700'
                                        : 'text-emerald-700'
                                    }`}
                                  >
                                    {dep.seatsRemaining} of {dep.maxSeats} spots left
                                  </span>
                                  {dep.isGuaranteed && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                                      <Sparkles className="w-3 h-3 text-amber-600" />
                                      Guaranteed
                                    </span>
                                  )}
                                </div>
                                <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-teal-600 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.round((dep.bookedSeats / dep.maxSeats) * 100)
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-extrabold text-slate-900">
                            {formatMoney(dep.priceUsd, currency)}
                          </div>
                          <div className="text-[11px] font-semibold text-teal-700">
                            Deposit: {formatMoney(depDeposit, currency)}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          {isBookable ? (
                            <button
                              onClick={() => {
                                setSelectedDeparture(dep);
                                setBookingModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                            >
                              Select & Book
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">
                              {dep.status === 'completed' ? 'Departed' : 'Unavailable'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* C-005: Verified Tourist Reviews Section (Rules R-007 & R-008) */}
          <section
            id="reviews"
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <Award className="w-4 h-4" />
                  100% Completed-Booking Gated Reviews (Rule R-007)
                </div>
                <h2 className="font-extrabold text-xl text-slate-900 mt-0.5">
                  Verified Tourist Reviews ({tourReviews.length} on this tour ·{' '}
                  {allOrganizerReviews.length} total for {organizer.brandName})
                </h2>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4 text-teal-400" />
                Submit Verified Review (With Booking Token)
              </button>
            </div>

            {/* Verified Review Submission Gate (R-007) */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-5 rounded-2xl bg-slate-50 border border-teal-200 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Post a Verified Tourist Review (Rule R-007)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Only travelers with a completed booking token can post a review. For testing, we pre-filled completed booking token{' '}
                      <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                        REV-TEST-DEMO
                      </code>{' '}
                      (Sarah Jenkins, 4 pax).
                    </p>
                  </div>
                </div>

                {reviewStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      reviewStatus.ok
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {reviewStatus.msg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Completed Booking Reference or Review Token *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewTokenInput}
                      onChange={(e) => setReviewTokenInput(e.target.value)}
                      placeholder="e.g. REV-TEST-DEMO or KG-2026-9044"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Overall Rating
                      </label>
                      <select
                        value={ratingOverall}
                        onChange={(e) =>
                          setRatingOverall(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                        }
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} ★
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Guide Rating
                      </label>
                      <select
                        value={ratingGuide}
                        onChange={(e) =>
                          setRatingGuide(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                        }
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} ★
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Experience with {organizer.brandName} *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share how the guide, 4WD transport, yurt camps, and itinerary matched expectations..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                  >
                    Verify Booking & Publish Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews Feed */}
            <div className="space-y-4">
              {tourReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {rev.authorName}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          · {rev.authorCountry}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Tourist · Booked & Completed ({rev.tripDate}) with{' '}
                        {organizer.brandName}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rev.ratingOverall}.0
                      <span className="text-slate-400 font-normal ml-1">
                        (Guide {rev.ratingGuide}★ · Yurts/Hotel {rev.ratingAccommodation}★ · 4WD{' '}
                        {rev.ratingTransport}★)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {rev.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt="Tourist trip photo"
                          className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                        />
                      ))}
                    </div>
                  )}

                  {rev.organizerReply && (
                    <div className="ml-4 pl-4 border-l-2 border-teal-500 bg-white p-3.5 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-teal-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Official Reply from {organizer.brandName}:
                      </div>
                      <p className="text-slate-600">{rev.organizerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3): Sticky Direct-Price Booking Card & Open Organizer Card (C-003) */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          {/* Direct-Price & Deposit Booking Box */}
          <div className="bg-white rounded-2xl border-2 border-teal-600 shadow-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                  <ShieldCheck className="w-4 h-4" />
                  Direct Organizer Price (0% Markup)
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {formatMoney(activePriceUsd, currency)}
                  <span className="text-xs font-normal text-slate-500"> / person</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setClaimSubmitted(false);
                  setShowPriceClaim(!showPriceClaim);
                }}
                className="text-[11px] font-semibold text-teal-700 underline hover:text-teal-900 text-right"
              >
                Found cheaper direct?
                <br />
                Price-Match Guarantee
              </button>
            </div>

            {/* R-002 Price-Match Claim Inline Drawer */}
            {showPriceClaim && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2.5">
                {claimSubmitted ? (
                  <div className="text-emerald-800 font-semibold">
                    ✓ Price-Match Claim sent to Platform Admin! We guarantee 100% parity with{' '}
                    {organizer.brandName}’s direct price (Rule R-002).
                  </div>
                ) : (
                  <form onSubmit={handlePriceClaimSubmit} className="space-y-2">
                    <div className="font-bold text-amber-950">
                      Direct-Price Parity Claim (Rule R-002)
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                    />
                    <input
                      type="url"
                      required
                      placeholder="Link to organizer's cheaper direct listing"
                      value={claimUrl}
                      onChange={(e) => setClaimUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Direct price found (USD)"
                      value={claimPrice}
                      onChange={(e) => setClaimPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-amber-600 text-white font-bold"
                    >
                      Submit Parity Claim
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* R-003 Payment Split Breakdown */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-teal-950 text-sm">
                <span>Online Deposit Today ({tour.depositPercent}%):</span>
                <span className="text-base text-teal-700">
                  {formatMoney(depositUsd, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>
                  Balance to {organizer.brandName} ({100 - tour.depositPercent}%):
                </span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(balanceUsd, currency)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-teal-200/60">
                You pay only the {tour.depositPercent}% reservation deposit online now. The remaining {100 - tour.depositPercent}% is paid directly to {organizer.brandName} when your tour starts.
              </p>
            </div>

            {/* Departure Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Group Departure Date
              </label>
              <select
                value={activeDeparture?.id || ''}
                onChange={(e) => {
                  const found = tourDepartures.find((d) => d.id === e.target.value);
                  if (found) setSelectedDeparture(found);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900"
              >
                {bookableDepartures.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.startDate} → {dep.endDate} · {dep.seatsRemaining} spots left{' '}
                    {dep.isGuaranteed ? '(Guaranteed)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {activeDeparture && activeDeparture.seatsRemaining > 0 && (
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition cursor-pointer"
              >
                Reserve Spot for {formatMoney(depositUsd, currency)} Deposit
              </button>
            )}

            <div className="text-[11px] text-center text-slate-500">
              ✓ Free cancellation up to {tour.freeCancellationDays} days before departure · Instant seat lock
            </div>
          </div>

          {/* C-003: Open Tour Organizer Identity & Trust Card (Rule R-001) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Open Tour Organizer Profile (Rule R-001)
            </div>

            <div className="flex items-start gap-3.5">
              <img
                src={organizer.logoUrl}
                alt={organizer.brandName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shrink-0"
              />
              <div>
                <Link
                  href={`/organizers/${organizer.slug}`}
                  className="font-extrabold text-base text-slate-900 hover:text-teal-700 transition block"
                >
                  {organizer.brandName}
                </Link>
                <div className="text-xs text-slate-500">{organizer.legalName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {organizer.registrationNumber}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{organizer.bio}</p>

            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <div className="font-extrabold text-sm text-slate-900 flex items-center justify-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {organizer.ratingAvg.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {organizer.reviewsCount} Reviews
                </div>
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">
                  {organizer.toursSoldCount}
                </div>
                <div className="text-[10px] text-slate-500">Tours Sold</div>
              </div>
              <div>
                <div className="font-extrabold text-sm text-teal-700">
                  {organizer.peopleSignedUpCount}
                </div>
                <div className="text-[10px] text-slate-500">People Signed Up</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>
                <strong>Base City:</strong> {organizer.baseCity}, Kyrgyzstan (Est.{' '}
                {organizer.foundedYear})
              </div>
              <div>
                <strong>Guide Languages:</strong> {organizer.languages.join(', ')}
              </div>
              <div>
                <strong>Official Website:</strong>{' '}
                <a
                  href={organizer.directSiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-700 hover:underline inline-flex items-center gap-1"
                >
                  {organizer.directSiteUrl.replace('https://', '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/organizers/${organizer.slug}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition"
              >
                View Organizer Profile, Guides & All {organizer.reviewsCount} Reviews →
              </Link>
              <Link
                href="/partner"
                onClick={() => setActivePartnerId(organizer.id)}
                className="w-full py-2 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                Preview {organizer.brandName}’s Partner Dashboard
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Booking Checkout Modal (S-005) */}
      {bookingModalOpen && activeDeparture && (
        <BookingModal
          tour={tour}
          organizer={organizer}
          departure={activeDeparture}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}

