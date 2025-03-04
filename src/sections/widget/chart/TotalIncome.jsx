import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

// third-party
import ReactApexChart from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import { ThemeMode } from 'config';

// assets
import { ArrowUp, ArrowDown2 } from 'iconsax-react';

// ==============================|| CHART ||============================== //

function ApexDonutChart({
  runningPer = 0,
  pendingPer = 0,
  rejectedPer = 0,
  running = 0,
  pending = 0,
  rejected = 0,
}) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const mode = theme.palette.mode;

  const { primary } = theme.palette.text;
  const line = theme.palette.divider;
  const grey200 = theme.palette.secondary[200];
  const backColor = theme.palette.background.paper;

  // Validate props to ensure they are valid numbers
  const validateProps = (value, defaultValue = 0) => {
    return typeof value === 'number' && !isNaN(value) ? value : defaultValue;
  };

  const validatedRunningPer = validateProps(runningPer);
  const validatedPendingPer = validateProps(pendingPer);
  const validatedRejectedPer = validateProps(rejectedPer);
  const validatedRunning = validateProps(running);
  const validatedPending = validateProps(pending);
  const validatedRejected = validateProps(rejected);

  const [series] = useState([validatedRunningPer, validatedPendingPer, validatedRejectedPer]);

  const pieChartOptions = {
    chart: {
      type: 'donut',
      height: 320,
    },
    labels: ['Running', 'Pending', 'Rejected'], // Labels for the chart
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex }) {
          // Show the amount instead of percentage on hover
          if (seriesIndex === 0) {
            return `$${validatedRunning}`; // For Running investments
          } else if (seriesIndex === 1) {
            return `$${validatedPending}`; // For Pending investments
          } else if (seriesIndex === 2) {
            return `$${validatedRejected}`; // For Rejected investments
          }
          return value;
        },
      },
    },
  };

  const [options, setOptions] = useState(pieChartOptions);

  useEffect(() => {
    const primaryMain = theme.palette.primary.main;
    const primaryLighter = theme.palette.primary[100];
    const warning = theme.palette.warning.main;
    const success = theme.palette.success.main;

    setOptions((prevState) => ({
      ...prevState,
      colors: [success, primaryLighter, warning], // Colors for the chart segments
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
      stroke: {
        colors: [backColor],
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light',
      },
    }));
  }, [mode, primary, line, grey200, backColor, theme]);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      width={downSM ? 280 : 320}
      height={downSM ? 280 : 320}
      id="total-income-chart"
    />
  );
}

// ==============================|| CHART WIDGETS - TOTAL INCOME ||============================== //

export default function TotalIncome({
  running = 0,
  pending = 0,
  rejected = 0,
  runningPer = 0,
  pendingPer = 0,
  rejectedPer = 0,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">Total Investments</Typography>
            <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'wallet-button',
                sx: { p: 1.25, minWidth: 150 },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center">
            <ApexDonutChart
              runningPer={runningPer}
              pendingPer={pendingPer}
              rejectedPer={rejectedPer}
              running={running}
              pending={pending}
              rejected={rejected}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot componentDiv sx={{ bgcolor: 'green' }} />
                <Typography>Running</Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ${running}
                <Typography
                  variant="caption"
                  color="green"
                  sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}
                >
                  <ArrowUp size={14} /> ${pending}
                </Typography>
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot componentDiv sx={{ bgcolor: 'primary.200' }} />
                <Typography>Pending</Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ${pending}
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack alignItems="flex-start" sx={{ p: 2 }} spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Dot componentDiv color="warning" />
                <Typography>Rejected</Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ${rejected}
                <Typography
                  variant="caption"
                  color="red"
                  sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}
                >
                  <ArrowDown2 size={14} />
                </Typography>
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}