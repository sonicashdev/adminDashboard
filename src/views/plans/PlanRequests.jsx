'use client';

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
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import MainCard from 'components/MainCard';
import { useAuthStore } from 'store/authStore';

export default function PlanRequests() {
  const theme = useTheme();
  const [plans, setPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of items per page
  const { getAnalyticDashboard, updatePlanStatus, getAllPlansRequests } = useAuthStore();

  // Fetch investment requests
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getAllPlansRequests();
        setPlans(response.data.plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  // Format duration
  const formatDuration = (time, durationType) => {
    return `${time} ${durationType}`;
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await updatePlanStatus(id, newStatus);
      if (response.status === 200) {
        toast.success('Status updated successfully');
        setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== id));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '10px', py: 10 }}>
      <Toaster position="top-center" />
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Investment Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan Name</TableCell>
              <TableCell>Plan Image</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plan Cost</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.plan.name}</TableCell>
                <TableCell>
                  <Image
                    src={plan.plan.image}
                    alt={plan.plan.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{plan.investor.name}</TableCell>
                <TableCell>{plan.investor.email}</TableCell>
                <TableCell>${plan.plan.cost}</TableCell>
                <TableCell>{formatDuration(plan.plan.time, plan.plan.durationType)}</TableCell>
                <TableCell>{plan.transactionID}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={plan.status}
                      onChange={(e) => handleStatusUpdate(plan._id, e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Running">Running</MenuItem>
                      <MenuItem value="Refused">Refused</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusUpdate(plan._id, 'Running')}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusUpdate(plan._id, 'Refused')}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(plans.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}