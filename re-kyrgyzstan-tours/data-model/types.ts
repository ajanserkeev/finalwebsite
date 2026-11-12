// Generated Data Model Types for Kyrgyzstan Tour Bridge Aggregator (RES Study)

export type VerificationStatus = 'pending' | 'verified' | 'suspended';

export type KyrgyzstanRegion =
  | 'issyk-kul'
  | 'song-kul'
  | 'kel-suu'
  | 'karakol'
  | 'ala-archa'
  | 'sary-chelek'
  | 'pamir-osh';

export type ActivityType =
  | 'jeep-4wd'
  | 'horseback'
  | 'trekking'
  | 'cultural-yurt'
  | 'day-trip'
  | 'winter-ski';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type ComfortLevel =
  | 'basic_tent'
  | 'nomadic_yurt'
  | 'standard_guesthouse'
  | 'comfort_hotel';

export type TourStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export type DepartureStatus =
  | 'open'
  | 'guaranteed'
  | 'sold_out'
  | 'closed'
  | 'completed'
  | 'cancelled';

export type BookingStatus =
  | 'pending_deposit'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentGateway = 'freedom_pay' | 'finik' | 'stripe' | 'mbank_qr';

/** E-001 Organizer (Tour Operator / Partner) */
export interface Organizer {
  id: string;
  slug: string;
  brandName: string;
  legalName: string;
  registrationNumber: string;
  baseCity: 'Bishkek' | 'Karakol' | 'Osh' | 'Naryn' | 'Cholpon-Ata';
  bio: string;
  logoUrl: string;
  directSiteUrl: string | null;
  languages: string[];
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  commissionPercent: number;
  ratingAvg: number;
  reviewsCount: number;
  /** Real-time counter of confirmed/completed bookings (R-009) */
  toursSoldCount: number;
  /** Real-time counter of total participants signed up across bookings (R-009) */
  peopleSignedUpCount: number;
  createdAt: string;
  verifiedAt: string | null;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  distanceKm?: number;
  maxAltitudeM?: number;
  meals: ('B' | 'L' | 'D')[];
  accommodation: string;
}

/** E-002 Tour */
export interface Tour {
  id: string;
  organizerId: string;
  slug: string;
  title: string;
  regions: KyrgyzstanRegion[];
  activityTypes: ActivityType[];
  durationDays: number;
  difficultyLevel: DifficultyLevel;
  comfortLevel: ComfortLevel;
  maxGroupSize: number;
  minParticipants: number;
  /** Must match or beat organizer's direct price (R-002) */
  basePriceUsd: number;
  /** Online reservation deposit percentage, e.g., 20% (R-003) */
  depositPercent: number;
  freeCancellationDays: number;
  itineraryDays: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  status: TourStatus;
  ratingAvg: number;
  reviewsCount: number;
  createdAt: string;
  priceVerifiedAt: string | null;
}

/** E-003 TourDeparture */
export interface TourDeparture {
  id: string;
  tourId: string;
  startDate: string;
  endDate: string;
  priceUsd: number;
  maxSeats: number;
  bookedSeats: number;
  heldSeats: number;
  seatsRemaining: number;
  isGuaranteed: boolean;
  guideLanguages: string[];
  cutoffHours: number;
  status: DepartureStatus;
  updatedAt: string;
}

export interface BookingParticipant {
  fullName: string;
  age?: number;
  nationality?: string;
}

/** E-004 Booking */
export interface Booking {
  id: string;
  departureId: string;
  tourId: string;
  organizerId: string;
  leadTravelerName: string;
  leadEmail: string;
  leadPhone: string;
  paxCount: number;
  participants: BookingParticipant[];
  dietaryNotes: string | null;
  totalAmountUsd: number;
  depositAmountUsd: number;
  balanceDueToOrganizerUsd: number;
  platformCommissionUsd: number;
  paymentGateway: PaymentGateway;
  paymentGatewayRef: string | null;
  status: BookingStatus;
  createdAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
}

/** E-005 Verified Tourist Review */
export interface Review {
  id: string;
  bookingId: string;
  tourId: string;
  organizerId: string;
  authorName: string;
  authorCountry: string | null;
  tripDate: string;
  ratingOverall: 1 | 2 | 3 | 4 | 5;
  ratingGuide: 1 | 2 | 3 | 4 | 5;
  ratingAccommodation: 1 | 2 | 3 | 4 | 5;
  ratingTransport: 1 | 2 | 3 | 4 | 5;
  comment: string;
  photos: string[];
  isVerifiedBooker: true;
  organizerReply: string | null;
  repliedAt: string | null;
  createdAt: string;
}
