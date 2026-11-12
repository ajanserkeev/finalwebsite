'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  TrendingUp,
  Wallet,
  Calendar,
  CheckCircle2,
  Plus,
  Download,
  MessageSquare,
  Sparkles,
  ExternalLink,
  AlertCircle,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  formatMoney,
  KyrgyzstanRegion,
  ActivityType,
  DifficultyLevel,
  ComfortLevel,
  REGION_META,
  ACTIVITY_META,
} from '@/types/marketplace';

/** S-006: Dedicated Tour Operator / Partner Portal */
export default function PartnerPortalPage() {
  const {
    organizers,
    tours,
    departures,
    bookings,
    reviews,
    currency,
    activePartnerId,
    setActivePartnerId,
    adjustDepartureSeats,
    addDeparture,
    createTour,
    markBookingCompleted,
    replyToReview,
  } = useMarketplace();

  const currentOrganizer =
    organizers.find((o) => o.id === activePartnerId) || organizers[0];

  const [activeTab, setActiveTab] = useState<
    'departures' | 'bookings' | 'tours' | 'reviews'
  >('departures');
  const [manifestDepartureId, setManifestDepartureId] = useState<string | null>(null);
  const [quotaAlert, setQuotaAlert] = useState<{ ok: boolean; msg: string } | null>(null);

  // New Departure Form State
  const [showAddDeparture, setShowAddDeparture] = useState(false);
  const [newDepTourId, setNewDepTourId] = useState<string>('');
  const [newDepStart, setNewDepStart] = useState('2027-08-10');
  const [newDepEnd, setNewDepEnd] = useState('2027-08-16');
  const [newDepPrice, setNewDepPrice] = useState('750');
  const [newDepSeats, setNewDepSeats] = useState('12');
  const [newDepGuaranteed, setNewDepGuaranteed] = useState(true);

  // New Tour Builder State (F-010)
  const [showTourBuilder, setShowTourBuilder] = useState(false);
  const [newTourTitle, setNewTourTitle] = useState('');
  const [newTourSubtitle, setNewTourSubtitle] = useState('');
  const [newTourRegion, setNewTourRegion] = useState<KyrgyzstanRegion>('song-kul');
  const [newTourActivity, setNewTourActivity] = useState<ActivityType>('jeep-4wd');
  const [newTourDays, setNewTourDays] = useState('5');
  const [newTourDifficulty, setNewTourDifficulty] = useState<DifficultyLevel>(2);
  const [newTourComfort, setNewTourComfort] = useState<ComfortLevel>('standard_guesthouse');
  const [newTourPrice, setNewTourPrice] = useState('590');
  const [newTourMaxPax, setNewTourMaxPax] = useState('10');
  const [newTourRoute, setNewTourRoute] = useState(
    'Bishkek → Kochkor → Song-Kul Lake → Karakol → Bishkek'
  );
  const [directPriceCovenant, setDirectPriceCovenant] = useState(true);

  // Reply to Review State
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  // R-012: Strictly scope all data to currentOrganizer.id
  const myTours = tours.filter((t) => t.organizerId === currentOrganizer.id);
  const myTourIds = new Set(myTours.map((t) => t.id));
  const myDepartures = departures
    .filter((d) => myTourIds.has(d.tourId))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const myBookings = bookings.filter((b) => b.organizerId === currentOrganizer.id);
  const myReviews = reviews.filter((r) => r.organizerId === currentOrganizer.id);

  // C-006 / R-009 Live Sales & Signup Calculations
  const activeBookings = myBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'completed'
  );
  const totalToursSold = currentOrganizer.toursSoldCount;
  const totalPeopleSignedUp = currentOrganizer.peopleSignedUpCount;
  const grossSalesVolumeUsd = activeBookings.reduce((sum, b) => sum + b.totalAmountUsd, 0);
  const totalDepositsCollectedUsd = activeBookings.reduce(
    (sum, b) => sum + b.depositAmountUsd,
    0
  );
  const totalBalanceToCollectOnArrivalUsd = activeBookings.reduce(
    (sum, b) => sum + b.balanceDueToOrganizerUsd,
    0
  );
  const totalPlatformCommissionUsd = activeBookings.reduce(
    (sum, b) => sum + b.platformCommissionUsd,
    0
  );

  const handleSeatChange = (depId: string, nextSeats: number) => {
    setQuotaAlert(null);
    const res = adjustDepartureSeats(depId, nextSeats);
    if (!res.ok) {
      setQuotaAlert({ ok: false, msg: res.error || 'Cannot adjust seats.' });
    } else {
      setQuotaAlert({
        ok: true,
        msg: `Updated departure capacity to ${nextSeats} seats. Public Tour Page synced immediately!`,
      });
    }
  };

  const handleAddDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTourId = newDepTourId || myTours[0]?.id;
    if (!targetTourId) return;
    addDeparture({
      tourId: targetTourId,
      startDate: newDepStart,
      endDate: newDepEnd,
      priceUsd: Number(newDepPrice) || 500,
      maxSeats: Number(newDepSeats) || 10,
      isGuaranteed: newDepGuaranteed,
      guideLanguages: ['EN', 'RU'],
      cutoffHours: 24,
    });
    setShowAddDeparture(false);
    setQuotaAlert({
      ok: true,
      msg: `Added new group departure (${newDepStart} → ${newDepEnd})!`,
    });
  };

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTourTitle.trim() || !directPriceCovenant) return;
    createTour({
      organizerId: currentOrganizer.id,
      title: newTourTitle.trim(),
      subtitle:
        newTourSubtitle.trim() ||
        'Direct-from-organizer small-group expedition in Kyrgyzstan.',
      regions: [newTourRegion],
      activityTypes: [newTourActivity],
      durationDays: Number(newTourDays) || 5,
      difficultyLevel: newTourDifficulty,
      comfortLevel: newTourComfort,
      maxGroupSize: Number(newTourMaxPax) || 10,
      minParticipants: 4,
      basePriceUsd: Number(newTourPrice) || 550,
      depositPercent: 20,
      freeCancellationDays: 14,
      heroImageUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      routeSummary: newTourRoute,
      accommodationDetails:
        'Verified guesthouses & heated felt yurt camps with warm meals included.',
      transportDetails: 'Prepared 4WD SUV / Sprinter fleet.',
      inclusions: [
        '4WD Transport & fuel',
        'All accommodation & meals',
        'Certified English/Russian mountain guide',
        'National park permits',
      ],
      exclusions: ['International flights', 'Personal insurance'],
    });
    setNewTourTitle('');
    setNewTourSubtitle('');
    setShowTourBuilder(false);
    setQuotaAlert({
      ok: true,
      msg: 'New tour submitted to Platform Admin for Direct-Price Parity verification (Rule R-013)! Switch to the Admin Panel to approve and publish it.',
    });
  };

  const exportManifestCsv = (depId: string) => {
    const dep = myDepartures.find((d) => d.id === depId);
    const depBookings = myBookings.filter(
      (b) => b.departureId === depId && (b.status === 'confirmed' || b.status === 'completed')
    );
    const header =
      'BookingCode,LeadTraveler,Country,PaxCount,Phone,Email,TotalUSD,DepositPaidUSD,BalanceToCollectOnDay1USD,DietaryNotes\n';
    const rows = depBookings
      .map(
        (b) =>
          `"${b.bookingCode}","${b.leadTravelerName}","${b.leadCountry}",${b.paxCount},"${b.leadPhone}","${b.leadEmail}",${b.totalAmountUsd},${b.depositAmountUsd},${b.balanceDueToOrganizerUsd},"${(
            b.dietaryNotes || ''
          ).replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest-${dep?.startDate || depId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const manifestBookings = manifestDepartureId
    ? myBookings.filter((b) => b.departureId === manifestDepartureId)
    : [];
  const manifestDep = myDepartures.find((d) => d.id === manifestDepartureId);
  const manifestTour = tours.find((t) => t.id === manifestDep?.tourId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Partner Portal Header & Operator Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={currentOrganizer.logoUrl}
            alt={currentOrganizer.brandName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                Dedicated Tour Operator Portal (Screen S-006)
              </span>
              {currentOrganizer.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Partner ({currentOrganizer.commissionPercent}% Agency Fee)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                  Pending Admin KYC Verification (Rule R-013)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {currentOrganizer.brandName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentOrganizer.legalName} · {currentOrganizer.registrationNumber}
            </p>
          </div>
        </div>

        {/* Multi-Tenant Operator Demo Switcher (Rule R-012) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-1">
              Switch Operator Account (Rule R-012 Isolation):
            </label>
            <select
              value={currentOrganizer.id}
              onChange={(e) => {
                setActivePartnerId(e.target.value);
                setManifestDepartureId(null);
              }}
              className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600 w-full"
            >
              {organizers.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.brandName} ({org.baseCity}) — {org.toursSoldCount} sold /{' '}
                  {org.peopleSignedUpCount} pax
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/organizers/${currentOrganizer.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shrink-0"
          >
            Public Organizer Page
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* C-006: 4 Real-Time KPI Cards (Tours Sold, People Signed Up, Volume, Direct Balance) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border-2 border-teal-500/40 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>TOTAL TOURS SOLD (BOOKINGS)</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {totalToursSold}
          </div>
          <div className="text-xs text-teal-700 font-medium">
            Confirmed & completed bookings across {myTours.length} programs
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-teal-600 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-teal-800">
            <span>TOTAL PEOPLE SIGNED UP (PAX)</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-teal-700 font-mono">
            {totalPeopleSignedUp}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Total participants registered across your departures
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>GROSS TOUR SALES VOLUME</span>
            <Calendar className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {formatMoney(grossSalesVolumeUsd, currency)}
          </div>
          <div className="text-xs text-slate-500">
            Online deposits collected: {formatMoney(totalDepositsCollectedUsd, currency)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>BALANCE PAID TO YOU ON ARRIVAL</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono">
            {formatMoney(totalBalanceToCollectOnArrivalUsd, currency)}
          </div>
          <div className="text-xs text-slate-500">
            Platform agency commission ({currentOrganizer.commissionPercent}%):{' '}
            {formatMoney(totalPlatformCommissionUsd, currency)}
          </div>
        </div>
      </section>

      {quotaAlert && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            quotaAlert.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {quotaAlert.msg}
          </span>
          <button onClick={() => setQuotaAlert(null)} className="underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Partner Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          {
            id: 'departures',
            label: `1. Departures, Seat Quotas & Manifests (${myDepartures.length})`,
          },
          {
            id: 'bookings',
            label: `2. Bookings & People Signed Up (${myBookings.length})`,
          },
          {
            id: 'tours',
            label: `3. My Tour Programs & Builder (${myTours.length})`,
          },
          {
            id: 'reviews',
            label: `4. Verified Tourist Reviews & Replies (${myReviews.length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Departures, 1-Click Seat Quotas & Participant Manifests */}
      {activeTab === 'departures' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-lg text-slate-900">
                  Group Departure Dates, Seat Fill Rate & 1-Click Quota Sync
                </h2>
                <p className="text-xs text-slate-500">
                  Sold a spot directly via Instagram or WhatsApp? Use <strong>[−] / [+]</strong> to adjust capacity in 1 second so the aggregator never overbooks (Solves B-003, Enforces Rule R-011).
                </p>
              </div>
              <button
                onClick={() => {
                  setNewDepTourId(myTours[0]?.id || '');
                  setShowAddDeparture(!showAddDeparture);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Departure Date
              </button>
            </div>

            {showAddDeparture && (
              <form
                onSubmit={handleAddDeparture}
                className="p-4 rounded-xl bg-slate-50 border border-teal-200 grid grid-cols-1 sm:grid-cols-6 gap-3 items-end text-xs"
              >
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tour Program</label>
                  <select
                    value={newDepTourId}
                    onChange={(e) => setNewDepTourId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    {myTours.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newDepStart}
                    onChange={(e) => setNewDepStart(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newDepEnd}
                    onChange={(e) => setNewDepEnd(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Direct Price ($) / Max Seats
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      value={newDepPrice}
                      onChange={(e) => setNewDepPrice(e.target.value)}
                      className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="number"
                      value={newDepSeats}
                      onChange={(e) => setNewDepSeats(e.target.value)}
                      className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Save Date
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs">
                    <th className="py-3 px-3">Tour & Departure Dates</th>
                    <th className="py-3 px-3">People Signed Up / Capacity</th>
                    <th className="py-3 px-3">1-Click Capacity Sync (R-011)</th>
                    <th className="py-3 px-3">Guaranteed Status (R-004)</th>
                    <th className="py-3 px-3 text-right">Participant Manifest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myDepartures.map((dep) => {
                    const tour = myTours.find((t) => t.id === dep.tourId);
                    const fillPct = Math.min(
                      100,
                      Math.round((dep.bookedSeats / dep.maxSeats) * 100)
                    );
                    return (
                      <tr key={dep.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {tour?.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {dep.startDate} → {dep.endDate} · Direct Price:{' '}
                            <strong>{formatMoney(dep.priceUsd, currency)}</strong>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-extrabold text-slate-900">
                            {dep.bookedSeats} / {dep.maxSeats} people signed up{' '}
                            <span className="text-teal-700">
                              ({dep.seatsRemaining} seats left)
                            </span>
                          </div>
                          <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-teal-600 rounded-full"
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="Decrease available seats"
                              onClick={() => handleSeatChange(dep.id, dep.maxSeats - 1)}
                              className="w-7 h-7 rounded-lg border border-slate-300 font-bold hover:bg-slate-100"
                            >
                              −
                            </button>
                            <span className="font-mono font-bold text-xs w-12 text-center">
                              {dep.maxSeats} max
                            </span>
                            <button
                              type="button"
                              aria-label="Increase available seats"
                              onClick={() => handleSeatChange(dep.id, dep.maxSeats + 1)}
                              className="w-7 h-7 rounded-lg border border-slate-300 font-bold hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() =>
                              adjustDepartureSeats(dep.id, dep.maxSeats, !dep.isGuaranteed)
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                              dep.isGuaranteed
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            {dep.isGuaranteed ? 'Guaranteed ON' : 'Mark Guaranteed'}
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setManifestDepartureId(
                                  manifestDepartureId === dep.id ? null : dep.id
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                            >
                              View Manifest ({dep.bookedSeats} pax)
                            </button>
                            <button
                              type="button"
                              onClick={() => exportManifestCsv(dep.id)}
                              title="Download CSV Manifest for Mountain Guide"
                              className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Participant Manifest Drawer */}
          {manifestDepartureId && manifestDep && (
            <div className="bg-teal-950 text-white rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Departure Participant Manifest (For Guide & Driver)
                  </span>
                  <h3 className="font-extrabold text-lg mt-0.5">
                    {manifestTour?.title} · {manifestDep.startDate} → {manifestDep.endDate}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportManifestCsv(manifestDep.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export CSV for Guide
                  </button>
                  <button
                    onClick={() => setManifestDepartureId(null)}
                    className="px-3 py-2 rounded-xl bg-teal-900 text-teal-200 text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>

              {manifestBookings.length === 0 ? (
                <p className="text-xs text-teal-200">
                  No confirmed bookings on this departure date yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {manifestBookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="p-4 rounded-xl bg-teal-900/70 border border-teal-700 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-teal-300">
                          {bk.bookingCode} · {bk.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 font-bold">
                          {bk.paxCount} {bk.paxCount === 1 ? 'person' : 'people'} signed up
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white">
                        Lead: {bk.leadTravelerName} ({bk.leadCountry})
                      </div>
                      <div className="text-teal-200">
                        WhatsApp/Tel: <strong>{bk.leadPhone}</strong> · Email:{' '}
                        <strong>{bk.leadEmail}</strong>
                      </div>
                      <div className="text-teal-100">
                        <strong>Participants:</strong>{' '}
                        {bk.participants.map((p) => p.fullName).join(', ')}
                      </div>
                      {bk.dietaryNotes && (
                        <div className="p-2 rounded-lg bg-teal-950/60 text-amber-300">
                          <strong>Notes:</strong> {bk.dietaryNotes}
                        </div>
                      )}
                      <div className="pt-2 border-t border-teal-800 flex items-center justify-between">
                        <span>
                          Deposit Paid Online:{' '}
                          <strong>{formatMoney(bk.depositAmountUsd, currency)}</strong>
                        </span>
                        <span className="text-emerald-300 font-bold">
                          Collect on Day 1:{' '}
                          {formatMoney(bk.balanceDueToOrganizerUsd, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Bookings & People Signed Up */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">
              All Bookings & People Signed Up ({myBookings.length} bookings ·{' '}
              {totalPeopleSignedUp} participants)
            </h2>
            <p className="text-xs text-slate-500">
              Click <strong>“Mark Completed”</strong> after a tour finishes to unlock the traveler’s post-trip Verified Review token (Flow FL-003).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs">
                  <th className="py-3 px-3">Booking Code</th>
                  <th className="py-3 px-3">Lead Tourist & Contact</th>
                  <th className="py-3 px-3">Tour & Departure</th>
                  <th className="py-3 px-3">People Signed Up</th>
                  <th className="py-3 px-3">Deposit Paid / Balance Due</th>
                  <th className="py-3 px-3">Status & Review Token</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myBookings.map((bk) => {
                  const tour = tours.find((t) => t.id === bk.tourId);
                  const dep = departures.find((d) => d.id === bk.departureId);
                  return (
                    <tr key={bk.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        {bk.bookingCode}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          {bk.leadTravelerName} ({bk.leadCountry})
                        </div>
                        <div className="text-xs text-slate-500">
                          {bk.leadPhone} · {bk.leadEmail}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {tour?.title}
                        </div>
                        <div className="text-xs text-slate-500">{dep?.startDate}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-extrabold text-xs">
                          {bk.paxCount} {bk.paxCount === 1 ? 'person' : 'people'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          Total: {formatMoney(bk.totalAmountUsd, currency)}
                        </div>
                        <div className="text-xs text-emerald-700 font-semibold">
                          Collect on Day 1:{' '}
                          {formatMoney(bk.balanceDueToOrganizerUsd, currency)}
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
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          Token: {bk.reviewToken} {bk.hasReview ? '(Reviewed ✓)' : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {bk.status === 'confirmed' && (
                          <button
                            onClick={() => markBookingCompleted(bk.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                          >
                            Mark Completed
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

      {/* TAB 3: My Tour Programs & Self-Service Tour Builder */}
      {activeTab === 'tours' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-lg text-slate-900">
                  My Tour Programs ({myTours.length})
                </h2>
                <p className="text-xs text-slate-500">
                  All tours are governed by the Direct-Price Parity Covenant (0% markup over your direct website/Instagram price).
                </p>
              </div>
              <button
                onClick={() => setShowTourBuilder(!showTourBuilder)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create New Tour Program
              </button>
            </div>

            {showTourBuilder && (
              <form
                onSubmit={handleCreateTour}
                className="p-5 rounded-2xl bg-slate-50 border border-teal-200 space-y-4 text-xs"
              >
                <div className="font-bold text-sm text-slate-900">
                  Submit New Direct-Price Tour Program (Rule R-002 & R-013)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tour Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5-Day Chatyr-Kul & Tash-Rabat Horseback Expedition"
                      value={newTourTitle}
                      onChange={(e) => setNewTourTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Route Summary *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTourRoute}
                      onChange={(e) => setNewTourRoute(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Region</label>
                    <select
                      value={newTourRegion}
                      onChange={(e) => setNewTourRegion(e.target.value as KyrgyzstanRegion)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((r) => (
                        <option key={r} value={r}>
                          {REGION_META[r].name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Activity</label>
                    <select
                      value={newTourActivity}
                      onChange={(e) => setNewTourActivity(e.target.value as ActivityType)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      {(Object.keys(ACTIVITY_META) as ActivityType[]).map((a) => (
                        <option key={a} value={a}>
                          {ACTIVITY_META[a].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Days</label>
                    <input
                      type="number"
                      value={newTourDays}
                      onChange={(e) => setNewTourDays(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Difficulty (1–5)
                    </label>
                    <select
                      value={newTourDifficulty}
                      onChange={(e) =>
                        setNewTourDifficulty(Number(e.target.value) as DifficultyLevel)
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      {[1, 2, 3, 4, 5].map((d) => (
                        <option key={d} value={d}>
                          Level {d}/5
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Direct Price (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newTourPrice}
                      onChange={(e) => setNewTourPrice(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Short Description & Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={newTourSubtitle}
                    onChange={(e) => setNewTourSubtitle(e.target.value)}
                    placeholder="Describe the route, yurts, and highlights..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-teal-900">
                  <input
                    type="checkbox"
                    checked={directPriceCovenant}
                    onChange={(e) => setDirectPriceCovenant(e.target.checked)}
                    className="rounded border-teal-400 text-teal-600"
                  />
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  I confirm this price (${newTourPrice}) matches our official direct booking price with zero markup added (Rule R-002).
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTourBuilder(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
                  >
                    Submit Tour for Admin Parity Approval
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTours.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          t.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {t.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t.durationDays} days · Max {t.maxGroupSize} pax
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{t.title}</h3>
                    <div className="text-xs font-semibold text-teal-700">
                      Direct Price: {formatMoney(t.basePriceUsd, currency)} · Online Deposit:{' '}
                      {t.depositPercent}%
                    </div>
                  </div>
                  <Link
                    href={`/tours/${t.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold shrink-0"
                  >
                    Preview
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Verified Reviews & Official Reply Console */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Verified Tourist Reviews & Official Organizer Reply Console ({myReviews.length})
            </h2>
            <p className="text-xs text-slate-500">
              Post an official reply to any verified tourist review — your reply appears publicly on both the Tour page and your Organizer profile.
            </p>
          </div>

          <div className="space-y-4">
            {myReviews.map((rev) => {
              const tour = tours.find((t) => t.id === rev.tourId);
              const draftReply =
                replyTexts[rev.id] !== undefined
                  ? replyTexts[rev.id]
                  : rev.organizerReply || '';

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {rev.authorName} ({rev.authorCountry}) · ★ {rev.ratingOverall}.0
                      </div>
                      <div className="text-xs text-slate-500">
                        Tour: <strong>{tour?.title}</strong> · Trip Date: {rev.tripDate}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700">{rev.comment}</p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={draftReply}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({ ...prev, [rev.id]: e.target.value }))
                      }
                      placeholder={`Write official reply from ${currentOrganizer.brandName}...`}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (draftReply.trim()) {
                          replyToReview(rev.id, draftReply.trim());
                          setQuotaAlert({
                            ok: true,
                            msg: `Published official reply to ${rev.authorName}'s review!`,
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      {rev.organizerReply ? 'Update Reply' : 'Post Official Reply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

