'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organizer,
  Tour,
  TourDeparture,
  Booking,
  Review,
  PriceMatchClaim,
  CurrencyCode,
  KyrgyzstanRegion,
  ActivityType,
  DifficultyLevel,
  ComfortLevel,
  PaymentGateway,
  BookingParticipant,
} from '@/types/marketplace';
import {
  INITIAL_ORGANIZERS,
  INITIAL_TOURS,
  INITIAL_DEPARTURES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_PRICE_CLAIMS,
} from '@/data/seed';

interface CreateBookingInput {
  departureId: string;
  paxCount: number;
  leadTravelerName: string;
  leadEmail: string;
  leadPhone: string;
  leadCountry: string;
  participants: BookingParticipant[];
  dietaryNotes?: string;
  paymentGateway: PaymentGateway;
}

interface SubmitReviewInput {
  tokenOrCode: string;
  ratingOverall: 1 | 2 | 3 | 4 | 5;
  ratingGuide: 1 | 2 | 3 | 4 | 5;
  ratingAccommodation: 1 | 2 | 3 | 4 | 5;
  ratingTransport: 1 | 2 | 3 | 4 | 5;
  comment: string;
  photoUrl?: string;
}

interface CreateTourInput {
  organizerId: string;
  title: string;
  subtitle: string;
  regions: KyrgyzstanRegion[];
  activityTypes: ActivityType[];
  durationDays: number;
  difficultyLevel: DifficultyLevel;
  comfortLevel: ComfortLevel;
  maxGroupSize: number;
  minParticipants: number;
  basePriceUsd: number;
  depositPercent: number;
  freeCancellationDays: number;
  heroImageUrl: string;
  routeSummary: string;
  accommodationDetails: string;
  transportDetails: string;
  inclusions: string[];
  exclusions: string[];
}

interface AddDepartureInput {
  tourId: string;
  startDate: string;
  endDate: string;
  priceUsd: number;
  maxSeats: number;
  isGuaranteed: boolean;
  guideLanguages: string[];
  cutoffHours: number;
}

