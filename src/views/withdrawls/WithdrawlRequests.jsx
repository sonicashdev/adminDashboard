'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from 'store/authStore';

export default function WithdrawlRequests() {
  const theme = useTheme();
  const [withdrawls, setWithdrawls] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState({}); // To track loading state of each request
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of items per page
  const { handleUpdateWithdrawlStatus, getAllWithdrawlRequests } = useAuthStore();

  // Fetch withdrawal requests
  useEffect(() => {
    const fetchWithdrawls = async () => {
      try {
        const response = await getAllWithdrawlRequests();
        setWithdrawls(response.data.withdrawls);
      } catch (error) {
        console.error('Error fetching withdrawls:', error);
      }
    };
    fetchWithdrawls();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Mark the withdrawal request as loading
      setLoadingRequests((prev) => ({ ...prev, [id]: true }));

      const response = await handleUpdateWithdrawlStatus(id, newStatus);

      if (response.status === 200) {
        toast.success('Status updated successfully');
        // Update withdrawal state to remove the processed request
        setWithdrawls((prevWithdrawls) => prevWithdrawls.filter((withdrawl) => withdrawl._id !== id));
      }

      // After the response, mark as no longer loading
      setLoadingRequests((prev) => ({ ...prev, [id]: false }));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      // Reset loading state in case of error
      setLoadingRequests((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = withdrawls.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 10 }}>
      <Toaster position="top-center" />
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Withdrawls Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Image</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Wallet ID</TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((withdrawl) => (
              <TableRow key={withdrawl._id}>
                <TableCell>
                  <Image
                    src={withdrawl.userId.profileImage}
                    alt={withdrawl.userId.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{withdrawl.userId.name}</TableCell>
                <TableCell>{withdrawl.userId.email}</TableCell>
                <TableCell>${withdrawl.amount}</TableCell>
                <TableCell>{withdrawl.walletId}</TableCell>
                <TableCell>{withdrawl.transactionID}</TableCell>
                <TableCell>{withdrawl.status}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={withdrawl.status}
                      onChange={(e) => handleStatusUpdate(withdrawl._id, e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approve">Running</MenuItem>
                      <MenuItem value="reject">Refused</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusUpdate(withdrawl._id, 'approve')}
                    sx={{ mr: 1 }}
                    disabled={loadingRequests[withdrawl._id]} // Disable if loading
                  >
                    {loadingRequests[withdrawl._id] ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Approve'
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusUpdate(withdrawl._id, 'reject')}
                    disabled={loadingRequests[withdrawl._id]} // Disable if loading
                  >
                    {loadingRequests[withdrawl._id] ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Reject'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(withdrawls.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
