'use client';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useAuthStore } from 'store/authStore';
import Loader from 'components/Loader';
import { useRouter } from 'next/navigation';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard/default?isp=1');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loader />;
  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
