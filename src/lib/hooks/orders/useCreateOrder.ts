import { useMutation } from '@tanstack/react-query'
import { createOrderApi, loginApi } from '../../../utils/services'
import { ILoginData } from '../../schema/auth'
import { IOrderData } from '../../schema/orders'
import { useSession } from '../auth'

export const useCreateOrder = () => {
  const { session } = useSession()

  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: IOrderData) => createOrderApi(body, session.access_token),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
