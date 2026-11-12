'use client';

import React from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  Tour,
  Organizer,
  TourDeparture,
  DIFFICULTY_META,
  COMFORT_META,
  formatMoney,
} from '@/types/marketplace';
import { useMarketplace } from '@/context/MarketplaceContext';

interface TourCardProps {
  tour: Tour;
  organizer: Organizer;
  departures: TourDeparture[];
}

/** C-002: Tour Card with Open Organizer Attribution (R-001) & Direct Price Badge (R-002) */
export function TourCard({ tour, organizer, departures }: TourCardProps) {
  const { currency } = useMarketplace();

  const upcomingDepartures = departures
    .filter((d) => d.status === 'open' || d.status === 'guaranteed')
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const hasGuaranteed = upcomingDepartures.some((d) => d.isGuaranteed);
  const depositUsd = Math.round((tour.basePriceUsd * tour.depositPercent) / 100);
  const diffMeta = DIFFICULTY_META[tour.difficultyLevel];
  const comfortMeta = COMFORT_META[tour.comfortLevel];

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col">
      {/* Image & Top Badges */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <Link href={`/tours/${tour.slug}`}>
          <img
            src={tour.heroImageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-600 text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Direct Organizer Price · 0% Markup
          </span>
          {hasGuaranteed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Guaranteed Group
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            {tour.durationDays} {tour.durationDays === 1 ? 'Day' : 'Days'}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${diffMeta.colorClass}`}
          >
            {diffMeta.short}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* R-001: Open Organizer Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <Link
              href={`/organizers/${organizer.slug}`}
              className="inline-flex items-center gap-2 group/org hover:bg-slate-50 pr-2 py-0.5 rounded-lg transition"
            >
              <img
                src={organizer.logoUrl}
                alt={organizer.brandName}
                className="w-6 h-6 rounded-full object-cover border border-teal-500"
              />
              <span className="text-xs font-semibold text-slate-700 group-hover/org:text-teal-700 underline-offset-2 group-hover/org:underline">
                {organizer.brandName}
              </span>
              {organizer.isVerified && (
                <span title="Verified Kyrgyz Tour Operator">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                </span>
              )}
            </Link>

            {tour.reviewsCount > 0 ? (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {tour.ratingAvg.toFixed(2)}
                <span className="text-slate-400 font-normal">({tour.reviewsCount})</span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                New Program
              </span>
            )}
          </div>

          {/* Title & Route */}
          <Link href={`/tours/${tour.slug}`} className="block group-hover:text-teal-700 transition">
            <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
              {tour.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-1">{tour.routeSummary}</p>

          {/* Spec Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Max {tour.maxGroupSize} pax
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
              {comfortMeta.short}
            </span>
          </div>

          {/* Upcoming Departure Dates Strip */}
          {upcomingDepartures.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Next Group Departures:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {upcomingDepartures.slice(0, 2).map((dep) => (
                  <Link
                    key={dep.id}
                    href={`/tours/${tour.slug}#departures`}
                    className="text-[11px] px-2 py-1 rounded-md bg-slate-50 border border-slate-200 hover:border-teal-400 text-slate-700 flex items-center gap-1.5"
                  >
                    <span className="font-semibold">{dep.startDate}</span>
                    <span
                      className={`font-medium ${
                        dep.seatsRemaining <= 3 ? 'text-amber-600 font-bold' : 'text-teal-700'
                      }`}
                    >
                      ({dep.seatsRemaining} left)
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Direct Price & Deposit Split */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-500">Direct Organizer Price</div>
            <div className="text-xl font-extrabold text-slate-900">
              {formatMoney(tour.basePriceUsd, currency)}
              <span className="text-xs font-normal text-slate-500"> / person</span>
            </div>
            <div className="text-[11px] font-semibold text-teal-700">
              Reserve online for {formatMoney(depositUsd, currency)} ({tour.depositPercent}% deposit)
            </div>
          </div>

          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition shrink-0"
          >
            View Tour
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

