import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Téranga S'cool · Plateforme d'apprentissage",
  description: "Plateforme éducative d'excellence au Sénégal et en Afrique de l'Ouest",
  icons: {
    icon: '/images/logo-teranga.jpeg',
    shortcut: '/images/logo-teranga.jpeg',
    apple: '/images/logo-teranga.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon" href="/images/logo-teranga.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/logo-teranga.jpeg" />
      </head>
      <body className="h-full bg-[#F8F5EE] text-stone-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
