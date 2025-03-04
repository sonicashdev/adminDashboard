import React from 'react'
import { Typography,  CardContent,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,  Paper } from '@mui/material';

const DepositsTable = ({user}) => {
  return (
    <>  
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Deposits</Typography>
              {user.deposits && user.deposits.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table stickyHeader aria-label="deposit table">
                    <TableHead sx={{backgroundColor:'linear-gradient(to right, #04dcc4, #04a3d3)'}}>
                      <TableRow>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell><strong>Currency</strong></TableCell>
                        <TableCell><strong>Method</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {user.deposits.map((deposit) => (
                        <TableRow key={deposit._id}>
                          <TableCell>{deposit.amount}</TableCell>
                          <TableCell>{deposit.currency}</TableCell>
                          <TableCell>{deposit.method}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">No deposits found.</Typography>
              )}
              </CardContent>
              </>
  )
}

export default DepositsTable