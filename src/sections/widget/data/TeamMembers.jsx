import { useEffect, useState } from 'react';

// material-ui
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// assets
const Avatar1 = '/assets/images/users/avatar-1.png'; // Fallback avatar image

export default function TeamMembers({ ifNo, users }) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1); // Current page (default to 1)
  const [usersPerPage] = useState(20); // Number of users per page

  // Calculate the index of users to show based on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };

  const handleUserClick = (userId) => {
    router.push(`./user/${userId}`); // Navigate to the user detail page
  };

  return (
    <MainCard content={false}>
      {/* Table Container */}
      <TableContainer>
        <Table>
          <TableHead sx={{background:'linear-gradient(to right, #04dcc4, #04a3d3)' }}>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Deposit Wallet</TableCell>
              <TableCell>Scoin Wallet</TableCell>
              <TableCell>Last Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers && currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <TableRow key={index} hover onClick={() => handleUserClick(user._id)}>
                  <TableCell>
                    <Avatar
                      alt={user.name}
                      src={user.avatar || Avatar1} // Use user's avatar if available, else fallback avatar
                      variant="rounded"
                      size="lg"
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.depositWallet || 0}</TableCell>
                  <TableCell>{user.scoinWallet || 0}</TableCell>
                  <TableCell>{format(new Date(user.lastLogin), 'MMMM dd, yyyy h:mm a')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="h6" color="textSecondary">{ifNo}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(users.length / usersPerPage)} // Calculate total pages
          page={currentPage} // Current page
          onChange={handlePageChange} // Handle page change
          color="primary"
        />
      </Box>
    </MainCard>
  );
}
