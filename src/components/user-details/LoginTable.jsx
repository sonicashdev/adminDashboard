import React from 'react'
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Stack, Divider, List, ListItem, ListItemIcon, ListItemSecondaryAction, Link } from '@mui/material';
import { format } from 'date-fns'; // For date formatting

const LoginTable = ({loginHistory , loginHistoryPage, handlePageChange}) => {
    const loginHistoryPerPage = 10;
    const indexOfLastLogin = loginHistoryPage * loginHistoryPerPage;
    const indexOfFirstLogin = indexOfLastLogin - loginHistoryPerPage;
    const currentLoginHistory = loginHistory.slice(indexOfFirstLogin, indexOfLastLogin);
  
  return (
    <>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Login History
                      </Typography>
                      {loginHistory && loginHistory.length > 0 ? (
                        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                          <Table stickyHeader aria-label="login history table">
                            <TableHead sx={{ background: 'linear-gradient(to right, #04dcc4, #04a3d3)' }}>
                              <TableRow>
                                <TableCell>
                                  <strong>IP Address</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>City</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>Country</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>Login Time</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {currentLoginHistory.map((login, index) => (
                                <TableRow key={index}>
                                  <TableCell>{login.ip}</TableCell>
                                  <TableCell>{login.city}</TableCell>
                                  <TableCell>{login.country}</TableCell>
                                  <TableCell>{format(new Date(login.loginTime), 'MMMM dd, yyyy h:mm a')}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No login history found.
                        </Typography>
                      )}
    
                      {/* Pagination for Login History */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                          count={Math.ceil(loginHistory.length / loginHistoryPerPage)} // Calculate total pages
                          page={loginHistoryPage} // Current page
                          onChange={handlePageChange} // Handle page change
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
    </>
  )
}

export default LoginTable