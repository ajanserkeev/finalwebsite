'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatMoney } from '@/types/marketplace';

/** S-007: Separate Platform Admin Panel */
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Platform Admin Control Center (Screen S-007)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            NomadBridge KG — Marketplace Governance & Escrow Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify Kyrgyz tour operators (Rule R-013), audit 0% markup direct-price parity (Rule R-002), manage agency commissions, and process free-cancellation deposit refunds (Rule R-010).
          </p>
        </div>
      </div>

      {/* Global Marketplace KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total GMV</div>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
            {formatMoney(totalGmvUsd, currency)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase">
            Deposits Collected
          </div>
          <div className="text-xl font-extrabold text-teal-700 font-mono mt-1">
            {formatMoney(totalOnlineDepositsUsd, currency)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40">
          <div className="text-[11px] font-bold text-emerald-800 uppercase">
            Platform Commission
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">
            {formatMoney(totalPlatformCommissionUsd, currency)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Tours Sold</div>
          <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
            {totalToursSold}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase">
            People Signed Up
          </div>
          <div className="text-xl font-extrabold text-teal-700 font-mono mt-1">
            {totalPeopleSignedUp} pax
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
          <div className="text-[11px] font-bold text-amber-800 uppercase">
            Pending Approvals
          </div>
          <div className="text-xl font-extrabold text-amber-700 font-mono mt-1">
            {pendingOrganizers.length + pendingTours.length + openClaims.length}
          </div>
        </div>
      </section>

      {adminNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {adminNotice}
          </span>
          <button onClick={() => setAdminNotice(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          {
            id: 'organizers',
            label: `1. Organizer KYC & Commission (${organizers.length})`,
            badge: pendingOrganizers.length,
          },
          {
            id: 'tours',
            label: `2. Tour Moderation & Direct-Price Parity (${tours.length})`,
            badge: pendingTours.length + openClaims.length,
          },
          {
            id: 'ledger',
            label: `3. Master Bookings, Deposit Escrow & Refunds (${bookings.length})`,
            badge: 0,
          },
          {
            id: 'reviews',
            label: `4. Verified Reviews Audit (${reviews.length})`,
            badge: 0,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Organizer KYC Verification & Commission Rate Setting */}
      {activeTab === 'organizers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">
              Tour Organizers KYC Verification & Agency Commission (Rule R-013)
            </h2>
            <p className="text-xs text-slate-500">
              Unverified organizers remain hidden from the public catalog until you verify their Kyrgyz legal registration (ОсОО / ИП) and direct-price contract.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs">
                  <th className="py-3 px-3">Organizer & Legal Registration</th>
                  <th className="py-3 px-3">Base City & Direct URL</th>
                  <th className="py-3 px-3">Sales & Signups</th>
                  <th className="py-3 px-3">Agency Commission %</th>
                  <th className="py-3 px-3">Verification Status</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizers.map((org) => {
                  const commVal =
                    commissionInputs[org.id] !== undefined
                      ? commissionInputs[org.id]
                      : org.commissionPercent;
                  return (
                    <tr key={org.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{org.brandName}</div>
                        <div className="text-xs text-slate-500">{org.legalName}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {org.registrationNumber}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{org.baseCity}</div>
                        <a
                          href={org.directSiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1"
                        >
                          Direct Site <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          {org.toursSoldCount} tours sold
                        </div>
                        <div className="text-xs text-teal-700 font-semibold">
                          {org.peopleSignedUpCount} people signed up
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={5}
                            max={30}
                            value={commVal}
                            onChange={(e) =>
                              setCommissionInputs((prev) => ({
                                ...prev,
                                [org.id]: Number(e.target.value),
                              }))
                            }
                            className="w-16 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-xs"
                          />
                          <span className="text-xs text-slate-500">%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            org.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : org.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {org.verificationStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2">
                        {org.verificationStatus !== 'verified' ? (
                          <button
                            onClick={() => {
                              verifyOrganizer(org.id, true, commVal, 'verified');
                              setAdminNotice(
                                `Verified ${org.brandName} (${commVal}% agency commission). Their profile and approved tours are now live!`
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Approve & Verify KYC
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                verifyOrganizer(org.id, true, commVal, 'verified');
                                setAdminNotice(
                                  `Updated ${org.brandName} commission to ${commVal}%.`
                                );
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                            >
                              Save %
                            </button>
                            <button
                              onClick={() => {
                                verifyOrganizer(org.id, false, commVal, 'suspended');
                                setAdminNotice(`Suspended ${org.brandName}.`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50 cursor-pointer"
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

      {/* TAB 2: Tour Moderation & Direct-Price Parity Audit */}
      {activeTab === 'tours' && (
        <div className="space-y-6">
          {/* Price-Match Claims Queue (Rule R-002) */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 space-y-4">
            <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              Direct-Price Parity Claims Queue (Rule R-002)
            </h2>
            {priceClaims.map((claim) => {
              const tour = tours.find((t) => t.id === claim.tourId);
              const org = organizers.find((o) => o.id === claim.organizerId);
              return (
                <div
                  key={claim.id}
                  className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">
                      Tour: {tour?.title} ({org?.brandName})
                    </div>
                    <div className="text-slate-600">
                      Submitted by <strong>{claim.touristName}</strong> ({claim.touristEmail}) ·
                      Found direct price:{' '}
                      <strong className="text-emerald-700">${claim.claimedPriceUsd}</strong>{' '}
                      (Current listed: ${tour?.basePriceUsd})
                    </div>
                    <div className="text-slate-500">
                      Direct URL: {claim.competitorUrl} — “{claim.notes}”
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {claim.status === 'open' ? (
                      <>
                        <button
                          onClick={() => {
                            resolvePriceMatchClaim(claim.id, 'matched', true);
                            setAdminNotice(
                              `Matched direct price ($${claim.claimedPriceUsd}) on "${tour?.title}" across all active departures (Rule R-002)!`
                            );
                          }}
                          className="px-3 py-2 rounded-xl bg-teal-600 text-white font-bold cursor-pointer"
                        >
                          Match Price (${claim.claimedPriceUsd}) & Update Tour
                        </button>
                        <button
                          onClick={() => resolvePriceMatchClaim(claim.id, 'dismissed', false)}
                          className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {claim.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tour Approval Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-extrabold text-lg text-slate-900">
              All Tour Listings & Direct-Price Moderation Queue
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs">
                    <th className="py-3 px-3">Tour Title</th>
                    <th className="py-3 px-3">Organizer & Direct Site</th>
                    <th className="py-3 px-3">Direct Price & Deposit</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tours.map((t) => {
                    const org = organizers.find((o) => o.id === t.organizerId);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-3">
                          <Link
                            href={`/tours/${t.slug}`}
                            className="font-bold text-slate-900 hover:text-teal-700"
                          >
                            {t.title}
                          </Link>
                          <div className="text-xs text-slate-500">
                            {t.durationDays} days · Max {t.maxGroupSize} pax
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-800">{org?.brandName}</div>
                          <a
                            href={org?.directSiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1"
                          >
                            Audit Direct Price <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-extrabold text-slate-900">
                            {formatMoney(t.basePriceUsd, currency)}
                          </div>
                          <div className="text-xs text-teal-700">
                            {t.depositPercent}% Online Deposit
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              t.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {t.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          {t.status !== 'published' ? (
                            <button
                              onClick={() => {
                                moderateTour(t.id, 'published');
                                setAdminNotice(
                                  `Approved & published "${t.title}" after verifying direct-price parity!`
                                );
                              }}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                            >
                              Approve & Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                moderateTour(t.id, 'draft');
                                setAdminNotice(`Moved "${t.title}" back to draft.`);
                              }}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
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

      {/* TAB 3: Master Bookings, Deposit Escrow & Refund Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">
              Master Bookings, Online Deposit Escrow & Free-Cancellation Refunds (Rule R-010)
            </h2>
            <p className="text-xs text-slate-500">
              Triggering a Free-Cancellation Refund returns 100% of the online deposit, restores the seats to the departure inventory, and updates the operator’s counters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs">
                  <th className="py-3 px-3">Booking / Gateway Ref</th>
                  <th className="py-3 px-3">Tourist & Pax</th>
                  <th className="py-3 px-3">Organizer & Tour</th>
                  <th className="py-3 px-3">Financial Split</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Refund Action (R-010)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((bk) => {
                  const org = organizers.find((o) => o.id === bk.organizerId);
                  const tour = tours.find((t) => t.id === bk.tourId);
                  return (
                    <tr key={bk.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-slate-900">
                          {bk.bookingCode}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {bk.paymentGateway.toUpperCase()} · {bk.paymentGatewayRef}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          {bk.leadTravelerName} ({bk.paxCount} pax)
                        </div>
                        <div className="text-xs text-slate-500">{bk.leadEmail}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-teal-800">{org?.brandName}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {tour?.title}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs">
                        <div>
                          Total: <strong>{formatMoney(bk.totalAmountUsd, currency)}</strong>
                        </div>
                        <div className="text-teal-700 font-semibold">
                          Deposit Paid: {formatMoney(bk.depositAmountUsd, currency)}
                        </div>
                        <div className="text-emerald-700 font-semibold">
                          Commission: {formatMoney(bk.platformCommissionUsd, currency)}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            bk.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : bk.status === 'confirmed'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {bk.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {bk.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              const res = refundBooking(bk.id);
                              setAdminNotice(res.message);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Refund Deposit & Restore Seats
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
      )}

      {/* TAB 4: Verified Reviews Audit */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-extrabold text-lg text-slate-900">
            Verified Tourist Reviews Audit Log (Rule R-007 & R-008)
          </h2>
          <div className="space-y-3">
            {reviews.map((rev) => {
              const bk = bookings.find((b) => b.id === rev.bookingId);
              const org = organizers.find((o) => o.id === rev.organizerId);
              const tour = tours.find((t) => t.id === rev.tourId);
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-slate-900">
                      {rev.authorName} ({rev.authorCountry}) · ★ {rev.ratingOverall}.0
                    </div>
                    <span className="font-mono text-emerald-700 font-bold">
                      ✓ Linked Booking: {bk?.bookingCode || rev.bookingId}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Organizer: <strong>{org?.brandName}</strong> · Tour:{' '}
                    <strong>{tour?.title}</strong>
                  </div>
                  <p className="text-slate-700">{rev.comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

