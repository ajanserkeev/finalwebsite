import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { MarketplaceProvider } from '@/context/MarketplaceContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DrawersAndToasts } from '@/components/DrawersAndToasts';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NomadBridge KG — Book Kyrgyzstan Tours Direct from Local Organizers',
  description:
    'Discover and book top-rated Kyrgyzstan mountain expeditions, Song-Kul yurt camps, horseback treks, and day trips at exact direct organizer prices (0% markup). Free cancellation, verified reviews & real-time seats.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#008768]/15 selection:text-[#004F32]">
        <MarketplaceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <DrawersAndToasts />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
