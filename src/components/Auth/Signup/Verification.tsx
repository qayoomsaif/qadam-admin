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
import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Toaster from '../../Toaster/Toaster'
import { useSession } from '../../../lib/hooks/auth'
import { useSignup } from '../../../lib/hooks/auth/useSignup'
import { VerificationProps } from './interface'
import OTPInput from '../../OtpInput'
import { useVerifyOTP } from '../../../lib/hooks/auth/useVerifyOTP'

export const Verification = ({ formData, setFormState }: VerificationProps) => {
  const { mutate, isPending, isError, error } = useVerifyOTP()
  const [otpCode, setOtpCode] = useState('')
  const [timer, setTimer] = useState(30)
  // const { logIn } = useSession()
  const router = useRouter()

  console.log('Form Data', formData)

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1
        } else {
          clearInterval(countdown)
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const phone = '0' + e.target[0].value
    const password = e.target[1].value
    mutate(
      {
        otp: otpCode,
        token: formData.token,
      },
      {
        onSuccess: (res) => {
          Toaster.success('Account Created! Please log in to continue.')
          router.push('/login')
        },
        onError: (e) => {
          console.log('ERROR', e)
        },
      }
    )
  }

  const maskedPhoneNumber = (phone: string) => {
    return `03*****${phone.slice(-4)}`
  }

  console.log('OTP code', otpCode)

  return (
    <form
      className="p-8 flex flex-col justify-center items-center gap-4"
      onSubmit={handleSubmit}
    >
      {/* <Image
        style={{
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        src={Logo}
        width={300}
        alt="logo"
      /> */}
      <span className="text-primary-blue-600 font-semibold text-4xl">
        Verification
      </span>
      <span className="text-neutral-gray-500 font-medium text-xl max-w-[22rem] text-center">
        Enter the 6 character verification code we sent to you at{' '}
        {formData?.email && formData.email}
      </span>
      <div className="text-neutral-gray-500 font-medium max-w-[22rem] text-center border rounded-xl px-2">
        Dev OTP code: {formData?.otp}
      </div>
      <div className="flex flex-col gap-4">
        <OTPInput
          length={6}
          onChange={(otp) => {
            console.log('change', otp)
            setOtpCode(otp)
          }}
        />
        <Button
          variant="primary"
          size="lg"
          type="submit"
          isLoading={isPending}
          // mt="1rem"
        >
          Verify
        </Button>
      </div>
      {timer > 0 ? (
        <span className="text-neutral-gray-500 mt-[1rem]">
          Having trouble? Request a new OTP in{' '}
          <time style={{ color: '#001662' }}>{`${timer} seconds`}</time>
        </span>
      ) : (
        <button className="mt-[1rem]" onClick={(e) => e.preventDefault()}>
          Resend OTP
        </button>
      )}
    </form>
  )
}
