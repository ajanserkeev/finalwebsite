'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Mountain,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Heart,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Star,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  CurrencyCode,
  CURRENCY_RATES,
  REGION_META,
  KyrgyzstanRegion,
  formatMoney,
} from '@/types/marketplace';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currency,
    setCurrency,
    organizers,
    tours,
    priceClaims,
    activePartnerId,
    savedTourIds,
    myBookingIds,
    bookings,
    setWishlistOpen,
    setTripsOpen,
    resetDemoData,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [destMenuOpen, setDestMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestMenuOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePartner = organizers.find((o) => o.id === activePartnerId) || organizers[0];
  const pendingOrganizersCount = organizers.filter((o) => o.verificationStatus === 'pending').length;
  const pendingToursCount = tours.filter((t) => t.status === 'pending_review').length;
  const openClaimsCount = priceClaims.filter((c) => c.status === 'open').length;
  const totalAdminBadges = pendingOrganizersCount + pendingToursCount + openClaimsCount;

  const activeTripsCount = bookings.filter(
    (b) => myBookingIds.includes(b.id) && b.status !== 'refunded' && b.status !== 'cancelled'
  ).length;

  const verifiedOrgIds = new Set(
    organizers.filter((o) => o.isVerified && o.verificationStatus === 'verified').map((o) => o.id)
  );
  const publishedTours = tours.filter(
    (t) => t.status === 'published' && verifiedOrgIds.has(t.organizerId)
  );

  const q = searchQuery.trim().toLowerCase();
  const matchingRegions = (Object.keys(REGION_META) as KyrgyzstanRegion[]).filter(
    (key) =>
      !q ||
      REGION_META[key].name.toLowerCase().includes(q) ||
      REGION_META[key].nameRu.toLowerCase().includes(q) ||
      REGION_META[key].tagline.toLowerCase().includes(q)
  );
  const matchingTours = q
    ? publishedTours.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.routeSummary.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q)
      )
    : publishedTours.slice(0, 3);

  const isPartnerRoute = pathname?.startsWith('/partner');
  const isAdminRoute = pathname?.startsWith('/admin');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (searchQuery.trim()) {
      router.push(`/tours?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/tours');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Slim Viator Forest Utility Bar */}
      <div className="bg-[#004F32] text-white/90 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              Direct Organizer Price Guarantee · 0% Markup
            </span>
            <span className="hidden lg:inline text-white/30">|</span>
            <span className="hidden lg:inline text-emerald-100/90">
              Reserve with 20% online deposit · Free cancellation up to 15 days prior
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <Link
              href="/"
              className={`px-2.5 py-1 rounded-full font-semibold transition ${
                !isPartnerRoute && !isAdminRoute
                  ? 'bg-white text-[#004F32]'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/partner"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition ${
                isPartnerRoute
                  ? 'bg-white text-[#004F32]'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Partner Portal</span>
              <span className="hidden sm:inline opacity-80">
                ({activePartner?.toursSoldCount ?? 0} sold · {activePartner?.peopleSignedUpCount ?? 0} pax)
              </span>
            </Link>
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition ${
                isAdminRoute
                  ? 'bg-amber-400 text-gray-950'
                  : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Admin</span>
              {totalAdminBadges > 0 && (
                <span className="px-1.5 py-0 rounded-full bg-amber-400 text-gray-950 font-extrabold text-[10px]">
                  {totalAdminBadges}
                </span>
              )}
            </Link>
            <button
              onClick={resetDemoData}
              title="Reset demo bookings & changes"
              className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Crisp White Viator-Style Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3 lg:gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-[#008768] flex items-center justify-center text-white shadow-xs group-hover:bg-[#006B52] transition">
            <Mountain className="w-5 h-5" />
          </div>
          <div className="leading-none">
            <span className="font-display font-extrabold text-xl tracking-tight text-gray-900">
              Nomad<span className="text-[#008768]">Bridge</span>
            </span>
            <span className="ml-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E6F5F0] text-[#006B52] align-middle">
              KG
            </span>
          </div>
        </Link>

        {/* Global Viator Search Pill (Desktop & Tablet) */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search Song-Kul, Ala-Kul, Karakol, horseback..."
              className="w-full pl-10 pr-16 py-2.5 rounded-full bg-gray-50 border border-gray-300/90 hover:border-gray-400 focus:bg-white focus:border-[#008768] focus:ring-2 focus:ring-[#008768]/15 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search tours"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#008768] hover:bg-[#006B52] text-white flex items-center justify-center transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Instant Autocomplete Popover */}
          {searchOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50">
              <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
                {matchingRegions.length > 0 && (
                  <div>
                    <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Kyrgyzstan Destinations
                    </div>
                    <div className="space-y-1">
                      {matchingRegions.slice(0, 4).map((reg) => (
                        <Link
                          key={reg}
                          href={`/tours?region=${reg}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
                        >
                          <img
                            src={REGION_META[reg].imageUrl}
                            alt={REGION_META[reg].name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">
                              {REGION_META[reg].name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#008768]" />
                              {REGION_META[reg].altitude} · Kyrgyzstan
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {matchingTours.length > 0 && (
                  <div className="pt-1 border-t border-gray-100">
                    <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {q ? 'Matching Direct Tours' : 'Popular Experiences'}
                    </div>
                    <div className="space-y-1">
                      {matchingTours.slice(0, 4).map((t) => (
                        <Link
                          key={t.id}
                          href={`/tours/${t.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={t.heroImageUrl}
                              alt={t.title}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-gray-900 line-clamp-1">
                                {t.title}
                              </div>
                              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-0.5 text-gray-700 font-semibold">
                                  <Star className="w-3 h-3 fill-[#008768] text-[#008768]" />
                                  {t.ratingAvg.toFixed(1)}
                                </span>
                                <span>·</span>
                                <span>{t.durationDays}d</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-gray-900 shrink-0">
                            {formatMoney(t.basePriceUsd, currency)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {matchingRegions.length === 0 && matchingTours.length === 0 && (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No matching Kyrgyzstan tours for “{searchQuery}”. Try “Song-Kul”, “Ala-Kul”, or “horseback”.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-gray-700">
          {/* Destinations Dropdown */}
          <div ref={destRef} className="relative">
            <button
              type="button"
              onClick={() => setDestMenuOpen(!destMenuOpen)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-800 transition cursor-pointer"
            >
              Destinations
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  destMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {destMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-[520px] bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Explore Kyrgyzstan by Region
                  </span>
                  <Link
                    href="/tours"
                    onClick={() => setDestMenuOpen(false)}
                    className="text-xs font-bold text-[#008768] hover:underline"
                  >
                    View all tours →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((reg) => (
                    <Link
                      key={reg}
                      href={`/tours?region=${reg}`}
                      onClick={() => setDestMenuOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F0FAF6] transition group"
                    >
                      <img
                        src={REGION_META[reg].imageUrl}
                        alt={REGION_META[reg].name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 group-hover:text-[#008768] truncate">
                          {REGION_META[reg].name}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {REGION_META[reg].altitude}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/tours"
            className={`px-3 py-2 rounded-full transition ${
              pathname === '/tours'
                ? 'bg-[#E6F5F0] text-[#006B52]'
                : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            All Tours
          </Link>

          <Link
            href="/organizers"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full transition ${
              pathname?.startsWith('/organizers')
                ? 'bg-[#E6F5F0] text-[#006B52]'
                : 'hover:bg-gray-100 text-gray-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#008768]" />
            Organizers
          </Link>
        </nav>

        {/* Right Utility Icons (Currency, Wishlist, My Trips, Mobile Menu) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Currency Dropdown */}
          <div ref={currencyRef} className="relative">
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-full hover:bg-gray-100 text-xs font-bold text-gray-700 transition cursor-pointer"
              aria-label="Select currency"
            >
              <Globe className="w-4 h-4 text-gray-500" />
              <span>{currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 z-50">
                {(['USD', 'KGS', 'EUR', 'RUB'] as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCurrency(code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      currency === code ? 'text-[#008768] bg-[#F0FAF6]' : 'text-gray-700'
                    }`}
                  >
                    <span>
                      {CURRENCY_RATES[code].flag} {CURRENCY_RATES[code].label}
                    </span>
                    {currency === code && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            aria-label="Open saved tours wishlist"
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {savedTourIds.length > 0 && (
              <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#008768] text-white text-[10px] font-bold flex items-center justify-center">
                {savedTourIds.length}
              </span>
            )}
          </button>

          {/* My Trips Button */}
          <button
            type="button"
            onClick={() => setTripsOpen(true)}
            className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 hover:border-gray-900 bg-white text-xs font-bold text-gray-900 transition cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-[#008768]" />
            <span className="hidden sm:inline">My Trips</span>
            {activeTripsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#E6F5F0] text-[#006B52] text-[10px] font-extrabold">
                {activeTripsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Song-Kul, Ala-Kul, Karakol..."
              className="w-full pl-10 pr-20 py-2.5 rounded-full bg-gray-50 border border-gray-300 text-sm outline-none focus:border-[#008768]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-[#008768] text-white text-xs font-bold"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-gray-50 hover:bg-[#F0FAF6] text-gray-900"
            >
              All Kyrgyzstan Tours
            </Link>
            <Link
              href="/organizers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-gray-50 hover:bg-[#F0FAF6] text-gray-900"
            >
              Verified Organizers
            </Link>
            <Link
              href="/partner"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-[#E6F5F0] text-[#006B52]"
            >
              Partner Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-amber-50 text-amber-900"
            >
              Admin Panel ({totalAdminBadges})
            </Link>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Top Destinations
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(REGION_META) as KyrgyzstanRegion[]).map((reg) => (
                <Link
                  key={reg}
                  href={`/tours?region=${reg}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 hover:bg-[#E6F5F0] hover:text-[#006B52]"
                >
                  {REGION_META[reg].name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
