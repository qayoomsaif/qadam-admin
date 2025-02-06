import { useMemo, useState } from 'react'
import { ProductPageProps } from './interface'
import VariantTable from './VariantTable'
export const ProductPage = ({ productData }: ProductPageProps) => {
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string
  }>({})
  const variantOptions = useMemo(() => {
    const variants = productData.productVariants.uniqueVariants
    const variantOptionTypes = Object.keys(variants)
    const options = []
    variantOptionTypes.forEach((option) => {
      if (variants[option].length > 0) {
        options.push(option)
      }
    })
    return options
  }, [])
  return (
    <>
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          {productData?.name}
        </h1>
        <h2 className="mt-6 md:mt-8 lg:mt-10 text-base md:text-lg lg:text-xl font-semibold">
          Variant Details:
        </h2>
        <div className="mt-4">
          <VariantTable
            headingTable={[
              ...variantOptions,
              'Vendor Price',
              'Quantity',
              'Status',
              'Action',
            ]}
            variantOptions={variantOptions}
            variants={productData?.productVariants.variants}
            variantOffers={productData.productOffers}
            productId={productData._id}
          />
        </div>
      </div>
    </>
  )
}