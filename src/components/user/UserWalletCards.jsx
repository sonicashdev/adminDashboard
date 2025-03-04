import React from 'react'
import { Card, CardContent, Grid, Typography } from '../../../node_modules/@mui/material/index'

function UserWalletCards({user}) {
  return (
    <Grid container spacing={2}>
    <Grid item xs={12} sm={4}>
      <Card
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #04dcc4, #04a3d3)'
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ color: '#fafafa', letterSpacing: 1 }}>
            Deposit Wallet
          </Typography>
          <Typography variant="h5" sx={{ color: '#fafafa', letterSpacing: 1 }}>
            ${user?.depositWallet || 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Card
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to left, #04dcc4, #04a3d3)'
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ color: '#fafafa', letterSpacing: 1 }}>
            Scoin Wallet
          </Typography>
          <Typography variant="h5" sx={{ color: '#fafafa', letterSpacing: 1 }}>
            {user?.scoinWallet || 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Card
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to left, #04dcc4, #04a3d3)'
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ color: '#fafafa', letterSpacing: 1 }}>
            Referral Wallet
          </Typography>
          <Typography variant="h5" sx={{ color: '#fafafa', letterSpacing: 1 }}>
            ${user?.referralWallet || 0}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
  )
}

export default UserWalletCards