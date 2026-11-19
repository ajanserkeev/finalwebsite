'use client';

import React from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Heart,
  Flame,
  Calendar,
  MapPin,
} from 'lucide-react';
import {
  Tour,
  Organizer,
  TourDeparture,
  REGION_META,
  formatMoney,
  formatShortDate,
} from '@/types/marketplace';
import { useMarketplace } from '@/context/MarketplaceContext';

interface TourCardProps {
  tour: Tour;
  organizer: Organizer;
  departures: TourDeparture[];
}

export function TourCard({ tour, organizer, departures }: TourCardProps) {
  const { currency, savedTourIds, toggleSavedTour } = useMarketplace();

  const isSaved = savedTourIds.includes(tour.id);

  const upcomingDepartures = departures
    .filter((d) => (d.status === 'open' || d.status === 'guaranteed') && d.seatsRemaining > 0)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const nextDeparture = upcomingDepartures[0];
  const hasGuaranteed = upcomingDepartures.some((d) => d.isGuaranteed);
  const likelyToSellOut =
    !!nextDeparture && nextDeparture.seatsRemaining <= 3 && nextDeparture.seatsRemaining > 0;
  const depositUsd = Math.round((tour.basePriceUsd * tour.depositPercent) / 100);
  const primaryRegion = REGION_META[tour.regions[0]]?.name || 'Kyrgyzstan';

  return (
    <article className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden hover:shadow-[0_12px_32px_rgba(17,24,39,0.09)] hover:border-gray-300 transition-all duration-300 flex flex-col">
      {/* Viator 4:3 Editorial Photo Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={`/tours/${tour.slug}`} className="block w-full h-full">
          <img
            src={tour.heroImageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
        </Link>

        {/* Top-Left Viator Badge */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 pointer-events-none">
          {likelyToSellOut ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#D93829] text-white shadow-sm">
              <Flame className="w-3 h-3 fill-white" />
              Likely to Sell Out
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-[#004F32] shadow-sm backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008768]" />
              0% Markup Direct
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSavedTour(tour.id);
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-[18px] h-[18px] transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-700 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Bottom Overlay Duration Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-[11px] font-semibold">
            <Clock className="w-3 h-3 text-emerald-300" />
            {tour.durationDays} {tour.durationDays === 1 ? 'Day' : 'Days'} · Max {tour.maxGroupSize}
          </span>
          {hasGuaranteed && (
            <span className="px-2.5 py-1 rounded-full bg-[#008768]/95 text-white text-[11px] font-bold">
              Guaranteed
            </span>
          )}
        </div>
      </div>

      {/* Card Body — Crisp Viator Visual Hierarchy */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          {/* Location & Open Organizer Attribution */}
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{primaryRegion}</span>
            </span>

            {tour.reviewsCount > 0 ? (
              <div className="inline-flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#008768] text-[#008768]" />
                <span className="font-bold text-gray-900">{tour.ratingAvg.toFixed(1)}</span>
                <span className="text-gray-500">({tour.reviewsCount})</span>
              </div>
            ) : (
              <span className="text-[11px] font-bold text-[#006B52] bg-[#E6F5F0] px-2 py-0.5 rounded-full shrink-0">
                New
              </span>
            )}
          </div>

          {/* Tour Title */}
          <Link href={`/tours/${tour.slug}`} className="block">
            <h3 className="font-display font-bold text-[15px] text-gray-900 group-hover:text-[#008768] line-clamp-2 leading-snug transition-colors">
              {tour.title}
            </h3>
          </Link>

          {/* Open Organizer Pill */}
          <Link
            href={`/organizers/${organizer.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#008768] transition group/org max-w-full"
          >
            <img
              src={organizer.logoUrl}
              alt={organizer.brandName}
              className="w-5 h-5 rounded-full object-cover border border-gray-200 shrink-0"
            />
            <span className="truncate font-medium group-hover/org:underline">
              {organizer.brandName}
            </span>
            {organizer.isVerified && (
              <CheckCircle2
                className="w-3.5 h-3.5 text-[#008768] shrink-0"
                aria-label="Verified organizer"
              />
            )}
          </Link>

          {/* Viator Highlights: Free Cancellation & Next Departure */}
          <div className="pt-1 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-[#006B52] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Free cancellation ({tour.freeCancellationDays}d prior)</span>
            </div>
            {nextDeparture && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>
                  Next: <strong className="text-gray-800">{formatShortDate(nextDeparture.startDate)}</strong>{' '}
                  <span
                    className={
                      nextDeparture.seatsRemaining <= 3
                        ? 'text-[#D93829] font-bold'
                        : 'text-[#006B52] font-semibold'
                    }
                  >
                    · {nextDeparture.seatsRemaining} left
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Price Bar (Viator Direct-Price Anchoring) */}
        <div className="pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-[11px] text-gray-500">
              from <span className="text-gray-900 font-display font-extrabold text-lg ml-0.5">{formatMoney(tour.basePriceUsd, currency)}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              direct price · per adult
            </div>
          </div>

          <Link
            href={`/tours/${tour.slug}`}
            className="px-3 py-1.5 rounded-full bg-[#E6F5F0] hover:bg-[#008768] text-[#006B52] hover:text-white text-[11px] font-bold transition shrink-0"
          >
            Book {formatMoney(depositUsd, currency)} deposit
          </Link>
        </div>
      </div>
    </article>
  );
}
