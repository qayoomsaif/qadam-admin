import React, { useState } from 'react'
import Image from 'next/image'
import styles from './reset-password.module.scss'
import { useRouter } from 'next/router'
import Logo from '../../assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { changePassword } from '../../utils/services' // Importing the service function for changing password
import { useDispatch } from 'react-redux'
import { setUserDetail } from '../../utils/HelperService' // Helper service to set user details after password change

const ResetPassword = () => {
  const router = useRouter() // Accessing Next.js router to programmatically navigate to different pages
  const dispatch = useDispatch() // Redux dispatch hook to update state in the Redux store

  // State to manage the old, new, and confirm password input values
  const [oldPassword, setOldPasword] = useState('')
  const [newPassword, setNewPasword] = useState('')
  const [confirmPassword, setConfrimPasword] = useState('')

  // State to manage the visibility of the password field (toggle between text and password type)
  const [showPassword, setShowPassword] = useState(false)

  // State to manage the error message for form validation
  const [errorMessage, setErrorMessage] = useState('')

  // Toggle function to show or hide password
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  // Validation function to check if the new password meets the criteria:
  // - At least 8 characters
  // - Contains at least one uppercase letter
  // - Contains at least one special character
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/
    return passwordRegex.test(password)
  }

  // Function to handle password change logic when the user clicks the "Change Password" button
  const handleChangePasword = async () => {
    try {
      // Clear any previous error messages
      setErrorMessage('')

      // Form validation checks
      if (!oldPassword) {
        setErrorMessage('Old password is required.')
        return
      }
      if (!newPassword) {
        setErrorMessage('New password is required.')
        return
      }
      if (!confirmPassword) {
        setErrorMessage('Confirm password is required.')
        return
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirm password do not match.')
        return
      }

      // Validate the new password using the criteria in the `validatePassword` function
      if (!validatePassword(newPassword)) {
        setErrorMessage(
          'Password must be at least 8 characters, with one uppercase letter and one special character.'
        )
        return
      }

      // If all validations pass, call the `changePassword` service to update the password
      let response = await changePassword({
        currentPassword: oldPassword,
        newPassword: newPassword,
      })

      // If the response contains user data, update the user details and redirect to the home page
      if (response?.data?.data?.user_data) {
        setUserDetail(response?.data?.data?.user_data)
        router.push('/home')
      }
    } catch (error) {
      // Handle any errors that occur during the password change process
      setErrorMessage('Failed to change password. Please try again.')
    }
  }

  return (
    <div className={styles['container']}>
      {/* Display the organization logo */}
      <Image className={styles['organization-logo']} src={Logo} alt="logo" />

      <div>
        <h1 className={styles['heading']}>Welcome!</h1>
        <h4 className={styles['small-heading']}>
          Please change your password.
        </h4>
      </div>

      {/* Form for entering old password, new password, and confirm password */}
      <div className={styles['form']}>
        <InputNew
          title={'Old Password'}
          value={oldPassword}
          showPassword={showPassword}
          onChange={setOldPasword}
          handlePasswordToggle={handlePasswordToggle}
        />
        <InputNew
          title={'New Password'}
          value={newPassword}
          showPassword={showPassword}
          onChange={setNewPasword}
          handlePasswordToggle={handlePasswordToggle}
        />
        <InputNew
          title={'Confirm Password'}
          value={confirmPassword}
          showPassword={showPassword}
          onChange={setConfrimPasword}
          handlePasswordToggle={handlePasswordToggle}
        />

        {/* Display any validation or error messages */}
        {errorMessage && (
          <p className="text-red-500 font-semibold text-sl">{errorMessage}</p>
        )}

        {/* Button to trigger the password change */}
        <button
          type="submit"
          onClick={handleChangePasword}
          className={styles['button']}
        >
          Change Password
        </button>
      </div>
    </div>
  )
}

const InputNew = ({
  showPassword,
  value,
  onChange,
  handlePasswordToggle,
  title,
}) => {
  return (
    <>
      {/* Label for the password input */}
      <label className={styles['label']}>{title}</label>

      {/* Input field with a toggle button to show/hide password */}
      <div style={{ position: 'relative' }} className={styles['input']}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter Password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: 'none',
            background: 'none',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handlePasswordToggle}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {/* Toggle icon for showing/hiding password */}
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    </>
  )
}

export default ResetPassword
