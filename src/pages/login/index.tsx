// pages/LoginPage.tsx
import React, { useEffect } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import axios from '../../utils/axios'
import styles from './login.module.scss'
import { useRouter } from 'next/router'
import Logo from '../..//assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Toaster from '../../components/Toaster/Toaster'
import { loginApi } from '../../utils/services'
import { Login } from '../../components/Auth/Login/Login'
import { AuthPage } from '../../components/layout/AuthPage'

const login = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const handleResize = () => {
    const width = window.innerWidth
    setIsMobile(width < 800)
    setIsTablet(width >= 800 && width < 940)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <AuthPage isMobile={isMobile}>
      <Login />
    </AuthPage>
  )
}

export default login
