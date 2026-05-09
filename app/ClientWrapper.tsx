'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminHeader from '../components/AdminHeader';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define excluded routes where we don't want Header/Footer
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  useEffect(() => {
    if (isAdminRoute || isAuthRoute) return;

    let visitorId = document.cookie
      .split('; ')
      .find(row => row.startsWith('visitor_id='))
      ?.split('=')[1];

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      document.cookie = `visitor_id=${visitorId}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
    }

    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageUrl: pathname, visitorId }),
    }).catch(console.error);

  }, [pathname, isAdminRoute, isAuthRoute]);

  return (
    <>
      {/* Only show headers/footers if not on admin or signin/signup pages */}
      {isAdminRoute ? <AdminHeader /> : !isAuthRoute && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  );
}
