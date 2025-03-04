'use client'
import React, { useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Switch, // Import Switch component
} from '@mui/material';
import Link from 'next/link';
import { Stack } from '../../../node_modules/@mui/material/index';
import { useAuthStore } from 'store/authStore';
import {toast , Toaster} from 'react-hot-toast'

function LeftSideTicketDetails({ ticket }) {
  const [status, setStatus] = useState(ticket.status === 'open'); // Initialize switch state based on ticket status
 const {updateTicket} = useAuthStore()
  // Function to handle switch toggle
  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked ? 'open' : 'close'; // Determine new status based on switch state
    setStatus(event.target.checked); // Update local state

    try {
      // Call the backend to update the ticket status
      const response = await updateTicket(ticket._id, newStatus);
      toast.success('Ticket Status Updated')
      console.log('Ticket status updated:', response.data);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setStatus(!event.target.checked); // Revert switch state if the update fails
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <Toaster />
      <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }} gutterBottom>
          Ticket Overview
        </Typography>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="subtitle1" fontWeight="bold" color="grey">
                Name
              </Typography>
            }
            secondary={
              <Typography variant="body1" fontWeight="medium" fontSize="16px">
                {ticket.name}
              </Typography>
            }
          />
        </ListItem>
        <List dense>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold" color="grey">
                  Email
                </Typography>
              }
              secondary={
                <Typography variant="body1" fontWeight="medium" fontSize="16px">
                  {ticket.email}
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold" color="grey">
                  Subject
                </Typography>
              }
              secondary={
                <Typography variant="body1" fontWeight="medium" fontSize="16px">
                  {ticket.subject}
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold" color="grey">
                  Priority
                </Typography>
              }
              secondary={
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  fontSize="16px"
                  color={
                    ticket.priority === 'high'
                      ? 'error'
                      : ticket.priority === 'medium'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {ticket.priority}
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'grey' }}>
                  Status
                </Typography>
              }
              secondary={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    fontSize="16px"
                    color={ticket.status === 'open' ? 'primary' : 'secondary'}
                  >
                    {ticket.status}
                  </Typography>
                  <Switch
                    checked={status}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                </Stack>
              }
            />
          </ListItem>
        </List>
      </Paper>
      <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: 'grey' }} gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" paragraph fontWeight="medium" fontSize="15px">
          {ticket.body}
        </Typography>
      </Paper>

      {ticket.attachedFiles && ticket.attachedFiles.length > 0 && (
        <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: 1, color: 'grey' }} gutterBottom>
            Attached Files
          </Typography>
          <List dense>
            {ticket.attachedFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    <Link href={file} target="_blank" rel="noopener noreferrer" underline="hover" color="primary">
                      {file.split('/').pop()} {/* Display only the file name */}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Grid>
  );
}

export default LeftSideTicketDetails;