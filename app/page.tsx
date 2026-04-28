'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '../components/SplashScreen';
import { getSession } from '@/lib/auth';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  const handleSplashComplete = () => {
    setShowSplash(false);
    
    // Check for session after splash completes
    const session = getSession();
    
    if (session) {
      // Redirect to dashboard if session exists
      router.push('/dashboard');
    } else {
      // Redirect to login if no session
      router.push('/login');
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // This will briefly show while redirecting
  return null;
}
