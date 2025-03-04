'use client';
import PropTypes from 'prop-types';

// next
import { SessionProvider } from 'next-auth/react';

// project-imports
import ThemeCustomization from 'themes';
import { ConfigProvider } from 'contexts/ConfigContext';
import RTLLayout from 'components/RTLLayout';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';

import Notistack from 'components/third-party/Notistack';
import Customization from 'components/customization';
import Snackbar from 'components/@extended/Snackbar';
import { StripeProvider } from 'contexts/StripeContext';

// ==============================|| PROVIDER WRAPPER  ||============================== //

export default function ProviderWrapper({ children }) {
  return (
    <ConfigProvider>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
                <Notistack>
                  <Snackbar />
                  <StripeProvider>
                  {children}
                  </StripeProvider>
                  <Customization />
                </Notistack>
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </ConfigProvider>
  );
}

ProviderWrapper.propTypes = { children: PropTypes.node };
