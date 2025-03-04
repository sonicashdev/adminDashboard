// import { useAuthStore } from 'store/authStore';

// export const authOptions = {
//   secret: process.env.NEXTAUTH_SECRET_KEY,
//   providers: [
//     CredentialsProvider({
//       id: 'login',
//       name: 'login',
//       credentials: {
//         email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
//         password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
//       },
//       async authorize(credentials) {
//         const { login } = useAuthStore();
//         try {
//           await login(credentials.email, credentials.password);
//           return { id: user.id, name: user.name, email: user.email }; // return the user object
//         } catch (error) {
//           throw new Error(error?.message || 'Login failed!');
//         }
//       }
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user, account }) => {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.id = user.id;
//       }
//       return token;
//     },
//     session: ({ session, token }) => {
//       if (token) {
//         session.user = { id: token.id, accessToken: token.accessToken };
//       }
//       return session;
//     }
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT)
//   },
//   jwt: {
//     secret: process.env.NEXT_APP_JWT_SECRET
//   },
//   pages: {
//     signIn: '/login',
//     newUser: '/register'
//   }
// };
