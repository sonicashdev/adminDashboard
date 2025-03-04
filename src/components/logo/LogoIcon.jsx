import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import axios from 'axios';

const LogoIcon = React.memo(() => {
  const [logo, setLogo] = useState({
    darkModeLogo: null,
    lightModeLogo: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    const getLogo = async () => {
      // Retrieve the cached logo from localStorage
      const cachedLogo = localStorage.getItem('logo');
      console.log(cachedLogo, 'cached logo');

      try {
        // Fetch the latest logos from the server
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/website-images`);
        const logoData = {
          darkModeLogo: response.data.websiteImages.websiteImages.darkModeLogo,
          lightModeLogo: response.data.websiteImages.websiteImages.lightModeLogo,
        };
        console.log(logoData, 'logo data');

        // If no cached logo or logos have changed, update localStorage and state
        if (!cachedLogo || JSON.stringify(logoData) !== cachedLogo) {
          setLogo(logoData);
          localStorage.setItem('logo', JSON.stringify(logoData)); // Cache the new logo data
          console.log('changed logo');
        } else {
          setLogo(JSON.parse(cachedLogo)); // Use cached logo if it matches the server logos
          console.log('same');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        setError('Failed to load logo');
      } finally {
        setLoading(false);
      }
    };

    getLogo();
  }, []);

  // Memoize the logo URL based on the current theme
  const logoUrl = useMemo(() => {
    return theme.palette.mode === ThemeMode.DARK ? logo.darkModeLogo : logo.lightModeLogo;
  }, [theme.palette.mode, logo.darkModeLogo, logo.lightModeLogo]);

  // if (loading) {
  //   return <div>Loading...</div>; // Or a spinner/placeholder
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <img
      src={logoUrl}
      alt="icon logo"
      width="100"
    />
  );
});

export default LogoIcon;