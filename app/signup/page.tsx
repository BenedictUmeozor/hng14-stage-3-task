'use client';

import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return <SignupForm onSuccess={handleSuccess} />;
}
