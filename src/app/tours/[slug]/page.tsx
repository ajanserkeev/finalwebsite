'use client';

import React, { useState, useEffect, use } from 'react';
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
  Heart,
  Share2,
  Images,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Flame,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  DIFFICULTY_META,
  COMFORT_META,
  REGION_META,
  formatMoney,
  formatDateRange,
  formatShortDate,
} from '@/types/marketplace';
import { BookingModal } from '@/components/BookingModal';

function StarRatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: 1 | 2 | 3 | 4 | 5;
  onChange: (val: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-2">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-0.5">
        {([1, 2, 3, 4, 5] as const).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`Rate ${label} ${star} stars`}
            className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'fill-[#008768] text-[#008768]' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

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
    bookings,
    reviews,
    currency,
    savedTourIds,
    toggleSavedTour,
    submitVerifiedReview,
    submitPriceMatchClaim,
    setActivePartnerId,
    showToast,
  } = useMarketplace();

  const tour = tours.find((t) => t.slug === slug);

  // Store only departure ID (never stale object snapshot)
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
  const [selectedPax, setSelectedPax] = useState<number>(2);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });

  // Photo Lightbox Modal State
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Verified Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTokenInput, setReviewTokenInput] = useState('');
  const [ratingOverall, setRatingOverall] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [ratingGuide, setRatingGuide] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [ratingAccommodation, setRatingAccommodation] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [ratingTransport, setRatingTransport] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState<{
    ok?: boolean;
    msg?: string;
    redirectSlug?: string;
  } | null>(null);

  // Price Match Claim Modal State
  const [showPriceClaim, setShowPriceClaim] = useState(false);
  const [claimName, setClaimName] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [claimPrice, setClaimPrice] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const photos = tour
    ? Array.from(new Set([tour.heroImageUrl, ...tour.galleryUrls].filter(Boolean)))
    : [];

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight')
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % photos.length));
      if (e.key === 'ArrowLeft')
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, photos.length]);

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-extrabold text-gray-900">
          Experience Not Found
        </h1>
        <p className="text-sm text-gray-600">
          This Kyrgyzstan tour may have been archived or moved.
        </p>
        <Link
          href="/tours"
          className="inline-block px-6 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold transition"
        >
          Browse All Kyrgyzstan Tours
        </Link>
      </div>
    );
  }

  const organizer = organizers.find((o) => o.id === tour.organizerId);
  if (!organizer) return null;

  const isSaved = savedTourIds.includes(tour.id);

  const tourDepartures = departures
    .filter((d) => d.tourId === tour.id)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const bookableDepartures = tourDepartures.filter(
    (d) => (d.status === 'open' || d.status === 'guaranteed') && d.seatsRemaining > 0
  );

  const activeDeparture =
    tourDepartures.find((d) => d.id === selectedDepartureId && d.seatsRemaining > 0 && (d.status === 'open' || d.status === 'guaranteed')) ||
    bookableDepartures[0] ||
    null;

  const safePax = activeDeparture
    ? Math.min(Math.max(1, selectedPax), activeDeparture.seatsRemaining)
    : 1;

  const tourReviews = reviews.filter((r) => r.tourId === tour.id);
  const allOrganizerReviews = reviews.filter((r) => r.organizerId === organizer.id);

  // Check if there's an unreviewed completed booking for THIS tour (for easy testing)
  const demoCompletedBooking = bookings.find(
    (b) => b.tourId === tour.id && b.status === 'completed' && !b.hasReview
  );

  const diffMeta = DIFFICULTY_META[tour.difficultyLevel];
  const comfortMeta = COMFORT_META[tour.comfortLevel];

  const unitPriceUsd = activeDeparture ? activeDeparture.priceUsd : tour.basePriceUsd;
  const totalPriceUsd = unitPriceUsd * safePax;
  const depositTotalUsd = Math.round((totalPriceUsd * tour.depositPercent) / 100);
  const balanceTotalUsd = totalPriceUsd - depositTotalUsd;

  const allExpanded = tour.itineraryDays.every((d) => expandedDays[d.dayNumber]);

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const toggleExpandAllDays = () => {
    const nextState: Record<number, boolean> = {};
    tour.itineraryDays.forEach((d) => {
      nextState[d.dayNumber] = !allExpanded;
    });
    setExpandedDays(nextState);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    showToast('Tour link copied to clipboard!', 'info');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus(null);
    if (!reviewTokenInput.trim()) {
      setReviewStatus({ ok: false, msg: 'Please enter your booking reference or review token.' });
      return;
    }
    if (reviewComment.trim().length < 15) {
      setReviewStatus({
        ok: false,
        msg: 'Please write at least 15 characters describing your tour experience.',
      });
      return;
    }

    const res = submitVerifiedReview({
      tokenOrCode: reviewTokenInput,
      expectedTourId: tour.id,
      ratingOverall,
      ratingGuide,
      ratingAccommodation,
      ratingTransport,
      comment: reviewComment.trim(),
    });

    if (!res.ok) {
      setReviewStatus({ ok: false, msg: res.error, redirectSlug: res.redirectSlug });
    } else {
      setReviewStatus({
        ok: true,
        msg: 'Your verified review is now live! Both the tour and organizer ratings have been updated.',
      });
      setReviewComment('');
      setReviewTokenInput('');
    }
  };

  const handlePriceClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimError(null);
    const parsedPrice = Number(claimPrice);
    if (!parsedPrice || parsedPrice <= 0 || parsedPrice >= tour.basePriceUsd) {
      setClaimError(
        `Please enter a valid lower direct price (below $${tour.basePriceUsd} USD).`
      );
      return;
    }
    submitPriceMatchClaim({
      tourId: tour.id,
      organizerId: organizer.id,
      touristName: claimName.trim(),
      touristEmail: claimEmail.trim(),
      competitorUrl: claimUrl.trim(),
      claimedPriceUsd: parsedPrice,
      notes: claimNotes.trim() || 'Direct organizer price parity claim',
    });
    setClaimSubmitted(true);
    setClaimName('');
    setClaimEmail('');
    setClaimUrl('');
    setClaimPrice('');
    setClaimNotes('');
  };

  // Review averages for sub-ratings
  const avgGuide =
    tourReviews.length > 0
      ? tourReviews.reduce((s, r) => s + r.ratingGuide, 0) / tourReviews.length
      : 5.0;
  const avgAccom =
    tourReviews.length > 0
      ? tourReviews.reduce((s, r) => s + r.ratingAccommodation, 0) / tourReviews.length
      : 4.9;
  const avgTransport =
    tourReviews.length > 0
      ? tourReviews.reduce((s, r) => s + r.ratingTransport, 0) / tourReviews.length
      : 5.0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#008768] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-[#008768] transition">
            Kyrgyzstan Tours
          </Link>
          <span>/</span>
          <Link
            href={`/tours?region=${tour.regions[0]}`}
            className="hover:text-[#008768] transition"
          >
            {REGION_META[tour.regions[0]]?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{tour.title}</span>
        </nav>

        {/* Viator Title, Ratings & Actions Row */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E6F5F0] text-[#006B52]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008768]" />
              0% Markup Direct Price
            </span>
            {bookableDepartures[0] && bookableDepartures[0].seatsRemaining <= 3 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF1F0] text-[#D93829]">
                <Flame className="w-3.5 h-3.5" />
                Likely to Sell Out
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${diffMeta.colorClass}`}
            >
              {diffMeta.label}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
            {tour.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <a
                href="#reviews"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#008768] text-[#008768]"
                    />
                  ))}
                </div>
                <span className="font-extrabold text-gray-900">
                  {tour.reviewsCount > 0 ? tour.ratingAvg.toFixed(1) : 'New'}
                </span>
                <span className="text-gray-500">
                  ({tourReviews.length} {tourReviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </a>

              <span className="text-gray-300">|</span>

              <Link
                href={`/organizers/${organizer.slug}`}
                className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#008768] font-semibold"
              >
                <img
                  src={organizer.logoUrl}
                  alt={organizer.brandName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>By {organizer.brandName}</span>
                {organizer.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-[#008768]" />
                )}
              </Link>

              <span className="hidden sm:inline text-gray-300">|</span>

              <span className="inline-flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                {tour.regions.map((r) => REGION_META[r]?.name).join(' · ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-300 hover:border-gray-900 text-xs font-bold text-gray-700 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button
                type="button"
                onClick={() => toggleSavedTour(tour.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition cursor-pointer ${
                  isSaved
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-gray-300 hover:border-gray-900 text-gray-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Viator 5-Photo Interactive Editorial Mosaic */}
        <div className="relative rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] sm:h-[420px] bg-gray-100">
          <button
            type="button"
            onClick={() => setLightboxIdx(0)}
            className="md:col-span-2 h-full relative group overflow-hidden cursor-pointer text-left"
          >
            <img
              src={photos[0]}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </button>

          <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full">
            {[1, 2, 3, 4].map((idx) => {
              const imgSrc = photos[idx] || photos[idx % photos.length];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIdx(idx % photos.length)}
                  className="relative group overflow-hidden cursor-pointer"
                >
                  <img
                    src={imgSrc}
                    alt={`${tour.title} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setLightboxIdx(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-gray-900 text-xs font-bold shadow-lg transition cursor-pointer"
          >
            <Images className="w-4 h-4 text-[#008768]" />
            See all {photos.length} photos
          </button>
        </div>

        {/* Sticky Section Navigation Tabs */}
        <div className="border-b border-gray-200 sticky top-[72px] z-30 bg-white/95 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-sm font-bold text-gray-600">
            {[
              { href: '#overview', label: 'Overview' },
              { href: '#included', label: "What's Included" },
              { href: '#itinerary', label: 'Itinerary' },
              { href: '#departures', label: 'Group Dates' },
              { href: '#reviews', label: `Reviews (${tourReviews.length})` },
            ].map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="py-3.5 border-b-2 border-transparent hover:border-[#008768] hover:text-[#008768] whitespace-nowrap transition"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>

        {/* Main 2-Column Viator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
          {/* Left 8 Columns: Rich Experience Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview & Quick Specs */}
            <section id="overview" className="space-y-5 scroll-mt-36">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200/80">
                  <Clock className="w-4 h-4 text-[#008768] mb-1.5" />
                  <div className="text-[11px] text-gray-500">Duration</div>
                  <div className="font-bold text-sm text-gray-900">
                    {tour.durationDays} {tour.durationDays === 1 ? 'Day' : 'Days'}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200/80">
                  <Users className="w-4 h-4 text-[#008768] mb-1.5" />
                  <div className="text-[11px] text-gray-500">Small Group</div>
                  <div className="font-bold text-sm text-gray-900">
                    Max {tour.maxGroupSize} travelers
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200/80">
                  <Sparkles className="w-4 h-4 text-[#008768] mb-1.5" />
                  <div className="text-[11px] text-gray-500">Accommodation</div>
                  <div className="font-bold text-sm text-gray-900 truncate">
                    {comfortMeta.short}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F0FAF6] border border-[#008768]/20">
                  <Calendar className="w-4 h-4 text-[#008768] mb-1.5" />
                  <div className="text-[11px] text-[#006B52]">Free Cancellation</div>
                  <div className="font-bold text-sm text-[#004F32]">
                    Up to {tour.freeCancellationDays}d prior
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h2 className="font-display text-2xl font-extrabold text-gray-900">Overview</h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {tour.subtitle}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F8F9] border border-gray-200 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#008768]">
                  Full Route Map
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {tour.routeSummary}
                </p>
              </div>
            </section>

            {/* What's Included / Excluded + Yurts & 4WD Logistics */}
            <section
              id="included"
              className="pt-8 border-t border-gray-200 space-y-6 scroll-mt-36"
            >
              <h2 className="font-display text-2xl font-extrabold text-gray-900">
                What’s Included
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-2.5 text-sm text-gray-700">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#008768] shrink-0 mt-1 stroke-[2.5]" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <ul className="space-y-2.5 text-sm text-gray-600">
                  {tour.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accommodation & Transport Transparency Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#F7F8F9] border border-gray-200 space-y-1.5">
                  <div className="font-display font-bold text-sm text-gray-900">
                    Accommodation ({comfortMeta.label})
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {tour.accommodationDetails}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F7F8F9] border border-gray-200 space-y-1.5">
                  <div className="font-display font-bold text-sm text-gray-900">
                    4WD Fleet & Mountain Transport
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {tour.transportDetails}
                  </p>
                </div>
              </div>
            </section>

            {/* Viator-Style Vertical Timeline Itinerary */}
            <section
              id="itinerary"
              className="pt-8 border-t border-gray-200 space-y-5 scroll-mt-36"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-extrabold text-gray-900">
                  What To Expect ({tour.itineraryDays.length}{' '}
                  {tour.itineraryDays.length === 1 ? 'Day' : 'Days'})
                </h2>
                <button
                  type="button"
                  onClick={toggleExpandAllDays}
                  className="text-xs font-bold text-[#008768] hover:underline cursor-pointer"
                >
                  {allExpanded ? 'Collapse all days' : 'Expand all days'}
                </button>
              </div>

              <div className="relative pl-6 border-l-2 border-dashed border-[#008768]/30 space-y-4">
                {tour.itineraryDays.map((day) => {
                  const isOpen = !!expandedDays[day.dayNumber];
                  return (
                    <div key={day.dayNumber} className="relative">
                      <span className="absolute -left-[35px] top-3.5 w-7 h-7 rounded-full bg-[#008768] text-white font-display font-extrabold text-xs flex items-center justify-center ring-4 ring-white">
                        {day.dayNumber}
                      </span>

                      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleDay(day.dayNumber)}
                          aria-expanded={isOpen}
                          className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-gray-50 transition cursor-pointer"
                        >
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[#008768]">
                              Day {day.dayNumber}
                              {day.maxAltitudeM ? ` · Max ${day.maxAltitudeM.toLocaleString()}m` : ''}
                            </div>
                            <h3 className="font-display font-bold text-sm sm:text-base text-gray-900 mt-0.5">
                              {day.title}
                            </h3>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 space-y-3.5 text-sm text-gray-700 border-t border-gray-100">
                            <p className="leading-relaxed">{day.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {day.drivingHours && (
                                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
                                  {day.distanceKm ? `${day.distanceKm} km · ` : ''}
                                  {day.drivingHours}
                                </span>
                              )}
                              {day.maxAltitudeM && (
                                <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold">
                                  Max Altitude: {day.maxAltitudeM.toLocaleString()}m
                                </span>
                              )}
                              <span className="px-3 py-1.5 rounded-full bg-[#E6F5F0] text-[#006B52] font-bold">
                                Meals: {day.meals.length > 0 ? day.meals.join(' + ') : 'None'}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950">
                              <strong>Overnight:</strong> {day.accommodation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Group Departure Schedule Table */}
            <section
              id="departures"
              className="pt-8 border-t border-gray-200 space-y-4 scroll-mt-36"
            >
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-gray-900">
                    Upcoming Group Departures
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Live seat counts synced directly from {organizer.brandName}. Pay {tour.depositPercent}% today to reserve.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-[#F7F8F9] border-b border-gray-200 text-gray-500 text-xs">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Dates</th>
                        <th className="py-3.5 px-4 font-bold">Guide</th>
                        <th className="py-3.5 px-4 font-bold">Availability</th>
                        <th className="py-3.5 px-4 font-bold">Direct Price</th>
                        <th className="py-3.5 px-4 text-right font-bold">Reserve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
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
                              isSelected ? 'bg-[#F0FAF6]/70' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                              {formatDateRange(dep.startDate, dep.endDate)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap gap-1">
                                {dep.guideLanguages.map((lang) => (
                                  <span
                                    key={lang}
                                    className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-bold"
                                  >
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {dep.status === 'sold_out' || dep.seatsRemaining === 0 ? (
                                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                                  Sold Out
                                </span>
                              ) : dep.status === 'completed' ? (
                                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                                  Completed
                                </span>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`font-bold text-xs ${
                                        dep.seatsRemaining <= 3
                                          ? 'text-[#D93829]'
                                          : 'text-[#006B52]'
                                      }`}
                                    >
                                      {dep.seatsRemaining} of {dep.maxSeats} spots left
                                    </span>
                                    {dep.isGuaranteed && (
                                      <span className="px-2 py-0.5 rounded-full bg-[#E6F5F0] text-[#006B52] text-[10px] font-extrabold">
                                        Guaranteed
                                      </span>
                                    )}
                                  </div>
                                  <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[#008768] rounded-full"
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Math.round((dep.bookedSeats / dep.maxSeats) * 100)
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-extrabold text-gray-900">
                                {formatMoney(dep.priceUsd, currency)}
                              </div>
                              <div className="text-[11px] font-semibold text-[#008768]">
                                {formatMoney(depDeposit, currency)} deposit
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              {isBookable ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDepartureId(dep.id);
                                    setBookingModalOpen(true);
                                  }}
                                  className="px-4 py-2 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold transition cursor-pointer"
                                >
                                  Book Date
                                </button>
                              ) : (
                                <span className="text-xs font-semibold text-gray-400">
                                  {dep.status === 'completed' ? 'Departed' : 'Full'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Viator Verified Traveler Reviews */}
            <section
              id="reviews"
              className="pt-8 border-t border-gray-200 space-y-6 scroll-mt-36"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008768]">
                    <Award className="w-4 h-4" />
                    Verified Travelers Only
                  </div>
                  <h2 className="font-display text-2xl font-extrabold text-gray-900 mt-0.5">
                    Reviews ({tourReviews.length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(!showReviewForm);
                    if (!reviewTokenInput && demoCompletedBooking) {
                      setReviewTokenInput(demoCompletedBooking.reviewToken);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-bold transition cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  Write a Verified Review
                </button>
              </div>

              {/* Viator Rating Overview Box */}
              <div className="p-5 rounded-2xl bg-[#F7F8F9] border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-5 items-center">
                <div className="text-center sm:text-left sm:border-r border-gray-200 sm:pr-5">
                  <div className="font-display text-4xl font-extrabold text-gray-900">
                    {tour.reviewsCount > 0 ? tour.ratingAvg.toFixed(1) : 'New'}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#008768] text-[#008768]" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tourReviews.length} tour · {allOrganizerReviews.length} organizer reviews
                  </div>
                </div>

                {[
                  { label: 'Mountain Guide', score: avgGuide },
                  { label: 'Yurts & Hotels', score: avgAccom },
                  { label: '4WD Transport', score: avgTransport },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                      <span>{metric.label}</span>
                      <span>{metric.score.toFixed(1)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-[#008768] rounded-full"
                        style={{ width: `${(metric.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Verified Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-6 rounded-2xl bg-[#F0FAF6] border border-[#008768]/25 space-y-4"
                >
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-900">
                      Submit a Verified Traveler Review
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Enter the booking reference or review token from your completed trip to guarantee 100% authentic reviews.
                    </p>
                    {demoCompletedBooking && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#008768]/30 text-xs">
                        <span className="text-gray-600">
                          Demo completed booking available for this tour:
                        </span>
                        <button
                          type="button"
                          onClick={() => setReviewTokenInput(demoCompletedBooking.reviewToken)}
                          className="font-mono font-bold text-[#008768] underline cursor-pointer"
                        >
                          {demoCompletedBooking.reviewToken}
                        </button>
                      </div>
                    )}
                  </div>

                  {reviewStatus && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-semibold flex flex-wrap items-center justify-between gap-2 ${
                        reviewStatus.ok
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {reviewStatus.msg}
                      </span>
                      {reviewStatus.redirectSlug && (
                        <Link
                          href={`/tours/${reviewStatus.redirectSlug}#reviews`}
                          className="underline font-bold text-rose-950"
                        >
                          Go to that tour →
                        </Link>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Completed Booking Code or Review Token *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewTokenInput}
                      onChange={(e) => setReviewTokenInput(e.target.value)}
                      placeholder="e.g. REV-TEST-DEMO or KG-2026-9044"
                      className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-mono font-bold focus:outline-none focus:border-[#008768]"
                    />
                  </div>

                  {/* All 4 Interactive 5-Star Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StarRatingInput
                      label="Overall Experience"
                      value={ratingOverall}
                      onChange={setRatingOverall}
                    />
                    <StarRatingInput
                      label="Mountain Guide"
                      value={ratingGuide}
                      onChange={setRatingGuide}
                    />
                    <StarRatingInput
                      label="Yurts & Accommodation"
                      value={ratingAccommodation}
                      onChange={setRatingAccommodation}
                    />
                    <StarRatingInput
                      label="4WD Transport & Safety"
                      value={ratingTransport}
                      onChange={setRatingTransport}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Share your experience with {organizer.brandName} *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="How was the guide, mountain route, yurt camp comfort, and direct-price booking experience?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-[#008768]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold transition cursor-pointer"
                    >
                      Verify & Publish Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews Feed */}
              <div className="space-y-5">
                {tourReviews.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No reviews yet for this specific program. View all{' '}
                    <Link
                      href={`/organizers/${organizer.slug}`}
                      className="text-[#008768] font-bold underline"
                    >
                      {organizer.reviewsCount} verified reviews for {organizer.brandName}
                    </Link>
                    .
                  </p>
                ) : (
                  tourReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="pb-6 border-b border-gray-200 last:border-b-0 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E6F5F0] text-[#006B52] font-display font-extrabold text-sm flex items-center justify-center">
                            {rev.authorName
                              .split(' ')
                              .map((p) => p[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">
                              {rev.authorName}{' '}
                              <span className="font-normal text-gray-500">
                                · {rev.authorCountry}
                              </span>
                            </div>
                            <div className="text-xs text-[#006B52] font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified Trip · {formatShortDate(rev.tripDate)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: rev.ratingOverall }).map((_, idx) => (
                              <Star
                                key={idx}
                                className="w-4 h-4 fill-[#008768] text-[#008768]"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {rev.ratingOverall}.0
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>

                      <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100">
                          Guide: <strong className="text-gray-800">{rev.ratingGuide}/5</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100">
                          Stay: <strong className="text-gray-800">{rev.ratingAccommodation}/5</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100">
                          4WD: <strong className="text-gray-800">{rev.ratingTransport}/5</strong>
                        </span>
                      </div>

                      {rev.photos && rev.photos.length > 0 && (
                        <div className="flex gap-2.5 pt-1">
                          {rev.photos.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt="Traveler review photo"
                              className="w-24 h-20 rounded-xl object-cover border border-gray-200"
                            />
                          ))}
                        </div>
                      )}

                      {rev.organizerReply && (
                        <div className="ml-4 pl-4 border-l-2 border-[#008768] bg-[#F7F8F9] p-4 rounded-r-xl text-xs space-y-1">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#008768]" />
                            Response from {organizer.brandName}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{rev.organizerReply}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right 4 Columns: Viator Sticky Booking Widget & Open Organizer Trust Card */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-[132px]">
            {/* Viator "Select Date and Travelers" Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_12px_36px_rgba(0,0,0,0.08)] p-6 space-y-5">
              <div className="flex items-start justify-between gap-2 pb-4 border-b border-gray-100">
                <div>
                  <div className="text-xs font-semibold text-gray-500">From</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-extrabold text-gray-900">
                      {formatMoney(unitPriceUsd, currency)}
                    </span>
                    <span className="text-xs text-gray-500">per adult</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#008768] mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Direct Organizer Price (0% Markup)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setClaimSubmitted(false);
                    setClaimError(null);
                    setShowPriceClaim(!showPriceClaim);
                  }}
                  className="text-[11px] font-bold text-gray-600 hover:text-[#008768] underline text-right cursor-pointer"
                >
                  Lowest Price
                  <br />
                  Guarantee
                </button>
              </div>

              {/* Price-Match Claim Inline Drawer (Fixed with all fields!) */}
              {showPriceClaim && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2.5">
                  {claimSubmitted ? (
                    <div className="text-emerald-900 font-semibold space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Price-Match Claim Received!
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Our verification team will match {organizer.brandName}’s direct price right away.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handlePriceClaimSubmit} className="space-y-2">
                      <div className="font-bold text-amber-950 flex items-center justify-between">
                        <span>Found it cheaper direct?</span>
                        <button
                          type="button"
                          onClick={() => setShowPriceClaim(false)}
                          className="text-amber-700 hover:text-amber-950 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {claimError && (
                        <div className="text-rose-700 font-semibold text-[11px]">
                          {claimError}
                        </div>
                      )}
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={claimName}
                        onChange={(e) => setClaimName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Your Email *"
                        value={claimEmail}
                        onChange={(e) => setClaimEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none"
                      />
                      <input
                        type="url"
                        required
                        placeholder="URL of organizer's cheaper direct listing *"
                        value={claimUrl}
                        onChange={(e) => setClaimUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none"
                      />
                      <input
                        type="number"
                        required
                        min={1}
                        max={tour.basePriceUsd - 1}
                        placeholder={`Lower price found in USD (< $${tour.basePriceUsd}) *`}
                        value={claimPrice}
                        onChange={(e) => setClaimPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Optional notes (e.g. promo code or date)"
                        value={claimNotes}
                        onChange={(e) => setClaimNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                      >
                        Submit Price-Match Claim
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeDeparture ? (
                <>
                  {/* Interactive Date Pills */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      Select Departure Date
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {bookableDepartures.map((dep) => {
                        const selected = activeDeparture.id === dep.id;
                        return (
                          <button
                            key={dep.id}
                            type="button"
                            onClick={() => setSelectedDepartureId(dep.id)}
                            className={`w-full p-3 rounded-2xl border-2 text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                              selected
                                ? 'border-[#008768] bg-[#F0FAF6]'
                                : 'border-gray-200 hover:border-gray-400 bg-white'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-gray-900">
                                {formatDateRange(dep.startDate, dep.endDate)}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                                <span
                                  className={
                                    dep.seatsRemaining <= 3
                                      ? 'text-[#D93829] font-bold'
                                      : 'text-[#006B52] font-semibold'
                                  }
                                >
                                  {dep.seatsRemaining} spots left
                                </span>
                                {dep.isGuaranteed && <span>· Guaranteed</span>}
                              </div>
                            </div>
                            <span className="font-extrabold text-xs text-gray-900 shrink-0">
                              {formatMoney(dep.priceUsd, currency)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Travelers Counter */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-[#F7F8F9]">
                    <div>
                      <div className="text-xs font-bold text-gray-900">Travelers</div>
                      <div className="text-[11px] text-gray-500">
                        Max {activeDeparture.seatsRemaining} available
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease travelers"
                        onClick={() => setSelectedPax(Math.max(1, safePax - 1))}
                        disabled={safePax <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white font-bold text-gray-800 hover:border-gray-900 disabled:opacity-40 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="font-display font-extrabold text-sm w-5 text-center">
                        {safePax}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase travelers"
                        onClick={() =>
                          setSelectedPax(Math.min(activeDeparture.seatsRemaining, safePax + 1))
                        }
                        disabled={safePax >= activeDeparture.seatsRemaining}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white font-bold text-gray-800 hover:border-gray-900 disabled:opacity-40 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Live Split Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#F0FAF6] border border-[#008768]/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>
                        Total ({safePax} × {formatMoney(unitPriceUsd, currency)})
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatMoney(totalPriceUsd, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-extrabold text-[#004F32] text-sm pt-1 border-t border-[#008768]/15">
                      <span>Pay Today ({tour.depositPercent}% Deposit)</span>
                      <span className="text-base text-[#008768]">
                        {formatMoney(depositTotalUsd, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Balance on Arrival ({100 - tour.depositPercent}%)</span>
                      <span className="font-semibold text-gray-900">
                        {formatMoney(balanceTotalUsd, currency)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(true)}
                    className="w-full py-4 px-6 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-display font-extrabold text-sm shadow-md transition cursor-pointer"
                  >
                    Reserve Now · {formatMoney(depositTotalUsd, currency)} Deposit
                  </button>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#008768] shrink-0 mt-0.5" />
                      <span>
                        <strong>Free cancellation</strong> up to {tour.freeCancellationDays} days before start
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#008768] shrink-0 mt-0.5" />
                      <span>
                        <strong>Reserve Now & Pay Later</strong> — pay 80% directly to {organizer.brandName}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-2">
                  <div className="font-bold text-sm text-gray-900">
                    All Scheduled Dates Currently Full
                  </div>
                  <p className="text-xs text-gray-600">
                    Contact {organizer.brandName} directly or check back for new 2027 dates.
                  </p>
                  <Link
                    href={`/organizers/${organizer.slug}`}
                    className="inline-block mt-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold"
                  >
                    View Organizer Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Open Local Organizer Trust Card */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#008768] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Verified Local Kyrgyz Organizer
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={organizer.logoUrl}
                  alt={organizer.brandName}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                />
                <div className="min-w-0">
                  <Link
                    href={`/organizers/${organizer.slug}`}
                    className="font-display font-bold text-base text-gray-900 hover:text-[#008768] transition block truncate"
                  >
                    {organizer.brandName}
                  </Link>
                  <div className="text-xs text-gray-500 truncate">{organizer.legalName}</div>
                  <div className="text-[11px] text-gray-400 truncate">
                    {organizer.registrationNumber}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-[#F7F8F9] p-3 rounded-2xl">
                <div>
                  <div className="font-extrabold text-sm text-gray-900 flex items-center justify-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-[#008768] text-[#008768]" />
                    {organizer.ratingAvg.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-gray-500">{organizer.reviewsCount} reviews</div>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-gray-900">
                    {organizer.toursSoldCount}
                  </div>
                  <div className="text-[10px] text-gray-500">Tours Sold</div>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#008768]">
                    {organizer.peopleSignedUpCount}
                  </div>
                  <div className="text-[10px] text-gray-500">Travelers</div>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <strong className="text-gray-900">Base:</strong> {organizer.baseCity}, Kyrgyzstan (Est. {organizer.foundedYear})
                </div>
                <div>
                  <strong className="text-gray-900">Languages:</strong> {organizer.languages.join(', ')}
                </div>
                <div>
                  <strong className="text-gray-900">Direct Website:</strong>{' '}
                  <a
                    href={organizer.directSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#008768] hover:underline inline-flex items-center gap-1"
                  >
                    {organizer.directSiteUrl.replace('https://', '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-1 flex flex-col gap-2">
                <Link
                  href={`/organizers/${organizer.slug}`}
                  className="w-full py-2.5 px-4 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold text-center transition"
                >
                  View Full Organizer Profile →
                </Link>
                <Link
                  href="/partner"
                  onClick={() => setActivePartnerId(organizer.id)}
                  className="w-full py-2 px-4 rounded-full bg-[#F0FAF6] hover:bg-[#E6F5F0] text-[#006B52] text-xs font-bold text-center transition inline-flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Preview Partner Dashboard
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Full-Screen Photo Lightbox Modal */}
      {lightboxIdx !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIdx(null);
          }}
        >
          <div className="w-full max-w-6xl flex items-center justify-between text-white">
            <span className="text-sm font-bold">
              {lightboxIdx + 1} / {photos.length} · {tour.title}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close gallery"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4">
            <button
              type="button"
              onClick={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)}
              aria-label="Previous photo"
              className="absolute left-0 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={photos[lightboxIdx]}
              alt={`${tour.title} gallery ${lightboxIdx + 1}`}
              className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)}
              aria-label="Next photo"
              className="absolute right-0 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {photos.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightboxIdx(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition ${
                  idx === lightboxIdx ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Checkout Modal */}
      {bookingModalOpen && activeDeparture && (
        <BookingModal
          tour={tour}
          organizer={organizer}
          departure={activeDeparture}
          initialPaxCount={safePax}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
