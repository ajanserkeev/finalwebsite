'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatMoney, formatShortDate } from '@/types/marketplace';

export default function AdminPanelPage() {
  const {
    organizers,
    tours,
    bookings,
    reviews,
    priceClaims,
    currency,
    verifyOrganizer,
    moderateTour,
    refundBooking,
    resolvePriceMatchClaim,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'organizers' | 'tours' | 'ledger' | 'reviews'
  >('organizers');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);
  const [commissionInputs, setCommissionInputs] = useState<Record<string, number>>({});
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // Global Marketplace Metrics
  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'completed'
  );
  const totalGmvUsd = activeBookings.reduce((sum, b) => sum + b.totalAmountUsd, 0);
  const totalOnlineDepositsUsd = activeBookings.reduce(
    (sum, b) => sum + b.depositAmountUsd,
    0
  );
  const totalPlatformCommissionUsd = activeBookings.reduce(
    (sum, b) => sum + b.platformCommissionUsd,
    0
  );
  const totalToursSold = activeBookings.length;
  const totalPeopleSignedUp = activeBookings.reduce((sum, b) => sum + b.paxCount, 0);

  const pendingOrganizers = organizers.filter((o) => o.verificationStatus === 'pending');
  const pendingTours = tours.filter((t) => t.status === 'pending_review');
  const openClaims = priceClaims.filter((c) => c.status === 'open');

  const filteredBookings = bookings.filter((bk) => {
    if (bookingStatusFilter !== 'all' && bk.status !== bookingStatusFilter) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.trim().toLowerCase();
      const org = organizers.find((o) => o.id === bk.organizerId);
      const tour = tours.find((t) => t.id === bk.tourId);
      const hay = `${bk.bookingCode} ${bk.leadTravelerName} ${bk.leadEmail} ${
        org?.brandName || ''
      } ${tour?.title || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#F7F8F9] min-h-screen pb-16">
      {/* Admin Executive Header */}
      <div className="bg-[#0C1D17] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Platform Admin Control Center
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
            NomadBridge KG — Governance, KYC & Escrow Ledger
          </h1>
          <p className="text-xs text-gray-300 mt-1 max-w-3xl">
            Verify Kyrgyz tour operators, audit 0% markup direct-price parity, configure B2B commission rates, and process free-cancellation deposit refunds.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5 space-y-6">
        {/* Global KPI Strip */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-[11px] font-bold text-gray-400 uppercase">Total GMV</div>
            <div className="font-display text-xl font-extrabold text-gray-900 mt-1">
              {formatMoney(totalGmvUsd, currency)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-[11px] font-bold text-gray-400 uppercase">Online Deposits</div>
            <div className="font-display text-xl font-extrabold text-[#008768] mt-1">
              {formatMoney(totalOnlineDepositsUsd, currency)}
            </div>
          </div>
          <div className="bg-[#F0FAF6] p-4 rounded-2xl border border-[#008768]/25 shadow-xs">
            <div className="text-[11px] font-bold text-[#006B52] uppercase">Commission</div>
            <div className="font-display text-xl font-extrabold text-[#006B52] mt-1">
              {formatMoney(totalPlatformCommissionUsd, currency)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-[11px] font-bold text-gray-400 uppercase">Tours Sold</div>
            <div className="font-display text-xl font-extrabold text-gray-900 mt-1">
              {totalToursSold}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="text-[11px] font-bold text-gray-400 uppercase">Travelers</div>
            <div className="font-display text-xl font-extrabold text-[#008768] mt-1">
              {totalPeopleSignedUp} pax
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
            <div className="text-[11px] font-bold text-amber-800 uppercase">Action Queue</div>
            <div className="font-display text-xl font-extrabold text-amber-700 mt-1">
              {pendingOrganizers.length + pendingTours.length + openClaims.length}
            </div>
          </div>
        </section>

        {adminNotice && (
          <div className="p-4 rounded-2xl bg-[#E6F5F0] border border-[#008768]/30 text-[#004F32] text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#008768] shrink-0" />
              {adminNotice}
            </span>
            <button
              onClick={() => setAdminNotice(null)}
              className="p-1 hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: 'organizers',
              label: `Organizer KYC & Rates (${organizers.length})`,
              badge: pendingOrganizers.length,
            },
            {
              id: 'tours',
              label: `Tour Moderation & Parity (${tours.length})`,
              badge: pendingTours.length + openClaims.length,
            },
            {
              id: 'ledger',
              label: `Bookings & Escrow Ledger (${bookings.length})`,
              badge: 0,
            },
            {
              id: 'reviews',
              label: `Verified Reviews Audit (${reviews.length})`,
              badge: 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-gray-950 text-[10px] font-extrabold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Organizer KYC & Commission */}
        {activeTab === 'organizers' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <div>
              <h2 className="font-display font-extrabold text-lg text-gray-900">
                Tour Organizers KYC Verification & Commission Rates
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Operators remain hidden from public search until their Kyrgyz legal entity (ОсОО / ИП) and direct-price contract are approved.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs">
                    <th className="py-3 px-3 font-bold">Organizer & License</th>
                    <th className="py-3 px-3 font-bold">Base & Direct Site</th>
                    <th className="py-3 px-3 font-bold">Performance</th>
                    <th className="py-3 px-3 font-bold">Commission %</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {organizers.map((org) => {
                    const commVal =
                      commissionInputs[org.id] !== undefined
                        ? commissionInputs[org.id]
                        : org.commissionPercent;
                    return (
                      <tr key={org.id} className="hover:bg-gray-50/80">
                        <td className="py-4 px-3">
                          <Link
                            href={`/organizers/${org.slug}`}
                            className="font-bold text-gray-900 hover:text-[#008768]"
                          >
                            {org.brandName}
                          </Link>
                          <div className="text-xs text-gray-500">{org.legalName}</div>
                          <div className="text-[11px] font-mono text-gray-400">
                            {org.registrationNumber}
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-semibold text-gray-800">{org.baseCity}</div>
                          <a
                            href={org.directSiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#008768] hover:underline inline-flex items-center gap-1"
                          >
                            Direct Site <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-bold text-gray-900">
                            {org.toursSoldCount} tours sold
                          </div>
                          <div className="text-xs text-[#008768] font-semibold">
                            {org.peopleSignedUpCount} travelers
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={5}
                              max={35}
                              value={commVal}
                              onChange={(e) =>
                                setCommissionInputs((prev) => ({
                                  ...prev,
                                  [org.id]: Number(e.target.value),
                                }))
                              }
                              className="w-16 px-2.5 py-1.5 rounded-xl border border-gray-300 font-mono font-bold text-xs"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              org.verificationStatus === 'verified'
                                ? 'bg-[#E6F5F0] text-[#006B52]'
                                : org.verificationStatus === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {org.verificationStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right space-x-2 whitespace-nowrap">
                          {org.verificationStatus !== 'verified' ? (
                            <button
                              type="button"
                              onClick={() => {
                                const safe = Math.min(35, Math.max(5, Number(commVal) || 15));
                                verifyOrganizer(org.id, true, safe, 'verified');
                                setAdminNotice(
                                  `Verified ${org.brandName} at ${safe}% partner commission.`
                                );
                              }}
                              className="px-4 py-1.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold cursor-pointer"
                            >
                              Approve KYC
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const safe = Math.min(35, Math.max(5, Number(commVal) || 15));
                                  verifyOrganizer(org.id, true, safe, 'verified');
                                  setAdminNotice(
                                    `Saved ${safe}% commission for ${org.brandName}.`
                                  );
                                }}
                                className="px-3.5 py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
                              >
                                Save %
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  verifyOrganizer(org.id, false, commVal, 'suspended');
                                  setAdminNotice(`Suspended ${org.brandName}.`);
                                }}
                                className="px-3.5 py-1.5 rounded-full border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-50 cursor-pointer"
                              >
                                Suspend
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Tour Moderation & Price-Match Claims */}
        {activeTab === 'tours' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-amber-200 p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Direct-Price Parity Claims ({openClaims.length} open)
              </h2>

              {priceClaims.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No direct-price parity claims submitted.
                </p>
              ) : (
                priceClaims.map((claim) => {
                  const tour = tours.find((t) => t.id === claim.tourId);
                  const org = organizers.find((o) => o.id === claim.organizerId);
                  return (
                    <div
                      key={claim.id}
                      className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-gray-900">
                          {tour?.title} ({org?.brandName})
                        </div>
                        <div className="text-gray-700">
                          Reported by <strong>{claim.touristName}</strong> ({claim.touristEmail}) ·
                          Direct price found:{' '}
                          <strong className="text-[#006B52]">
                            {formatMoney(claim.claimedPriceUsd, currency)}
                          </strong>{' '}
                          (Listed: {formatMoney(tour?.basePriceUsd ?? 0, currency)})
                        </div>
                        <div className="text-gray-500">
                          Source: {claim.competitorUrl} — “{claim.notes}”
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {claim.status === 'open' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                resolvePriceMatchClaim(claim.id, 'matched', true);
                                setAdminNotice(
                                  `Matched direct price (${formatMoney(
                                    claim.claimedPriceUsd,
                                    currency
                                  )}) on "${tour?.title}" across all active departures.`
                                );
                              }}
                              className="px-4 py-2 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-bold cursor-pointer"
                            >
                              Match Price & Update Tour
                            </button>
                            <button
                              type="button"
                              onClick={() => resolvePriceMatchClaim(claim.id, 'dismissed', false)}
                              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-bold cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full font-bold ${
                              claim.status === 'matched'
                                ? 'bg-[#E6F5F0] text-[#006B52]'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {claim.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-extrabold text-lg text-gray-900">
                All Tour Listings & Moderation Queue
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-xs">
                      <th className="py-3 px-3 font-bold">Tour Title</th>
                      <th className="py-3 px-3 font-bold">Organizer & Audit Link</th>
                      <th className="py-3 px-3 font-bold">Direct Price</th>
                      <th className="py-3 px-3 font-bold">Status</th>
                      <th className="py-3 px-3 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tours.map((t) => {
                      const org = organizers.find((o) => o.id === t.organizerId);
                      return (
                        <tr key={t.id} className="hover:bg-gray-50/80">
                          <td className="py-4 px-3">
                            <Link
                              href={`/tours/${t.slug}`}
                              className="font-bold text-gray-900 hover:text-[#008768]"
                            >
                              {t.title}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {t.durationDays} days · Max {t.maxGroupSize} pax
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-semibold text-gray-800">{org?.brandName}</div>
                            <a
                              href={org?.directSiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#008768] hover:underline inline-flex items-center gap-1"
                            >
                              Verify Direct Price <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-extrabold text-gray-900">
                              {formatMoney(t.basePriceUsd, currency)}
                            </div>
                            <div className="text-xs text-[#008768]">
                              {t.depositPercent}% Deposit
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                t.status === 'published'
                                  ? 'bg-[#E6F5F0] text-[#006B52]'
                                  : t.status === 'pending_review'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {t.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right whitespace-nowrap">
                            {t.status !== 'published' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  moderateTour(t.id, 'published');
                                  setAdminNotice(`Approved & published "${t.title}".`);
                                }}
                                className="px-4 py-1.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold cursor-pointer"
                              >
                                Approve & Publish
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  moderateTour(t.id, 'draft');
                                  setAdminNotice(`Moved "${t.title}" to draft.`);
                                }}
                                className="px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold hover:border-gray-900 cursor-pointer"
                              >
                                Unpublish
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Master Bookings & Escrow Ledger */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-lg text-gray-900">
                  Master Bookings, Escrow & Free-Cancellation Refunds
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Refunding returns 100% of the online deposit, restores departure seats, and updates operator KPIs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search code, traveler, tour..."
                    className="pl-8 pr-3 py-2 rounded-full border border-gray-300 text-xs focus:outline-none focus:border-[#008768]"
                  />
                </div>
                {['all', 'confirmed', 'completed', 'refunded'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBookingStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition cursor-pointer ${
                      bookingStatusFilter === st
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No bookings match your search filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-xs">
                      <th className="py-3 px-3 font-bold">Booking / Ref</th>
                      <th className="py-3 px-3 font-bold">Traveler</th>
                      <th className="py-3 px-3 font-bold">Organizer & Tour</th>
                      <th className="py-3 px-3 font-bold">Financial Split</th>
                      <th className="py-3 px-3 font-bold">Status</th>
                      <th className="py-3 px-3 text-right font-bold">Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((bk) => {
                      const org = organizers.find((o) => o.id === bk.organizerId);
                      const tour = tours.find((t) => t.id === bk.tourId);
                      return (
                        <tr key={bk.id} className="hover:bg-gray-50/80">
                          <td className="py-4 px-3">
                            <div className="font-mono font-bold text-gray-900">
                              {bk.bookingCode}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {bk.paymentGateway.toUpperCase()} · {bk.paymentGatewayRef}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-bold text-gray-900">
                              {bk.leadTravelerName} ({bk.paxCount} pax)
                            </div>
                            <div className="text-xs text-gray-500">{bk.leadEmail}</div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-semibold text-[#006B52]">{org?.brandName}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {tour?.title}
                            </div>
                          </td>
                          <td className="py-4 px-3 text-xs">
                            <div>
                              Total: <strong>{formatMoney(bk.totalAmountUsd, currency)}</strong>
                            </div>
                            <div className="text-[#008768] font-semibold">
                              Deposit: {formatMoney(bk.depositAmountUsd, currency)}
                            </div>
                            <div className="text-gray-600">
                              Fee: {formatMoney(bk.platformCommissionUsd, currency)}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                bk.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : bk.status === 'confirmed'
                                  ? 'bg-[#E6F5F0] text-[#006B52]'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {bk.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-right">
                            {bk.status === 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const res = refundBooking(bk.id);
                                  setAdminNotice(res.message);
                                }}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Refund Deposit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Verified Reviews Audit */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="font-display font-extrabold text-lg text-gray-900">
              Verified Traveler Reviews Audit ({reviews.length})
            </h2>
            <div className="space-y-3">
              {reviews.map((rev) => {
                const bk = bookings.find((b) => b.id === rev.bookingId);
                const org = organizers.find((o) => o.id === rev.organizerId);
                const tour = tours.find((t) => t.id === rev.tourId);
                return (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#F7F8F9] border border-gray-200 text-xs space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-gray-900">
                        {rev.authorName} ({rev.authorCountry}) · ★ {rev.ratingOverall}.0 ·{' '}
                        <span className="text-gray-500 font-normal">
                          Trip {formatShortDate(rev.tripDate)}
                        </span>
                      </div>
                      <span className="font-mono text-[#006B52] font-bold">
                        ✓ Linked Booking: {bk?.bookingCode || rev.bookingId}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      Organizer: <strong className="text-gray-800">{org?.brandName}</strong> · Tour:{' '}
                      <strong className="text-gray-800">{tour?.title}</strong>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
