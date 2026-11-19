'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Users,
  CreditCard,
  QrCode,
  Calendar,
  AlertCircle,
  Sparkles,
  Building2,
  Lock,
  Briefcase,
  Copy,
  Check,
} from 'lucide-react';
import {
  Tour,
  Organizer,
  TourDeparture,
  PaymentGateway,
  formatMoney,
  formatDateRange,
} from '@/types/marketplace';
import { useMarketplace } from '@/context/MarketplaceContext';

interface BookingModalProps {
  tour: Tour;
  organizer: Organizer;
  departure: TourDeparture;
  initialPaxCount?: number;
  onClose: () => void;
}

export function BookingModal({
  tour,
  organizer,
  departure,
  initialPaxCount = 2,
  onClose,
}: BookingModalProps) {
  const { currency, createBooking, setActivePartnerId, setTripsOpen } = useMarketplace();

  const maxSelectable = Math.max(1, departure.seatsRemaining);
  const [paxCount, setPaxCount] = useState<number>(
    Math.min(Math.max(1, initialPaxCount), maxSelectable)
  );
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCountry, setLeadCountry] = useState('');
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('freedom_pay');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<
    ReturnType<typeof createBooking>['booking'] | null
  >(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const totalAmountUsd = paxCount * departure.priceUsd;
  const depositAmountUsd = Math.round((totalAmountUsd * tour.depositPercent) / 100);
  const balanceDueToOrganizerUsd = totalAmountUsd - depositAmountUsd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      setErrorMsg('Please fill in your full name, email address, and WhatsApp/Telegram phone.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please accept the Direct-Price Booking & Free Cancellation terms.');
      return;
    }

    const participants = Array.from({ length: paxCount }).map((_, idx) => ({
      fullName:
        idx === 0
          ? leadName.trim()
          : guestNames[idx - 1]?.trim() || `${leadName.trim()} (Guest #${idx + 1})`,
      nationality: leadCountry.trim() || 'International',
    }));

    const res = createBooking({
      departureId: departure.id,
      paxCount,
      leadTravelerName: leadName.trim(),
      leadEmail: leadEmail.trim(),
      leadPhone: leadPhone.trim(),
      leadCountry: leadCountry.trim() || 'International',
      participants,
      dietaryNotes: dietaryNotes.trim() || undefined,
      paymentGateway,
    });

    if (!res.ok) {
      setErrorMsg(res.error || 'Could not complete booking.');
      return;
    }

    setConfirmedBooking(res.booking || null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Crisp Modal Top Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#E6F5F0] text-[#008768] flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#006B52] flex items-center gap-1">
                Secure Direct-Price Checkout · 0% Markup
              </div>
              <h3 className="font-display font-bold text-base text-gray-900 truncate">
                {tour.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {confirmedBooking ? (
            /* Viator-Style Instant Confirmation Voucher */
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-5 rounded-2xl bg-[#F0FAF6] border border-[#008768]/25 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#008768] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#006B52]">
                    Instant Confirmation
                  </div>
                  <h4 className="font-display font-extrabold text-xl text-gray-900 mt-0.5">
                    You’re booked! Ref {confirmedBooking.bookingCode}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {confirmedBooking.paxCount}{' '}
                    {confirmedBooking.paxCount === 1 ? 'seat' : 'seats'} locked for{' '}
                    <strong className="text-gray-900">
                      {formatDateRange(departure.startDate, departure.endDate)}
                    </strong>{' '}
                    with <strong className="text-gray-900">{organizer.brandName}</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500">Deposit Paid Now</div>
                  <div className="text-2xl font-display font-extrabold text-[#006B52] mt-1">
                    {formatMoney(confirmedBooking.depositAmountUsd, currency)}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 mt-1">
                    {confirmedBooking.paymentGatewayRef}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-500">Balance Due on Arrival</div>
                  <div className="text-2xl font-display font-extrabold text-gray-900 mt-1">
                    {formatMoney(confirmedBooking.balanceDueToOrganizerUsd, currency)}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Paid directly to {organizer.brandName}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <div className="text-xs font-semibold text-amber-900">
                    Verified Review Token
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-mono font-extrabold text-amber-950">
                      {confirmedBooking.reviewToken}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(confirmedBooking.reviewToken).catch(() => {});
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
                    >
                      {copiedToken ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] text-amber-800 mt-1">
                    Unlocks verified review after trip
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Partner Portal Synced in Real Time
                  </div>
                  <p className="text-xs text-gray-300">
                    {organizer.brandName}’s dashboard now reflects +1 tour sold and +
                    {confirmedBooking.paxCount} travelers signed up with your manifest ready.
                  </p>
                </div>
                <Link
                  href="/partner"
                  onClick={() => {
                    setActivePartnerId(organizer.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-xs font-bold transition shrink-0"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  View Partner Portal
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTripsOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 hover:border-gray-900 text-gray-900 text-sm font-bold transition cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-[#008768]" />
                  Open My Trips & Voucher
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* 2-Column Viator Checkout Experience */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left 3 Columns: Traveler & Payment Details */}
              <div className="lg:col-span-3 p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-gray-200">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Travelers Stepper */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div>
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#008768]" />
                      Travelers
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {departure.seatsRemaining} spots remaining on this departure
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease travelers"
                      onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                      disabled={paxCount <= 1}
                      className="w-9 h-9 rounded-full border border-gray-300 bg-white font-bold text-gray-800 hover:border-gray-900 disabled:opacity-40 transition cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-display font-extrabold text-base w-6 text-center">
                      {paxCount}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase travelers"
                      onClick={() => setPaxCount(Math.min(maxSelectable, paxCount + 1))}
                      disabled={paxCount >= maxSelectable}
                      className="w-9 h-9 rounded-full border border-gray-300 bg-white font-bold text-gray-800 hover:border-gray-900 disabled:opacity-40 transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3.5">
                  <h4 className="font-display font-bold text-sm text-gray-900">
                    1. Lead Traveler Contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#008768] focus:ring-2 focus:ring-[#008768]/15"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#008768] focus:ring-2 focus:ring-[#008768]/15"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        WhatsApp / Telegram Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 415 555 0192 or +996..."
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#008768] focus:ring-2 focus:ring-[#008768]/15"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Country / Nationality
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. United Kingdom, Germany"
                        value={leadCountry}
                        onChange={(e) => setLeadCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#008768] focus:ring-2 focus:ring-[#008768]/15"
                      />
                    </div>
                  </div>

                  {/* Additional Guests Names */}
                  {paxCount > 1 && (
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                      <div className="text-xs font-semibold text-gray-700">
                        Additional Travelers (optional — helpful for border permits)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Array.from({ length: paxCount - 1 }).map((_, idx) => (
                          <input
                            key={idx}
                            type="text"
                            placeholder={`Guest #${idx + 2} Full Name`}
                            value={guestNames[idx] || ''}
                            onChange={(e) => {
                              const next = [...guestNames];
                              next[idx] = e.target.value;
                              setGuestNames(next);
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#008768]"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Special Requests / Dietary / Flight Notes (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Vegetarian meals, hotel pickup in Bishkek, private yurt request..."
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#008768] focus:ring-2 focus:ring-[#008768]/15"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2.5">
                  <h4 className="font-display font-bold text-sm text-gray-900">
                    2. Deposit Payment Method ({tour.depositPercent}% Today)
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {[
                      {
                        id: 'freedom_pay',
                        label: 'Freedom Pay KG',
                        sub: 'Visa / Mastercard 3DS',
                        icon: CreditCard,
                      },
                      {
                        id: 'stripe',
                        label: 'Stripe Global',
                        sub: 'International Cards / Apple Pay',
                        icon: CreditCard,
                      },
                      {
                        id: 'finik',
                        label: 'Finik KG',
                        sub: 'Instant Local Card & QR',
                        icon: QrCode,
                      },
                      {
                        id: 'mbank_qr',
                        label: 'MBANK / Elkart',
                        sub: 'Kyrgyzstan QR Payment',
                        icon: QrCode,
                      },
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const selected = paymentGateway === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentGateway(pm.id as PaymentGateway)}
                          className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2.5 cursor-pointer ${
                            selected
                              ? 'border-[#008768] bg-[#F0FAF6] text-gray-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              selected ? 'text-[#008768]' : 'text-gray-400'
                            }`}
                          />
                          <div>
                            <div className="font-bold">{pm.label}</div>
                            <div className="text-[11px] text-gray-500">{pm.sub}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#008768] focus:ring-[#008768]"
                  />
                  <span>
                    I accept the Direct-Price Booking Terms. Free cancellation with{' '}
                    <strong className="text-gray-900">100% deposit refund</strong> up to{' '}
                    <strong className="text-gray-900">{tour.freeCancellationDays} days</strong> before departure.
                  </span>
                </label>
              </div>

              {/* Right 2 Columns: Viator Order Summary */}
              <div className="lg:col-span-2 bg-gray-50 p-6 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <img
                      src={tour.heroImageUrl}
                      alt={tour.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xs"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                        {tour.title}
                      </h4>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008768] shrink-0" />
                        <span className="truncate">{organizer.brandName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#008768]" />
                        Dates
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatDateRange(departure.startDate, departure.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#008768]" />
                        Group
                      </span>
                      <span className="font-bold text-gray-900">
                        {paxCount} {paxCount === 1 ? 'Adult' : 'Adults'}
                      </span>
                    </div>
                  </div>

                  {/* Direct Price Breakdown */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>
                        Direct Price ({paxCount} × {formatMoney(departure.priceUsd, currency)})
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatMoney(totalAmountUsd, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#006B52]">
                      <span>Platform Markup Fee</span>
                      <span className="font-bold">{formatMoney(0, currency)} (0%)</span>
                    </div>

                    <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-gray-900">Due Today Online</div>
                        <div className="text-[11px] text-gray-500">
                          {tour.depositPercent}% Reservation Deposit
                        </div>
                      </div>
                      <span className="text-xl font-display font-extrabold text-[#008768]">
                        {formatMoney(depositAmountUsd, currency)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-gray-600">
                      <span>Pay {organizer.brandName} on Day 1</span>
                      <span className="font-bold text-gray-900">
                        {formatMoney(balanceDueToOrganizerUsd, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#E6F5F0]/70 text-[#004F32] text-xs flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#008768] shrink-0 mt-0.5" />
                    <span>
                      <strong>Free cancellation</strong> up to {tour.freeCancellationDays} days before start for a full deposit refund.
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-full bg-[#008768] hover:bg-[#006B52] text-white font-display font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    Pay {formatMoney(depositAmountUsd, currency)} & Confirm {paxCount}{' '}
                    {paxCount === 1 ? 'Seat' : 'Seats'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel and return to tour
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
