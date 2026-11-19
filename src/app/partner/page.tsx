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
  X,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  formatMoney,
  formatDateRange,
  formatShortDate,
  KyrgyzstanRegion,
  ActivityType,
  DifficultyLevel,
  ComfortLevel,
  REGION_META,
  ACTIVITY_META,
  COMFORT_META,
} from '@/types/marketplace';

function addDaysToIso(isoDate: string, daysToAdd: number): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return isoDate;
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  dt.setUTCDate(dt.getUTCDate() + Math.max(0, daysToAdd));
  return dt.toISOString().slice(0, 10);
}

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

  // Add Departure Form State
  const [showAddDeparture, setShowAddDeparture] = useState(false);
  const [newDepTourId, setNewDepTourId] = useState<string>('');
  const [newDepStart, setNewDepStart] = useState('2027-08-10');
  const [newDepEnd, setNewDepEnd] = useState('2027-08-16');
  const [newDepPrice, setNewDepPrice] = useState('750');
  const [newDepSeats, setNewDepSeats] = useState('12');
  const [newDepGuaranteed, setNewDepGuaranteed] = useState(true);

  // Tour Builder State
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
  const [tourBuilderError, setTourBuilderError] = useState<string | null>(null);

  // Reply to Review State
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  // Strictly scope all data to currentOrganizer
  const myTours = tours.filter((t) => t.organizerId === currentOrganizer.id);
  const myTourIds = new Set(myTours.map((t) => t.id));
  const myDepartures = departures
    .filter((d) => myTourIds.has(d.tourId))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const myBookings = bookings.filter((b) => b.organizerId === currentOrganizer.id);
  const myReviews = reviews.filter((r) => r.organizerId === currentOrganizer.id);

  // Live Sales & Signup Calculations
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

  const openAddDepartureForm = () => {
    const firstTour = myTours[0];
    if (firstTour) {
      setNewDepTourId(firstTour.id);
      setNewDepPrice(String(firstTour.basePriceUsd));
      setNewDepSeats(String(firstTour.maxGroupSize));
      setNewDepEnd(addDaysToIso(newDepStart, Math.max(0, firstTour.durationDays - 1)));
    }
    setShowAddDeparture(!showAddDeparture);
  };

  const handleSelectDepTour = (tourId: string) => {
    setNewDepTourId(tourId);
    const matched = myTours.find((t) => t.id === tourId);
    if (matched) {
      setNewDepPrice(String(matched.basePriceUsd));
      setNewDepSeats(String(matched.maxGroupSize));
      setNewDepEnd(addDaysToIso(newDepStart, Math.max(0, matched.durationDays - 1)));
    }
  };

  const handleSelectDepStart = (start: string) => {
    setNewDepStart(start);
    const matched = myTours.find((t) => t.id === (newDepTourId || myTours[0]?.id));
    if (matched) {
      setNewDepEnd(addDaysToIso(start, Math.max(0, matched.durationDays - 1)));
    }
  };

  const handleSeatChange = (depId: string, nextSeats: number) => {
    setQuotaAlert(null);
    const res = adjustDepartureSeats(depId, nextSeats);
    if (!res.ok) {
      setQuotaAlert({ ok: false, msg: res.error || 'Cannot adjust seats.' });
    } else {
      setQuotaAlert({
        ok: true,
        msg: `Updated departure capacity to ${nextSeats} seats. Live calendar synced immediately.`,
      });
    }
  };

  const handleAddDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTourId = newDepTourId || myTours[0]?.id;
    if (!targetTourId) {
      setQuotaAlert({
        ok: false,
        msg: 'Create a tour program first before scheduling departure dates.',
      });
      return;
    }
    const res = addDeparture({
      tourId: targetTourId,
      startDate: newDepStart,
      endDate: newDepEnd,
      priceUsd: Number(newDepPrice),
      maxSeats: Number(newDepSeats),
      isGuaranteed: newDepGuaranteed,
      guideLanguages: ['EN', 'RU'],
      cutoffHours: 24,
    });
    if (!res.ok) {
      setQuotaAlert({ ok: false, msg: res.error || 'Invalid departure dates or values.' });
      return;
    }
    setShowAddDeparture(false);
    setQuotaAlert({
      ok: true,
      msg: `Published new departure (${formatDateRange(newDepStart, newDepEnd)}) to your live calendar.`,
    });
  };

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    setTourBuilderError(null);
    if (!newTourTitle.trim()) {
      setTourBuilderError('Please enter a tour title.');
      return;
    }
    if (!directPriceCovenant) {
      setTourBuilderError(
        'You must confirm the 0% Markup Direct-Price Parity agreement before submitting.'
      );
      return;
    }
    createTour({
      organizerId: currentOrganizer.id,
      title: newTourTitle.trim(),
      subtitle:
        newTourSubtitle.trim() ||
        'Direct-from-organizer small-group expedition in Kyrgyzstan.',
      regions: [newTourRegion],
      activityTypes: [newTourActivity],
      durationDays: Math.max(1, Number(newTourDays) || 5),
      difficultyLevel: newTourDifficulty,
      comfortLevel: newTourComfort,
      maxGroupSize: Math.max(2, Number(newTourMaxPax) || 10),
      minParticipants: 4,
      basePriceUsd: Math.max(25, Number(newTourPrice) || 550),
      depositPercent: 20,
      freeCancellationDays: 14,
      routeSummary: newTourRoute,
      accommodationDetails: COMFORT_META[newTourComfort].description,
      transportDetails: 'Prepared 4WD SUV / Sprinter mountain fleet.',
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
      msg: 'Tour submitted to Platform Admin for Direct-Price Parity approval.',
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
  const manifestPlatformPax = manifestBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((s, b) => s + b.paxCount, 0);
  const manifestOfflinePax = manifestDep
    ? Math.max(0, manifestDep.bookedSeats - manifestPlatformPax)
    : 0;

  return (
    <div className="bg-[#F7F8F9] min-h-screen pb-16">
      {/* Viator Supplier Management Center Header */}
      <div className="bg-[#004F32] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentOrganizer.logoUrl}
              alt={currentOrganizer.brandName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 text-xs font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  Tour Operator Partner Portal
                </span>
                {currentOrganizer.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified · {currentOrganizer.commissionPercent}% Partner Fee
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-200 text-xs font-bold">
                    Pending Admin KYC Verification
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
                {currentOrganizer.brandName}
              </h1>
              <p className="text-xs text-emerald-100/75 mt-0.5">
                {currentOrganizer.legalName} · {currentOrganizer.registrationNumber}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="bg-black/20 p-2.5 rounded-2xl border border-white/15">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
                Switch Operator Account
              </label>
              <select
                value={currentOrganizer.id}
                onChange={(e) => {
                  setActivePartnerId(e.target.value);
                  setManifestDepartureId(null);
                  setShowAddDeparture(false);
                  setShowTourBuilder(false);
                  setQuotaAlert(null);
                }}
                className="bg-[#0C1D17] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 w-full cursor-pointer"
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
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-white text-[#004F32] hover:bg-emerald-50 text-xs font-bold transition shrink-0"
            >
              Public Storefront
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5 space-y-6">
        {/* 4 Executive Real-Time KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>TOTAL TOURS SOLD</span>
              <div className="w-8 h-8 rounded-xl bg-[#E6F5F0] text-[#008768] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-gray-900">
              {totalToursSold}
            </div>
            <div className="text-xs text-[#006B52] font-semibold">
              Confirmed & completed bookings across {myTours.length} tours
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#008768] shadow-sm p-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#006B52]">
              <span>PEOPLE SIGNED UP (PAX)</span>
              <div className="w-8 h-8 rounded-xl bg-[#008768] text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-[#008768]">
              {totalPeopleSignedUp}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              Total travelers registered on your departures
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>GROSS BOOKING VOLUME</span>
              <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-gray-900">
              {formatMoney(grossSalesVolumeUsd, currency)}
            </div>
            <div className="text-xs text-gray-500">
              Online deposits held: {formatMoney(totalDepositsCollectedUsd, currency)}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>COLLECT ON ARRIVAL (80%)</span>
              <div className="w-8 h-8 rounded-xl bg-[#E6F5F0] text-[#008768] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-[#006B52]">
              {formatMoney(totalBalanceToCollectOnArrivalUsd, currency)}
            </div>
            <div className="text-xs text-gray-500">
              Partner commission ({currentOrganizer.commissionPercent}%):{' '}
              {formatMoney(totalPlatformCommissionUsd, currency)}
            </div>
          </div>
        </section>

        {quotaAlert && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
              quotaAlert.ok
                ? 'bg-[#E6F5F0] border-[#008768]/30 text-[#004F32]'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {quotaAlert.msg}
            </span>
            <button
              onClick={() => setQuotaAlert(null)}
              className="p-1 hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'departures', label: `Departures & Quotas (${myDepartures.length})` },
            { id: 'bookings', label: `Bookings & Travelers (${myBookings.length})` },
            { id: 'tours', label: `My Tour Programs (${myTours.length})` },
            { id: 'reviews', label: `Verified Reviews (${myReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Departures, 1-Click Seat Quotas & Participant Manifests */}
        {activeTab === 'departures' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-gray-900">
                    Group Departures & Live Seat Quotas
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Sold seats directly via WhatsApp or Instagram? Adjust max capacity in 1 click so you never overbook.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddDepartureForm}
                  disabled={myTours.length === 0}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Departure Date
                </button>
              </div>

              {myTours.length === 0 && (
                <div className="p-8 rounded-2xl bg-[#F7F8F9] border border-gray-200 text-center space-y-3">
                  <p className="font-bold text-sm text-gray-900">
                    No tour programs created yet for {currentOrganizer.brandName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Create your first direct-price tour program to start scheduling departure dates.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('tours');
                      setShowTourBuilder(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#008768] text-white text-xs font-bold cursor-pointer"
                  >
                    Create First Tour Program
                  </button>
                </div>
              )}

              {showAddDeparture && myTours.length > 0 && (
                <form
                  onSubmit={handleAddDeparture}
                  className="p-5 rounded-2xl bg-[#F0FAF6] border border-[#008768]/25 space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                    <div className="lg:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Tour Program</label>
                      <select
                        value={newDepTourId}
                        onChange={(e) => handleSelectDepTour(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-semibold"
                      >
                        {myTours.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} ({t.durationDays}d · ${t.basePriceUsd})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={newDepStart}
                        onChange={(e) => handleSelectDepStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={newDepEnd}
                        onChange={(e) => setNewDepEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        Price (USD) / Seats
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          required
                          min={10}
                          value={newDepPrice}
                          onChange={(e) => setNewDepPrice(e.target.value)}
                          className="w-1/2 px-2.5 py-2 rounded-xl border border-gray-300 bg-white font-bold"
                        />
                        <input
                          type="number"
                          required
                          min={1}
                          max={40}
                          value={newDepSeats}
                          onChange={(e) => setNewDepSeats(e.target.value)}
                          className="w-1/2 px-2.5 py-2 rounded-xl border border-gray-300 bg-white font-bold"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-bold cursor-pointer"
                    >
                      Save Date
                    </button>
                  </div>

                  <label className="inline-flex items-center gap-2 font-semibold text-[#004F32] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDepGuaranteed}
                      onChange={(e) => setNewDepGuaranteed(e.target.checked)}
                      className="rounded border-gray-300 text-[#008768]"
                    />
                    Mark as Guaranteed Departure immediately
                  </label>
                </form>
              )}

              {myDepartures.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 text-xs">
                        <th className="py-3 px-3 font-bold">Tour & Dates</th>
                        <th className="py-3 px-3 font-bold">Signups / Capacity</th>
                        <th className="py-3 px-3 font-bold">Quick Seat Sync</th>
                        <th className="py-3 px-3 font-bold">Status</th>
                        <th className="py-3 px-3 text-right font-bold">Guide Manifest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myDepartures.map((dep) => {
                        const tour = myTours.find((t) => t.id === dep.tourId);
                        const fillPct =
                          dep.maxSeats > 0
                            ? Math.min(100, Math.round((dep.bookedSeats / dep.maxSeats) * 100))
                            : 0;
                        return (
                          <tr key={dep.id} className="hover:bg-gray-50/80 transition">
                            <td className="py-4 px-3">
                              <div className="font-bold text-gray-900 line-clamp-1">
                                {tour?.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDateRange(dep.startDate, dep.endDate)} · Direct Price:{' '}
                                <strong className="text-gray-800">
                                  {formatMoney(dep.priceUsd, currency)}
                                </strong>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="font-bold text-gray-900 text-xs">
                                {dep.bookedSeats} / {dep.maxSeats} travelers{' '}
                                <span className="text-[#008768]">
                                  ({dep.seatsRemaining} left)
                                </span>
                              </div>
                              <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden mt-1.5">
                                <div
                                  className="h-full bg-[#008768] rounded-full"
                                  style={{ width: `${fillPct}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="Decrease capacity"
                                  onClick={() => handleSeatChange(dep.id, dep.maxSeats - 1)}
                                  className="w-7 h-7 rounded-full border border-gray-300 bg-white font-bold hover:border-gray-900 cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="font-mono font-bold text-xs w-12 text-center">
                                  {dep.maxSeats} max
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase capacity"
                                  onClick={() => handleSeatChange(dep.id, dep.maxSeats + 1)}
                                  className="w-7 h-7 rounded-full border border-gray-300 bg-white font-bold hover:border-gray-900 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              {dep.status === 'completed' ? (
                                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                                  Completed
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    adjustDepartureSeats(dep.id, dep.maxSeats, !dep.isGuaranteed)
                                  }
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                                    dep.isGuaranteed
                                      ? 'bg-[#E6F5F0] text-[#006B52] border border-[#008768]/30'
                                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-400'
                                  }`}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  {dep.isGuaranteed ? 'Guaranteed' : 'Set Guaranteed'}
                                </button>
                              )}
                            </td>
                            <td className="py-4 px-3 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setManifestDepartureId(
                                      manifestDepartureId === dep.id ? null : dep.id
                                    )
                                  }
                                  className="px-3.5 py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
                                >
                                  Manifest ({dep.bookedSeats} pax)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => exportManifestCsv(dep.id)}
                                  title="Export CSV Manifest"
                                  className="p-2 rounded-full border border-gray-300 text-gray-700 hover:border-gray-900 cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Participant Manifest Panel */}
            {manifestDepartureId && manifestDep && (
              <div className="bg-[#0C1D17] text-white rounded-3xl p-6 space-y-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Guide & Driver Participant Manifest
                    </span>
                    <h3 className="font-display font-extrabold text-lg mt-0.5">
                      {manifestTour?.title} ·{' '}
                      {formatDateRange(manifestDep.startDate, manifestDep.endDate)}
                    </h3>
                    <div className="text-xs text-gray-300 mt-1">
                      Platform confirmed: <strong>{manifestPlatformPax} pax</strong>
                      {manifestOfflinePax > 0 && (
                        <span>
                          {' '}
                          · Direct/offline seats reserved: <strong>{manifestOfflinePax} pax</strong>
                        </span>
                      )}
                      {' '}· Total: <strong>{manifestDep.bookedSeats} / {manifestDep.maxSeats}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => exportManifestCsv(manifestDep.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => setManifestDepartureId(null)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {manifestBookings.length === 0 ? (
                  <p className="text-xs text-gray-300">
                    No online bookings recorded on this departure yet (
                    {manifestOfflinePax > 0
                      ? `${manifestOfflinePax} seats allocated offline/direct`
                      : '0 seats booked'}
                    ).
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manifestBookings.map((bk) => (
                      <div
                        key={bk.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/15 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-emerald-300">
                            {bk.bookingCode} · {bk.status.toUpperCase()}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 font-bold">
                            {bk.paxCount} {bk.paxCount === 1 ? 'traveler' : 'travelers'}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-white">
                          {bk.leadTravelerName} ({bk.leadCountry})
                        </div>
                        <div className="text-gray-300">
                          Phone: <strong>{bk.leadPhone}</strong> · {bk.leadEmail}
                        </div>
                        <div className="text-gray-200">
                          <strong>Roster:</strong>{' '}
                          {bk.participants.map((p) => p.fullName).join(', ')}
                        </div>
                        {bk.dietaryNotes && (
                          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-200">
                            <strong>Notes:</strong> {bk.dietaryNotes}
                          </div>
                        )}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <span>
                            Deposit Paid: <strong>{formatMoney(bk.depositAmountUsd, currency)}</strong>
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
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <div>
              <h2 className="font-display font-extrabold text-lg text-gray-900">
                All Bookings & Travelers Signed Up ({myBookings.length} bookings ·{' '}
                {totalPeopleSignedUp} pax)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Mark a confirmed booking as completed after the trip ends to unlock the traveler’s verified review token.
              </p>
            </div>

            {myBookings.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No bookings yet for {currentOrganizer.brandName}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-xs">
                      <th className="py-3 px-3 font-bold">Code</th>
                      <th className="py-3 px-3 font-bold">Lead Traveler</th>
                      <th className="py-3 px-3 font-bold">Tour & Date</th>
                      <th className="py-3 px-3 font-bold">Travelers</th>
                      <th className="py-3 px-3 font-bold">Balance Due</th>
                      <th className="py-3 px-3 font-bold">Status & Token</th>
                      <th className="py-3 px-3 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myBookings.map((bk) => {
                      const tour = tours.find((t) => t.id === bk.tourId);
                      const dep = departures.find((d) => d.id === bk.departureId);
                      return (
                        <tr key={bk.id} className="hover:bg-gray-50/80">
                          <td className="py-4 px-3 font-mono font-bold text-gray-900">
                            {bk.bookingCode}
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-bold text-gray-900">
                              {bk.leadTravelerName} ({bk.leadCountry})
                            </div>
                            <div className="text-xs text-gray-500">
                              {bk.leadPhone} · {bk.leadEmail}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-semibold text-gray-900 line-clamp-1">
                              {tour?.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {dep ? formatShortDate(dep.startDate) : ''}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span className="px-2.5 py-1 rounded-full bg-[#E6F5F0] text-[#006B52] font-extrabold text-xs">
                              {bk.paxCount} pax
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-bold text-gray-900">
                              {formatMoney(bk.totalAmountUsd, currency)}
                            </div>
                            <div className="text-xs text-[#008768] font-semibold">
                              Day 1: {formatMoney(bk.balanceDueToOrganizerUsd, currency)}
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
                            <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                              {bk.reviewToken} {bk.hasReview ? '· Reviewed ✓' : ''}
                            </div>
                          </td>
                          <td className="py-4 px-3 text-right">
                            {bk.status === 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => markBookingCompleted(bk.id)}
                                className="px-3.5 py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
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
            )}
          </div>
        )}

        {/* TAB 3: My Tour Programs & Self-Service Tour Builder */}
        {activeTab === 'tours' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-lg text-gray-900">
                  My Tour Programs ({myTours.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  All tours follow the 0% Markup Direct-Price Parity agreement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTourBuilderError(null);
                  setShowTourBuilder(!showTourBuilder);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Tour Program
              </button>
            </div>

            {showTourBuilder && (
              <form
                onSubmit={handleCreateTour}
                className="p-5 rounded-2xl bg-[#F0FAF6] border border-[#008768]/25 space-y-4 text-xs"
              >
                <div className="font-display font-bold text-sm text-gray-900">
                  Submit New Direct-Price Kyrgyzstan Tour
                </div>

                {tourBuilderError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {tourBuilderError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tour Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5-Day Chatyr-Kul & Tash-Rabat Horseback Expedition"
                      value={newTourTitle}
                      onChange={(e) => setNewTourTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Route Summary *</label>
                    <input
                      type="text"
                      required
                      value={newTourRoute}
                      onChange={(e) => setNewTourRoute(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Region</label>
                    <select
                      value={newTourRegion}
                      onChange={(e) => setNewTourRegion(e.target.value as KyrgyzstanRegion)}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-white"
                    >
                      {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((r) => (
                        <option key={r} value={r}>
                          {REGION_META[r].name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Style</label>
                    <select
                      value={newTourActivity}
                      onChange={(e) => setNewTourActivity(e.target.value as ActivityType)}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-white"
                    >
                      {(Object.keys(ACTIVITY_META) as ActivityType[]).map((a) => (
                        <option key={a} value={a}>
                          {ACTIVITY_META[a].shortLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Comfort</label>
                    <select
                      value={newTourComfort}
                      onChange={(e) => setNewTourComfort(e.target.value as ComfortLevel)}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-white"
                    >
                      {(Object.keys(COMFORT_META) as ComfortLevel[]).map((c) => (
                        <option key={c} value={c}>
                          {COMFORT_META[c].short}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Days</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={newTourDays}
                      onChange={(e) => setNewTourDays(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Max Pax</label>
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={newTourMaxPax}
                      onChange={(e) => setNewTourMaxPax(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Price (USD) *</label>
                    <input
                      type="number"
                      required
                      min={25}
                      value={newTourPrice}
                      onChange={(e) => setNewTourPrice(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-gray-300 bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Physical Difficulty (1–5)
                    </label>
                    <select
                      value={newTourDifficulty}
                      onChange={(e) =>
                        setNewTourDifficulty(Number(e.target.value) as DifficultyLevel)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                    >
                      {[1, 2, 3, 4, 5].map((d) => (
                        <option key={d} value={d}>
                          Level {d}/5
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">
                      Highlights & Overview
                    </label>
                    <input
                      type="text"
                      value={newTourSubtitle}
                      onChange={(e) => setNewTourSubtitle(e.target.value)}
                      placeholder="Describe the alpine route, yurt camp stay, and local experiences..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#004F32] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={directPriceCovenant}
                    onChange={(e) => setDirectPriceCovenant(e.target.checked)}
                    className="rounded border-gray-300 text-[#008768]"
                  />
                  <ShieldCheck className="w-4 h-4 text-[#008768] shrink-0" />
                  I confirm ${newTourPrice} matches our official direct booking price with 0% markup.
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTourBuilder(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 bg-white font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-bold cursor-pointer"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            )}

            {myTours.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No tour programs listed yet. Click “Create Tour Program” above to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTours.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-gray-200 flex items-center gap-4 hover:border-gray-300 transition"
                  >
                    <img
                      src={t.heroImageUrl}
                      alt={t.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'published'
                              ? 'bg-[#E6F5F0] text-[#006B52]'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {t.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t.durationDays}d · Max {t.maxGroupSize}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{t.title}</h3>
                      <div className="text-xs font-bold text-[#008768]">
                        {formatMoney(t.basePriceUsd, currency)} · {t.depositPercent}% Deposit
                      </div>
                    </div>
                    <Link
                      href={`/tours/${t.slug}`}
                      className="px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold shrink-0"
                    >
                      Preview
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Verified Reviews & Official Reply Console */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div>
              <h2 className="font-display font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#008768]" />
                Verified Traveler Reviews ({myReviews.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Official replies appear publicly on both your Tour pages and your Organizer Storefront.
              </p>
            </div>

            {myReviews.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No verified reviews received yet.
              </div>
            ) : (
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
                      className="p-5 rounded-2xl bg-[#F7F8F9] border border-gray-200 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-gray-900">
                            {rev.authorName} ({rev.authorCountry}) · ★ {rev.ratingOverall}.0
                          </div>
                          <div className="text-xs text-gray-500">
                            <strong>{tour?.title}</strong> · {formatShortDate(rev.tripDate)}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>

                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={draftReply}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({ ...prev, [rev.id]: e.target.value }))
                          }
                          placeholder={`Write official reply from ${currentOrganizer.brandName}...`}
                          className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#008768]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (draftReply.trim()) {
                              replyToReview(rev.id, draftReply.trim());
                            }
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold shrink-0 cursor-pointer"
                        >
                          {rev.organizerReply ? 'Update Reply' : 'Post Reply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
