// pages/LoginPage.tsx
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from '../../utils/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import styles from './signup.module.scss'
import Logo from '../../assets/logo.svg'
import { AuthPage } from '../../components/layout/AuthPage'
import { Signup } from '../../components/Auth/Signup'

const signup = () => {
  return (
    <AuthPage>
      <Signup />
    </AuthPage>
  )
}

export default signup
