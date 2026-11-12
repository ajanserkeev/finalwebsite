import React from 'react';
import Link from 'next/link';
import { Mountain, ShieldCheck, CheckCircle2, Building2, SlidersHorizontal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Mountain className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-white">
              NomadBridge <span className="text-teal-400">KG</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Kyrgyzstan’s transparent tour bridge aggregator. Book multi-day mountain, yurt, and horseback tours at the exact same price as booking directly with verified local organizers.
          </p>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-medium pt-1">
            <ShieldCheck className="w-4 h-4" />
            0% Markup · Verified Organizers · Verified Reviews
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Top Kyrgyzstan Regions</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tours?region=song-kul" className="hover:text-white transition">
                Song-Kul Alpine Lake (3,016m)
              </Link>
            </li>
            <li>
              <Link href="/tours?region=kel-suu" className="hover:text-white transition">
                Kel-Suu Canyon & Naryn
              </Link>
            </li>
            <li>
              <Link href="/tours?region=karakol" className="hover:text-white transition">
                Karakol, Ala-Kul & Altyn-Arashan
              </Link>
            </li>
            <li>
              <Link href="/tours?region=issyk-kul" className="hover:text-white transition">
                Issyk-Kul South Shore & Skazka
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
          <h4 className="text-white font-semibold text-sm mb-3">Verified Local Organizers</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/organizers/tien-shan-nomads" className="hover:text-white transition flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Tien Shan Nomads Expedition
              </Link>
            </li>
            <li>
              <Link href="/organizers/karakol-alpine-club" className="hover:text-white transition flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Karakol Alpine & Freeride Club
              </Link>
            </li>
            <li>
              <Link href="/organizers/pamir-silk-road-osh" className="hover:text-white transition flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Pamir & Silk Road Odyssey
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Platform Portals & Acquiring</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/partner"
                className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-medium"
              >
                <Building2 className="w-4 h-4" />
                Tour Operator / Partner Portal →
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Platform Admin Control Panel →
              </Link>
            </li>
            <li className="text-xs text-slate-500 pt-2">
              Supported Payments: Visa, Mastercard (Freedom Pay KG / Stripe), Finik QR, MBANK & Elkart.
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-900 py-5 text-center text-xs text-slate-500">
        © 2026 NomadBridge KG — Built from the RES Study of Bolshaya Strana & Viator for Kyrgyzstan Tourism.
      </div>
    </footer>
  );
}

