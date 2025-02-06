import { useSelector } from 'react-redux'
import { Input } from '../inputs/Input'
import { Select } from '../inputs/Select'
import { RootState } from '../../store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Spinner, useToast } from '@chakra-ui/react'
import { useUploadImage } from '../../lib/hooks/common/useUploadImage'
import Image from 'next/image'
import { CloseIcon } from '@chakra-ui/icons'
import { useAddProduct } from '../../lib/hooks/products/useAddProduct'
import { useRouter } from 'next/router'
import 'react-quill/dist/quill.snow.css'
import TextEditor from './TextEditor'
import { editProductApi } from '../../utils/services'

const EditProduct = ({ data, productId }) => {
  console.log({ EditProduct: data })

  const categories = useSelector(
    (state: RootState) => state.categories.categories
  )
  const toast = useToast()
  const router = useRouter()

  const { mutate: mutateUploadImage, isPending: isUploadImagePending } =
    useUploadImage()

  const { mutate: mutateAddProduct, isPending: isAddProductPending } =
    useAddProduct()

  const [allVariants, setAllVariants] = useState<
    { _id: string; variant: { [key: string]: string }; image_url: [] }[] | null
  >(null)

  const [productData, setProductData] = useState(data)

  const handleChange = (content: string) => {
    setProductData({ ...productData, description: content })
  }

  useEffect(() => {
    setProductData({
      ...productData,
      category: categories[0]._id,
      subCategory: categories[0].subcategory[0]._id,
    })
  }, [])

  const subCategoryOptions = useMemo(() => {
    const categoryData = categories.find(
      (category) => category._id === productData.category
    )

    if (categoryData) {
      return categoryData.subcategory.map((subCategory) => ({
        key: subCategory.name,
        value: subCategory._id,
      }))
    } else {
      return []
    }
  }, [productData.category])

  const handleFileUpload = (e) => {
    const formData = new FormData()
    const file = e.target.files[0]
    formData.append('file', file)
    formData.append('fileName', file?.name)

    mutateUploadImage(formData, {
      onSuccess: (res) => {
        setProductData({
          ...productData,
          productImages: [...productData.productImages, ...res.data.data],
        })
      },
      onError: (res) => {
        console.log(res)
      },
    })
  }

  const onRemoveImage = (image: string) => {
    setProductData({
      ...productData,
      productImages: productData.productImages.filter((img) => img !== image),
    })
  }

  const onAddProduct = async () => {
    if (!productData.name || !productData.description) {
      toast({
        title: 'Error',
        description: 'Product name and description cannot be empty',
        status: 'error',
        variant: 'subtle',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    if (!productData.weight) {
      toast({
        title: 'Error',
        description: 'weight cannot be empty',
        status: 'error',
        variant: 'subtle',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }

    if (productData.productImages.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one product image',
        status: 'error',
        variant: 'subtle',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      return
    }
    const { name, description, category, subCategory, productImages, weight } =
      productData

    const apiPayload = {
      name,
      description,
      category,
      subCategory,
      image_url: productImages,
      weight: weight,
      variants: productData.variants,
    }
    try {
      let res = await editProductApi(apiPayload, productId)
      toast({
        title: 'Success',
        description: 'Product Edited',
        status: 'success',
        variant: 'subtle',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      router.push('/home')
      console.log({ 'Product Edited': res })
    } catch (error) {
      console.log({ 'Product Edited': error })
    }
  }

  return (
    <div className="flex flex-col md:px-[10rem] lg:px-[20rem] xl:px-[20rem] gap-4">
      <span className="w-full text-xl sm:text-2xl font-semibold text-center mb-4">
        Edit Product
      </span>
      <Input
        label="Product Name"
        value={productData.name}
        onChange={(e) =>
          setProductData({ ...productData, name: e.target.value })
        }
      />
      <div>
        <span className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold">
          Description
        </span>
        <div>
          <TextEditor
            onChange={handleChange}
            value={productData?.description}
          />
        </div>
      </div>
      <Select
        label="Category"
        options={categories.map((category) => ({
          key: category.name,
          value: category._id,
        }))}
        value={productData.category}
        onChange={(e) =>
          setProductData({ ...productData, category: e.target.value })
        }
      />
      <Select
        value={productData.subCategory}
        label="Sub Category"
        options={subCategoryOptions}
        onChange={(e) =>
          setProductData({ ...productData, subCategory: e.target.value })
        }
      />
      <Input
        label="Weight In Grams"
        value={productData.weight}
        onChange={(e) =>
          setProductData({ ...productData, weight: parseInt(e.target.value) })
        }
      />
      <span className="my-4 text-lg sm:text-xl font-semibold">
        Product Images
      </span>
      {productData.productImages.length === 0 && (
        <span className="text-base sm:text-lg text-gray-500">
          No Images Added
        </span>
      )}
      <div className="w-full flex gap-4 flex-wrap">
        {productData.productImages?.map((image) => (
          <div
            key={image}
            className="w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] relative rounded-lg bg-gray-100"
          >
            <CloseIcon
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                cursor: 'pointer',
                zIndex: 10,
              }}
              onClick={() => onRemoveImage(image)}
            />
            <Image src={image} alt={image} layout="fill" objectFit="contain" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <input type="file" onChange={handleFileUpload} />
        {isUploadImagePending && <Spinner size="lg" />}
      </div>
      <Button
        bg="#001459"
        color="white"
        size="lg"
        mt="2rem"
        onClick={() => onAddProduct()}
        isLoading={isAddProductPending}
      >
        Edit Product
      </Button>
    </div>
  )
}

export default EditProduct