import React from 'react'
// Material UI Components
import { Box, Typography, Grid, Card, CardContent, TextField, Button, Avatar, Switch, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  Paper, Pagination } from '@mui/material';
import { format } from 'date-fns'; // For date formatting

const InvestmentsTable = ({user}) => {
  return (
    <>
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Investments
        </Typography>
        {user.investments && user.investments.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table stickyHeader aria-label="investment table">
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(to right, #04dcc4, #04a3d3)' }}>
                  <TableCell>
                    <strong>Transaction ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Plan</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Start Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>End Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Recieved</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Return</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.investments.map((investment) => (
                  <TableRow key={investment._id}>
                    <TableCell>{investment.transactionID}</TableCell>
                    <TableCell>
                      <div>{investment.plan.name}</div>
                      <div>{investment.plan.cost}$</div>
                    </TableCell>
                    <TableCell>{investment.startTime && format(new Date(investment?.startTime), 'MMMM dd, yyyy h:mm a')}</TableCell>
                    <TableCell>{investment.endTime && format(new Date(investment?.endTime), 'MMMM dd, yyyy h:mm a')}</TableCell>
                    <TableCell>{investment.recievedScoin} Scach</TableCell>
                    <TableCell>{investment.status}</TableCell>
                    <TableCell>{investment.plan.totalInvestmentScach} Scach</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No investments found.
          </Typography>
        )}
      </CardContent>
      </Card>
    </>
  );
}

export default InvestmentsTable