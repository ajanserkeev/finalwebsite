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

export type CurrencyCode = 'USD' | 'KGS' | 'EUR' | 'RUB';

export interface GuideMember {
  name: string;
  role: string;
  experienceYears: number;
  languages: string[];
  avatarUrl: string;
}

export interface Organizer {
  id: string;
  slug: string;
  brandName: string;
  legalName: string;
  registrationNumber: string;
  baseCity: 'Bishkek' | 'Karakol' | 'Osh' | 'Naryn' | 'Cholpon-Ata';
  bio: string;
  logoUrl: string;
  coverUrl: string;
  directSiteUrl: string;
  phone: string;
  email: string;
  telegramHandle: string;
  languages: string[];
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  commissionPercent: number;
  ratingAvg: number;
  reviewsCount: number;
  toursSoldCount: number;
  peopleSignedUpCount: number;
  foundedYear: number;
  fleetSummary: string;
  guides: GuideMember[];
  createdAt: string;
  verifiedAt: string | null;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  distanceKm?: number;
  drivingHours?: string;
  maxAltitudeM?: number;
  meals: ('B' | 'L' | 'D')[];
  accommodation: string;
}

export interface Tour {
  id: string;
  organizerId: string;
  slug: string;
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
  galleryUrls: string[];
  routeSummary: string;
  itineraryDays: ItineraryDay[];
  accommodationDetails: string;
  transportDetails: string;
  inclusions: string[];
  exclusions: string[];
  status: TourStatus;
  ratingAvg: number;
  reviewsCount: number;
  createdAt: string;
  priceVerifiedAt: string | null;
}

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

export interface Booking {
  id: string;
  bookingCode: string;
  departureId: string;
  tourId: string;
  organizerId: string;
  leadTravelerName: string;
  leadEmail: string;
  leadPhone: string;
  leadCountry: string;
  paxCount: number;
  participants: BookingParticipant[];
  dietaryNotes: string | null;
  totalAmountUsd: number;
  depositAmountUsd: number;
  balanceDueToOrganizerUsd: number;
  platformCommissionUsd: number;
  paymentGateway: PaymentGateway;
  paymentGatewayRef: string;
  reviewToken: string;
  hasReview: boolean;
  status: BookingStatus;
  createdAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
}

