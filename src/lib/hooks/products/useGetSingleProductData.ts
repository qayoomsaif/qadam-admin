import { useMutation, useQuery } from '@tanstack/react-query'
import {
  addProductApi,
  createOrderApi,
  getSingleProductApi,
  loginApi,
} from '../../../utils/services'
import { useSession } from '../auth'
import { IAddProduct } from '../../schema/products'
import { useAppSelector } from '../../../store'

export const useGetSingleProductData = (productId: string) => {
  const state = useAppSelector((state) => state.session)

  const { data, isError, isLoading, isSuccess, error } = useQuery({
    queryKey: ['GET_PRODUCT_DATA', productId],
    queryFn: () => getSingleProductApi(productId, state.session.access_token),
  })

  return {
    data,
    isError,
    error,
    isLoading,
    isSuccess,
  }
}