interface MarketplaceContextType {
  organizers: Organizer[];
  tours: Tour[];
  departures: TourDeparture[];
  bookings: Booking[];
  reviews: Review[];
  priceClaims: PriceMatchClaim[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  activePartnerId: string;
  setActivePartnerId: (id: string) => void;
  createBooking: (input: CreateBookingInput) => { ok: boolean; error?: string; booking?: Booking };
  adjustDepartureSeats: (
    departureId: string,
    newMaxSeats: number,
    isGuaranteed?: boolean
  ) => { ok: boolean; error?: string };
  addDeparture: (input: AddDepartureInput) => { ok: boolean; departure?: TourDeparture };
  createTour: (input: CreateTourInput) => { ok: boolean; tour?: Tour };
  markBookingCompleted: (bookingId: string) => void;
  refundBooking: (bookingId: string) => { ok: boolean; message: string };
  submitVerifiedReview: (input: SubmitReviewInput) => { ok: boolean; error?: string; review?: Review };
  replyToReview: (reviewId: string, replyText: string) => void;
  verifyOrganizer: (
    organizerId: string,
    isVerified: boolean,
    commissionPercent: number,
    verificationStatus: 'pending' | 'verified' | 'suspended'
  ) => void;
  moderateTour: (tourId: string, status: 'published' | 'draft' | 'archived') => void;
  submitPriceMatchClaim: (claim: Omit<PriceMatchClaim, 'id' | 'status' | 'createdAt'>) => void;
  resolvePriceMatchClaim: (
    claimId: string,
    status: 'matched' | 'dismissed',
    applyNewPrice?: boolean
  ) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'kyrgyz_tours_marketplace_v1';

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [organizers, setOrganizers] = useState<Organizer[]>(INITIAL_ORGANIZERS);
  const [tours, setTours] = useState<Tour[]>(INITIAL_TOURS);
  const [departures, setDepartures] = useState<TourDeparture[]>(INITIAL_DEPARTURES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [priceClaims, setPriceClaims] = useState<PriceMatchClaim[]>(INITIAL_PRICE_CLAIMS);
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [activePartnerId, setActivePartnerId] = useState<string>('org-1');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('pref_currency') as CurrencyCode | null;
      if (savedCurrency && ['USD', 'KGS', 'EUR', 'RUB'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.organizers) setOrganizers(parsed.organizers);
        if (parsed.tours) setTours(parsed.tours);
        if (parsed.departures) setDepartures(parsed.departures);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.priceClaims) setPriceClaims(parsed.priceClaims);
      }
    } catch {
      // Ignore storage read errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          organizers,
          tours,
          departures,
          bookings,
          reviews,
          priceClaims,
        })
      );
    } catch {
      // Ignore storage write errors
    }
  }, [organizers, tours, departures, bookings, reviews, priceClaims, hydrated]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('pref_currency', c);
    } catch {
      // Ignore
    }
  };

  // R-003, R-004, R-005, R-006, R-009: Create Booking with Deposit Split & Quota Lock
  const createBooking = (input: CreateBookingInput) => {
    const dep = departures.find((d) => d.id === input.departureId);
    if (!dep) {
      return { ok: false, error: 'Departure slot not found.' };
    }
    const tour = tours.find((t) => t.id === dep.tourId);
    if (!tour) {
      return { ok: false, error: 'Tour not found.' };
    }
    const org = organizers.find((o) => o.id === tour.organizerId);
    if (!org) {
      return { ok: false, error: 'Tour organizer not found.' };
    }

    // R-006: Check booking cutoff
    const startMs = new Date(dep.startDate + 'T08:00:00Z').getTime();
    const nowMs = Date.now();
    const hoursUntilStart = (startMs - nowMs) / (1000 * 60 * 60);
    if (hoursUntilStart < dep.cutoffHours || dep.status === 'closed' || dep.status === 'completed') {
      return {
        ok: false,
        error: `Online booking closed: this departure locks ${dep.cutoffHours} hours before departure (Rule R-006).`,
      };
    }

    // R-005: Check seat quota
    if (input.paxCount < 1 || input.paxCount > dep.seatsRemaining) {
      return {
        ok: false,
        error: `Only ${dep.seatsRemaining} seat(s) remaining on this departure (Rule R-005).`,
      };
    }

    // R-003: Direct-Price Deposit Split Calculation
    const totalAmountUsd = input.paxCount * dep.priceUsd;
    const depositAmountUsd = Math.round((totalAmountUsd * tour.depositPercent) / 100);
    const balanceDueToOrganizerUsd = totalAmountUsd - depositAmountUsd;
    const platformCommissionUsd = Number(
      ((totalAmountUsd * org.commissionPercent) / 100).toFixed(2)
    );

    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `KG-2027-${randDigits}`;
    const reviewToken = `REV-${randDigits}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode,
      departureId: dep.id,
      tourId: tour.id,
      organizerId: org.id,
      leadTravelerName: input.leadTravelerName,
      leadEmail: input.leadEmail,
      leadPhone: input.leadPhone,
      leadCountry: input.leadCountry || 'International',
      paxCount: input.paxCount,
      participants: input.participants,
      dietaryNotes: input.dietaryNotes || null,
      totalAmountUsd,
      depositAmountUsd,
      balanceDueToOrganizerUsd,
      platformCommissionUsd,
      paymentGateway: input.paymentGateway,
      paymentGatewayRef: `${input.paymentGateway.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      reviewToken,
      hasReview: false,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      completedAt: null,
    };

    // Update departure seats & status (R-004, R-005)
    const newBooked = dep.bookedSeats + input.paxCount;
    const newRemaining = Math.max(0, dep.maxSeats - newBooked - dep.heldSeats);
    const newGuaranteed = dep.isGuaranteed || newBooked >= tour.minParticipants;
    const newStatus =
      newRemaining === 0 ? 'sold_out' : newGuaranteed ? 'guaranteed' : 'open';

    setDepartures((prev) =>
      prev.map((d) =>
        d.id === dep.id
          ? {
              ...d,
              bookedSeats: newBooked,
              seatsRemaining: newRemaining,
              isGuaranteed: newGuaranteed,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );

    // R-009: Increment Organizer's Tours Sold (+1) and People Signed Up (+paxCount)
    setOrganizers((prev) =>
      prev.map((o) =>
        o.id === org.id
          ? {
              ...o,
              toursSoldCount: o.toursSoldCount + 1,
              peopleSignedUpCount: o.peopleSignedUpCount + input.paxCount,
            }
          : o
      )
    );

    setBookings((prev) => [newBooking, ...prev]);

    return { ok: true, booking: newBooking };
  };

  // R-011: Operator Quota Floor Validation & 1-Click Seat Adjustment
  const adjustDepartureSeats = (
    departureId: string,
    newMaxSeats: number,
    isGuaranteed?: boolean
  ) => {
    const dep = departures.find((d) => d.id === departureId);
    if (!dep) return { ok: false, error: 'Departure not found.' };

    if (newMaxSeats < dep.bookedSeats) {
      return {
        ok: false,
        error: `Cannot reduce capacity to ${newMaxSeats}: ${dep.bookedSeats} seats are already booked by confirmed tourists (Rule R-011).`,
      };
    }

    const tour = tours.find((t) => t.id === dep.tourId);
    const minPart = tour ? tour.minParticipants : 4;
    const newRemaining = Math.max(0, newMaxSeats - dep.bookedSeats - dep.heldSeats);
    const nextGuaranteed =
      isGuaranteed !== undefined ? isGuaranteed : dep.isGuaranteed || dep.bookedSeats >= minPart;
    const nextStatus =
      dep.status === 'completed'
        ? 'completed'
        : newRemaining === 0
        ? 'sold_out'
        : nextGuaranteed
        ? 'guaranteed'
        : 'open';

    setDepartures((prev) =>
      prev.map((d) =>
        d.id === departureId
          ? {
              ...d,
              maxSeats: newMaxSeats,
              seatsRemaining: newRemaining,
              isGuaranteed: nextGuaranteed,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
    return { ok: true };
  };

  const addDeparture = (input: AddDepartureInput) => {
    const newDep: TourDeparture = {
      id: `dep-${Date.now()}`,
      tourId: input.tourId,
      startDate: input.startDate,
      endDate: input.endDate,
      priceUsd: input.priceUsd,
      maxSeats: input.maxSeats,
      bookedSeats: 0,
      heldSeats: 0,
      seatsRemaining: input.maxSeats,
      isGuaranteed: input.isGuaranteed,
      guideLanguages: input.guideLanguages.length ? input.guideLanguages : ['EN', 'RU'],
      cutoffHours: input.cutoffHours || 24,
      status: input.isGuaranteed ? 'guaranteed' : 'open',
      updatedAt: new Date().toISOString(),
    };
    setDepartures((prev) => [...prev, newDep]);
    return { ok: true, departure: newDep };
  };

  // F-010, R-013: Operator creates tour -> queued as pending_review until Admin approves
  const createTour = (input: CreateTourInput) => {
    const slug =
      input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.floor(100 + Math.random() * 900);

    const newTour: Tour = {
      id: `tour-${Date.now()}`,
      organizerId: input.organizerId,
      slug,
      title: input.title,
      subtitle: input.subtitle,
      regions: input.regions,
      activityTypes: input.activityTypes,
      durationDays: input.durationDays,
      difficultyLevel: input.difficultyLevel,
      comfortLevel: input.comfortLevel,
      maxGroupSize: input.maxGroupSize,
      minParticipants: input.minParticipants,
      basePriceUsd: input.basePriceUsd,
      depositPercent: input.depositPercent,
      freeCancellationDays: input.freeCancellationDays,
      heroImageUrl:
        input.heroImageUrl ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      galleryUrls: [
        input.heroImageUrl ||
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      ],
      routeSummary: input.routeSummary,
      itineraryDays: [
        {
          dayNumber: 1,
          title: 'Day 1: Departure from Bishkek & Mountain Ascent',
          description: input.subtitle,
          distanceKm: 180,
          drivingHours: '3.5h 4WD drive',
          maxAltitudeM: 2800,
          meals: ['L', 'D'],
          accommodation: input.accommodationDetails,
        },
      ],
      accommodationDetails: input.accommodationDetails,
      transportDetails: input.transportDetails,
      inclusions: input.inclusions,
      exclusions: input.exclusions,
      status: 'pending_review',
      ratingAvg: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      priceVerifiedAt: null,
    };

    setTours((prev) => [newTour, ...prev]);
    return { ok: true, tour: newTour };
  };

  const markBookingCompleted = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'completed', completedAt: new Date().toISOString() }
          : b
      )
    );
  };

  // R-010: Free Cancellation Cutoff & Seat Restoration
  const refundBooking = (bookingId: string) => {
    const bk = bookings.find((b) => b.id === bookingId);
    if (!bk) return { ok: false, message: 'Booking not found.' };
    if (bk.status === 'refunded' || bk.status === 'cancelled') {
      return { ok: false, message: 'Booking is already refunded or cancelled.' };
    }

    const dep = departures.find((d) => d.id === bk.departureId);
    const tour = tours.find((t) => t.id === bk.tourId);

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'refunded' } : b))
    );

    if (dep) {
      const nextBooked = Math.max(0, dep.bookedSeats - bk.paxCount);
      const nextRemaining = Math.max(0, dep.maxSeats - nextBooked - dep.heldSeats);
      setDepartures((prev) =>
        prev.map((d) =>
          d.id === dep.id
            ? {
                ...d,
                bookedSeats: nextBooked,
                seatsRemaining: nextRemaining,
                status: nextRemaining > 0 ? (d.isGuaranteed ? 'guaranteed' : 'open') : 'sold_out',
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
    }

    setOrganizers((prev) =>
      prev.map((o) =>
        o.id === bk.organizerId
          ? {
              ...o,
              toursSoldCount: Math.max(0, o.toursSoldCount - 1),
              peopleSignedUpCount: Math.max(0, o.peopleSignedUpCount - bk.paxCount),
            }
          : o
      )
    );

    return {
      ok: true,
      message: `Refunded $${bk.depositAmountUsd} deposit for booking ${bk.bookingCode} (${
        tour?.freeCancellationDays ?? 15
      }-day free cancellation policy) and restored ${bk.paxCount} seat(s) to inventory (Rule R-010).`,
    };
  };

  // R-007 & R-008: Verified-Booker-Only Review Gate & Dual Rating Aggregation
  const submitVerifiedReview = (input: SubmitReviewInput) => {
    const cleanToken = input.tokenOrCode.trim().toUpperCase();
    const bk = bookings.find(
      (b) =>
        b.reviewToken.toUpperCase() === cleanToken ||
        b.bookingCode.toUpperCase() === cleanToken
    );

    if (!bk) {
      return {
        ok: false,
        error:
          'Invalid Booking Reference or Review Token. Only real tourists with a verified booking can post a review (Rule R-007). Try demo token: REV-TEST-DEMO',
      };
    }

    if (bk.status !== 'completed') {
      return {
        ok: false,
        error: `Booking ${bk.bookingCode} is currently "${bk.status}". Reviews can only be submitted after the tour is completed (Rule R-007). (Tip: you can mark it Completed in the Partner Portal!)`,
      };
    }

    if (bk.hasReview) {
      return {
        ok: false,
        error: `A verified review has already been submitted for booking ${bk.bookingCode}.`,
      };
    }

    const dep = departures.find((d) => d.id === bk.departureId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: bk.id,
      tourId: bk.tourId,
      organizerId: bk.organizerId,
      authorName: bk.leadTravelerName,
      authorCountry: bk.leadCountry,
      tripDate: dep ? dep.startDate : new Date().toISOString().slice(0, 10),
      ratingOverall: input.ratingOverall,
      ratingGuide: input.ratingGuide,
      ratingAccommodation: input.ratingAccommodation,
      ratingTransport: input.ratingTransport,
      comment: input.comment,
      photos: input.photoUrl ? [input.photoUrl] : [],
      isVerifiedBooker: true,
      organizerReply: null,
      repliedAt: null,
      createdAt: new Date().toISOString(),
    };

    const nextReviews = [newReview, ...reviews];
    setReviews(nextReviews);
    setBookings((prev) =>
      prev.map((b) => (b.id === bk.id ? { ...b, hasReview: true } : b))
    );

    // R-008: Recalculate Tour ratingAvg & reviewsCount
    const tourReviews = nextReviews.filter((r) => r.tourId === bk.tourId);
    const tourAvg =
      tourReviews.reduce((acc, r) => acc + r.ratingOverall, 0) / tourReviews.length;

    setTours((prev) =>
      prev.map((t) =>
        t.id === bk.tourId
          ? {
              ...t,
              ratingAvg: Number(tourAvg.toFixed(2)),
              reviewsCount: tourReviews.length,
            }
          : t
      )
    );

    // R-008: Recalculate Organizer ratingAvg & reviewsCount
    const orgReviews = nextReviews.filter((r) => r.organizerId === bk.organizerId);
    const orgAvg =
      orgReviews.reduce((acc, r) => acc + r.ratingOverall, 0) / orgReviews.length;

    setOrganizers((prev) =>
      prev.map((o) =>
        o.id === bk.organizerId
          ? {
              ...o,
              ratingAvg: Number(orgAvg.toFixed(2)),
              reviewsCount: orgReviews.length,
            }
          : o
      )
    );

    return { ok: true, review: newReview };
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              organizerReply: replyText,
              repliedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  // R-013: Admin KYC Verification & Commission Rate Setting
  const verifyOrganizer = (
    organizerId: string,
    isVerified: boolean,
    commissionPercent: number,
    verificationStatus: 'pending' | 'verified' | 'suspended'
  ) => {
    setOrganizers((prev) =>
      prev.map((o) =>
        o.id === organizerId
          ? {
              ...o,
              isVerified,
              commissionPercent,
              verificationStatus,
              verifiedAt: isVerified ? new Date().toISOString() : o.verifiedAt,
            }
          : o
      )
    );
  };

  // R-002 & R-013: Admin Tour Moderation & Direct-Price Parity Approval
  const moderateTour = (tourId: string, status: 'published' | 'draft' | 'archived') => {
    setTours((prev) =>
      prev.map((t) =>
        t.id === tourId
          ? {
              ...t,
              status,
              priceVerifiedAt:
                status === 'published' ? new Date().toISOString() : t.priceVerifiedAt,
            }
          : t
      )
    );
  };

  const submitPriceMatchClaim = (
    claim: Omit<PriceMatchClaim, 'id' | 'status' | 'createdAt'>
  ) => {
    const newClaim: PriceMatchClaim = {
      ...claim,
      id: `pmc-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setPriceClaims((prev) => [newClaim, ...prev]);
  };

  const resolvePriceMatchClaim = (
    claimId: string,
    status: 'matched' | 'dismissed',
    applyNewPrice?: boolean
  ) => {
    const target = priceClaims.find((c) => c.id === claimId);
    setPriceClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status } : c))
    );

    if (target && status === 'matched' && applyNewPrice) {
      setTours((prev) =>
        prev.map((t) =>
          t.id === target.tourId
            ? {
                ...t,
                basePriceUsd: target.claimedPriceUsd,
                priceVerifiedAt: new Date().toISOString(),
              }
            : t
        )
      );
      setDepartures((prev) =>
        prev.map((d) =>
          d.tourId === target.tourId && d.status !== 'completed'
            ? { ...d, priceUsd: target.claimedPriceUsd }
            : d
        )
      );
    }
  };

  const resetDemoData = () => {
    setOrganizers(INITIAL_ORGANIZERS);
    setTours(INITIAL_TOURS);
    setDepartures(INITIAL_DEPARTURES);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setPriceClaims(INITIAL_PRICE_CLAIMS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        organizers,
        tours,
        departures,
        bookings,
        reviews,
        priceClaims,
        currency,
        setCurrency,
        activePartnerId,
        setActivePartnerId,
        createBooking,
        adjustDepartureSeats,
        addDeparture,
        createTour,
        markBookingCompleted,
        refundBooking,
        submitVerifiedReview,
        replyToReview,
        verifyOrganizer,
        moderateTour,
        submitPriceMatchClaim,
        resolvePriceMatchClaim,
        resetDemoData,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return ctx;
}

