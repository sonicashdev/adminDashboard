'use client'
// material-ui
import Grid from '@mui/material/Grid';

// project-imports
// import TeamMembers from 'sections/widget/data/TeamMembers';

import { useEffect, useState } from 'react';
import axios from 'axios'
import SuspiciousLogins from 'components/user-details/SuspeciousLoginsTable';
// ===========================|| Banned - Users ||=========================== //

export default function SuspeciousLogins() {
   const [logins, setLogins] = useState([]);
  useEffect(() => {

     //await getAllUsers()
    const fetchUsers = async () => {
      try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/suspecious-user-logins`,{withCredentials:true});
         console.log(response)
         setLogins(response.data.suspeciousLogin)
      } catch (error) {
        console.error('Error fetching general settings:', error);
      }
    };

    fetchUsers(); // Call the fetch function
  }, []);
  return (
    <Grid container spacing={3}>
      {/* row 1 */}
      <Grid item xs={12} lg={12} md={12}>
        <SuspiciousLogins  ifNo={'No Banned Users At This Time'} suspiciousLogins={logins}/>
      </Grid>
    </Grid>
  );
}
