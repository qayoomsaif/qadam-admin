import { useCallback, FormEvent, useEffect, useState } from 'react'
import { Button, Input } from '@chakra-ui/react'
import Logo from '../../../assets/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Toaster from '../../Toaster/Toaster' // For success/failure notifications
import { useDispatch } from 'react-redux'
import { login, logOut } from '../../../slices/sessionSlice'
import { getCategoriesApi, loginApi } from '../../../utils/services'
import { addCategories } from '../../../slices/categorySlice'
import Modal from '../../../components/Auth/Login/Modal'
import { setCookie } from 'cookies-next'
import {
  removeUserDetail,
  setUserDetail,
  setToken,
} from '../../../utils/HelperService' // Helper functions for setting and removing user details

export const Login = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Modal open/close functions memoized with useCallback
  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  // Handle window resize for responsiveness
  const handleResize = useCallback(() => {
    const width = window.innerWidth
    setIsMobile(width < 800) // Mobile width < 800px
    setIsTablet(width >= 800 && width < 940) // Tablet width between 800 and 940px
  }, [])

  // Email validation regex
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation for minimum length of 8 characters
  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  // Email and password validation functions
  const validateInputs = (email: string, password: string) => {
    if (!email) {
      setErrorMsg('Email is required')
      return false
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email')
      return false
    }
    if (!password) {
      setErrorMsg('Password is required')
      return false
    }
    if (!validatePassword(password)) {
      setErrorMsg('Password must be at least 8 characters')
      return false
    }
    return true
  }

  // Lifecycle hook to handle responsiveness and clean up
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    dispatch(logOut()) // Log out user on component mount
    removeUserDetail() // Clear user data on load
    return () => window.removeEventListener('resize', handleResize)
  }, [dispatch, handleResize])

  // Form submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    // Validate inputs
    if (!validateInputs(email, password)) return

    // Proceed with API request using the loginApi function
    try {
      setIsLoading(true)
      const res = await loginApi({ email, password })

      if (res?.data?.data?.access_token) {
        const tokens = {
          access_token: res.data.data.access_token,
          refresh_token: res.data.data.refresh_token,
          expires_in: Date.now() + res.data.data.expires_in * 1000,
          role: res.data.data.user_data?.role,
          refresh_expires_in:
            Date.now() + res.data.data.refresh_expires_in * 1000,
        }

        // Save tokens and user details to Redux and local storage
        dispatch(login(tokens))
        setToken(tokens)
        setUserDetail(res.data.data.user_data)

        // Fetch categories post-login and dispatch to Redux
        const categories = await getCategoriesApi()
        dispatch(addCategories(categories?.data?.data))

        // Show success notification
        Toaster.success('Welcome to Qadam.io!')

        // Check if it's the user's first login and redirect accordingly
        if (res.data.data.user_data?.first_login) {
          router.push('/change-password')
        } else {
          const redirectTo = Array.isArray(router.query.redirect)
            ? router.query.redirect[0] // Use the first item in the array if it's an array
            : router.query.redirect || '/home' // Use the value if it's a string, or default to '/home'
          router.push(redirectTo)
        }
      }
    } catch (e) {
      // Handle errors gracefully and show appropriate message
      setErrorMsg(
        e?.response?.data?.status?.message ||
          e?.message ||
          'Login failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className="p-8 flex flex-col justify-center items-center gap-4"
      onSubmit={handleSubmit} // Form submit handler
    >
      <Image
        src={Logo}
        width={300}
        alt="logo"
        className="cursor-pointer mb-4"
      />
      <span className="text-primary-blue-600 font-semibold text-4xl">
        Welcome Back!
      </span>
      <span className="text-neutral-gray-500 font-semibold text-xl">
        Please sign in to your account
      </span>

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />

        {/* Error Message Display */}
        {errorMsg && (
          <span className="text-red-500 font-semibold text-sm capitalize">
            {errorMsg}
          </span>
        )}

        {/* Login Button */}
        <Button
          variant="primary"
          size="lg"
          type="submit"
          isLoading={isLoading}
          mt="1rem"
        >
          Login
        </Button>
      </div>

      {/* Additional Links */}
      <Link href="/reset-password" className="text-accent-orange-500">
        Forgot Password?
      </Link>
      <span className="font-medium text-lg mt-4">
        Don't have an account?{' '}
        <button className="text-accent-orange-500" onClick={openModal}>
          Sign Up
        </button>
      </span>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </form>
  )
}
