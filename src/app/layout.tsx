import type { Metadata } from 'next';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'NomadBridge KG — Direct Kyrgyzstan Tours Aggregator (0% Markup)',
  description:
    'Book multi-day Kyrgyzstan mountain, yurt, and horseback tours directly from verified local organizers at their official direct price. Open organizer profiles, real tourist reviews, Partner Portal & Admin Panel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <MarketplaceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MarketplaceProvider>
      </body>
    </html>
  );
}

