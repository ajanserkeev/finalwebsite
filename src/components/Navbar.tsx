'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mountain,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  Compass,
  RotateCcw,
  Users,
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { CurrencyCode } from '@/types/marketplace';

export function Navbar() {
  const pathname = usePathname();
  const {
    currency,
    setCurrency,
    organizers,
    tours,
    priceClaims,
    activePartnerId,
    resetDemoData,
  } = useMarketplace();

  const activePartner = organizers.find((o) => o.id === activePartnerId) || organizers[0];
  const pendingOrganizersCount = organizers.filter((o) => o.verificationStatus === 'pending').length;
  const pendingToursCount = tours.filter((t) => t.status === 'pending_review').length;
  const openClaimsCount = priceClaims.filter((c) => c.status === 'open').length;
  const totalAdminBadges = pendingOrganizersCount + pendingToursCount + openClaimsCount;

  const isPartnerRoute = pathname?.startsWith('/partner');
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Role & Direct-Price Guarantee Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-medium text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              0% Markup Guarantee — Same Price as Booking Direct with Kyrgyz Organizers
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              Pay only 20% deposit online · Balance paid directly to your organizer on arrival
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 hidden sm:inline">Switch Portal:</span>
            <Link
              href="/"
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                !isPartnerRoute && !isAdminRoute
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tourist Marketplace
            </Link>
            <Link
              href="/partner"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                isPartnerRoute
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Operator Portal ({activePartner?. toursSoldCount ?? 0} sold ·{' '}
              {activePartner?.peopleSignedUpCount ?? 0} pax)
            </Link>
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition ${
                isAdminRoute
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Admin Panel
              {totalAdminBadges > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {totalAdminBadges}
                </span>
              )}
            </Link>
            <button
              onClick={resetDemoData}
              title="Reset Demo Data to Initial State"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
              NomadBridge <span className="text-teal-600">KG</span>
            </div>
            <div className="text-[11px] text-slate-500 -mt-1 font-medium">
              Direct Kyrgyzstan Tours Aggregator
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link
            href="/tours"
            className="hover:text-teal-600 transition flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-teal-600" />
            All Kyrgyzstan Tours
          </Link>
          <Link
            href="/tours?region=song-kul"
            className="hover:text-teal-600 transition"
          >
            Song-Kul Yurts
          </Link>
          <Link
            href="/tours?region=kel-suu"
            className="hover:text-teal-600 transition"
          >
            Kel-Suu Canyon
          </Link>
          <Link
            href="/tours?region=karakol"
            className="hover:text-teal-600 transition"
          >
            Karakol & Ala-Kul
          </Link>
          <Link
            href="/organizers/tien-shan-nomads"
            className="hover:text-teal-600 transition flex items-center gap-1"
          >
            <Users className="w-4 h-4 text-teal-600" />
            Verified Organizers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['USD', 'KGS', 'EUR', 'RUB'] as CurrencyCode[]).map((code) => (
              <button
                key={code}
                onClick={() => setCurrency(code)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  currency === code
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <Link
            href="/partner"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            For Organizers
          </Link>
        </div>
      </div>
    </header>
  );
}

