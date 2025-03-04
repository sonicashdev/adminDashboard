'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import Tabs from '@mui/material/Tabs';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';

// assets
import { ArrowDown, ArrowSwapHorizontal, ArrowUp } from 'iconsax-react';
import axios from '../../../../node_modules/axios/index';
import { Pagination, PaginationItem } from '../../../../node_modules/@mui/material/index';
import { format } from '../../../../node_modules/date-fns/format';
import { useAuthStore } from 'store/authStore';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| DATA WIDGET - TYRANSACTIONS ||============================== //

export default function Transactions({}) {
  const {getAllTransactions} = useAuthStore()
  const [value, setValue] = useState(0);
  const [investments , setInvestments] = useState([])
  const [page, setPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of items per page

  const filteredRunningInv = investments.filter(investment => investment.status === "Running");
  const filteredPendingInv = investments.filter(investment => investment.status === "Pending");
  const filteredApprovedInv = investments.filter(investment => investment.status === "approved");

  // Pagination logic for "Running" investments
  const totalRunningPages = Math.ceil(filteredRunningInv.length / itemsPerPage);
  const paginatedRunningInv = filteredRunningInv.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Pagination logic for "Pending" investments
  const totalPendingPages = Math.ceil(filteredPendingInv.length / itemsPerPage);
  const paginatedPendingInv = filteredPendingInv.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalApprovedgPages = Math.ceil(filteredApprovedInv.length / itemsPerPage);
  const paginatedApprovedgInv = filteredApprovedInv.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  console.log(filteredRunningInv)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(()=>{
    let mounted = true;
    const fetchInvestments = async ()=>{
      try {
        const response = await getAllTransactions()
        if(mounted){
          setInvestments(response.data.transactions)
        }
        
      } catch (error) {
        setInvestments([])
        console.log(error)
      } 
    }
    fetchInvestments()
    return ()=>{
      mounted = false;
    }
  },[])
  const totalPages = Math.ceil(investments.length / itemsPerPage);
  const paginatedInvestments = investments.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5">Transactions</Typography>
          <IconButton
            color="secondary"
            id="wallet-button"
            aria-controls={open ? 'wallet-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="wallet-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'wallet-button',
              sx: { p: 1.25, minWidth: 150 }
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <ListItemButton onClick={handleClose}>Today</ListItemButton>
            <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
            <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
          </Menu>
        </Stack>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3 }}>
            <Tab label="All Transaction" {...a11yProps(0)} />
            <Tab label="Running" {...a11yProps(1)} />
            <Tab label="Approved" {...a11yProps(1)} />
            <Tab label="Pending" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {paginatedInvestments.map((investment, index) => (
              <ListItem key={index}
              divider
              secondaryAction={
                <Stack spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle1">${investment.amount}</Typography>
                  <Typography variant="subtitle2">{format(new Date(investment.createdAt), 'MMMM dd, yyyy h:mm a')}</Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  type="outlined"
                  color="secondary"
                  sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                >
                  {investment.image ? investment.image : 'AI'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{investment.userName}</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {investment.transactionID}
                  </Typography>
                }
              />
            </ListItem>
            ))}
          </List>
          <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} renderItem={(item) => <PaginationItem {...item} />} />
          </Stack>
        </TabPanel>

        {/* Running Investments Tab */}
        <TabPanel value={value} index={1}>
          {investments.length > 0 ? (
                        <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
                        {paginatedRunningInv.map((investment, index) => (
                          <ListItem
                          key={index}
                            divider
                            secondaryAction={
                              <Stack spacing={0.25} alignItems="flex-end">
                                <Typography variant="subtitle1">${investment.amount}</Typography>
                                <Typography variant="subtitle2">{format(new Date(investment.createdAt), 'MMMM dd, yyyy h:mm a')}</Typography>
                              </Stack>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar
                                variant="rounded"
                                type="outlined"
                                color="secondary"
                                sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                              >
                                {investment.image ? investment.image : 'AI'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={<Typography variant="subtitle1">{investment.userName}</Typography>}
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {investment.transactionID}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
          )
        :
        'Loading Data...'
        }

          <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalRunningPages}
              page={page}
              onChange={handlePageChange}
              renderItem={(item) => <PaginationItem {...item} />}
            />
          </Stack>
        </TabPanel>

                {/* Pending Investments Tab */}
        <TabPanel value={value} index={2}>
          {investments.length > 0 ? (          
            <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
            {paginatedApprovedgInv.map((investment, index) => (
              <ListItem
              key={index}
              divider
              secondaryAction={
                <Stack spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle1">${investment.amount}</Typography>
                  <Typography variant="subtitle2">{format(new Date(investment.createdAt), 'MMMM dd, yyyy h:mm a')}</Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  type="outlined"
                  color="secondary"
                  sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                >
                  {investment.image ? investment.image : 'AI'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="subtitle1">{investment.userName}</Typography>}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {investment.transactionID}
                  </Typography>
                }
              />
            </ListItem>
            ))}
          </List>
          )
        : 'Loading Data...'
        }
          <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalApprovedgPages}
              page={page}
              onChange={handlePageChange}
              renderItem={(item) => <PaginationItem {...item} />}
            />
          </Stack>
        </TabPanel>

        {/* Pending Investments Tab */}
        <TabPanel value={value} index={3}>
          {investments.length > 0 ? (
                      <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
                      {paginatedPendingInv.map((investment, index) => (
                        <ListItem
                        key={index}
                        divider
                        secondaryAction={
                          <Stack spacing={0.25} alignItems="flex-end">
                            <Typography variant="subtitle1">${investment.amount}</Typography>
                            <Typography variant="subtitle2">{format(new Date(investment.createdAt), 'MMMM dd, yyyy h:mm a')}</Typography>
                          </Stack>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            type="outlined"
                            color="secondary"
                            sx={{ color: 'secondary.darker', borderColor: 'secondary.light', fontWeight: 600 }}
                          >
                            {investment.image ? investment.image : 'AI'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{investment.userName}</Typography>}
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {investment.transactionID}
                            </Typography>
                          }
                        />
                      </ListItem>
                      ))}
                    </List>
          ) 
        : 'Loading Data'}

          <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalPendingPages}
              page={page}
              onChange={handlePageChange}
              renderItem={(item) => <PaginationItem {...item} />}
            />
          </Stack>
        </TabPanel>
      </Box>
    </MainCard>
  );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.any, index: PropTypes.number };
