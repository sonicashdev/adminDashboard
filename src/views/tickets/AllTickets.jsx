'use client';
import { useEffect, useMemo, useState } from 'react';

// material-ui

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';

// assets
import { useAuthStore } from 'store/authStore';
import CircularLoader from 'components/CircularLoader';
import toast, { Toaster } from 'react-hot-toast';
import { Chip } from '@mui/material';
import TicketsDialog from 'components/tickets/TicketsDialog';
import TicketSendReply from 'components/tickets/TicketSendReply';
import { FormControl, InputLabel, MenuItem, Select } from '../../../node_modules/@mui/material/index';
import AllTicketsTable from 'components/tickets/AllTicketsTable';
import { useRouter } from '../../../node_modules/next/navigation';

// ==============================|| REACT TABLE ||============================== //



// ==============================|| REACT TABLE - BASIC ||============================== //

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { allTickets ,updateTicket} = useAuthStore();
  const [openModal, setOpenModal] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [selectedId,setSelectedId] =useState(null)
  const [refresh,setRefresh] = useState(false)
  const router = useRouter()
  const handleOpenModal = (response ) => {
    setSelectedResponse(response);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedResponse(null);
  };
  const handleOpenReplyModal=(response ,ticketId)=>{
      setSelectedId(ticketId)
      setSelectedReply(response)
      setOpenReplyModal(true)
    }
  const handleCloseReply=()=>{
    setOpenReplyModal(false)
    setSelectedReply(null)
    setSelectedId(null)
  }
  const handleStatusUpdate= async(ticketId , status)=>{
    try {
        const updateStatus = await updateTicket(ticketId , status)
        console.log(updateStatus.data.ticket)
        toast.success('Status updated successfully');
              // Update the tickets state with the new ticket
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? updateStatus.data.ticket : ticket
        )
      );
    } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
    }
  }
  const handleGetTicketDetails=(id)=>{
    router.push(`/tickets/ticket/${id}`)
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await allTickets();
        console.log(response);
        setTickets(response.data.tickets); // Set investments from the API response
        setRefresh(false)
      } catch (error) {
        console.error('Error fetching investments:', error);
        toast.error(error.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [allTickets , refresh]);

  const columns = useMemo(
    () => [
      {
        header: 'Subject',
        accessorKey: 'subject',
        cell: ({ row }) => (
          <Typography variant="subtitle1">
            {row.original.subject}
          </Typography>
        ),
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Reply',
        accessorKey: 'replies',
        cell: ({ row }) => (
            <Box>
            <Typography variant="subtitle1">
                    <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenReplyModal(row.original.replies , row.original._id)}>
                     Send Message
                    </Box>
            </Typography>
          </Box>
        ),
        enableSorting: true,
      },
      {
        header: 'Respond',
        accessorKey: 'responses',
        cell: ({ row }) => (
          <Box>
            <Typography variant="subtitle1">
              {row.original.responses.length > 0
                ? (
                    <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpenModal(row.original.responses)}>
                     Responses
                    </Box>
                )
                : 'No Recieved Responses'}
            </Typography>
          </Box>
        ),
        enableSorting: true,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'open';
          let color;

          switch (status.toLowerCase()) {
            case 'close':
              color = 'warning';
              break;
            case 'open':
              color = 'success';
              break;
            default:
              color = 'default';
          }

          return (
            <Typography variant="subtitle1">
              <Chip size="small" color={color} label={status} />
            </Typography>
          );
        },
        enableSorting: true,
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ row }) => {
          const status = row.original.priority;
          let color;

          switch (status.toLowerCase()) {
            case 'high':
              color = 'warning';
              break;
            case 'medium':
              color = 'success';
              break;
            case 'low':
              color = 'primary';
              break;
            default:
              color = 'default';
          }

          return (
            <Typography variant="subtitle1">
              <Chip size="small" color={color} label={status} />
            </Typography>
          );
        },
        enableSorting: true,
      },
      {
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row }) => {
            const status = row.original.status;
            return (

                <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
               onChange={(e) => handleStatusUpdate(row.original._id, e.target.value)}
              label="Status"
              >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="close">Close</MenuItem>
            </Select>
          </FormControl>
            )
        },
        enableSorting: true,
      },
      {
        header: 'Conetent',
        accessorKey: 'content',
        cell: ({ row }) => (
            <Box>
            <Typography variant="subtitle1">
                    <Box sx={{ cursor: 'pointer' }} onClick={() => handleGetTicketDetails( row.original._id)}>
                     Display Content
                    </Box>
            </Typography>
          </Box>
        ),
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <>
      {loading ? (
        <CircularLoader />
      ) : (
        <MainCard content={false}>
          <Toaster />
          <ScrollX>
            <AllTicketsTable columns={columns} data={tickets} title="All Tickets" />
          </ScrollX>
        </MainCard>
      )}
      {selectedResponse && (
        <TicketsDialog open={openModal} onClose={handleCloseModal} title='Respond' re={selectedResponse} />
      )}
      {selectedReply && (
        <TicketSendReply open={openReplyModal} onClose={handleCloseReply} title="Reply" re={selectedReply} ticket={selectedId} setRefresh={setRefresh}/>
      )}
    </>
  );
}

