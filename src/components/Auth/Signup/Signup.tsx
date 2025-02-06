import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import Logo from '../../../assets/logo.svg'
import Image from 'next/image'
import { PhoneIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { FormEvent, FormEventHandler, useState } from 'react'
import { useRouter } from 'next/router'
import Toaster from '../../Toaster/Toaster'
import { useSession } from '../../../lib/hooks/auth'
import { useSignup } from '../../../lib/hooks/auth/useSignup'
import { UserDetails } from './UserDetails'
import { Verification } from './Verification'
import { FormStates, IFormData } from './interface'
import classNames from 'classnames'

export const Signup = () => {
  const { mutate, isPending, isError, error } = useSignup()
  const [formState, setFormState] = useState(FormStates.UserDetails)
  const [formData, setFormData] = useState<IFormData | null>(null)

  // const { logIn } = useSession()
  const router = useRouter()

  const userDetailsClasses = classNames(
    'absolute transition-all duration-300',
    {
      'translate-x-[-20rem] opacity-0': formState === FormStates.Verification,
    }
  )

  const verificationClasses = classNames(
    'absolute transition-all duration-300 translate-x-[20rem] opacity-0',
    {
      'translate-x-0 opacity-100': formState === FormStates.Verification,
    }
  )

  return (
    <div className="realtive w-full h-full flex items-center justify-center">
      <div className={userDetailsClasses}>
        <UserDetails
          setFormData={setFormData}
          setFormState={setFormState}
          formData={formData}
        />
      </div>
      <div className={verificationClasses}>
        <Verification
          setFormState={setFormState}
          setFormData={setFormData}
          formData={formData}
        />
      </div>
    </div>
  )
}
