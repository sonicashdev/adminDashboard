'use client';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useAuthStore } from 'store/authStore';
import TeamMembers from 'sections/users/usersTable';
import CircularProgress from '@mui/material/CircularProgress'; // For loading spinner

import {toast , Toaster} from 'react-hot-toast'
export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const { getAllUsers , deleteUserById} = useAuthStore();
  const [loading , setLoading] =useState(true)
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await getAllUsers();

          setUsers(response.data.users);

      } catch (error) {
        console.error('Error fetching users:', error);
      } finally{
        setLoading(false)
      }
    };
    fetchUsers();
  }, []);

  // Handle Delete User
  const handleDelete = async (userId) => {
    try {
      await deleteUserById(userId)
      toast.success('User deleted successfully');
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  return (
    <>
    {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , mx:'auto'}}>
        <CircularProgress /> 
      </div>
    ) : (
    <Grid container spacing={3}>
      {/* row 1 */}
      <Grid item xs={12} lg={12} md={12}>
            <TeamMembers users={users} onDelete={handleDelete} />
      </Grid>
    </Grid>
      )}
      </>
  );
}