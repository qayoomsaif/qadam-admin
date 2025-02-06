import { useSelector } from 'react-redux'
import { Input } from '../inputs/Input'
import { Select } from '../inputs/Select'
import { TextArea } from '../inputs/TextArea'
import { RootState } from '../../store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Spinner, useToast } from '@chakra-ui/react'
import { AddVariant } from './AddVariant'
import { useUploadImage } from '../../lib/hooks/common/useUploadImage'
import Image from 'next/image'
import { CloseIcon } from '@chakra-ui/icons'
import { useAddProduct } from '../../lib/hooks/products/useAddProduct'
import { useRouter } from 'next/router'
import { ProductVariantsSection } from './ProductVariantsSection'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { uploadImageApi } from '../../utils/services'
import TextEditor from './TextEditor'
import { Constants } from '../../utils/Constants'
import { fileUploads } from '../../utils/HelperService'

const AddProduct = () => {
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

  const [productId, setProductId] = useState<string | undefined>(undefined)

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    weight: 0,
    category: undefined,
    subCategory: undefined,
    variants: {},
    productImages: [],
  })
  const [value, setValue] = useState('')
  const reactQuillRef = useRef(null)

  const handleChange = (content: string) => {
    setProductData({ ...productData, description: content })
  }
  const modules = {
    toolbar: [
      [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image'],
        ['clean'],
      ],
    ],
    // handlers: {
    //   video: handleVideo,
    // },
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

  const onAddVariant = () => {
    const id = (Math.random() + 1).toString(36).substring(7)
    setProductData({
      ...productData,
      variants: {
        ...productData.variants,
        [id]: {
          type: '',
          options: [],
        },
      },
    })
  }

  const onRemoveVariant = (id: string) => {
    const optionOmitted = Object.keys(productData.variants)
      .filter((objKey) => objKey !== id)
      .reduce((newObj, key) => {
        newObj[key] = productData.variants[key]
        return newObj
      }, {})
    setProductData({
      ...productData,
      variants: optionOmitted,
    })
  }

  const onUpdateVariantType = (variantId: string) => {
    return (updatedtype: string) => {
      setProductData((prevState) => ({
        ...prevState,
        variants: {
          ...prevState.variants,
          [variantId]: {
            type: updatedtype,
            options: prevState.variants[variantId].options,
          },
        },
      }))
    }
  }

  const onUpdateOption = (variantId: string) => {
    return (optionId: string, updatedOption: string) => {
      setProductData((prevState) => ({
        ...prevState,
        variants: {
          ...prevState.variants,
          [variantId]: {
            type: prevState.variants[variantId].type,
            options: {
              ...prevState.variants[variantId].options,
              [optionId]: updatedOption,
            },
          },
        },
      }))
    }
  }

  const onAddOption = (variantId) => {
    const id = (Math.random() + 1).toString(36).substring(7)
    setProductData((prevState) => ({
      ...prevState,
      variants: {
        ...prevState.variants,
        [variantId]: {
          type: prevState.variants[variantId].type,
          options: {
            ...prevState.variants[variantId].options,
            [id]: '',
          },
        },
      },
    }))
  }

  const onRemoveOption = (variantId) => {
    return (optionId) => {
      const optionOmitted = Object.keys(productData.variants[variantId].options)
        .filter((objKey) => objKey !== optionId)
        .reduce((newObj, key) => {
          newObj[key] = productData.variants[variantId].options[key]
          return newObj
        }, {})
      setProductData((prevState) => ({
        ...prevState,
        variants: {
          ...prevState.variants,
          [variantId]: {
            type: prevState.variants[variantId].type,
            options: optionOmitted,
          },
        },
      }))
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files ? event.target.files[0] : null
      const response = await fileUploads(file)
      if (response.status === Constants.statuses.success) {
        setProductData({
          ...productData,
          productImages: [...productData.productImages, response.data],
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const onRemoveImage = (image: string) => {
    setProductData({
      ...productData,
      productImages: productData.productImages.filter((img) => img !== image),
    })
  }

  const onAddProduct = () => {
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

    const allVariants = Object.keys(productData.variants)

    const variantData = {}

    allVariants.forEach((variant) => {
      const varaintOptions = Object.keys(
        productData.variants[variant].options
      ).map((optionId) => productData.variants[variant].options[optionId])
      variantData[productData.variants[variant].type] = varaintOptions
    })

    const { name, description, category, subCategory, productImages, weight } =
      productData

    const apiPayload = {
      name,
      description,
      category,
      subCategory,
      image_url: productImages,
      weight: weight,
      variants: allVariants.length > 0 ? variantData : null,
    }
    mutateAddProduct(apiPayload, {
      onSuccess: (res) => {
        toast({
          title: 'Success',
          description: 'Product Added',
          status: 'success',
          variant: 'subtle',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        })

        // router.push(/product/${res.data.data._id})
        setProductId(res.data.data._id)
        setAllVariants(res.data.data.productVariants.variants)
      },
      onError: (e) => {
        console.log(e)
      },
    })
  }
  console.log({ valuevaluevaluevalue: productData?.description })

  return (
    // <div className="flex flex-col lg:px-4 sm:px-15 lg:px-20 xl:px-[10rem] 2xl:px-[20rem] gap-4">
    <div className="flex flex-col sm:px-[5rem] md:px-[5rem] lg:px-[18rem] xl:px-[18rem] 2xl:px-[25rem] gap-4">
      <span className="w-full text-xl sm:text-2xl font-semibold text-center mb-4">
        {/* // <div className="flex flex-col lg:px-[20rem] gap-2"> */}
        {/* <span className="w-full text-2xl font-semibold text-center mb-4"> */}
        Add Product
      </span>
      <Input
        label="Product Name"
        value={productData.name}
        onChange={(e) =>
          setProductData({ ...productData, name: e.target.value })
        }
      />
      <div className="w-full">
        <span className="mt-6 text-lg font-semibold">Description</span>
        <TextEditor onChange={handleChange} value={productData?.description} />
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
        label="Sub Category"
        options={subCategoryOptions}
        value={productData.subCategory}
        onChange={(e) =>
          setProductData({ ...productData, subCategory: e.target.value })
        }
      />
      <Input
        label="Weight In Grams"
        value={productData.weight}
        onChange={(e) =>
          setProductData({
            ...productData,
            weight: parseInt(e.target.value) ? parseInt(e.target.value) : 0,
          })
        }
      />
      <span className="my-4 text-lg font-semibold">Product Images</span>
      {productData.productImages.length === 0 && (
        <span className="text-lg text-gray-500">No Images Added</span>
      )}

      <div className="w-full flex flex-wrap gap-4">
        {productData.productImages?.map((image) => (
          <div className="w-[8rem] h-[8rem] md:w-[10rem] md:h-[10rem] relative rounded-lg bg-gray-100 shadow-md">
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
            <Image
              src={image}
              alt={image}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/webp"
          onChange={handleFileUpload}
          className="file:mr-4 file:border-0 file:bg-primary-blue-600 file:text-white file:cursor-pointer file:rounded-md file:px-4 file:py-1 file:text-lg file:h-10"
        />
        {isUploadImagePending && <Spinner size="lg" />}
      </div>

      <span className="mb-2 mt-8 text-lg font-semibold">Variants</span>
      {Object.keys(productData.variants).length === 0 && (
        <span className="text-lg text-gray-500">No Variants Added</span>
      )}

      <div className="w-full flex flex-col gap-4">
        {Object.keys(productData.variants)?.map((variant) => (
          <div className="w-full flex flex-col md:flex-row items-end gap-2">
            <AddVariant
              variantData={productData.variants[variant]}
              onUpdateVariantType={onUpdateVariantType(variant)}
              onAddOption={() => onAddOption(variant)}
              onRemoveOption={onRemoveOption(variant)}
              onUpdateOption={onUpdateOption(variant)}
              onRemoveVariant={() => onRemoveVariant(variant)}
            />
          </div>
        ))}
      </div>

      <Button
        mt="4"
        bg="bg-primary-blue-600"
        onClick={() => onAddVariant()}
        className="w-full sm:w-auto"
      >
        Add Variant Type
      </Button>

      <Button
        bg="#001459"
        color="white"
        size="lg"
        mt="8"
        onClick={() => onAddProduct()}
        isLoading={isAddProductPending}
        className="w-full sm:w-auto"
      >
        Add Product
      </Button>

      {allVariants && productId && (
        <ProductVariantsSection
          allVariants={allVariants}
          productId={productId}
        />
      )}
    </div>
  )
}

export default AddProduct
