import type { Metadata } from 'next';
import { Poppins, Play } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import QueryProvider from '@/providers/QueryProvider';
import Navbar from '@/components/appComponets/Navbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// const abel = Abel({
//   subsets: ['latin'],
//   weight: ['400'],
//   variable: '--font-abel',
// });

// const oswald = Oswald({
//   subsets: ['latin'],
//   weight: ['400', '500', '700'],
//   variable: '--font-oswald',
// });

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play',
});

export const metadata: Metadata = {
  title: 'FilmSphere',
  description:
    'Explore the world of cinema like never before. Discover movies, reviews, and more on FilmSphere.',
  icons: {
    icon: [
      { url: '/logo/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/logo.png', sizes: '16x16', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        poppins.variable,
        // abel.variable,
        // oswald.variable,
        play.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <Navbar />
          {children}
          {/* <Toaster position="top-right" richColors /> */}
        </QueryProvider>
      </body>
    </html>
  );
}
