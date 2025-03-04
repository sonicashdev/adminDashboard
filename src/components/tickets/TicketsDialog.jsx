import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Avatar } from '@mui/material';
import { Box, Typography } from '../../../node_modules/@mui/material/index';

const TicketsDialog = ({ open, onClose, loading, title, re }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {re.map((res, index) => (
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
              {/* Avatar with "Admin" text */}
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: '12px',
                  bgcolor: 'primary.main',
                  p:4
                }}
              >
                Admin
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketsDialog;