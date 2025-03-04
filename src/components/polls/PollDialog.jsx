import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Paper,
} from '@mui/material';
import { useRouter } from '../../../node_modules/next/navigation';

function PollDialog({ openModal, handleCloseModal, voters }) {
  const router = useRouter();
  const safeVoters = voters || [];

  const handleRowClick = (userId) => {
    router.push(`/users/user/${userId}`); // Navigate to the user's profile page
  };

  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
      <DialogTitle>View Voters</DialogTitle>
      <DialogContent>
        {safeVoters.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Profile Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Voted Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safeVoters.map((voter, index) => (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => handleRowClick(voter.user?._id)} // Navigate on row click
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Avatar
                        src={voter.user?.profileImage} // Display profile image
                        alt={voter.user?.name || 'User'}
                      >
                        {!voter.user?.profileImage && voter.user?.name?.charAt(0)} {/* Fallback to avatar */}
                      </Avatar>
                    </TableCell>
                    <TableCell>{voter.user?.name || 'Unknown User'}</TableCell>
                    <TableCell>{voter.user?.email || 'No email available'}</TableCell>
                    <TableCell>{voter.votedAnswer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" align="center">
            No voters yet.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PollDialog;