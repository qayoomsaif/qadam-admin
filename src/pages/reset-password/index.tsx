import React, { FormEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Logo from '../../assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { resetPassword, sendVerifyEmail } from '../../utils/services'
import { toast } from 'react-toastify'
import { VerificationOtp } from '../../components/Auth/ChangePasword/VerificationOtp'

// Define the shape of the validation errors
type ValidationErrors = {
  email?: string
  password?: string
  confirmPassword?: string
}
type otpType = {
  otp?: string
  verification_token?: string
}

const ResetPassword = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [otpData, setOtpData] = useState<otpType>()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({}) // Use the ValidationErrors type

  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Manual validation function
  const validateForm = (): boolean => {
    const validationErrors: ValidationErrors = {}

    if (!email) {
      validationErrors.email = 'Email is required'
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Invalid email format'
    }

    if (!password) {
      validationErrors.password = 'Password is required'
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long'
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Confirm password is required'
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0 // Form is valid if no errors
  }

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Perform validation
    if (!validateForm()) {
      return
    }

    // Proceed with password change request if validation passes
    try {
      const response = await sendVerifyEmail(email)
      if (response.data.data) {
        setOtpData(response.data.data)
        toast.success('Password reset successful!')
        // router.push('/login') // Redirect after successful reset
      } else {
        toast.error('Failed to reset password')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred while resetting password')
    }
  }
  const handleReset = async (e: React.FormEvent, otp: string) => {
    // const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Proceed with password change request if validation passes
    try {
      const response = await resetPassword(
        { newPassword: password, otp: otp },
        otpData.verification_token
      )
      if (response.data.data) {
        setOtpData(response.data.data)
        toast.success('Password reset successful!')
        // router.push('/login') // Redirect after successful reset
      } else {
        toast.error('Failed to reset password')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred while resetting password')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center  p-6">
      <Image className="w-40 mb-8" src={Logo} alt="logo" />
      {!otpData?.verification_token ? (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-2">Reset Password</h1>
            <h4 className="text-gray-600 mb-6">
              Please enter your email to reset your password
            </h4>
          </div>

          <form
            className="w-full max-w-sm bg-gray-100   shadow-lg rounded-lg p-6 space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <PasswordInput
              title="New Password"
              value={password}
              showPassword={showPassword}
              onChange={setPassword}
              handlePasswordToggle={handlePasswordToggle}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}

            <PasswordInput
              title="Confirm Password"
              value={confirmPassword}
              showPassword={showPassword}
              onChange={setConfirmPassword}
              handlePasswordToggle={handlePasswordToggle}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary-blue-500 text-white py-2 rounded-md hover:bg-blue-900"
            >
              Reset Password
            </button>
          </form>
        </>
      ) : (
        <VerificationOtp
          setOtpData={setOtpData}
          email={email}
          handleSubmit={handleReset}
        />
      )}
    </div>
  )
}

// Reusable PasswordInput component for password fields
const PasswordInput = ({
  showPassword,
  value,
  onChange,
  handlePasswordToggle,
  title,
}: {
  showPassword: boolean
  value: string
  onChange: (value: string) => void
  handlePasswordToggle: () => void
  title: string
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div className="relative mt-1">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter Password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handlePasswordToggle}
          className="absolute inset-y-0 right-4 flex items-center text-gray-500 focus:outline-none"
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
  )
}

export default ResetPassword
