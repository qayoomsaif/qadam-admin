import { useQuery } from '@tanstack/react-query'
import { getAllOrdersApi } from '../../../utils/services'

export const useOrder = (payload) => {
  const { data, isError, isLoading, isSuccess, error, refetch, isFetching } =
    useQuery({
      queryKey: ['GET_ALL_ORDER_DATA', payload],
      queryFn: () => getAllOrdersApi(payload),
    })
  return {
    data,
    isError,
    isLoading,
    isSuccess,
    error,
    refetch,
    isFetching,
  }
}
