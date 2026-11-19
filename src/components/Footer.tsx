import React from 'react';
import Link from 'next/link';
import {
  Mountain,
  ShieldCheck,
  CheckCircle2,
  Building2,
  SlidersHorizontal,
  Star,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0C1D17] text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        {/* Top Trust Strip */}
        <div className="pb-10 mb-10 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008768] flex items-center justify-center text-white">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-extrabold text-xl text-white">
                Nomad<span className="text-emerald-400">Bridge</span> KG
              </div>
              <div className="text-xs text-emerald-200/75">
                Direct Kyrgyzstan Tour Bridge · Verified Local Organizers
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.95 / 5</span>
              <span className="text-gray-400">Verified Traveler Rating</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              0% Markup Direct-Price Guarantee
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm">About NomadBridge KG</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Book multi-day Kyrgyzstan mountain expeditions, felt yurt camps, horseback treks, and day excursions directly from licensed local Kyrgyz organizers at their official direct price.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-gray-300">
              {['Visa', 'Mastercard', 'Freedom Pay', 'Finik', 'MBANK QR'].map((pm) => (
                <span
                  key={pm}
                  className="px-2 py-1 rounded-md bg-white/5 border border-white/10"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm mb-3.5">
              Top Kyrgyzstan Destinations
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/tours?region=song-kul" className="hover:text-white transition">
                  Song-Kul Alpine Lake (3,016m)
                </Link>
              </li>
              <li>
                <Link href="/tours?region=kel-suu" className="hover:text-white transition">
                  Kel-Suu Canyon & Tash-Rabat
                </Link>
              </li>
              <li>
                <Link href="/tours?region=karakol" className="hover:text-white transition">
                  Karakol, Ala-Kul & Altyn-Arashan
                </Link>
              </li>
              <li>
                <Link href="/tours?region=issyk-kul" className="hover:text-white transition">
                  Issyk-Kul South Shore & Skazka Canyon
                </Link>
              </li>
              <li>
                <Link href="/tours?region=pamir-osh" className="hover:text-white transition">
                  Osh, Sary-Chelek & Lenin Peak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm mb-3.5">
              Verified Local Organizers
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link
                  href="/organizers"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  Browse All Verified Organizers →
                </Link>
              </li>
              <li>
                <Link
                  href="/organizers/tien-shan-nomads"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Tien Shan Nomads Expedition
                </Link>
              </li>
              <li>
                <Link
                  href="/organizers/karakol-alpine-club"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Karakol Alpine & Freeride Club
                </Link>
              </li>
              <li>
                <Link
                  href="/organizers/pamir-silk-road-osh"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Pamir & Silk Road Odyssey
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm mb-3.5">
              For Tour Operators & Admin
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 font-semibold transition w-full"
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  Tour Operator Partner Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 font-semibold transition w-full"
                >
                  <SlidersHorizontal className="w-4 h-4 shrink-0" />
                  Platform Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 NomadBridge KG. All rights reserved.</span>
          <span>Bishkek · Karakol · Osh · Naryn, Kyrgyz Republic</span>
        </div>
      </div>
    </footer>
  );
}
