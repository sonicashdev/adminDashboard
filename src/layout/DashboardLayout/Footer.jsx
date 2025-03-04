// next
import Link from 'next/link';

// material-ui
import Links from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

export default function Footer() {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">&copy; Sonicach - Crypto Investments Platform</Typography>
      <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        <Links component={Link} href="https://sonicash.io" target="_blank" variant="caption" color="text.primary">
          Home
        </Links>
        <Links component={Link} href="https://doc.sonicash.io" target="_blank" variant="caption" color="text.primary">
          Documentation
        </Links>
        <Links component={Link} href="https://stackdeans.com" target="_blank" variant="caption" color="text.primary">
          Support
        </Links>
      </Stack>
    </Stack>
  );
}
