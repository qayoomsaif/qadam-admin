import { useMutation } from '@tanstack/react-query'
import { bulkUpdateVariantsApi } from '../../../utils/services'
import { useSession } from '../auth'
import { IBulkUpdateVariants } from '../../schema/products'
import { useAppSelector } from '../../../store'

export const useBulkUpdateVariants = () => {
  const { session } = useSession()
  const state = useAppSelector((state) => state.session)

  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: IBulkUpdateVariants) =>
      bulkUpdateVariantsApi(body, state.session.access_token),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
