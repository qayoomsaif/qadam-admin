import { useMutation } from '@tanstack/react-query'
import { loginApi, verifyOtp } from '../../../utils/services'
import { ILoginData, IVerifyOTPData } from '../../schema/auth'

export const useVerifyOTP = () => {
  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: IVerifyOTPData) => verifyOtp(body),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