export interface Review {
  id: string;
  bookingId: string;
  tourId: string;
  organizerId: string;
  authorName: string;
  authorCountry: string;
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

export interface PriceMatchClaim {
  id: string;
  tourId: string;
  organizerId: string;
  touristName: string;
  touristEmail: string;
  competitorUrl: string;
  claimedPriceUsd: number;
  notes: string;
  status: 'open' | 'matched' | 'dismissed';
  createdAt: string;
}

export const REGION_META: Record<
  KyrgyzstanRegion,
  { name: string; nameRu: string; tagline: string; imageUrl: string; altitude: string }
> = {
  'song-kul': {
    name: 'Song-Kul Alpine Lake',
    nameRu: 'Озеро Сон-Куль',
    tagline: 'High-Altitude Nomadic Pastures, Felt Yurt Camps & Wild Horses',
    imageUrl: '/images/hero-song-kul.jpg',
    altitude: '3,016m',
  },
  'issyk-kul': {
    name: 'Issyk-Kul & Skazka Canyon',
    nameRu: 'Иссык-Куль и каньон Сказка',
    tagline: 'Red Sandstone Fairy Tale Canyons, Eagle Hunters & Alpine Beaches',
    imageUrl: '/images/issyk-kul-skazka.jpg',
    altitude: '1,607m',
  },
  'kel-suu': {
    name: 'Kel-Suu & Naryn',
    nameRu: 'Кель-Суу и Нарын',
    tagline: 'Dramatic Emerald Canyon Lake & Tash-Rabat Stone Caravanserai',
    imageUrl: '/images/kel-suu-canyon.jpg',
    altitude: '3,514m',
  },
  karakol: {
    name: 'Karakol & Ala-Kul Lake',
    nameRu: 'Каракол и озеро Ала-Куль',
    tagline: 'Turquoise Glacier Lake, Altyn-Arashan Hot Springs & Jeti-Oguz',
    imageUrl: '/images/ala-kul-karakol.jpg',
    altitude: '2,500–3,900m',
  },
  'ala-archa': {
    name: 'Ala-Archa & Bishkek',
    nameRu: 'Ала-Арча и Бишкек',
    tagline: 'Glacier Peaks 40 Minutes from Bishkek & Burana Silk Road Tower',
    imageUrl: '/images/ala-archa-gorge.jpg',
    altitude: '2,100–3,300m',
  },
  'sary-chelek': {
    name: 'Sary-Chelek & Arslanbob',
    nameRu: 'Сары-Челек и Арсланбоб',
    tagline: 'UNESCO Biosphere Alpine Lakes & Ancient Walnut Forests',
    imageUrl: '/images/sary-chelek-lake.jpg',
    altitude: '1,873m',
  },
  'pamir-osh': {
    name: 'Osh & Lenin Peak Basecamp',
    nameRu: 'Ош и Памир (Пик Ленина)',
    tagline: '3,000-Year-Old Osh Bazaar, Tulpar-Kul Lake & 7,134m Lenin Peak',
    imageUrl: '/images/pamir-lenin-peak.jpg',
    altitude: '3,600m',
  },
};

export const ACTIVITY_META: Record<ActivityType, { label: string; shortLabel: string; iconName: string }> = {
  'jeep-4wd': { label: '4WD Jeep Expeditions', shortLabel: '4WD Expeditions', iconName: 'Compass' },
  horseback: { label: 'Horseback Nomadic Treks', shortLabel: 'Horseback Treks', iconName: 'Mountain' },
  trekking: { label: 'High-Altitude Trekking', shortLabel: 'Alpine Trekking', iconName: 'Footprints' },
  'cultural-yurt': { label: 'Yurt & Eagle Culture', shortLabel: 'Yurt & Culture', iconName: 'Tent' },
  'day-trip': { label: '1-Day Excursions', shortLabel: 'Day Trips', iconName: 'Sun' },
  'winter-ski': { label: 'Winter Ski & Freeride', shortLabel: 'Ski & Freeride', iconName: 'Snowflake' },
};

export const DIFFICULTY_META: Record<
  DifficultyLevel,
  { label: string; short: string; description: string; colorClass: string }
> = {
  1: {
    label: '1/5 Easy (Sightseeing)',
    short: 'Easy',
    description: 'Short walks on flat trails; suitable for all ages and families.',
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  2: {
    label: '2/5 Moderate (Light Active)',
    short: 'Moderate',
    description: '1–3 hour scenic walks or gentle horseback rides; no prior experience required.',
    colorClass: 'bg-[#E6F5F0] text-[#006B52] border-[#008768]/20',
  },
  3: {
    label: '3/5 Active (Mountain Trails)',
    short: 'Active',
    description: '3–5 hours daily hiking or horseback riding up to 3,200m altitude.',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  4: {
    label: '4/5 Challenging (High Altitude)',
    short: 'Challenging',
    description: 'Steep mountain passes up to 3,900m (e.g., Ala-Kul); good cardiovascular fitness needed.',
    colorClass: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  5: {
    label: '5/5 Expedition (Autonomous)',
    short: 'Expedition',
    description: 'Multi-day high-altitude expedition above 4,000m; prior trekking experience required.',
    colorClass: 'bg-rose-50 text-rose-800 border-rose-200',
  },
};

export const COMFORT_META: Record<
  ComfortLevel,
  { label: string; short: string; description: string }
> = {
  basic_tent: {
    label: 'Camping Tents & Mountain Huts',
    short: 'Tents & Camps',
    description: '2-person expedition tents, sleeping mats provided, camp meals under the stars.',
  },
  nomadic_yurt: {
    label: 'Authentic Felt Yurt Camps & Guesthouses',
    short: 'Yurts & Guesthouses',
    description: 'Traditional heated felt yurts (4 beds per yurt, shared heated washrooms) + family guesthouses.',
  },
  standard_guesthouse: {
    label: 'Private En-Suite Guesthouses & Glamping',
    short: 'En-Suite & Glamping',
    description: 'Twin rooms with private bathrooms on most nights; upgraded boutique yurts at lakes.',
  },
  comfort_hotel: {
    label: 'Comfort 3–4* Hotels & Eco-Lodges',
    short: 'Comfort Hotels',
    description: 'Private en-suite rooms in top regional hotels and premium heated glamping domes.',
  },
};

export const CURRENCY_RATES: Record<
  CurrencyCode,
  { symbol: string; rateFromUsd: number; label: string; flag: string }
> = {
  USD: { symbol: '$', rateFromUsd: 1, label: 'USD ($)', flag: '🇺🇸' },
  KGS: { symbol: 'сом', rateFromUsd: 86.8, label: 'KGS (сом)', flag: '🇰🇬' },
  EUR: { symbol: '€', rateFromUsd: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  RUB: { symbol: '₽', rateFromUsd: 96.5, label: 'RUB (₽)', flag: '🇷🇺' },
};

export function formatMoney(amountUsd: number, currency: CurrencyCode = 'USD'): string {
  const cfg = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(amountUsd * cfg.rateFromUsd);
  if (currency === 'KGS') {
    return `${converted.toLocaleString('en-US')} KGS`;
  }
  if (currency === 'RUB') {
    return `${converted.toLocaleString('en-US')} ₽`;
  }
  return `${cfg.symbol}${converted.toLocaleString('en-US')}`;
}

export function formatShortDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return isoDate;
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDateRange(startIso: string, endIso: string): string {
  if (!startIso) return '';
  if (!endIso || startIso === endIso) return formatShortDate(startIso);
  const sParts = startIso.split('-').map(Number);
  const eParts = endIso.split('-').map(Number);
  if (sParts.length !== 3 || eParts.length !== 3) return `${startIso} – ${endIso}`;
  const sDt = new Date(Date.UTC(sParts[0], sParts[1] - 1, sParts[2]));
  const eDt = new Date(Date.UTC(eParts[0], eParts[1] - 1, eParts[2]));
  const sStr = sDt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const eStr = eDt.toLocaleDateString('en-US', {
    month: sParts[1] === eParts[1] ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return `${sStr} – ${eStr}`;
}
