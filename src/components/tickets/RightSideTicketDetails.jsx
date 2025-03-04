'use client';
import { Box, Button, Grid, List, ListItem, ListItemText, Paper, TextField, Typography, Avatar, Stack, Input } from '@mui/material';
import Link from 'next/link';
import { useAuthStore } from 'store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function RightSideTicketDetails({ setResponseMessage, responseMessage, handleSubmitResponse, ticket }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [attachedFiles, setAttachedFiles] = useState([]); // State to store attached files
 console.log(ticket)
  const handleClickUser = (userId) => {
    router.push(`../../users/user/${userId}`);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    setAttachedFiles(files); // Update state with selected files
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('message', responseMessage); // Add message to FormData

    // Add each file to FormData
    attachedFiles.forEach((file, index) => {
      formData.append(`attachedFiles`, file);
    });

    // Call the handleSubmitResponse function with FormData
    await handleSubmitResponse(formData, ticket._id);

    // Clear the form after submission
    setResponseMessage('');
    setAttachedFiles([]);
  };

  return (
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          maxHeight: 'calc(100vh - 200px)', // Adjust the height as needed
          overflowY: 'auto', // Enable vertical scrolling
          paddingRight: 2 // Add some padding to avoid content touching the scrollbar
        }}
      >
        {ticket.replies && ticket.replies.length > 0 && (
          <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              Replies
            </Typography>
            {ticket.replies.map((reply, index) => (
              <Paper key={index} elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Avatar for Reply */}
                  <Avatar
                    onClick={() => handleClickUser(ticket.userId._id)}
                    src={ticket?.userId?.profileImage} // Use the user's profile image
                    sx={{ width: 40, height: 40, cursor: 'pointer' }}
                  >
                    {!reply.profileImage && reply.name
                      ? reply.name.substring(0, 2).toUpperCase() // Display first two letters of the name
                      : null}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ cursor: 'pointer', color: 'grey' }}
                      onClick={() => handleClickUser(ticket.userId._id)}
                    >
                      {ticket.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {reply.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Sent on: {new Date(reply.time).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
                {reply.attachedFiles && reply.attachedFiles.length > 0 && (
                  <List dense>
                    {reply.attachedFiles.map((file, fileIndex) => (
                      <ListItem key={fileIndex}>
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
                )}
              </Paper>
            ))}
          </Paper>
        )}

        {ticket.responses && ticket.responses.length > 0 && (
          <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              Responses
            </Typography>
            {ticket.responses.map((response, index) => (
              <Paper key={index} elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Avatar for Response (Admin) */}
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>ME</Avatar>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {response.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Sent on: {new Date(response.time).toLocaleString()}
                    </Typography>
                    {response.attachedFiles && (
                <List dense>
                  {response.attachedFiles.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              )}
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Paper>
        )}

        {/* Admin Response Form */}
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Send a Response
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Type your response here..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                type="file"
                inputProps={{ multiple: true }} // Allow multiple files
                onChange={handleFileChange}
                sx={{ display: 'none' }} // Hide the default file input
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button variant="outlined" component="span" sx={{ mb: 2 }}>
                  Attach Files
                </Button>
              </label>
              {/* Display attached file names */}
              {attachedFiles.length > 0 && (
                <List dense>
                  {attachedFiles.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!responseMessage.trim()}>
                  Send Response
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Grid>
  );
}

export default RightSideTicketDetails;
