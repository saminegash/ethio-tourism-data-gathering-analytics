import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ethiopia Tourism Companion',
  description: 'Offline-first travel app for Ethiopian destinations'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
