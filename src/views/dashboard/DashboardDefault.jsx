'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from '../../../node_modules/axios/index';
// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';

import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import ProjectOverview from 'sections/widget/chart/ProjectOverview';
import ProjectRelease from 'sections/dashboard/default/ProjectRelease';
import AssignUsers from 'sections/widget/statistics/AssignUsers';

import Transactions from 'sections/widget/data/Transactions';
import TotalIncome from 'sections/widget/chart/TotalIncome';

// assets
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from 'iconsax-react';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from 'store/authStore';
import { CircularProgress } from '../../../node_modules/@mui/material/index';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [data, setData] = useState();
  const theme = useTheme();
  const { getAnalyticDashboard } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatics = async () => {
      
        try {
          setLoading(true);
          const res = await getAnalyticDashboard();
          console.log(res);

            setData(res)
          
        } catch (error) {
          console.error('Error fetching analytics data:', error);
        } finally {
          setLoading(false);
        }
      
    };

    getStatics();
  }, []); // Dependencies ensure data is fetched once

  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mx: 'auto' }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          {/* row 1 */}
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard title="Total Users" count={data?.usersData?.usersCount} iconPrimary={<Wallet3 />}>
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3} overflow={'inherit'}>
            <EcommerceDataCard
              title="Active Users"
              count={data?.usersData?.totalActiveUsers}
              color="warning"
              iconPrimary={<Book color={theme.palette.warning.dark} />}
            >
              <EcommerceDataChart color={theme.palette.warning.dark} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Unverified users"
              count={data?.usersData?.unVerifiedUsersCount}
              color="success"
              iconPrimary={<Calendar color={theme.palette.success.darker} />}
            >
              <EcommerceDataChart color={theme.palette.success.darker} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Total Deposits"
              count={`${data?.depositsData?.amount} $`}
              color="error"
              iconPrimary={<CloudChange color={theme.palette.error.dark} />}
            >
              <EcommerceDataChart color={theme.palette.error.dark} />
            </EcommerceDataCard>
          </Grid>

          {/* row 2 */}
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard title="Total Investments" count={`${data?.investmentsData?.investmentsAmount} $`} iconPrimary={<Wallet3 />}>
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3} overflow={'inherit'}>
            <EcommerceDataCard
              title="Investments Count"
              count={data?.investmentsData?.investmentsCount}
              color="warning"
              iconPrimary={<Book color={theme.palette.warning.dark} />}
            >
              <EcommerceDataChart color={theme.palette.warning.dark} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Running Investments"
              count={data?.investmentsData?.runningInvestmentsCount}
              color="success"
              iconPrimary={<Calendar color={theme.palette.success.darker} />}
            >
              <EcommerceDataChart color={theme.palette.success.darker} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Pending Investments"
              count={data?.investmentsData?.pendingInvestmentsCount}
              color="error"
              iconPrimary={<CloudChange color={theme.palette.error.dark} />}
            >
              <EcommerceDataChart color={theme.palette.error.dark} />
            </EcommerceDataCard>
          </Grid>

          {/* row 3 */}
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RepeatCustomerRate />
              </Grid>
              <Grid item xs={12}>
                <ProjectOverview />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Stack spacing={3}>
              <ProjectRelease />
              <AssignUsers />
            </Stack>
          </Grid>

          {/* row 3 */}
          <Grid item xs={12} md={6}>
            <Transactions />
          </Grid>
          <Grid item xs={12} md={6}>
            <TotalIncome 
            running={data?.investmentsData?.runningInvestmentsAmount}
            pending={data?.investmentsData?.pendingInvestmentsAmount}
            rejected={data?.investmentsData?.refusedInvestmentsAmount}
            runningPer={data?.investmentsData?.runningInvestmentsCount / data?.investmentsData?.investmentsCount * 100}
            pendingPer={data?.investmentsData?.pendingInvestmentsCount / data?.investmentsData?.investmentsCount * 100}
            rejectedPer={data?.investmentsData?.refusedInvestmentsCount / data?.investmentsData?.investmentsCount * 100}
             />
          </Grid>
        </Grid>
      )}
    </>
  );
}
