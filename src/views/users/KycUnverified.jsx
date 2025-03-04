'use client'
// material-ui
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress'; // For loading spinner

import { useEffect, useState } from 'react';
import { useAuthStore } from 'store/authStore';
import TeamMembers from 'sections/users/usersTable';
// ===========================|| Banned - Users ||=========================== //


export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Loading state to control loading UI
  const { getUsersByField } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await getUsersByField('KYC', false);
        if (mounted) {
          setUsers(response.users);
          setMessage(response.message);
          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching general settings:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Grid container spacing={3}>
      {/* row 1 */}
      <Grid item xs={12} lg={12} md={12}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress /> 
          </div>
        ) : (
          <TeamMembers ifNo={message} users={users} />
        )}
      </Grid>
    </Grid>
  );
}
