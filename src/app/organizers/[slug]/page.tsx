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
  ExternalLink,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatShortDate } from '@/types/marketplace';
import { TourCard } from '@/components/TourCard';

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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-extrabold text-gray-900">
          Organizer Not Found
        </h1>
        <Link
          href="/organizers"
          className="inline-block px-6 py-2.5 rounded-full bg-[#008768] text-white text-sm font-bold"
        >
          Browse Verified Organizers
        </Link>
      </div>
    );
  }

  const organizerTours = tours.filter(
    (t) => t.organizerId === organizer.id && t.status === 'published'
  );
  const allOrgReviews = reviews.filter((r) => r.organizerId === organizer.id);
  const filteredReviews = allOrgReviews.filter(
    (r) => selectedReviewTourId === 'all' || r.tourId === selectedReviewTourId
  );

  return (
    <div className="bg-white pb-12">
      {/* Editorial Cover Banner */}
      <section className="relative">
        <div className="h-56 sm:h-72 overflow-hidden bg-gray-900 relative">
          <img
            src={organizer.coverUrl}
            alt={organizer.brandName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={organizer.logoUrl}
                alt={organizer.brandName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {organizer.isVerified && organizer.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008768]" />
                      Verified Kyrgyz Tour Organizer
                    </span>
                  ) : organizer.verificationStatus === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      KYC Verification Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Account Suspended
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    {organizer.baseCity}, Kyrgyzstan · Est. {organizer.foundedYear}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {organizer.brandName}
                </h1>

                <div className="text-xs text-gray-500">
                  <strong className="text-gray-800">{organizer.legalName}</strong> ·{' '}
                  {organizer.registrationNumber}
                </div>
              </div>
            </div>

            {/* Live Performance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto text-center">
              <div className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200">
                <div className="text-lg font-display font-extrabold text-gray-900 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-[#008768] text-[#008768]" />
                  {allOrgReviews.length > 0 ? organizer.ratingAvg.toFixed(1) : 'New'}
                </div>
                <div className="text-[11px] text-gray-500">Rating</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200">
                <div className="text-lg font-display font-extrabold text-gray-900">
                  {allOrgReviews.length}
                </div>
                <div className="text-[11px] text-gray-500">Reviews</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200">
                <div className="text-lg font-display font-extrabold text-gray-900">
                  {organizer.toursSoldCount}
                </div>
                <div className="text-[11px] text-gray-500">Tours Sold</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F0FAF6] border border-[#008768]/20">
                <div className="text-lg font-display font-extrabold text-[#008768]">
                  {organizer.peopleSignedUpCount}
                </div>
                <div className="text-[11px] text-[#006B52] font-semibold">Travelers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 space-y-5">
            <h2 className="font-display font-extrabold text-xl text-gray-900">
              About {organizer.brandName}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{organizer.bio}</p>

            <div className="p-4 rounded-2xl bg-[#F7F8F9] border border-gray-200 space-y-1.5 text-xs">
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#008768]" />
                4WD Fleet & Yurt Camp Infrastructure
              </div>
              <p className="text-gray-600 leading-relaxed">{organizer.fleetSummary}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#008768]" />
                <strong>Guide Languages:</strong> {organizer.languages.join(', ')}
              </div>
              <a
                href={organizer.directSiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#008768] font-bold hover:underline"
              >
                Official Website ({organizer.directSiteUrl.replace('https://', '')})
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F0FAF6] border border-[#008768]/20 text-xs text-[#004F32] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#008768] shrink-0" />
              Signed Direct-Price Parity Agreement — 0% markup over booking direct.
            </div>
          </div>

          {/* Lead Guides */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-lg text-gray-900">Lead Guides</h2>
              <Link
                href="/partner"
                onClick={() => setActivePartnerId(organizer.id)}
                className="text-xs font-bold text-[#008768] hover:underline flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5" />
                Partner Portal
              </Link>
            </div>

            <div className="space-y-3">
              {organizer.guides.map((g, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-[#F7F8F9] border border-gray-200/80 flex items-center gap-3.5"
                >
                  <img
                    src={g.avatarUrl}
                    alt={g.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-gray-900">{g.name}</div>
                    <div className="text-gray-500">{g.role}</div>
                    <div className="text-[11px] text-[#006B52] font-semibold mt-0.5">
                      {g.experienceYears} yrs experience · {g.languages.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Tours by this Organizer */}
        <section className="space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#008768]">
              0% Markup Direct Programs
            </span>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 mt-0.5">
              Experiences by {organizer.brandName} ({organizerTours.length})
            </h2>
          </div>

          {organizerTours.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#F7F8F9] border border-gray-200 text-center text-sm text-gray-600">
              This organizer has no published tours live yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </section>

        {/* Verified Reviews Feed */}
        <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008768]">
                <Award className="w-4 h-4" />
                Verified Bookings Only
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                Traveler Reviews for {organizer.brandName} ({filteredReviews.length})
              </h2>
            </div>

            <select
              value={selectedReviewTourId}
              onChange={(e) => setSelectedReviewTourId(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-800 cursor-pointer"
            >
              <option value="all">All Tours ({allOrgReviews.length} reviews)</option>
              {organizerTours.map((t) => {
                const cnt = allOrgReviews.filter((r) => r.tourId === t.id).length;
                return (
                  <option key={t.id} value={t.id}>
                    {t.title} ({cnt})
                  </option>
                );
              })}
            </select>
          </div>

          {filteredReviews.length === 0 ? (
            <p className="text-sm text-gray-500">No verified reviews matching this filter yet.</p>
          ) : (
            <div className="space-y-5">
              {filteredReviews.map((rev) => {
                const revTour = tours.find((t) => t.id === rev.tourId);
                return (
                  <div
                    key={rev.id}
                    className="pb-5 border-b border-gray-100 last:border-b-0 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-gray-900">
                          {rev.authorName}{' '}
                          <span className="font-normal text-gray-500">· {rev.authorCountry}</span>
                        </div>
                        <div className="text-xs font-medium text-[#006B52] flex flex-wrap items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified Trip · {formatShortDate(rev.tripDate)}
                          {revTour && (
                            <Link
                              href={`/tours/${revTour.slug}`}
                              className="text-gray-700 underline hover:text-[#008768]"
                            >
                              {revTour.title}
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold bg-[#F0FAF6] px-3 py-1 rounded-full text-gray-900">
                        <Star className="w-3.5 h-3.5 fill-[#008768] text-[#008768]" />
                        {rev.ratingOverall}.0
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex gap-2">
                        {rev.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt="Verified traveler photo"
                            className="w-20 h-16 rounded-xl object-cover border border-gray-200"
                          />
                        ))}
                      </div>
                    )}

                    {rev.organizerReply && (
                      <div className="ml-4 pl-4 border-l-2 border-[#008768] bg-[#F7F8F9] p-3.5 rounded-r-xl text-xs">
                        <div className="font-bold text-gray-900">
                          Reply from {organizer.brandName}:
                        </div>
                        <p className="text-gray-600 mt-0.5">{rev.organizerReply}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
