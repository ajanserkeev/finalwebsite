'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  Tour,
  Organizer,
  TourDeparture,
  PaymentGateway,
  formatMoney,
} from '@/types/marketplace';
import { useMarketplace } from '@/context/MarketplaceContext';

interface BookingModalProps {
  tour: Tour;
  organizer: Organizer;
  departure: TourDeparture;
  onClose: () => void;
}

/** S-005: Booking Application & Deposit Checkout Modal enforcing R-003, R-005, R-006, R-009 */
export function BookingModal({
  tour,
  organizer,
  departure,
  onClose,
}: BookingModalProps) {
  const { currency, createBooking, setActivePartnerId } = useMarketplace();

  const [paxCount, setPaxCount] = useState<number>(Math.min(2, departure.seatsRemaining));
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCountry, setLeadCountry] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('freedom_pay');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<
    ReturnType<typeof createBooking>['booking'] | null
  >(null);

  // R-003 calculations
  const totalAmountUsd = paxCount * departure.priceUsd;
  const depositAmountUsd = Math.round((totalAmountUsd * tour.depositPercent) / 100);
  const balanceDueToOrganizerUsd = totalAmountUsd - depositAmountUsd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      setErrorMsg('Please fill in your full name, email, and WhatsApp/Telegram phone number.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please accept the Direct-Price Booking & Free Cancellation terms.');
      return;
    }

    const participants = Array.from({ length: paxCount }).map((_, idx) => ({
      fullName: idx === 0 ? leadName.trim() : `${leadName.trim()} (Guest #${idx + 1})`,
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              Direct Organizer Price Checkout · 0% Platform Markup
            </div>
            <h3 className="font-bold text-lg mt-0.5 line-clamp-1">{tour.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950 text-base">
                  Seats Locked & Confirmed! ({confirmedBooking.bookingCode})
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Your {confirmedBooking.paxCount} seat(s) on{' '}
                  <strong>
                    {departure.startDate} → {departure.endDate}
                  </strong>{' '}
                  with <strong>{organizer.brandName}</strong> are now confirmed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Online Deposit Paid</div>
                <div className="text-lg font-extrabold text-teal-700 mt-0.5">
                  {formatMoney(confirmedBooking.depositAmountUsd, currency)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Ref: {confirmedBooking.paymentGatewayRef}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">Balance Due on Arrival</div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {formatMoney(confirmedBooking.balanceDueToOrganizerUsd, currency)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Paid directly to {organizer.brandName}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-amber-800 font-semibold">Post-Trip Review Token</div>
                <div className="text-base font-mono font-bold text-amber-950 mt-0.5">
                  {confirmedBooking.reviewToken}
                </div>
                <div className="text-[11px] text-amber-700">
                  Unlocks verified review after trip completion
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Live Partner Portal Updated (Rule R-009):
              </div>
              <p>
                <strong>{organizer.brandName}</strong>’s dedicated Operator Portal now shows{' '}
                <strong>+1 Tour Sold</strong> and{' '}
                <strong>+{confirmedBooking.paxCount} People Signed Up</strong>, with your contact manifest ready for their mountain guide.
              </p>
              <div className="pt-1 flex flex-wrap gap-2">
                <Link
                  href="/partner"
                  onClick={() => {
                    setActivePartnerId(organizer.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Open {organizer.brandName} Partner Portal to See Your Booking →
                </Link>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Departure & Organizer Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Departure: {departure.startDate} → {departure.endDate}
                </div>
                <div className="text-slate-600">
                  Organizer: <strong className="text-slate-900">{organizer.brandName}</strong> (
                  {organizer.legalName})
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold">
                {departure.seatsRemaining} of {departure.maxSeats} seats left
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Pax Stepper (Enforces R-005 ceiling) */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  Number of Participants (People Signing Up)
                </label>
                <p className="text-xs text-slate-500">
                  Max {departure.seatsRemaining} available on this departure (Rule R-005)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease travelers"
                  onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  −
                </button>
                <span className="font-extrabold text-base w-6 text-center">{paxCount}</span>
                <button
                  type="button"
                  aria-label="Increase travelers"
                  onClick={() =>
                    setPaxCount(Math.min(departure.seatsRemaining, paxCount + 1))
                  }
                  className="w-8 h-8 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lead Traveler Contact Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Traveler Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (for Voucher & Review Link) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Telegram Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 415 555 0192 or +996..."
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country / Nationality
                </label>
                <input
                  type="text"
                  placeholder="e.g. United Kingdom, Germany, Kazakhstan"
                  value={leadCountry}
                  onChange={(e) => setLeadCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary, Medical or Gear Notes for {organizer.brandName}
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian meals, private yurt request, flight arrival time..."
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* R-003 Transparent Direct-Price & Deposit Split Box */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>
                  Direct Organizer Price ({paxCount} × {formatMoney(departure.priceUsd, currency)})
                </span>
                <span className="font-bold text-slate-900">
                  {formatMoney(totalAmountUsd, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-teal-900 font-bold text-sm pt-1 border-t border-teal-200/70">
                <span>
                  Due Now Online ({tour.depositPercent}% Reservation Deposit):
                </span>
                <span className="text-base text-teal-700">
                  {formatMoney(depositAmountUsd, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>
                  Remaining Balance ({100 - tour.depositPercent}% paid directly to{' '}
                  {organizer.brandName} on Day 1):
                </span>
                <span className="font-semibold text-slate-800">
                  {formatMoney(balanceDueToOrganizerUsd, currency)}
                </span>
              </div>
            </div>

            {/* Kyrgyzstan + International Payment Rail Selector (BR-001) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Deposit Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  {
                    id: 'freedom_pay',
                    label: 'Freedom Pay KG',
                    sub: 'Visa / Mastercard 3DS',
                    icon: CreditCard,
                  },
                  {
                    id: 'finik',
                    label: 'Finik KG',
                    sub: 'Instant Card / QR Link',
                    icon: QrCode,
                  },
                  {
                    id: 'mbank_qr',
                    label: 'MBANK / Elkart',
                    sub: 'Kyrgyzstan Local QR',
                    icon: QrCode,
                  },
                  {
                    id: 'stripe',
                    label: 'Stripe Global',
                    sub: 'International Cards',
                    icon: CreditCard,
                  },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentGateway(pm.id as PaymentGateway)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        paymentGateway === pm.id
                          ? 'border-teal-600 bg-teal-50/60 text-teal-950 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-teal-600 mb-1" />
                      <div>{pm.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{pm.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span>
                I agree to the Direct-Price Agency Offer. Free cancellation with{' '}
                <strong>100% deposit refund</strong> is available up to{' '}
                <strong>{tour.freeCancellationDays} days</strong> before departure (Rule R-010).
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition"
              >
                Pay {formatMoney(depositAmountUsd, currency)} Deposit & Lock {paxCount}{' '}
                {paxCount === 1 ? 'Seat' : 'Seats'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

