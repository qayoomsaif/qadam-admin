import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../../utils/services'
import { ILoginData } from '../../schema/auth'

export const useLogIn = () => {
  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: ILoginData) => loginApi(body),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
