import PropTypes from 'prop-types';

import './globals.css';

// project-imports
import ProviderWrapper from './ProviderWrapper';

export const metadata = {
  title: 'Sonicash - Crypto Investment platform',
  description: 'Sonicash - Crypto Investment platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}

RootLayout.propTypes = { children: PropTypes.node };
