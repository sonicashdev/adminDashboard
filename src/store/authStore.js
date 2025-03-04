import  { create }  from "zustand";
import axios, { isAxiosError } from "axios"
import toast from "react-hot-toast";



axios.defaults.withCredentials=true
const API_URl=process.env.NEXT_PUBLIC_API_URL
export const useAuthStore = create((set,get)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    users:[],
    analytics:null,
    plansRequests:null,
    signup: async(email , password , name)=>{
        set({isLoading:true , error:null})
        try {
            const response = await axios.post(`${API_URl}/auth/signup` , {email , password , name})
            set({
                user:response.data.user ,
                isLoading:false
            })
        } catch (error) {
            set({error:error.response.data.message || "Error Signing Up",
                isLoading:false 
            })
            throw error;
            
        }

    },
    verifyEmail:async (code)=>{
        set({isLoading:true , error:null})
        try {
            const response = await axios.post(`${API_URl}/auth/verify-email`  ,{code})
            set({user:response.data.user , isAuthenticated:true , isLoading:false , error:null})
            return response.data
            
        } catch (error) {
            set({error:error.response.data.message,
                isLoading:false 
            })
            throw error;
            
        }
    },
    login: async(email , password)=>{
        set({ error:null})
        try {
            const response = await axios.post(`${API_URl}/auth/admin/controll/login` , {email , password})
            set({user:response.data.user , isLoading:false , isAuthenticated:true , error:null})            
            return response
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Something went wrong';
            set({
              error: errorMessage,
              isLoading: false,
            });
        
            // Display toast with the error message
            toast.error(errorMessage);
        
            // Throw the error to propagate it up
            throw error;
            
        }

    },
    refreshToken:async()=>{
        if(get().isCheckingAuth) return ;

        set({isCheckingAuth:true});
        try {
            const response = await axios.post(`${API_URl}/auth/refresh-token`)
            set({isCheckingAuth:false})
            return response.data
            
        } catch (error) {
            set({user:null , isCheckingAuth:false})
            
        }
    },
    updatePasssword: async (oldPassword , newPassword)=>{
        try {
            const response = await axios.post(`${API_URl}/auth/update-password`,{oldPassword , newPassword})
            return response
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error while updating user passwords'});
            console.log(error)
        }
    },
    checkAuth:async()=>{
        set({error:null })
        try {
            const response = await axios.get(`${API_URl}/auth/check-auth`)
                set({
                    user:response.data.user,
                    isAuthenticated:true,
                    isCheckingAuth:false,
                    error:null
                })
            return response
        } catch (error) {
            console.log(error.response.status)
            set({error:error.response.data.message ,
                isCheckingAuth:false,
                isAuthenticated:false
            })
            
        }
    },
    logOut:async()=>{
        try {
            await axios.post(`${API_URl}/auth/logout`,{withCredentials:false})
            set({user:null , isAuthenticated:false})
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error while logging user out'});
            console.log(error)
        }
    },
    getAllUsers:async()=>{
        try {
            const response =  await axios.get(`${API_URl}/admin/users`)
            set({users:response.data.users})
            return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error getting all users'});
            console.log(error)
        }
    },
    getUsersByField:async(field,value)=>{
        try {
            const response = await axios.get(`${API_URl}/admin/users/get-users`,
                {
                    params:{
                        field:field,
                        value:value
                    }
                })
                return response.data
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error getting user by field'});
            console.log(error)
        }
    },
    getAnalyticDashboard:async()=>{
        try {
            const response =  await axios.get(`${API_URl}/admin/analytics`)
            return response.data
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error while getting analytics' });
            console.log(error)
            throw new Error(error.response?.data?.message)
            
        }
    },
    getInvestmentsRequests:async()=>{
        try {
            const response =  await axios.get(`${API_URl}/admin/investments/requests`)
            set({plansRequests:response.data.plan})
            return response.data.plans
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While getting Investments requests' });
            console.log(error)
        }
    },
    deleteUserById: async (userId) => {
       // set({ isLoading: true, error: null });
        try {
          await axios.delete(`${API_URl}/admin/users/${userId}`);
          await get().getAnalyticDashboard();

        } catch (error) {
          set({ error: error.response?.data?.message || 'Error deleting user', isLoading: false });
          console.log(error)
        }
      },
      updatePlanStatus:async (id , newStatus)=>{
        try {
            const response = await axios.put(
                `${API_URl}/admin/investments/edit-request/${id}`,
                { status: newStatus },
              );
              await get().getAnalyticDashboard()
              return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While updating plan request status'});
            console.log(error)
        }
      },
      getAllPlansRequests:async ()=>{
        try {
            const response = await axios.get(`${API_URl}/admin/investments/requests`);
            return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While getting all plans requests'});
            console.log(error)
        }
      },
      checkoutHandler: async (planId)=>{
        try {
            const response = await axios.post(`${API_URl}/payment/create-checkout-session`, {planId})
            return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While payment checkout'});
            console.log(error)
        }
      },
      getPyamentDetails: async (session_id)=>{
        try {
            const response = await axios.post(`${API_URl}/payment/checkout-success`, {sessionId:session_id});
            await get().checkAuth()
            return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While getting payment details'});
            console.log(error)
            
        }
      },
      updateUserProfile: async (formData, userID) => {
        try {
          const response = await axios.post(
            `${API_URl}/auth/update-user/${userID}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file uploads
              },
              withCredentials: true, // Include credentials if needed
            }
          );
          set({ user: response.data.updatedUser }); // Update the user in the store
          console.log(response);
          return response;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Error While Updating User Details' });
          console.log(error);
        }
      },
      getAllWithdrawlRequests: async ()=>{
        try {
            const response = await axios.get(`${API_URl}/admin/withdrawl-requests`)
            return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While getting all withdrawl requests requests'});
            console.log(error)
        }
      },
      handleUpdateWithdrawlStatus: async(id , newStatus)=>{
        try {
            const response = await axios.put(
                `${API_URl}/admin/withdrawl-action/${id}`,
                { action: newStatus },
              );
              return response
            
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error While updating withdrawl request status'});
            console.log(error)
        }
      },
      getAllTransactions: async ()=>{
        try {
            const response = await axios.get(`${API_URl}/admin/transactions`)
            return response
        } catch (error) {
            set({error:error.response.data.message})
            console.log(error)
            throw new Error(error.response.data.message)
        }
      },
      addBannerData:async (formData)=>{
        try {
            const response = await axios.post(`${API_URl}/admin/add-banner`,formData , {
                headers:{
                    "content-type":"multipart/form-data"
                }
            })
            return response
            
        } catch (error) {
            throw new Error(error.response?.data?.message)
        }
      },
      deletePoll:async(pollId)=>{
        try {
            const response = await axios.delete(`${API_URl}/poll/delete-poll/${pollId}`)
            return response
            
        } catch (error) {
            throw new Error(error.response?.data?.message)
        }
      },
      getAllPolls:async () =>{
        try {
            const response = await axios.get(`${API_URl}/poll/get-all-polls`)
            return response;
            
        } catch (error) {
            throw new Error(error.response?.data?.message)
        }
      },
      updatePoll: async (formData , pollId)=>{
        try {
            const response = await axios.put(`${API_URl}/poll/update-poll/${pollId}`, formData );
            return response
        } catch (error) {
            throw new Error(error.response?.data?.message)
        }
      },
      allTickets:async()=>{
        try {
          const response = await axios.get(`${API_URl}/ticket/all-tickets`)
          return response
        } catch (error) {
          throw error
        }
      },
      updateTicket:async(ticketId , status)=>{
        try {
            const response = await axios.put(`${API_URl}/ticket/update-ticket-status/${ticketId}`,{status})
            return response
        } catch (error) {
            throw error
        }
      },
      getTicketDetails:async (ticketId)=>{
        try {
            const response = await axios.get(`${API_URl}/ticket/get-ticket-details/${ticketId}`)
            return response
        } catch (error) {
            throw error
        }
      },
      sendResponse:async(formData , ticketId)=>{
        try {
            const response = await axios.put(`${API_URl}/ticket/respond-to-ticket/${ticketId}`,formData , {
                headers:{
                    "content-type":"multipart/form-data"
                }
            })
            return response
        } catch (error) {
            throw error
        }
      }
}))


let isRefreshing = false;
let refreshTokenPromise = null;

axios.interceptors.response.use(
  response => response,  // On successful response, do nothing
  async (error) => {
    const originalRequest = error.config;

    // If the status is 401 and the request hasn't already been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a token refresh is already in progress, wait for it to finish before retrying
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshTokenPromise.then(() => {
            axios(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      // Set refreshing flag to true
      isRefreshing = true;

      try {
        // Call the refresh token endpoint to get a new access token
        refreshTokenPromise = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {}, { withCredentials: true });

        const response = await refreshTokenPromise;

        // After receiving new token, retry the original request
        isRefreshing = false;
        refreshTokenPromise = null;

        // No need to modify the headers since cookies are automatically sent with the request
        return axios(originalRequest); // Retry the original request

      } catch (err) {
        isRefreshing = false;
        refreshTokenPromise = null;
        useAuthStore.getState().logOut();
        return Promise.reject(err);
      }
    }

    // If the error is not a 401, just reject the promise
    return Promise.reject(error);
  }
);

// let isRefreshing = false;
// let refreshTokenPromise = null;

// axios.interceptors.response.use(
//     response => response,  // On successful response, do nothing
//     async (error) => {
//         const originalRequest = error.config;

//         // If the status is 401 and the request hasn't already been retried
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             // If a token refresh is already in progress, wait for it to finish before retrying
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     refreshTokenPromise.then(() => {
//                         axios(originalRequest).then(resolve).catch(reject);
//                     });
//                 });
//             }

//             // Set refreshing flag to true
//             isRefreshing = true;

//             try {
//                 // Call the refresh token endpoint to get a new access token
//                 refreshTokenPromise = axios.post(`${API_URl}/auth/refresh-token`, {}, { withCredentials: true });

//                 const response = await refreshTokenPromise;

//                 // After receiving new token, retry the original request
//                 isRefreshing = false;
//                 refreshTokenPromise = null;

//                 // No need to modify the headers since cookies are automatically sent with the request
//                 return axios(originalRequest); // Retry the original request

//             } catch (err) {
//                 isRefreshing = false;
//                 refreshTokenPromise = null;

//                 // Log out the user and redirect to login page on 401
//                 useAuthStore.getState().logOut();
//                 const router = useRouter();
//                 router.push('/login');

//                 return Promise.reject(err);
//             }
//         }

//         // If the error is not a 401, just reject the promise
//         return Promise.reject(error);
//     }
// );

