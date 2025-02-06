import { useMutation } from '@tanstack/react-query'
import { signupApi } from '../../../utils/services'
import { ISignupData } from '../../schema/auth'

export const useSignup = () => {
  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: ISignupData) => signupApi(body),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
