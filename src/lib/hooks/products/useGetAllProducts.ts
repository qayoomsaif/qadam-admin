import { useQuery } from '@tanstack/react-query'
import { getProductsApi } from '../../../utils/services'

import { useAppSelector } from '../../../store'

export const useGetAllProducts = (page) => {
  const { data, isError, isLoading, isSuccess, error, refetch ,isFetching} = useQuery({
    queryKey: ['GET_ALL_PRODUCTS_DATA'],
    queryFn: () => getProductsApi(page),
  })

  return {
    data,
    isError,
    error,
    isLoading,
    isSuccess,
    refetch,
    isFetching
  }
}
