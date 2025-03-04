'use client';
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Avatar } from '@mui/material';
import { Box, Grid, InputLabel, TextField, Typography } from '../../../node_modules/@mui/material/index';
import { useAuthStore } from 'store/authStore';
import { toast, Toaster } from 'react-hot-toast';

const TicketSendReply = ({ open, onClose, loading, title, re, ticket , setRefresh }) => {
  const [body, setBody] = useState('');
  const [files, setFiles] = useState([]);
  const { sendReply, user } = useAuthStore(); // Assuming `user` contains the current user's info

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      toast.error('You can upload a maximum of 5 files.');
      return;
    }
    setFiles(selectedFiles);
  };

  const handleSubmit = async (ticketId) => {
    try {
      if (!body) {
        toast.error('Body is required.');
        return;
      }

      const formData = new FormData();
      formData.append('message', body);
      files.forEach((file) => formData.append('attachedFiles', file));

      const response = await sendReply(formData, ticketId);

      if (response.status === 201) {
        toast.success('Reply sent successfully!');
        setBody('');
        setFiles([]);
        onClose(); // Close the modal after successful submission
        setRefresh(true)
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {re &&
            re.map((res, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'rgba(99, 112, 153, 0.4)',
                  p: 2,
                  borderRadius: '15px',
                  width: '100%',
                }}
              >
                {/* Avatar for the message */}
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {res.userId === user?.id ? 'ME' : ''} {/* Display "ME" if the message is from the current user */}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '16px', fontWeight: 'medium' }}>{res.message}</Typography>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'regular' }} color="textDisabled">
                    {new Date(res.time).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))}
        </Stack>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="body">Description</InputLabel>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                id="body"
                placeholder="Describe your issue in detail"
                required
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="attachedFiles">Attach Files</InputLabel>
              {/* Hidden file input */}
              <input
                type="file"
                id="attachedFiles"
                multiple
                accept=".jpg,.png,.doc,.pdf,.jfif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {/* Custom button to trigger file input */}
              <label htmlFor="attachedFiles">
                <Button variant="contained" component="span">
                  Choose Files
                </Button>
              </label>
              {/* Display selected file names */}
              {files.length > 0 && (
                <Box>
                  <Typography variant="body2" color="textPrimary">
                    Selected Files:
                  </Typography>
                  <Stack spacing={0.5}>
                    {files.map((file, index) => (
                      <Typography key={index} variant="caption" color="textSecondary">
                        {file.name}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
              <Typography variant="caption" color="textSecondary">
                You can upload up to 5 files (jpg, png, doc, pdf, jfif).
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="contained" onClick={() => handleSubmit(ticket)}>
                Submit Reply
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketSendReply;