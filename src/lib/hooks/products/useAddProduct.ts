import { useMutation } from '@tanstack/react-query'
import {
  addProductApi,
  createOrderApi,
  loginApi,
} from '../../../utils/services'
import { ILoginData } from '../../schema/auth'
import { IOrderData } from '../../schema/orders'
import { useSession } from '../auth'
import { IAddProduct } from '../../schema/products'
import { useAppSelector } from '../../../store'

export const useAddProduct = () => {
  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: IAddProduct) => addProductApi(body),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
