'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import AdminHeader from '../components/AdminHeader';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide site Nav + Footer only on sign-in and admin (all other routes unchanged)
  const isAdminRoute = pathname.startsWith('/admin');
  const isSignInRoute =
    pathname === '/signin' || pathname.startsWith('/signin/');
  const hideSiteChrome = isAdminRoute || isSignInRoute;

  useEffect(() => {
    if (hideSiteChrome) return;

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

  }, [pathname, hideSiteChrome]);

  return (
    <>
      {isAdminRoute && <AdminHeader />} 
      {!hideSiteChrome && <Nav />}
      <main>{children}</main>
      {!hideSiteChrome && <Footer />}
    </>
  );
}
