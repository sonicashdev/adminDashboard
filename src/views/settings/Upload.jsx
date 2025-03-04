'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Grid, InputLabel, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';

export default function CreatePlan() {
  const [files, setFiles] = useState({
    darkModeLogo: null,
    lightModeLogo: null,
    authImage: null,
  });
  const [previews, setPreviews] = useState({
    darkModeLogo: null,
    lightModeLogo: null,
    authImage: null,
  });

  // Fetch existing images from the backend
  useEffect(() => {
    const fetchMainSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`, {
          withCredentials: true,
        });
        const { websiteImages } = response.data.mainSettings;

        // Set previews for existing images
        setPreviews({
          darkModeLogo: websiteImages.darkModeLogo || null,
          lightModeLogo: websiteImages.lightModeLogo || null,
          authImage: websiteImages.authImage || null,
        });
      } catch (error) {
        console.error('Error fetching main settings:', error);
      }
    };

    fetchMainSettings();
  }, []);

  const handleFileUpload = (field, value) => {
    if (value && value.length > 0) {
      setFiles((prev) => ({ ...prev, [field]: value[0] }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(value[0]) }));
    } else {
      setFiles((prev) => ({ ...prev, [field]: null }));
      setPreviews((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCreatePlan = async () => {
    try {
      const formData = new FormData();
      if (files.darkModeLogo) formData.append('darkModeLogo', files.darkModeLogo);
      if (files.lightModeLogo) formData.append('lightModeLogo', files.lightModeLogo);
      if (files.authImage) formData.append('authImage', files.authImage);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/update-website-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast.success('Images Uploaded successfully!');

      // Reset files and previews
      setFiles({ darkModeLogo: null, lightModeLogo: null, authImage: null });
      setPreviews({ darkModeLogo: null, lightModeLogo: null, authImage: null });

      // Refetch main settings to update previews
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/main-settings`, {
        withCredentials: true,
      });
      const { websiteImages } = response.data.mainSettings;
      setPreviews({
        darkModeLogo: websiteImages.darkModeLogo || null,
        lightModeLogo: websiteImages.lightModeLogo || null,
        authImage: websiteImages.authImage || null,
      });
    } catch (error) {
      toast.error('Error uploading images');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Upload Website Images">
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{py:5}}>
                <Grid container spacing={2} direction="row">
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <InputLabel>Dark Mode Logo</InputLabel>
                      {previews.darkModeLogo && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1">Dark Mode Logo Preview:</Typography>
                          <img src={previews.darkModeLogo} alt="Dark Mode Logo Preview" style={{ width: '100px', height: 'auto' }} />
                        </Box>
                      )}
                      <SingleFileUpload
                        file={files.darkModeLogo ? [files.darkModeLogo] : []}
                        setFieldValue={(field, value) => handleFileUpload('darkModeLogo', value)}
                        sx={{ width: '100%', height: '150px', mb: 2 }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <InputLabel>Light Mode Logo</InputLabel>
                      {previews.lightModeLogo && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1">Light Mode Logo Preview:</Typography>
                          <img src={previews.lightModeLogo} alt="Light Mode Logo Preview" style={{ width: '100px', height: 'auto' }} />
                        </Box>
                      )}
                      <SingleFileUpload
                        file={files.lightModeLogo ? [files.lightModeLogo] : []}
                        setFieldValue={(field, value) => handleFileUpload('lightModeLogo', value)}
                        sx={{ width: '100%', height: '150px', mb: 2 }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={2}>
                      <InputLabel>Auth Image (Login/Signup Background)</InputLabel>
                      {previews.authImage && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1">Auth Image Preview:</Typography>
                          <img src={previews.authImage} alt="Auth Image Preview" style={{ width: '100px', height: 'auto' }} />
                        </Box>
                      )}
                      <SingleFileUpload
                        file={files.authImage ? [files.authImage] : []}
                        setFieldValue={(field, value) => handleFileUpload('authImage', value)}
                        sx={{ width: '100%', height: '150px', mb: 2 }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ my: 2 }}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleCreatePlan}>
                    Upload
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