'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, FormControl, InputLabel, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';
import { Select } from '@mui/material';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile'; // Import the SingleFileUpload component

export default function CreatePlan() {
  const [bannerLabel, setBannerLabel] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [bannerImage, setBannerImage] = useState(null); // For the image upload
  const [imagePreview, setImagePreview] = useState(null); // For the image preview
  const [file, setFile] = useState(null); // For the SingleFileUpload component
  
  // Handle form submission to create a new plan
  const handleCreatePlan = async () => {
    if (!bannerLabel || !imageLink) {
      toast.error('Please fill out all the fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('label', bannerLabel);
      formData.append('to', imageLink);
      if (bannerImage) {
        formData.append('image', bannerImage); // Append image if it's selected
      }

      // Send new plan data to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/add-banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Handle success
      toast.success('Banner Data Added successfully!');
      
      // Reset form fields after successful creation
      setBannerLabel('');
      setImageLink('');
      setBannerImage(null);
      setImagePreview(null); // Clear the image preview
      setFile(null); // Clear the file state

    } catch (error) {
        console.log(error)
      toast.error('Error adding banner data');
    }
  };

  // Handle file selection in SingleFileUpload
  const setFieldValue = (field, value) => {
    if (field === 'files') {
      setFile(value); // Update the file state for SingleFileUpload
      if (value && value.length > 0) {
        setBannerImage(value[0]); // Update planImage state with the first file
        setImagePreview(URL.createObjectURL(value[0])); // Update the preview
      } else {
        setBannerImage(null); // Clear planImage if no file is selected
        setImagePreview(null); // Clear the preview
      }
    }
  };


  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 3 }}>
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title="Create New Plan">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <TextField 
                    label="Banner Label" 
                    fullWidth 
                    value={bannerLabel} 
                    onChange={(e) => setBannerLabel(e.target.value)} 
                  />
                  <TextField 
                    label="Image Link" 
                    fullWidth 
                    value={imageLink} 
                    onChange={(e) => setImageLink(e.target.value)} 
                    type="text" 
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  {/* Replace Input with SingleFileUpload */}
                  <SingleFileUpload
                    file={file} // Pass the file state
                    setFieldValue={setFieldValue} // Pass the setFieldValue function
                    sx={{ mb: 2 }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleCreatePlan}>
                    Create Banner
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