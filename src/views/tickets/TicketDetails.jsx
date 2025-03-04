'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+
import { useAuthStore } from 'store/authStore';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Stack,
  Link,
} from '@mui/material';
import { useParams } from '../../../node_modules/next/navigation';
import MainCard from 'components/MainCard';
import CircularLoader from 'components/CircularLoader';
import {toast , Toaster} from 'react-hot-toast'
import LeftSideTicketDetails from 'components/tickets/LeftSideTicketDetails';
import RightSideTicketDetails from 'components/tickets/RightSideTicketDetails';
const TicketDetails = () => {
  const { getTicketDetails , sendResponse } = useAuthStore();
  const { id } = useParams()
  const [ticket, setTicket] = useState(null);
  const [responseMessage, setResponseMessage] = useState(''); // State for the admin's response
 
  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const response = await getTicketDetails(id);
          setTicket(response.data.ticket);
        } catch (error) {
          console.error('Error fetching ticket data:', error);
        }
      };

      fetchTicket();
    }
  }, [id]);

  if (!ticket) {
    return <CircularLoader/>;
  }

  // Function to handle sending the response (mocked for now)
  const handleSubmitResponse = async (formData ,ticketId ) => {
    try {
        console.log(ticketId)
      if (!responseMessage.trim()) {
        toast.error('Please enter a response message.');
        return;
      }
      const response = await sendResponse(formData , ticketId)
      console.log(response)
      toast.success('Response Send Successfully')
      setTicket(response.data.ticket)
      // Simulate sending the response to the server
      console.log('Sending response:', responseMessage);

      // Clear the input field after submission
      setResponseMessage('');

      // Optionally, you can update the ticket state with the new response
      // For simplicity, this is not implemented here.
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  return (
<MainCard title="Ticket Details">
    <Toaster />
        <Grid container spacing={3}>
          {/* Left Side - Ticket Information */}
          <LeftSideTicketDetails ticket={ticket}/>

          {/* Right Side - Responses and Replies */}
          <RightSideTicketDetails 
          ticket={ticket} 
          setResponseMessage={setResponseMessage} 
          responseMessage={responseMessage}
          handleSubmitResponse={handleSubmitResponse}
          />
        </Grid>

    </MainCard>
  );
};

export default TicketDetails;