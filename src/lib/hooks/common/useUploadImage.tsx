import { useMutation } from '@tanstack/react-query'
import { uploadImageApi } from '../../../utils/services'
import { useSession } from '../auth'
import { useAppSelector } from '../../../store'

export const useUploadImage = () => {
  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (body: FormData) => uploadImageApi(body),
  })

  return {
    mutate,
    isError,
    error,
    isPending,
    isSuccess,
  }
}
