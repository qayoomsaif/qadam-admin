import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { Constants } from './Constants'
import { getToken, removeUserDetail, setToken } from './HelperService'
import store from '../store'
import { login, logOut, setIsQadamUser } from '../slices/sessionSlice'
import Router from 'next/router'

// Helper to get vendor UUID if the user is a Qadam user
const getVendorUUID = () => {
  const { vendorUUID, isQadamUser } = store.getState().session
  return isQadamUser ? vendorUUID : null
}

// Function to refresh the token
const refreshToken = async () => {
  try {
    const session = await getToken()
    if (!session?.refresh_token) throw new Error('No refresh token available')
    const response = await axios.post(
      `${Constants.baseURL}/api/auth/token/refresh`,
      {
        refreshToken: session.refresh_token,
      }
    )

    const newTokens = {
      access_token: response?.data?.data?.access_token,
      refresh_token: response?.data?.data?.refresh_token,
      expires_in: Date.now() + response.data.data.expires_in * 1000,
      refresh_expires_in:
        Date.now() + response.data.data.refresh_expires_in * 1000,
      role: response?.data?.data?.user_data?.role,
    }
    store.dispatch(login(newTokens))
    setToken(newTokens)
    return newTokens.access_token
  } catch (error) {
    console.error('Request failed:', error?.message)
    console.error('Request failed:', error?.config)
    console.log('Request failed:', error?.message)
    console.log('Request failed:', error?.response?.data?.status?.message)
    handleAuthFailure()
    return Promise.reject(error)
  }
}

// Handle authentication failure by logging out and redirecting to login
const handleAuthFailure = () => {
  store.dispatch(setIsQadamUser(false))
  store.dispatch(logOut())
  removeUserDetail()
  Router.push('/login')
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: Constants.baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getToken()
    if (session?.access_token) {
      config.headers['Authorization'] = `Bearer ${session.access_token}`
    }

    if (config.url !== '/api/image/upload') {
      const vendorUUID = getVendorUUID()
      if (vendorUUID) {
        if (config.method === 'get') {
          config.params = { ...config.params, vendorUUID }
        } else {
          config.data = { ...config.data, vendorUUID }
        }
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getToken()
    if (session?.access_token) {
      config.headers['Authorization'] = `Bearer ${session.access_token}`
    }
    if (config.url !== '/api/image/upload') {
      const vendorUUID = getVendorUUID()
      if (vendorUUID) {
        if (config.method === 'get') {
          config.params = { ...config.params, vendorUUID }
        } else {
          config.data = { ...config.data, vendorUUID }
        }
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
