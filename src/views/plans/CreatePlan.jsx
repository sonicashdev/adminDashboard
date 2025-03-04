'use client';

import { useState } from 'react';
import { Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, FormControl, InputLabel, Typography, Stack } from '@mui/material';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';
import { Select } from '@mui/material';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile'; // Import the SingleFileUpload component

export default function CreatePlan() {
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState('');
  const [planDurationType, setPlanDurationType] = useState('');
  const [amountCoins, setAmountCoins] = useState('');
  const [status, setStatus] = useState('Active');
  const [planImage, setPlanImage] = useState(null); // For the image upload
  const [imagePreview, setImagePreview] = useState(null); // For the image preview
  const [file, setFile] = useState(null); // For the SingleFileUpload component

  // Handle form submission to create a new plan
  const handleCreatePlan = async () => {
    if (!planName || !planPrice || !planDuration || !planDurationType || !amountCoins) {
      toast.error('Please fill out all the fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('planName', planName);
      formData.append('planTime', planDuration); // Duration time
      formData.append('planDurationType', planDurationType); // Duration type (e.g., Days, Months)
      formData.append('planCost', planPrice);
      formData.append('planIntersetAmountScach', amountCoins);
      formData.append('planStatus', status); // Set the status
      if (planImage) {
        formData.append('planImage', planImage); // Append image if it's selected
      }

      // Send new plan data to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/create-plan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // Handle success
      toast.success('Plan created successfully!');
      
      // Reset form fields after successful creation
      setPlanName('');
      setPlanPrice('');
      setPlanDuration('');
      setPlanDurationType('');
      setAmountCoins('');
      setStatus('Active');
      setPlanImage(null);
      setImagePreview(null); // Clear the image preview
      setFile(null); // Clear the file state

    } catch (error) {
      toast.error('Error creating the plan');
    }
  };

  // Handle file selection in SingleFileUpload
  const setFieldValue = (field, value) => {
    if (field === 'files') {
      setFile(value); // Update the file state for SingleFileUpload
      if (value && value.length > 0) {
        setPlanImage(value[0]); // Update planImage state with the first file
        setImagePreview(URL.createObjectURL(value[0])); // Update the preview
      } else {
        setPlanImage(null); // Clear planImage if no file is selected
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
                    label="Plan Name" 
                    fullWidth 
                    value={planName} 
                    onChange={(e) => setPlanName(e.target.value)} 
                  />
                  <TextField 
                    label="Price" 
                    fullWidth 
                    value={planPrice} 
                    onChange={(e) => setPlanPrice(e.target.value)} 
                    type="number" 
                  />
                  <TextField 
                    label="Duration (Number)" 
                    fullWidth 
                    value={planDuration} 
                    onChange={(e) => setPlanDuration(e.target.value)} 
                    type="number" 
                  />
                  <FormControl fullWidth>
                    <InputLabel>Duration Type</InputLabel>
                    <Select
                      value={planDurationType}
                      onChange={(e) => setPlanDurationType(e.target.value)}
                      label="Duration Type"
                    >
                      <MenuItem value="Hour">Hour</MenuItem>
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Week">Week</MenuItem>
                      <MenuItem value="Month">Month</MenuItem>
                      <MenuItem value="Year">Year</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <TextField 
                    label="Amount of Coins" 
                    fullWidth 
                    value={amountCoins} 
                    onChange={(e) => setAmountCoins(e.target.value)} 
                    type="number" 
                  />
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                  <SingleFileUpload
                    file={file}
                    setFieldValue={setFieldValue}
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
                    Create Plan
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