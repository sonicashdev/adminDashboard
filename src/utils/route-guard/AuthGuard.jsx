'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from 'store/authStore';
import Loader from 'components/Loader';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth  } = useAuthStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isLoading) {
        if (!isAuthenticated) {
          const resp = await checkAuth();
          if (resp.status === 404 ) {
              router.push('/login')
          } 

        } 
      }
    };

    checkAuthentication();
  }, [isAuthenticated, isLoading, checkAuth, router]);

  if (isLoading) return <Loader />; 
  return <>{children}</>;
}
