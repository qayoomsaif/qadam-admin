import { Button } from '@chakra-ui/react'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { sendVerifyEmail } from '../../../../utils/services'
import OtpInput from './OtpInput'

interface VerificationProps {
  email: string
  setOtpData: (otp: otpType) => void
  handleSubmit: (e: React.FormEvent, otpCode: string) => void
}
type otpType = {
  otp?: string
  verification_token?: string
}

export const VerificationOtp: React.FC<VerificationProps> = ({
  email,
  setOtpData,
  handleSubmit,
}) => {
  const [otpCode, setOtpCode] = useState<string>('')
  const [timer, setTimer] = useState<number>(60)
  const [isResending, setIsResending] = useState<boolean>(false)

  // Countdown timer effect
  useEffect(() => {
    if (timer === 0) return
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1)
    }, 1000)
    return () => clearInterval(countdown)
  }, [timer])

  // Resend OTP and reset timer
  const handleResendOTP = async () => {
    setIsResending(true)
    try {
      const response = await sendVerifyEmail(email)
      if (response.data?.data) {
        setOtpData(response.data?.data)
        setTimer(120)
        toast.success('OTP resent successfully.')
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  // Mask email for display
  const maskedEmail = () => {
    return `*****${email.slice(-4)}`
  }

  return (
    <form
      className="p-8 flex flex-col justify-center items-center gap-4"
      onSubmit={(e) => handleSubmit(e, otpCode)}
    >
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Verification</h1>
        <h4 className="text-gray-600 mb-6 max-w-[22rem] text-centers">
          Enter the 6-character verification code we sent to you at{' '}
          {email && maskedEmail()}
        </h4>
      </div>
      <div className="flex flex-col gap-4">
        <OtpInput length={6} onChange={setOtpCode} />
        <Button
          variant="primary"
          size="lg"
          type="submit"
          isLoading={isResending}
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
        <button
          className="mt-[1rem] text-primary-blue-600 hover:underline"
          type="button"
          onClick={handleResendOTP}
          disabled={isResending}
        >
          Resend OTP
        </button>
      )}
    </form>
  )
}
