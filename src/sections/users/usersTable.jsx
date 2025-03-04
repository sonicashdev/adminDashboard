import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack, Tooltip, IconButton, Grid, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { format } from 'date-fns';
import { Edit, Eye, Trash } from 'iconsax-react';
import { toast, Toaster } from 'react-hot-toast';

// assets
const Avatar1 = '/assets/images/users/avatar-1.png'; // Fallback avatar image

export default function TeamMembers({ ifNo, users, onDelete }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [globalFilter, setGlobalFilter] = useState('');

  // Columns definition for table
  const columns = useMemo(() => [
    {
      id: 'Avatar',
      header: 'Avatar',
      accessorKey: 'avatar',
      cell: ({ row }) => (
        <Avatar alt={row.original.name} src={row.original.avatar || Avatar1} size="lg" />
      ),
    },
    {
      id: 'Name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'Email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'Deposit Wallet',
      header: 'Deposit Wallet',
      accessorKey: 'depositWallet',
    },
    {
      id: 'Scoin Wallet',
      header: 'Scoin Wallet',
      accessorKey: 'scoinWallet',
    },
    {
      id: 'Last Login',
      header: 'Last Login',
      accessorKey: 'lastLogin',
      cell: ({ getValue }) => format(new Date(getValue()), 'MMMM dd, yyyy h:mm a'),
    },
    {
      id: 'Actions',
      header: 'Actions',
      cell: ({ row }) => {
        const userId = row.original._id;
        return (
          <Stack direction="row" spacing={2}>
            <Tooltip title="View">
              <IconButton onClick={() => router.push(`./user/${userId}`)}>
                <Eye />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`./user/${userId}`)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => onDelete(userId)}>
                <Trash />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ], []);

  // Function to handle search filter
  const handleSearchChange = (e) => {
    setGlobalFilter(e.target.value.toLowerCase());
  };

  // Filter the users based on the global filter (search query)
  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const query = globalFilter;
      return (
        user?.name?.toLowerCase().includes(query) || // Filter by name
        user?.email?.toLowerCase().includes(query) // Filter by email
      );
    });
  }, [users, globalFilter]);

  // Pagination calculation
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Toaster position="top-right" />
      <MainCard content={false}>
        <Box sx={{ padding: 3 }}>
          {/* Global Search */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by Name or Email"
                variant="outlined"
                fullWidth
                value={globalFilter}
                onChange={handleSearchChange}
              />
            </Grid>
          </Grid>

          {/* Table Container */}
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(to right, #04dcc4, #04a3d3)' }}>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Deposit Wallet</TableCell>
                  <TableCell>Scoin Wallet</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Avatar alt={user.name} src={user.profileImage || Avatar1} variant="rounded" size="lg" />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.depositWallet || 0}</TableCell>
                      <TableCell>{user.scoinWallet || 0}</TableCell>
                      <TableCell>{format(new Date(user.lastLogin), 'MMMM dd, yyyy h:mm a')}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Tooltip title="View">
                            <IconButton onClick={() => router.push(`./user/${user._id}`)}>
                              <Eye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => router.push(`./user/${user._id}`)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => onDelete(user._id)}>
                              <Trash />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="h6" color="textSecondary">{ifNo}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(filteredData.length / usersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      </MainCard>
    </>
  );
}