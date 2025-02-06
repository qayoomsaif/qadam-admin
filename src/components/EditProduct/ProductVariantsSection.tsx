import { CloseIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import Image from 'next/image'
import { useUploadImage } from '../../lib/hooks/common/useUploadImage'
import { Button, Spinner, useToast } from '@chakra-ui/react'
import { useBulkUpdateVariants } from '../../lib/hooks/products/useBulkUpdateVariants'
import { useRouter } from 'next/router'

const getVariantHeading = (variant: {
  _id: string
  variant: { [key: string]: string }
}) => {
  const variantTypes = Object.keys(variant.variant)
  const values = variantTypes.map((type) => ({
    value: variant.variant[type],
    key: type,
  }))
  let title = ''

  values.forEach((val, i) => {
    title = title.concat(`${val.key}: ${val.value}`)
    if (i !== values.length - 1) {
      title = title.concat(' - ')
    }
  })

  return title
}

export const ProductVariantsSection = ({
  allVariants,
  productId,
}: {
  allVariants: {
    _id: string
    variant: { [key: string]: string }
    image_url: []
  }[]
  productId: string
}) => {
  const [variantImages, setVariantImages] = useState<{
    [key: string]: string[]
  }>({})

  const toast = useToast()

  const router = useRouter()

  const { mutate: mutateUploadImage, isPending: isUploadImagePending } =
    useUploadImage()

  const { mutate, isPending } = useBulkUpdateVariants()

  const handleFileUpload = (e, variantId) => {
    const formData = new FormData()
    const file = e.target.files[0]
    formData.append('file', file)
    formData.append('fileName', file?.name)

    mutateUploadImage(formData, {
      onSuccess: (res) => {
        console.log('RES', res)
        if (!variantImages[variantId]) {
          setVariantImages({
            ...variantImages,
            [variantId]: [...res.data.data],
          })
        } else {
          setVariantImages({
            ...variantImages,
            [variantId]: [...variantImages[variantId], ...res.data.data],
          })
        }
      },
      onError: (res) => {
        console.log(res)
      },
    })
  }

  const onRemoveImage = (image: string, variantId: string) => {
    setVariantImages({
      ...variantImages,
      [variantId]: variantImages[variantId].filter((img) => img !== image),
    })
  }

  const onUpdateVariantImages = () => {
    const vars = Object.keys(variantImages)

    const varsImageData = vars.map((varImg) => ({
      id: varImg,
      image_url: variantImages[varImg],
    }))

    return mutate(
      {
        productId: productId,
        variants: varsImageData,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Varaints images updated',
            status: 'success',
            variant: 'subtle',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          })
          router.reload()
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Varaints images could not be updated',
            status: 'error',
            variant: 'subtle',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          })
        },
      }
    )
  }

  return (
    <div className="w-full mt-8">
      <span className="w-full text-2xl font-semibold text-center pb-[4rem]">
        Add Variants Images
      </span>
      <div className="flex flex-col gap-8 mt-4">
        {allVariants.map((variant) => (
          <div className="">
            <span className="text-xl font-medium">
              {getVariantHeading(variant)}
            </span>
            <div className="w-full flex gap-4 flex-wrap mt-2">
              {variantImages[variant._id]?.map((image) => (
                <div className="w-[10rem] h-[10rem] relative rounded-lg bg-gray-100">
                  <CloseIcon
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                    onClick={() => onRemoveImage(image, variant._id)}
                  />
                  <Image
                    src={image}
                    alt={image}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, variant._id)}
              />
              {isUploadImagePending && <Spinner size="lg" />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <Button
          bg="#001459"
          color="white"
          size="lg"
          mt="2rem"
          onClick={() => onUpdateVariantImages()}
          isLoading={isPending}
        >
          Add Variant Images
        </Button>
        <Button
          bg="#001459"
          color="white"
          size="lg"
          mt="4rem"
          onClick={() => router.reload()}
        >
          Add Another Product
        </Button>
      </div>
    </div>
  )
}
