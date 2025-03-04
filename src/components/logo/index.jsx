'use client'
import PropTypes from 'prop-types';
// next
import Link from 'next/link';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project-imports
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from 'config';
import { useMemo } from 'react';

export default function LogoSection({ reverse, isIcon, sx, to }) {
  const memoizedLogoIcon = useMemo(() => <LogoIcon />, []);
  return (
    <ButtonBase disableRipple component={Link} href={!to ? APP_DEFAULT_PATH : to} sx={sx}>
      {memoizedLogoIcon}
    </ButtonBase>
  );
}

LogoSection.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool,
  sx: PropTypes.any,
  to: PropTypes.any,
};