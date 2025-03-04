'use client'
import { useEffect } from 'react';
import axios from 'axios'
import { useSearchParams } from 'next/navigation';
import { Box } from '../../../node_modules/@mui/material/index';
import toast, { Toaster } from '../../../node_modules/react-hot-toast/dist/index';
import { useAuthStore } from 'store/authStore';
export default function SuccessPage() {
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const {getPyamentDetails} = useAuthStore()
  useEffect(() => {
    // Get session_id from URL

    const fetchPaymentDetails = async () => {
      const response = await getPyamentDetails(session_id)
      console.log(response)
      if (response.data.success) {
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    };

    if (session_id) {
      fetchPaymentDetails();
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
        <Toaster />
    </Box>
  );
}