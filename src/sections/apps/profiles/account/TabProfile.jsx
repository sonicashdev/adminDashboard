import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { facebookColor, linkedInColor, ThemeMode } from 'config';

// assets
import { Apple, Camera, Facebook, Google } from 'iconsax-react';
import { useAuthStore } from 'store/authStore';
import toast, { Toaster } from '../../../../../node_modules/react-hot-toast/dist/index';

const avatarImage = '/assets/images/users';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

export default function TabProfile() {
  const theme = useTheme();
  const { user , updateUserProfile } = useAuthStore(); // Get user data from the auth store
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(`${avatarImage}/default.png`);
  const [updatedUser, setUpdatedUser] = useState({ ...user }); // State to track updated user data

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setUpdatedUser((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleUpdateProfile = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
  
      // Append only the fields displayed in the form
      formData.append('name', updatedUser.name); // Append the full name
      formData.append('phone', updatedUser.phone); // Append the phone number
      formData.append('email', updatedUser.email); // Append the email
  
      // Append the image file if selected
      if (selectedImage) {
        formData.append('profileImage', selectedImage); // Append the profile image file
      }
  
      // Call the updateUserProfile function with FormData
      const response = await updateUserProfile(formData, user._id);
  
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <Grid container spacing={3}>
      <Toaster />
      <Grid item xs={12} sm={6}>
        <MainCard title="Personal Information">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
                <FormLabel
                  htmlFor="change-avtar"
                  sx={{
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    '&:hover .MuiBox-root': { opacity: 1 },
                    cursor: 'pointer',
                  }}
                >
                  <Avatar alt="User Avatar" src={avatar} sx={{ width: 76, height: 76 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Stack spacing={0.5} alignItems="center">
                      <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                      <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                        Upload
                      </Typography>
                    </Stack>
                  </Box>
                </FormLabel>
                <TextField
                  type="file"
                  id="change-avtar"
                  placeholder="Outlined"
                  variant="outlined"
                  sx={{ display: 'none' }}
                  onChange={(e) => setSelectedImage(e.target.files?.[0])}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                <TextField
                  fullWidth
                  value={updatedUser.name.split(' ')[0]} // Use value instead of defaultValue
                  onChange={(e) => handleInputChange('name', e.target.value + ' ' + updatedUser.name.split(' ')[1])}
                  id="personal-first-name"
                  placeholder="First Name"
                  autoFocus
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                <TextField
                  fullWidth
                  value={updatedUser.name.split(' ')[1] || ''} // Use value instead of defaultValue
                  onChange={(e) => handleInputChange('name', updatedUser.name.split(' ')[0] + ' ' + e.target.value)}
                  id="personal-last-name"
                  placeholder="Last Name"
                />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="Contact Information">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-phone">Phone Number</InputLabel>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Select defaultValue="20">
                        <MenuItem value="20">+20</MenuItem>
                        <MenuItem value="91">+91</MenuItem>
                        <MenuItem value="1-671">1-671</MenuItem>
                        <MenuItem value="36">+36</MenuItem>
                        <MenuItem value="225">(255)</MenuItem>
                        <MenuItem value="39">+39</MenuItem>
                        <MenuItem value="1-876">1-876</MenuItem>
                        <MenuItem value="7">+7</MenuItem>
                        <MenuItem value="254">(254)</MenuItem>
                        <MenuItem value="373">(373)</MenuItem>
                        <MenuItem value="1-664">1-664</MenuItem>
                        <MenuItem value="95">+95</MenuItem>
                        <MenuItem value="264">(264)</MenuItem>
                      </Select>
                      <PatternFormat
                        format="(+2) ### ### ####"
                        mask="_"
                        fullWidth
                        customInput={TextField}
                        placeholder="Phone Number"
                        value={updatedUser.phone || ''} // Use value instead of defaultValue
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={updatedUser.email || ''} // Use value instead of defaultValue
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      id="personal-email"
                      placeholder="Email Address"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}