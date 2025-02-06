import { useParams } from 'react-router-dom'
import styles from './Product.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from './../../utils/axios'
import ProductDetails from './../../components/ProductDetail'
import Review from './../../components/Review'
import { getSingleProductApi } from '../../utils/services'
import { AppPage } from '../../components/layout/AppPage'
import { ProductPage } from '../../components/ProductPage'
import dynamic from 'next/dynamic'
import { IProduct } from '../../lib/schema/products'
import { useGetSingleProductData } from '../../lib/hooks/products/useGetSingleProductData'
import { AllProducts } from '../../components/AllProducts'
const EditProduct = dynamic(
  () => import('../../components/EditProduct/EditProduct'),
  {
    ssr: false,
  }
)

interface Props {
  productData: IProduct
}

const Product = () => {
  const router = useRouter()
  const { data, isLoading, error } = useGetSingleProductData(
    router.query.productId as string
  )
  console.log({ datadatadata: data })

  return (
    <AppPage
    // crumbs={[
    //   {
    //     label: 'Category',
    //     path: 'Some path',
    //     isLastChild: false,
    //   },
    //   {
    //     label: 'Womens Footwear',
    //     path: 'Some path',
    //     isLastChild: false,
    //   },
    //   {
    //     label: 'Product',
    //     path: 'Some path',
    //     isLastChild: false,
    //   },
    // ]}
    >
      {isLoading || !data ? (
        <div>Loading.....</div>
      ) : (
        <EditProduct
          productId={data?.data?.data?._id}
          data={{
            name: data?.data?.data?.name,
            description: data?.data?.data?.description,
            weight: data?.data?.data?.weight,
            category: data?.data?.data?.category,
            subCategory: data?.data?.data?.subCategory,
            variants: data?.data?.data?.variants,
            productImages: data?.data?.data?.image_url,
          }}
        />
      )}
    </AppPage>
  )
}

export default Product
