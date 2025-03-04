'use client'
import { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, FormControlLabel, Switch, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';

export default function GeneralSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    title: '',
    registerationBonus: {
      bonusAmount: 0,
      bonusStatus: false,
    },
    referralBonus: {
      bonusAmount: 0,
      bonusStatus: false,
    },
    KYC: false,
    emailVerification: false,
    Tax: 0,
  });

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`);
        const { generalSettings } = response.data.mainSettings;
        setGeneralSettings(generalSettings);
      } catch (error) {
        console.error('Error fetching general settings:', error);
      }
    };

    fetchGeneralSettings();
  }, []);

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;

    if (name === 'bonusStatus') {
      setGeneralSettings((prev) => ({
        ...prev,
        registerationBonus: {
          ...prev.registerationBonus,
          bonusStatus: checked,
        },
      }));
    } else if (name === 'bonusStatusRef') {
      setGeneralSettings((prev) => ({
        ...prev,
        referralBonus: {
          ...prev.referralBonus,
          bonusStatus: checked,
        },
      }));
    } else {
      setGeneralSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'bonusAmount') {
      setGeneralSettings((prev) => ({
        ...prev,
        registerationBonus: {
          ...prev.registerationBonus,
          bonusAmount: value,
        },
      }));
    } else if (name === 'referralBonusAmount') {
      setGeneralSettings((prev) => ({
        ...prev,
        referralBonus: {
          ...prev.referralBonus,
          bonusAmount: value,
        },
      }));
    } else {
      setGeneralSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`,
        {
          generalSettings,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success('General Settings Updated Successfully');
      }
    } catch (error) {
      toast.error('Error updating general settings');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="General Settings">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Title"
                    fullWidth
                    name="title"
                    variant="outlined"
                    value={generalSettings.title}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Tax Amount"
                    fullWidth
                    name="Tax"
                    variant="outlined"
                    type="number"
                    value={generalSettings.Tax}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Referral Bonus Amount"
                    fullWidth
                    name="referralBonusAmount"
                    variant="outlined"
                    type="number"
                    value={generalSettings.referralBonus.bonusAmount}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Register Bonus Amount"
                    fullWidth
                    name="bonusAmount"
                    variant="outlined"
                    type="number"
                    value={generalSettings.registerationBonus.bonusAmount}
                    onChange={handleInputChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.KYC}
                        onChange={handleSwitchChange}
                        name="KYC"
                        color="primary"
                      />
                    }
                    label={generalSettings.KYC ? 'KYC Verification Enabled' : 'KYC Verification Disabled'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.referralBonus.bonusStatus}
                        onChange={handleSwitchChange}
                        name="bonusStatusRef"
                        color="primary"
                      />
                    }
                    label={generalSettings.referralBonus.bonusStatus ? 'Referral Bonus Active' : 'Referral Bonus Disabled'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.emailVerification}
                        onChange={handleSwitchChange}
                        name="emailVerification"
                        color="primary"
                      />
                    }
                    label={generalSettings.emailVerification ? 'Email Verification Enabled' : 'Email Verification Disabled'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={generalSettings.registerationBonus.bonusStatus}
                        onChange={handleSwitchChange}
                        name="bonusStatus"
                        color="primary"
                      />
                    }
                    label={generalSettings.registerationBonus.bonusStatus ? 'Registeration Bonus Active' : 'Registeration Bonus Disabled'}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="contained" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}