import { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  const stripePromise = loadStripe('pk_test_51N2NceKnX4K2SmOpa2cXDvVeYcNy3c5V5uJ2mMVGqDAZEhBhoY9gZwsuuQlDAO2nnqnKpRTmyiDwbbvYk6dUZ3eK00PD2d4AYP');  // Replace with your Stripe public key

  return (
    <StripeContext.Provider value={stripePromise}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => useContext(StripeContext);
