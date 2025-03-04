'use client';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, TextField, FormControlLabel, Switch, Checkbox, FormGroup, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function SendNotifications() {
    const [emailSettings, setEmailSettings] = useState({
      subject: '',
      body: '',
      selectedUsers: [],
      sendToAll: false,
      searchQuery: '',
    });
  
    const [allUsers, setAllUsers] = useState([]);
    const matches = useMediaQuery('(max-width:900px)'); // Adjust breakpoint as needed
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, { withCredentials: true });
          setAllUsers(response.data.users);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchUsers(); // Fetch users when component mounts
    }, []);
  
    const handleSwitchChange = (event) => {
      const { checked } = event.target;
      setEmailSettings((prev) => ({
        ...prev,
        sendToAll: checked,
        selectedUsers: checked ? allUsers.map((user) => user.email) : [], // Automatically select all users if the switch is on
      }));
    };
  
    const handleCheckboxChange = (email) => (event) => {
      const { checked } = event.target;
  
      setEmailSettings((prev) => {
        const updatedSelectedUsers = checked
          ? [...prev.selectedUsers, email]
          : prev.selectedUsers.filter(user => user !== email);
  
        return {
          ...prev,
          selectedUsers: updatedSelectedUsers,
        };
      });
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setEmailSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const emailsToSend = emailSettings.selectedUsers.length > 0 || emailSettings.sendToAll
        ? emailSettings.sendToAll ? [] : emailSettings.selectedUsers
        : [];
  
      const data = {
        subject: emailSettings.subject,
        text: emailSettings.body,
        emails: emailsToSend,
      };
  
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/send-emails`, data, { withCredentials: true });
        if (res.status === 200) {
          toast.success('Emails sent successfully');
          setEmailSettings({
            subject: '',
            body: '',
            selectedUsers: [],
            sendToAll: false,
            searchQuery: '',
          });
        }
      } catch (error) {
        console.error('Error sending emails:', error);
        toast.error('Failed to send emails');
      }
    };
  
    const handleSearchChange = (event) => {
      const { value } = event.target;
      setEmailSettings((prev) => ({
        ...prev,
        searchQuery: value,
      }));
    };
  
    const filteredUsers = allUsers.filter(user =>
      user.email.toLowerCase().includes(emailSettings.searchQuery.toLowerCase())
    );
  
    return (
      <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
        <Box sx={{ width: matches ? '80%' : '50%', mt: 2 }}>
          <Toaster position="top-center" />
  
          {/* Subject */}
          <Typography sx={{ pl: 1 }}>Subject</Typography>
          <TextField
            name="subject"
            variant="standard"
            fullWidth
            sx={{ my: 2 }}
            value={emailSettings.subject}
            onChange={handleInputChange}
            InputProps={{  }}
          />
  
          {/* Body */}
          <Typography sx={{ pl: 1 }}>Body</Typography>
          <TextField
            name="body"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            sx={{ my: 2 }}
            value={emailSettings.body}
            onChange={handleInputChange}
            InputProps={{  }}
          />
  
          {/* Switch for "Send to All Users" */}
          <FormControlLabel
            control={<Switch checked={emailSettings.sendToAll} onChange={handleSwitchChange} color="primary" />}
            label={emailSettings.sendToAll ? 'Send to All Users' : 'Send to Selected Users'}
          />
  
          {/* If "Send to Selected Users" is chosen */}
          {!emailSettings.sendToAll && (
            <>
              {/* Search bar for users */}
              <TextField
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                value={emailSettings.searchQuery}
                onChange={handleSearchChange}
                label="Search User by Email"
                InputProps={{
                  startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                }}
              />
  
              {/* Display filtered users */}
              <FormGroup>
                {filteredUsers.map((user) => (
                  <FormControlLabel
                    key={user.email}
                    control={<Checkbox checked={emailSettings.selectedUsers.includes(user.email)} onChange={handleCheckboxChange(user.email)} />}
                    label={user.email}
                  />
                ))}
              </FormGroup>
  
              {/* Display selected users */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" >Selected Users</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: 1 }}>
                  {emailSettings.selectedUsers.map((email) => (
                    <Box key={email} sx={{ background: '#ebf6fc', padding: '4px 8px', borderRadius: '5px' }}>
                      {email}
                    </Box>
                  ))}
                </Box>
              </Box>
            </>
          )}
  
          {/* Send Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              my: 2,
              px: 5,
              py: '15px',
              width: '50%',
              mx: 'auto',
              letterSpacing: 1.5,
              fontWeight: 'bold',
              fontSize: 18,
              background: 'linear-gradient(to right, #04dcc4, #04a3d3)',
              borderRadius: '20px 20px',
            }}
          >
            Send Email
          </Button>
        </Box>
      </Box>
    );
  }
  
