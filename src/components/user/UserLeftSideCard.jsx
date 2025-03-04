import React from 'react'
import { Avatar, Card, CardContent, Chip, Divider, Grid, List, ListItem, ListItemIcon, ListItemSecondaryAction, Stack, Typography } from '../../../node_modules/@mui/material/index'
import { format } from 'date-fns'; // For date formatting
import { CallCalling, Gps, Link1, Sms } from 'iconsax-react'; // Icons

const avatarImage = '/assets/images/users';

function UserLeftSideCard({user}) {
  return (
            <Grid item xs={12} sm={5} md={4} xl={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Stack direction="row" justifyContent="flex-end">
                            <Chip label={user.role || '---'} size="small" color="primary" /> {/* Dynamic Role */}
                          </Stack>
                          <Stack spacing={2.5} alignItems="center">
                            <Avatar alt="User Avatar" size="xl" src={user.image || `${avatarImage}/default.png`} /> {/* Dynamic Avatar */}
                            <Stack spacing={0.5} alignItems="center">
                              <Typography variant="h5">{user.name}</Typography> {/* Dynamic User Name */}
                              <Typography color="secondary">{user.role || 'Role Not Available'}</Typography> {/* Dynamic User Role */}
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                            <ListItem>
                              <ListItemIcon>
                                <Sms size={18} />
                              </ListItemIcon>
                              <ListItemSecondaryAction>
                                <Typography align="right">{user.email}</Typography> {/* Dynamic Email */}
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <CallCalling size={18} />
                              </ListItemIcon>
                              <ListItemSecondaryAction>
                              <Typography align="right">{user.phone || 'Phone Not Available'}</Typography>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Gps size={18} />
                              </ListItemIcon>
                              <ListItemSecondaryAction>
                                <Typography align="right">{user.country || 'Location Not Available'}</Typography> {/* Dynamic Location */}
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Gps size={18} />
                              </ListItemIcon>
                              <ListItemSecondaryAction>
                                <Typography align="right">{`${format(new Date(user.lastLogin), 'MMMM dd, yyyy h:mm a')}` || 'Last Login is Not Available'}</Typography> {/* Dynamic Location */}
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
  )
}

export default UserLeftSideCard