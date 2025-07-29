'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';
import Loader from './loader';
import ChatLauncher from '@/components/ui/chat-launcher';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <Header title="Listable" />
      {loading && <Loader />}
      <main className={`${loading ? 'opacity-30 pointer-events-none' : ''} transition-opacity`}>
        {children}
      </main>

      {/* ✅ Floating Chat Assistant */}
      <ChatLauncher />

      <Footer />
    </>
  );
}
