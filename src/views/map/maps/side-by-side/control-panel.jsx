'use client';
import PropTypes from 'prop-types';

import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// project-import
import ControlPanelStyled from 'components/third-party/map/ControlPanelStyled';
import { ThemeMode } from 'config';

// ==============================|| SIDE BY SIDE - CONTROL ||============================== //

function ControlPanel({ mode, onModeChange }) {
  const theme = useTheme();

  return (
    <ControlPanelStyled>
      <ToggleButtonGroup value={mode} exclusive onChange={onModeChange}>
        <ToggleButton
          sx={{ border: '1px solid', borderColor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50' }}
          value="side-by-side"
        >
          Side by side
        </ToggleButton>
        <ToggleButton
          sx={{ border: '1px solid', borderColor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.50' }}
          value="split-screen"
        >
          Split screen
        </ToggleButton>
      </ToggleButtonGroup>
    </ControlPanelStyled>
  );
}

export default memo(ControlPanel);

ControlPanel.propTypes = { mode: PropTypes.any, onModeChange: PropTypes.any };
