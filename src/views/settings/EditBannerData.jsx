'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Importing the Next.js Image component
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile'; // Assuming this is your file upload component
import Link from '../../../node_modules/next/link';

export default function AllBanners() {
  const theme = useTheme();
  const [banners, setBanners] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [newLabel, setNewLabel] = useState('');
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newLink, setNewLink] = useState('');
  const [file, setFile] = useState(null);
  
  // Fetch banners from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/banner-data`, { withCredentials: true });
        setBanners(response.data.bannerCarouselData);
      } catch (error) {
        console.error('Error fetching banners:', error);
        toast.error('Failed to load banners.');
      }
    };
    fetchBanners();
  }, []);

  // Handle open modal for editing a banner
  const handleOpenEditModal = (banner) => {
    setEditBanner(banner);
    setNewLabel(banner.label);
    setNewImagePreview(banner.imgPath); // Set the existing image for preview
    setNewLink(banner.to);
    setOpenEditModal(true);
  };

  // Handle closing modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditBanner(null);
    setNewLabel('');
    setNewImagePreview(null);
    setNewLink('');
    setFile(null); // Clear file when closing
  };

  // Handle saving the edited banner
  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('label', newLabel);
      formData.append('to', newLink);
  
      // If a new file is uploaded, append it to the form data
      if (file && file[0]) {
        formData.append('image', file[0]);
      }
  
      // Don't append image if no new file is uploaded, keep the existing image intact
      if (!file || !file[0]) {
        formData.append('image', newImagePreview); // Send the existing image URL to preserve it
      }
  
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit-banner/${editBanner._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
  
      console.log(response.data); // Check the structure of the response
  
      // Assuming response.data.updatedBannerData is the updated array of banners
      // Find the updated banner in the response and update it in the state
      const updatedBanners = response.data.updatedBannerData;
  
      // Update the banners list in the state
      setBanners(updatedBanners); // Since the response returns the updated list, just set the new array directly
  
      toast.success('Banner updated successfully!');
      handleCloseEditModal();
    } catch (error) {
      toast.error('Error updating the banner');
    }
  };
  
  

  const handleDeleteBanner = async (bannerId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete-banner/${bannerId}`, { withCredentials: true });
      setBanners((prevBanners) => prevBanners.filter((banner) => banner._id !== bannerId));
      toast.success('Banner deleted successfully!');
    } catch (error) {
      toast.error('Error deleting the banner');
    }
  };

  // Set the field value for the image upload
  const setFieldValue = (field, value) => {
    if (field === 'files') {
      setFile(value);
      if (value && value.length > 0) {
        setNewImagePreview(URL.createObjectURL(value[0])); // Update preview with the uploaded file
      }
    }
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
          {banners.map((banner) => (
            <Grid item xs={12} sm={6} md={4} key={banner._id}>
              <MainCard>
                <Grid container spacing={3}>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Image
                      src={banner.imgPath}
                      alt={banner.label}
                      width={300}
                      height={240}
                      style={{ borderRadius: '8px', marginBottom: '8px', objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={0} textAlign="center">
                      <Typography variant="h5">{banner.label}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1} alignItems="center">
                      <Typography variant="body1">
                        <Link href={banner.to} target="_blank" rel="noopener noreferrer">
                          Go to Banner Link
                        </Link>
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sx={{mt: 2}}>
                    <Button variant="contained" fullWidth onClick={() => handleOpenEditModal(banner)} sx={{ mb: 1 }}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" fullWidth onClick={() => handleDeleteBanner(banner._id)} sx={{ mb: 1 }}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Edit Banner Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {/* Display current image or preview */}
            {newImagePreview && (
              <Image
                src={newImagePreview}
                alt="Preview"
                width={345}
                height={180}
                style={{ borderRadius: '8px', objectFit: 'contain' }}
              />
            )}
          </Box>

          {/* File upload component for image */}
          <SingleFileUpload file={file} setFieldValue={setFieldValue} sx={{ mb: 2 }} />

          <TextField label="Label" fullWidth value={newLabel} onChange={(e) => setNewLabel(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Link (to)" fullWidth value={newLink} onChange={(e) => setNewLink(e.target.value)} sx={{ mb: 2 }} />
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
