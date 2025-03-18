import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
});
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: 'GeoVoyager',
  description:
    'Embark on an unforgettable journey across a beautifully rendered 3D Earth. Discover breathtaking landmarks, explore hidden gems, and experience the magic of travel like never before.',
  applicationName: 'GeoVoyager',
  keywords: [
    '3D Earth',
    'travel exploration',
    'world landmarks',
    'interactive globe',
    'virtual tourism',
  ],
  icons: [
    {
      rel: 'icon',
      url: '/favicon.svg',
      sizes: '138x138',
      type: 'image/svg+xml',
    },
  ],
  authors: [{ name: 'Iryna Vyshniak' }],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${playfairDisplay.variable} ${lora.variable} antialiased`}>
        {children}
        {modal}
      </body>
    </html>
  );
}
