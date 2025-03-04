import React, { useEffect, useState } from 'react';
import GooglePayButton from '@google-pay/button-react';
import axios from 'axios';

const GooglePayButtonn = ({ onSuccess, onError, planId, cost }) => {
  const [googlePaySettings, setGooglePaySettings] = useState(null);
  const [userInvestmentStatus, setUserInvestmentStatus] = useState(null); // Track investment status
  const [investmentMessage, setInvestmentMessage] = useState(''); // Store status message

  // Fetch Google Pay settings from the backend
  useEffect(() => {
    const fetchGooglePaySettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/main-settings', { withCredentials: true });
        setGooglePaySettings(response.data.mainSettings.googlePaySettings);
      } catch (error) {
        console.error('Error fetching Google Pay settings:', error);
      }
    };

    const fetchUserInvestmentStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/investment/status',{ withCredentials: true });
         console.log(response)
        // If the user has a pending investment, show a message
        if (response.status === 200 && response.data.message === 'You Have A Plan Under Review! Please Wait') {
          setInvestmentMessage(response.data.message); // Use message from backend
          setUserInvestmentStatus('Pending'); // Set investment status as Pending
        } else {
          setInvestmentMessage(''); // Clear any previous messages
          setUserInvestmentStatus(''); // No pending investment
        }
      } catch (error) {
        console.error('Error fetching user investment status:', error);
        setInvestmentMessage('Error fetching investment status. Please try again.');
      }
    };

    fetchGooglePaySettings();
    fetchUserInvestmentStatus();
  }, []);

  const handlePaymentSuccess = async (paymentRequest) => {
    try {
      // Prepare payment data to send to the backend for processing investment
      const paymentData = {
        paymentData: paymentRequest.paymentMethodData, // This is the payment data received from Google Pay
        planId,
      };

      const response = await axios.post(
        'http://localhost:5000/api/user/investment',
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('Investment processed successfully:', response.data);
        onSuccess(response.data);
      } else {
        onError(new Error('Investment processing failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      onError(error); // Pass error to onError callback
    }
  };

  if (!googlePaySettings || userInvestmentStatus === null) {
    return <div>Loading...</div>; // Show a loading message until settings and investment status are fetched
  }

  // If the user's investment status is "Pending", show the message instead of the button
  if (userInvestmentStatus === 'Pending') {
    return <div>{investmentMessage}</div>; // Show message from backend
  }

  return (
    <GooglePayButton
      environment={googlePaySettings.googlePayEnvironment} // Use environment from settings
      buttonSizeMode={googlePaySettings.googlePayButtonSizeMode} // Use button size mode from settings
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: googlePaySettings.googlePayAllowedPaymentMethods, // Use allowed payment methods from settings
        merchantInfo: googlePaySettings.googlePayMerchantInfo, // Use merchant info from settings
        transactionInfo: {
          totalPriceStatus: googlePaySettings.googlePayTransactionInfo.totalPriceStatus, // Use transaction info from settings
          totalPriceLabel: googlePaySettings.googlePayTransactionInfo.totalPriceLabel,
          totalPrice: `${cost}`,
          currencyCode: googlePaySettings.googlePayTransactionInfo.currencyCode,
          countryCode: googlePaySettings.googlePayTransactionInfo.countryCode,
        },
      }}
      onLoadPaymentData={handlePaymentSuccess} // Handle successful payment
      onError={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
};

export default GooglePayButtonn;
