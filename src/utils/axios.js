import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useAuthStore } from 'store/authStore';

const axiosServices = axios.create({ baseURL:process.env.NEXT_PUBLIC_API_URL });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

/**
 * Request interceptor to add Authorization token to request
 */
let refreshPromise = null;
axiosServices.interceptors.response.use(
    (response)=> response,
    async (error)=>{
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry){
            console.log('hello from error resp',error.response.status)
            originalRequest._retry=true
            try {
                if(refreshPromise){
                    await refreshPromise;
                    return axios(originalRequest)
                }
                refreshPromise=useAuthStore.getState().refreshToken()
                await refreshPromise;
                refreshPromise=null;

                return axios(originalRequest)
            } catch (refreshError) {
                useAuthStore.getState().logOut()
                return Promise.reject(refreshError)
                
            }
        }
        return Promise.reject(error)
    }
)

export default axiosServices;