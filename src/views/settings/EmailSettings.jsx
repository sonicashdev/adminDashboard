'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, FormControlLabel, Switch, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';

export default function EmailSettings() {
  const [host, setHost] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [port, setPort] = useState('');
  const [secure, setSecure] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`);
        const { emailSettings } = response.data.mainSettings;
        setHost(emailSettings.host);
        setUser(emailSettings.auth.user);
        setPass(emailSettings.auth.pass);
        setPort(emailSettings.port);
        setSecure(emailSettings.secure);
        setSenderName(emailSettings.senderName);
        setSenderEmail(emailSettings.senderEmail);
      } catch (error) {
        console.error('Error fetching email settings:', error);
      }
    };

    fetchEmailSettings();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`,
        {
          emailSettings: {
            host,
            auth: { user, pass },
            port,
            secure,
            senderName,
            senderEmail
          }
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success('Email Settings Updated Successfully');
      }
    } catch (error) {
      toast.error('Error updating email settings');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Email Settings">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <TextField
                    label="Host"
                    fullWidth
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                  />
                  <TextField
                    label="User"
                    fullWidth
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                  <TextField
                    label="Password"
                    fullWidth
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <TextField
                    label="Port"
                    fullWidth
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={secure}
                        onChange={(e) => setSecure(e.target.checked)}
                        name="secure"
                        color="primary"
                      />
                    }
                    label={secure ? 'Secure True' : 'Secure False'}
                  />
                  <TextField
                    label="Sender Email"
                    fullWidth
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                  />
                  <TextField
                    label="Sender Name"
                    fullWidth
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
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