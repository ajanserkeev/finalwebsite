'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Star,
  ShieldCheck,
  MapPin,
  Globe,
  Truck,
  Building2,
  Award,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { TourCard } from '@/components/TourCard';

/** S-004: Public Tour Organizer Profile Page */
export default function OrganizerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { organizers, tours, departures, reviews, setActivePartnerId } = useMarketplace();

  const organizer = organizers.find((o) => o.slug === slug);
  const [selectedReviewTourId, setSelectedReviewTourId] = useState<string>('all');

  if (!organizer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Organizer Not Found</h1>
        <Link
          href="/tours"
          className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
        >
          Browse All Tours
        </Link>
      </div>
    );
  }

  const organizerTours = tours.filter(
    (t) => t.organizerId === organizer.id && t.status === 'published'
  );
  const organizerReviews = reviews
    .filter((r) => r.organizerId === organizer.id)
    .filter((r) => selectedReviewTourId === 'all' || r.tourId === selectedReviewTourId);

  return (
    <div className="space-y-10 pb-12">
      {/* Organizer Cover & Hero Header */}
      <section className="relative bg-slate-900 text-white">
        <div className="h-56 sm:h-72 overflow-hidden opacity-45">
          <img
            src={organizer.coverUrl}
            alt={organizer.brandName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-8">
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={organizer.logoUrl}
                alt={organizer.brandName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-teal-500 shadow-md"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Verified Kyrgyz Tour Organizer
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Base: {organizer.baseCity} · Est. {organizer.foundedYear}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {organizer.brandName}
                </h1>

                <div className="text-xs text-slate-500">
                  <strong>Legal Entity:</strong> {organizer.legalName} ({organizer.registrationNumber})
                </div>
              </div>
            </div>

            {/* Organizer Live Performance & Reputation Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto text-center">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {organizer.ratingAvg.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500">Verified Rating</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-lg font-extrabold text-slate-900">
                  {organizer.reviewsCount}
                </div>
                <div className="text-[11px] text-slate-500">Tourist Reviews</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-lg font-extrabold text-slate-900">
                  {organizer.toursSoldCount}
                </div>
                <div className="text-[11px] text-slate-500">Tours Sold</div>
              </div>
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                <div className="text-lg font-extrabold text-teal-700">
                  {organizer.peopleSignedUpCount}
                </div>
                <div className="text-[11px] text-teal-800 font-semibold">
                  People Signed Up
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* About, Fleet & Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-extrabold text-lg text-slate-900">
              About {organizer.brandName}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{organizer.bio}</p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-teal-600" />
                4WD Fleet & Camp Infrastructure
              </div>
              <p className="text-slate-600">{organizer.fleetSummary}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" />
                <strong>Languages spoken by guides:</strong> {organizer.languages.join(', ')}
              </div>
              <div className="flex items-center gap-1.5 text-teal-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Signed 0% Markup Direct-Price Parity Agreement
              </div>
            </div>
          </div>

          {/* Lead Mountain Guides */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-lg text-slate-900">Lead Guides</h2>
              <Link
                href="/partner"
                onClick={() => setActivePartnerId(organizer.id)}
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5" />
                Operator Portal
              </Link>
            </div>

            <div className="space-y-3">
              {organizer.guides.map((g, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3"
                >
                  <img
                    src={g.avatarUrl}
                    alt={g.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">{g.name}</div>
                    <div className="text-slate-500">{g.role}</div>
                    <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                      {g.experienceYears} yrs exp · {g.languages.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Active Direct-Price Tours by this Organizer */}
        <section className="space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              0% Markup Direct Programs
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Active Tours by {organizer.brandName} ({organizerTours.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerTours.map((tour) => {
              const tourDeps = departures.filter((d) => d.tourId === tour.id);
              return (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  organizer={organizer}
                  departures={tourDeps}
                />
              );
            })}
          </div>
        </section>

        {/* All Verified Tourist Reviews for this Organizer */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <Award className="w-4 h-4" />
                Aggregated Verified Reviews Across All Tours (Rule R-008)
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Reviews from Real Tourists Who Traveled with {organizer.brandName} (
                {organizerReviews.length})
              </h2>
            </div>

            <select
              value={selectedReviewTourId}
              onChange={(e) => setSelectedReviewTourId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
            >
              <option value="all">All Tours ({organizer.reviewsCount} reviews)</option>
              {organizerTours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.reviewsCount})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {organizerReviews.map((rev) => {
              const revTour = tours.find((t) => t.id === rev.tourId);
              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {rev.authorName}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          ({rev.authorCountry})
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Booking · Trip Date: {rev.tripDate}
                        {revTour && (
                          <Link
                            href={`/tours/${revTour.slug}`}
                            className="text-teal-700 underline ml-1"
                          >
                            ({revTour.title})
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rev.ratingOverall}.0 / 5.0
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.organizerReply && (
                    <div className="ml-4 pl-4 border-l-2 border-teal-500 bg-white p-3 rounded-xl text-xs">
                      <div className="font-bold text-teal-800">
                        Reply from {organizer.brandName}:
                      </div>
                      <p className="text-slate-600 mt-0.5">{rev.organizerReply}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

