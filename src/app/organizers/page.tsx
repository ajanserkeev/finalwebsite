'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Star,
  MapPin,
  ShieldCheck,
  Truck,
  Globe,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';

export default function OrganizersDirectoryPage() {
  const { organizers, tours, setActivePartnerId } = useMarketplace();
  const [cityFilter, setCityFilter] = useState<string>('all');

  const verifiedOrganizers = organizers.filter(
    (o) => o.isVerified && o.verificationStatus === 'verified'
  );
  const cities = Array.from(new Set(verifiedOrganizers.map((o) => o.baseCity)));

  const filtered =
    cityFilter === 'all'
      ? verifiedOrganizers
      : verifiedOrganizers.filter((o) => o.baseCity === cityFilter);

  return (
    <div className="bg-white min-h-screen">
      {/* Crisp Viator Header Banner */}
      <section className="bg-[#F7F8F9] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#008768]" />
            Verified Kyrgyz Tour Operators · 0% Markup Direct-Price Covenant
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Verified Local Organizers in Kyrgyzstan
              </h1>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                Every tour operator listed below has passed KYC verification of their Kyrgyz legal entity, tourism license, 4WD fleet safety, and signed our 0% markup direct-price guarantee.
              </p>
            </div>
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold transition shrink-0"
            >
              <Building2 className="w-4 h-4" />
              Partner Portal Login
            </Link>
          </div>

          {/* Base City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCityFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition cursor-pointer ${
                cityFilter === 'all'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              All Cities ({verifiedOrganizers.length})
            </button>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition cursor-pointer ${
                  cityFilter === city
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Organizers Cards List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {filtered.map((org) => {
          const activeTours = tours.filter(
            (t) => t.organizerId === org.id && t.status === 'published'
          );
          return (
            <article
              key={org.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Cover Thumbnail */}
              <div className="lg:col-span-4 relative min-h-[220px] bg-gray-100">
                <img
                  src={org.coverUrl}
                  alt={org.brandName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 text-[#006B52] text-xs font-bold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008768]" />
                    Verified Operator
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                  <img
                    src={org.logoUrl}
                    alt={org.brandName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {org.baseCity} · Est. {org.foundedYear}
                    </div>
                    <h2 className="font-display font-extrabold text-lg leading-tight truncate">
                      {org.brandName}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Right Details & Stats */}
              <div className="lg:col-span-8 p-6 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-gray-500">
                      <strong className="text-gray-800">{org.legalName}</strong> ·{' '}
                      {org.registrationNumber}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FAF6] text-xs font-bold text-gray-900">
                      <Star className="w-3.5 h-3.5 fill-[#008768] text-[#008768]" />
                      {org.ratingAvg.toFixed(2)}
                      <span className="text-gray-500 font-normal">
                        ({org.reviewsCount} verified reviews)
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{org.bio}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2">
                      <Truck className="w-4 h-4 text-[#008768] shrink-0 mt-0.5" />
                      <span className="text-gray-600 line-clamp-2">{org.fleetSummary}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2">
                      <Globe className="w-4 h-4 text-[#008768] shrink-0 mt-0.5" />
                      <div className="text-gray-600">
                        <strong className="text-gray-900">Guide Languages:</strong>{' '}
                        {org.languages.join(', ')} ·{' '}
                        <strong className="text-gray-900">{org.guides.length}</strong> lead guides
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-5 text-xs">
                    <div>
                      <span className="font-display font-extrabold text-base text-gray-900">
                        {activeTours.length}
                      </span>{' '}
                      <span className="text-gray-500">Active Tours</span>
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-base text-gray-900">
                        {org.toursSoldCount}
                      </span>{' '}
                      <span className="text-gray-500">Tours Sold</span>
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-base text-[#008768]">
                        {org.peopleSignedUpCount}
                      </span>{' '}
                      <span className="text-gray-500">Travelers Hosted</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/partner"
                      onClick={() => setActivePartnerId(org.id)}
                      className="px-4 py-2 rounded-full border border-gray-300 hover:border-gray-900 text-gray-700 text-xs font-bold transition"
                    >
                      Partner View
                    </Link>
                    <Link
                      href={`/organizers/${org.slug}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold transition"
                    >
                      View Profile & Tours
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
