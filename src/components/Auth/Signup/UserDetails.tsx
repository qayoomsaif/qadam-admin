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
import { FormStates, UserDetailsProps } from './interface'

export const UserDetails = ({
  setFormData,
  setFormState,
}: UserDetailsProps) => {
  const { mutate, isPending, isError, error } = useSignup()
  const [responseError, setResponseError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const confirmPassword = e.target[3].value
    if (password !== confirmPassword) {
      setResponseError('Passwrods do not match')
      return
    }
    mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: (res) => {
          console.log('RES', res)
          setFormData({
            name,
            email,
            password,
            token: res.data.data.verification_token,
            otp: res.data.data.otp,
          })
          setFormState(FormStates.Verification)
          // Toaster.success('Account Created! Please log in to continue.')
          // router.push('/login')
        },
        onError: (e: any) => {
          setResponseError(e.status.message)
          console.log('ERROR', e.status.message)
        },
      }
    )
  }

  return (
    <form
      className="p-8 flex flex-col justify-center items-center gap-4"
      onSubmit={handleSubmit}
    >
      <Image
        style={{
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        src={Logo}
        width={300}
        alt="logo"
      />
      <span className="text-primary-blue-600 font-semibold text-4xl">
        Welcome!
      </span>
      <span className="text-neutral-gray-500 font-semibold text-xl">
        Create your Qadam.io account
      </span>
      <span className="text-red-500 font-medium max-w-[22rem] text-center">
        {responseError}
      </span>
      <div className="flex flex-col gap-4">
        <Input name="name" placeholder="Name" />
        <Input name="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
        />
        <Button
          variant="primary"
          size="lg"
          type="submit"
          isLoading={isPending}
          mt="1rem"
        >
          Create Account
        </Button>
      </div>
      <span className="font-medium text-lg mt-4">
        Already have an account?{' '}
        <Link className="text-accent-orange-500" href="/login">
          Log In
        </Link>
      </span>
    </form>
  )
}
