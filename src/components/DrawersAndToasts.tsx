'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  X,
  Heart,
  Briefcase,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Copy,
  Check,
  Star,
  RotateCcw,
  ArrowRight,
  Phone,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatMoney, formatDateRange } from '@/types/marketplace';

export function DrawersAndToasts() {
  const {
    tours,
    organizers,
    departures,
    bookings,
    currency,
    savedTourIds,
    toggleSavedTour,
    myBookingIds,
    wishlistOpen,
    setWishlistOpen,
    tripsOpen,
    setTripsOpen,
    refundBooking,
    toast,
    dismissToast,
  } = useMarketplace();

  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setWishlistOpen(false);
        setTripsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setWishlistOpen, setTripsOpen]);

  const savedTours = tours.filter((t) => savedTourIds.includes(t.id));
  const myBookings = bookings.filter((b) => myBookingIds.includes(b.id));

  const handleCopyToken = (id: string, token: string) => {
    navigator.clipboard?.writeText(token).catch(() => {});
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  return (
    <>
      {/* Wishlist Slide-Over Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setWishlistOpen(false)}
          />
          <aside className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Saved Experiences</h2>
                  <p className="text-xs text-gray-500">
                    {savedTours.length} {savedTours.length === 1 ? 'tour' : 'tours'} in your wishlist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                aria-label="Close wishlist"
                className="p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {savedTours.length === 0 ? (
                <div className="text-center py-16 px-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                    <Heart className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-gray-900">No saved tours yet</h3>
                    <p className="text-sm text-gray-500">
                      Tap the heart icon on any Kyrgyzstan tour to save it here for easy comparison.
                    </p>
                  </div>
                  <Link
                    href="/tours"
                    onClick={() => setWishlistOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold transition"
                  >
                    Explore Kyrgyzstan Tours
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                savedTours.map((tour) => {
                  const org = organizers.find((o) => o.id === tour.organizerId);
                  return (
                    <div
                      key={tour.id}
                      className="flex gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-[#008768]/40 bg-white transition group"
                    >
                      <Link
                        href={`/tours/${tour.slug}`}
                        onClick={() => setWishlistOpen(false)}
                        className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100"
                      >
                        <img
                          src={tour.heroImageUrl}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/tours/${tour.slug}`}
                              onClick={() => setWishlistOpen(false)}
                              className="font-bold text-sm text-gray-900 hover:text-[#008768] line-clamp-2 leading-snug"
                            >
                              {tour.title}
                            </Link>
                            <button
                              onClick={() => toggleSavedTour(tour.id)}
                              title="Remove from wishlist"
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded-full shrink-0 cursor-pointer"
                            >
                              <Heart className="w-4 h-4 fill-rose-500" />
                            </button>
                          </div>
                          {org && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              by {org.brandName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                            <Star className="w-3.5 h-3.5 fill-[#008768] text-[#008768]" />
                            {tour.reviewsCount > 0 ? tour.ratingAvg.toFixed(1) : 'New'}
                            {tour.reviewsCount > 0 && (
                              <span className="text-gray-400 font-normal">({tour.reviewsCount})</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-gray-500 mr-1">from</span>
                            <span className="font-extrabold text-sm text-gray-900">
                              {formatMoney(tour.basePriceUsd, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {savedTours.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-gray-50">
                <Link
                  href="/tours"
                  onClick={() => setWishlistOpen(false)}
                  className="w-full py-3 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                >
                  Browse More Experiences
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* My Trips & Booking Vouchers Slide-Over Drawer */}
      {tripsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setTripsOpen(false)}
          />
          <aside className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E6F5F0] flex items-center justify-center text-[#008768]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">My Trips & Vouchers</h2>
                  <p className="text-xs text-gray-500">
                    Manage bookings, review tokens & free cancellations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTripsOpen(false)}
                aria-label="Close my trips"
                className="p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {myBookings.length === 0 ? (
                <div className="text-center py-16 px-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-gray-900">No upcoming trips</h3>
                    <p className="text-sm text-gray-500">
                      When you book a Kyrgyzstan tour, your instant voucher, direct organizer contact, and deposit receipt will appear here.
                    </p>
                  </div>
                  <Link
                    href="/tours"
                    onClick={() => setTripsOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#008768] hover:bg-[#006B52] text-white text-sm font-bold transition"
                  >
                    Find Your Next Adventure
                  </Link>
                </div>
              ) : (
                myBookings.map((bk) => {
                  const tour = tours.find((t) => t.id === bk.tourId);
                  const org = organizers.find((o) => o.id === bk.organizerId);
                  const dep = departures.find((d) => d.id === bk.departureId);
                  const isConfirmed = bk.status === 'confirmed';
                  const isCompleted = bk.status === 'completed';

                  return (
                    <div
                      key={bk.id}
                      className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs"
                    >
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900">
                            {bk.bookingCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isConfirmed
                                ? 'bg-[#E6F5F0] text-[#006B52]'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {bk.status === 'confirmed'
                              ? 'Confirmed'
                              : bk.status === 'completed'
                              ? 'Completed'
                              : 'Refunded'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {bk.paxCount} {bk.paxCount === 1 ? 'traveler' : 'travelers'}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex gap-3">
                          {tour && (
                            <img
                              src={tour.heroImageUrl}
                              alt={tour.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            {tour && (
                              <Link
                                href={`/tours/${tour.slug}`}
                                onClick={() => setTripsOpen(false)}
                                className="font-bold text-sm text-gray-900 hover:text-[#008768] line-clamp-2 leading-snug"
                              >
                                {tour.title}
                              </Link>
                            )}
                            {dep && (
                              <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#008768]" />
                                {formatDateRange(dep.startDate, dep.endDate)}
                              </div>
                            )}
                          </div>
                        </div>

                        {org && (
                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={org.logoUrl}
                                alt={org.brandName}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                              <div className="truncate">
                                <div className="font-bold text-gray-900 truncate">
                                  {org.brandName}
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {org.phone}
                                </div>
                              </div>
                            </div>
                            <Link
                              href={`/organizers/${org.slug}`}
                              onClick={() => setTripsOpen(false)}
                              className="text-[#008768] font-bold hover:underline shrink-0 ml-2"
                            >
                              Profile
                            </Link>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-[#F0FAF6] border border-[#008768]/15">
                            <div className="text-[11px] text-gray-600">Deposit Paid Online</div>
                            <div className="font-extrabold text-[#006B52] text-sm">
                              {formatMoney(bk.depositAmountUsd, currency)}
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80">
                            <div className="text-[11px] text-gray-600">Pay Organizer on Arrival</div>
                            <div className="font-extrabold text-gray-900 text-sm">
                              {formatMoney(bk.balanceDueToOrganizerUsd, currency)}
                            </div>
                          </div>
                        </div>

                        {/* Review Token Bar */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                          <div>
                            <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Verified Review Token
                            </div>
                            <div className="font-mono font-bold text-amber-950">
                              {bk.reviewToken}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyToken(bk.id, bk.reviewToken)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 transition cursor-pointer"
                            >
                              {copiedTokenId === bk.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Copy
                                </>
                              )}
                            </button>
                            {isCompleted && !bk.hasReview && tour && (
                              <Link
                                href={`/tours/${tour.slug}#reviews`}
                                onClick={() => setTripsOpen(false)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#008768] text-white font-bold hover:bg-[#006B52] transition"
                              >
                                Write Review
                              </Link>
                            )}
                          </div>
                        </div>

                        {isConfirmed && (
                          <div className="pt-1 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-[#008768] font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Free cancellation up to {tour?.freeCancellationDays ?? 15} days prior
                            </span>
                            <button
                              type="button"
                              onClick={() => refundBooking(bk.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Cancel & Refund
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Floating Modern Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] max-w-sm animate-fade-slide-up">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-950 text-white border-rose-800'
                : toast.type === 'info'
                ? 'bg-gray-900 text-white border-gray-700'
                : 'bg-[#004F32] text-white border-[#008768]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <span className="text-xs leading-snug">{toast.text}</span>
            <button
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="ml-auto p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
