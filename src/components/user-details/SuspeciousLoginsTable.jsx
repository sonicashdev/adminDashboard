import { useState, useMemo } from 'react';
 // Import router for navigation
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { Toaster } from 'react-hot-toast';
import MainCard from 'components/MainCard';
import { useRouter } from 'next/navigation';

export default function SuspiciousLogins({ suspiciousLogins }) {
  const router = useRouter();  // Initialize router
  const [currentPage, setCurrentPage] = useState(1);
  const [loginsPerPage] = useState(20);
  const [globalFilter, setGlobalFilter] = useState(''); // For search query input

  // Columns definition for table
  const columns = useMemo(() => [
    {
      id: 'Users',
      header: 'Users',
      accessorKey: 'users',
      cell: ({ row }) => {
        return (
          <Box>
            {row.original.users.map((user, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => router.push(`./user/${user.userId}`)}  // Redirect to user profile on click
              >
                {user.name}
              </Typography>
            ))}
          </Box>
        );
      },
    },
    {
      id: 'IP',
      header: 'IP Address',
      accessorKey: 'ip',
    },
    {
      id: 'Count',
      header: 'Count',
      accessorKey: 'count',
    },
  ], [router]);

  // Function to handle search filter
  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Filter the suspicious logins based on the global filter (search query)
  const filteredData = useMemo(() => {
    return suspiciousLogins.filter((login) => {
      const query = globalFilter;
      return login.users.some((user) =>
        user.name.toLowerCase().includes(query) || user.userId.toLowerCase().includes(query)
      );
    });
  }, [suspiciousLogins, globalFilter]);

  // Pagination calculation
  const indexOfLastLogin = currentPage * loginsPerPage;
  const indexOfFirstLogin = indexOfLastLogin - loginsPerPage;
  const currentLogins = filteredData.slice(indexOfFirstLogin, indexOfLastLogin); // Paginate based on filtered data

  // Pagination handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Toaster position="top-right" /> {/* Position of the toast */}

      <MainCard content={false}>
        <Box sx={{ padding: 3 }}>
          {/* Global Search */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by User Name"
                variant="outlined"
                fullWidth
                value={globalFilter}
                onChange={handleSearchChange} // Update global filter based on input
              />
            </Grid>
          </Grid>

          {/* Table Container */}
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(to right, #04dcc4, #04a3d3)' }}>
                <TableRow>
                  <TableCell>Users</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLogins.length > 0 ? (
                  currentLogins.map((login, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {/* Displaying users beside each other */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                          {login.users.map((user, idx) => (
                            <Typography 
                              key={idx} 
                              variant="body1" 
                              sx={{ cursor: 'pointer' }}
                              onClick={() => router.push(`./user/${user.userId}`)}  // Redirect on click
                            >
                              {user.name}
                            </Typography>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>{login._id}</TableCell> {/* Display IP Address */}
                      <TableCell>{login.count}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="h6" color="textSecondary">No Suspicious Logins Found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(filteredData.length / loginsPerPage)} // Total pages based on filtered data
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              color="primary"
            />
          </Box>
        </Box>
      </MainCard>
    </>
  );
}
