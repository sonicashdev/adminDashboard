/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    domains: ['flagcdn.com' , 'res.cloudinary.com']
  },
  transpilePackages: ['react-syntax-highlighter'],
  env: {
    NEXT_APP_VERSION: 'v2.0.1',
    NEXTAUTH_SECRET: 'LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=',
    NEXTAUTH_URL: 'http://localhost:3000/',
    REACT_APP_GOOGLE_MAPS_API_KEY: 'AIzaSyAXv4RQK39CskcIB8fvM1Q7XCofZcLxUXw',
    NEXT_APP_MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoicmFrZXNoLW5ha3JhbmkiLCJhIjoiY2xsNjNkZm0yMGhvcDNlb3phdjF4dHlzeiJ9.ps6azYbr7M3rGk_QTguMEQ',
    NEXT_APP_API_URL: 'https://mock-data-api-nextjs.vercel.app',
    NEXT_APP_JWT_SECRET: 'ikRgjkhi15HJiU78-OLKfjngiu',
    NEXT_APP_JWT_TIMEOUT: '86400',
    NEXTAUTH_SECRET_KEY: 'LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=',
    NEXT_PUBLIC_API_URL: 'http://wcggogocs4wosw8w404ocsss.167.86.86.179.sslip.io/api'
  }
};

module.exports = nextConfig;
