'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Importing the Next.js Image component
import { useStripe } from 'contexts/StripeContext';
// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// project-imports
import MainCard from 'components/MainCard';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import GooglePayButtonn from 'components/google-play-button/GooglePlayButton';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { useAuthStore } from 'store/authStore';

export default function AllPlans() {
  const theme = useTheme();
  const [plans, setPlans] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null); 
  const [newCoins, setNewCoins] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [timePeriod, setTimePeriod] = useState(true);
  const [file, setFile] = useState(null);
  const stripePromise = useStripe();
  const [loading, setLoading] = useState(false);
  const {checkoutHandler} = useAuthStore()

  const handleCheckout = async (planId) => {
    try {
      setLoading(true);

      const res = await checkoutHandler(planId)
      

      console.log(res , 'resopnse 1')
      const session = res.data

      if (!session.id) {
        throw new Error('Failed to create checkout session');
      }
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (error) {
        console.error('Stripe Checkout error:', error);
        alert(error.message);
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast.error('There was an error during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const setFieldValue = (field, value) => {
    if (field === 'files') {
      setFile(value); 
    }
  };

  // Fetch plans from the backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/plans`, { withCredentials: true });
        setPlans(response.data.plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Failed to load plans.');
      }
    };
    fetchPlans();
  }, []);

  // Handle open modal for editing a plan
  const handleOpenEditModal = (plan) => {
    setEditPlan(plan);
    setNewName(plan.name);
    setNewPrice(plan.cost);
    setNewDuration(`${plan.time} ${plan.durationType}`);
    setNewImage(plan.image);
    setNewImagePreview(plan.image); // Set the existing image for preview
    setNewCoins(plan.intersetAmountScash);
    setNewStatus(plan.status);
    setOpenEditModal(true);
  };

  // Handle closing modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditPlan(null);
    setFile(null); // Clear the file state
    setNewImage(null); // Clear newImage state
    setNewImagePreview(null); // Clear the preview
    setNewStatus('');
  };

  // Handle saving the edited plan
  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('planName', newName);
      formData.append('planTime', newDuration.split(' ')[0]);
      formData.append('planDurationType', newDuration.split(' ')[1]);
      formData.append('planCost', newPrice);
      formData.append('planIntersetAmountScash', newCoins);
      formData.append('planStatus', newStatus);

      const imageToUpload = file ? file[0] : newImagePreview;
      if (imageToUpload) {
        formData.append('planImage', imageToUpload);
      }
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/edite-plan/${editPlan._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setPlans((prevPlans) => prevPlans.map((plan) => (plan._id === editPlan._id ? response.data.plan : plan)));
      toast.success('Plan updated successfully!');
      handleCloseEditModal();
    } catch (error) {
      toast.error('Error updating the plan');
    }
  };

  // Handle deleting a plan
  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete-plan/${planId}`, { withCredentials: true });
      setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== planId));
      toast.success('Plan deleted successfully!');
    } catch (error) {
      toast.error('Error deleting the plan');
    }
  };

  const formatDuration = (time, durationType) => {
    return `${time} ${durationType}`;
  };

  const priceActivePlan = {
    padding: 3,
    borderRadius: 1,
    bgcolor: theme.palette.primary.lighter
  };

  const price = {
    fontSize: '40px',
    fontWeight: 700,
    lineHeight: 1
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        py: 10
      }}
    >
      <Toaster position="top-center" />
      <Grid container spacing={3}>
        <Grid item container spacing={3} xs={12} alignItems="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan._id}>
              <MainCard>
                <Grid container spacing={3} >
                  <Grid item xs={12} >
                    <Box sx={plan.status === 'Active' ? priceActivePlan : { padding: 3 }}>
                      <Grid container spacing={3}>
                        {plan.status === 'Active' && (
                          <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Chip label={plan.status} color="success" />
                          </Grid>
                        )}
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                          <Image
                            src={plan.image}
                            alt={plan.name}
                            width={180}
                            height={180}
                            style={{ borderRadius: '8px', marginBottom: '8px', objectFit: 'cover' }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={0} textAlign="center">
                            <Typography variant="h4">{plan.name}</Typography>
                            <Typography>{formatDuration(plan.time, plan.durationType)}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={0} alignItems="center">
                            {timePeriod ? (
                              <Typography variant="h2" sx={price}>
                                ${plan.cost}
                              </Typography>
                            ) : (
                              <Typography variant="h2" sx={price}>
                                ${plan.cost * 12 - 99}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                    <Grid item xs={12} sx={{mt:2}}>
                          <Button variant="contained" fullWidth onClick={() => handleOpenEditModal(plan)} sx={{ mb: 1 }}>
                            Edit
                          </Button>
                          <Button variant="outlined" color="error" fullWidth onClick={() => handleDeletePlan(plan._id)} sx={{ mb: 1 }}>
                            Delete
                          </Button>
                          <Button variant="contained" color="success" fullWidth onClick={() => handleCheckout(plan._id)} disabled={loading} sx={{ mb: 1 }}>
                            {loading ? 'Processing...' : 'Buy'}
                          </Button>
                        </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {/* Edit Plan Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Plan</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {(file && file.length > 0) || newImagePreview ? (
              <Image
                src={file && file.length > 0 ? URL.createObjectURL(file[0]) : newImagePreview}
                alt="Preview"
                width={345}
                height={180}
                style={{ borderRadius: '8px', objectFit: 'contain' }}
              />
            ) : null}
          </Box>
          <SingleFileUpload file={file} setFieldValue={setFieldValue} sx={{ mb: 2 }} />
          <TextField label="Name" fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Price" fullWidth value={newPrice} onChange={(e) => setNewPrice(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Duration" fullWidth value={newDuration} onChange={(e) => setNewDuration(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Amount of Coins" fullWidth value={newCoins} onChange={(e) => setNewCoins(e.target.value)} sx={{ mb: 2 }} />
          <TextField
            label="Status"
            fullWidth
            select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mb: 2 }}
            SelectProps={{ native: true }}
          >
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
