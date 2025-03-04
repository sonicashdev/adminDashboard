'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, FormControlLabel, Switch, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';

export default function NotificationSettings() {
  const [notificationSettings, setNotificationSettings] = useState({
    appId: '',
    key: '',
    secret: '',
    cluster: '',
    useTLS: false,
    channel: '',
    event: ''
  });

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`);
        const { notificationSettings } = response.data.mainSettings;
        setNotificationSettings(notificationSettings);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`, {
        notificationSettings,
      }, { withCredentials: true });

      if (res.status === 200) {
        toast.success('Notification Settings Updated Successfully');
      }
    } catch (error) {
      toast.error('Error updating notification settings');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Notification Settings">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <TextField
                    label="appId"
                    fullWidth
                    name="appId"
                    variant="outlined"
                    value={notificationSettings.appId}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Key"
                    fullWidth
                    name="key"
                    variant="outlined"
                    value={notificationSettings.key}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Secret"
                    fullWidth
                    name="secret"
                    variant="outlined"
                    value={notificationSettings.secret}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Cluster"
                    fullWidth
                    name="cluster"
                    variant="outlined"
                    value={notificationSettings.cluster}
                    onChange={handleInputChange}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Channel"
                    fullWidth
                    name="channel"
                    variant="outlined"
                    value={notificationSettings.channel}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Event"
                    fullWidth
                    name="event"
                    variant="outlined"
                    value={notificationSettings.event}
                    onChange={handleInputChange}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.useTLS}
                        onChange={handleSwitchChange}
                        name="useTLS"
                        color="primary"
                      />
                    }
                    label={notificationSettings.useTLS ? 'useTLS True' : 'useTLS False'}
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
