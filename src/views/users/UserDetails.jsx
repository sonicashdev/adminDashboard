'use client'; // Ensure this is a client-side component
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios'; // Correct import for axios

// Material UI Components
import { Box, Typography, Grid, Card,  TextField, Button,  Switch, FormControlLabel, Stack,  List, ListItem } from '@mui/material';
import DepositsTable from 'components/user-details/DepositsTable';
import InvestmentsTable from 'components/user-details/InvestmentsTable';
import { useRouter } from 'next/navigation';
import { useAuthStore } from 'store/authStore';
import MainCard from 'components/MainCard';
import CircularLoader from 'components/CircularLoader';
import toast, { Toaster } from '../../../node_modules/react-hot-toast/dist/index';
import LoginTable from 'components/user-details/LoginTable';
import UserWalletCards from 'components/user/UserWalletCards';
import UserLeftSideCard from 'components/user/UserLeftSideCard';
import { format } from 'date-fns'; // For date formatting
const UserDetail = () => {
  const { id } = useParams(); // Get the dynamic `id` from the URL
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false); // For toggle edit mode
  const [userData, setUserData] = useState(null);
  const [loginHistoryPage, setLoginHistoryPage] = useState(1); // Pagination for login history
  const [loginHistory, setLoginHistory] = useState([]);
  const { getAllUsers } = useAuthStore();

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const response = await axios(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, { withCredentials: true });
        console.log(response)
          setUser(response.data.user);
          setUserData(response.data.user);
          setLoginHistory(response.data.user.loginHistory);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();

  }, [id, getAllUsers]);
  console.log()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value }); // Update editable user data
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setUserData({ ...userData, [name]: checked }); // Update the switch field in userData
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        userData,
        { withCredentials: true }
      );
      setUser(response.data.user);
      setUserData(response.data.user);
      setEditing(false);
      setLoginHistory(response.data.user.loginHistory);
      toast.success('User updated Successfully')
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error('Failed to update user at the moment!')
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, { withCredentials: true });
      toast.success('User deleted successfully');
      await getAllUsers();
      router.push('/users/all-users'); // Redirect to all users page after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  // Calculate the login history to be shown for the current page (10 per page)
  const loginHistoryPerPage = 10;
  const indexOfLastLogin = loginHistoryPage * loginHistoryPerPage;
  const indexOfFirstLogin = indexOfLastLogin - loginHistoryPerPage;
  const currentLoginHistory = loginHistory.slice(indexOfFirstLogin, indexOfLastLogin);

  const handlePageChange = (event, value) => {
    setLoginHistoryPage(value); // Update current page
  };

  if (!user) return <CircularLoader/>;

  const formattedLastLogin = user.lastLogin ? format(new Date(user.lastLogin), 'MMMM dd, yyyy h:mm a') : 'Invalid Date';

  return (
    <Box sx={{ p: 3 }}>
      <Toaster />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {editing ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="outlined" color="primary" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
        <Button variant="contained" color="secondary" onClick={handleDelete} sx={{ ml: 2 }}>
          Delete
        </Button>
      </Box>

      {/* User's Basic Information */}
      <Grid container spacing={3}>
        {/* Left Side: User Profile Card */}
        <UserLeftSideCard user={user}/>

        {/* Right Side: Personal Details */}
        <Grid item xs={12} sm={7} md={8} xl={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <MainCard title="Personal details">
                  <List sx={{ py: 0 }}>
                    <ListItem divider>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Name</Typography>
                            {editing ? (
                              <TextField fullWidth name="name" value={userData.name} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.name}</Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">First name</Typography>
                            {editing ? (
                              <TextField fullWidth name="firstName" value={userData.firstName} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.firstName}</Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Last Name</Typography>
                            {editing ? (
                              <TextField fullWidth name="lastName" value={userData.lastName} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.lastName}</Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Role</Typography>
                            {editing ? (
                              <TextField fullWidth name="role" value={userData.role} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.role || 'Not Available'}</Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem divider>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Phone</Typography>
                            {editing ? (
                              <TextField fullWidth name="phone" value={userData.phone} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.phone || 'Not Available'}</Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Country</Typography>
                            {editing ? (
                              <TextField fullWidth name="country" value={userData.country} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.country || 'Not Available'}</Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem divider>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Email</Typography>
                            {editing ? (
                              <TextField fullWidth name="email" value={userData.email} onChange={handleInputChange} />
                            ) : (
                              <Typography>{user.email}</Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                            <Typography color="secondary">Ban</Typography>
                            {editing ? (
                              <FormControlLabel
                                control={<Switch checked={userData.banned} onChange={handleSwitchChange} name="banned" color="primary" />}
                                label="Banned Status"
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {user.banned ? 'banned' : 'Not banned'}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem divider>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">KYC</Typography>
                            {editing ? (
                              <FormControlLabel
                                control={<Switch checked={userData.KYC} onChange={handleSwitchChange} name="KYC" color="primary" />}
                                label="KYC Verification"
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {user.KYC ? 'KYC Verified' : 'KYC Not Verified'}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                            <Typography color="secondary">Email</Typography>
                            {editing ? (
                              <FormControlLabel
                                control={
                                  <Switch checked={userData.isVerified} onChange={handleSwitchChange} name="isVerified" color="primary" />
                                }
                                label="Email Verification"
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {user.isVerified ? 'Email Verified' : 'Email Not Verified'}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Profile Completed</Typography>
                            {editing ? (
                              <FormControlLabel
                                control={<Switch checked={userData.profileCompleted} onChange={handleSwitchChange} name="profileCompleted" color="primary" />}
                                label="Profile Completed"
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {user.profileCompleted ? 'Profile Completed' : 'Profile Not Completed'}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </MainCard>
              </Card>
            </Grid>

            {/* Display Three Cards for Deposit and Scoin Wallets and Refferral Wallet */}
            <Grid item xs={12}>
              <UserWalletCards user={user}/>
            </Grid>

            {/* Display User Deposits in a Scrollable Table */}
            <Grid item xs={12}>
              <DepositsTable user={user} />
            </Grid>

            {/* Display User Investments in a Scrollable Table */}
            <Grid item xs={12}>
              <InvestmentsTable user={user} />
            </Grid>

            {/* Display User Login History in a Scrollable Table */}
            <Grid item xs={12}>
              <LoginTable loginHistory={loginHistory} loginHistoryPage={loginHistoryPage} handlePageChange={handlePageChange} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;