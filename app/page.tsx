'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '../components/SplashScreen';
import { getSession } from '@/lib/auth';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleSplashComplete = useCallback(() => {
    if (isRedirecting) return; // Prevent multiple redirects
    
    setShowSplash(false);
    setIsRedirecting(true);
    
    // Check for session after splash completes
    const session = getSession();
    
    if (session) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router, isRedirecting]);

  // Prevent showing splash on back navigation
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash === 'true') {
      setShowSplash(false);
      const session = getSession();
      router.replace(session ? '/dashboard' : '/login');
    } else {
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, [router]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return null;
}
