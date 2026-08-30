import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getCurrentUser } from './lib/dal';

export const metadata: Metadata = {
  title: '2Bucks — Win Big for ₹2',
  description: "India's fairest product draw platform. Enter any draw for just ₹2. Win iPhones, laptops, bikes and more.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#0A0F1E', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
