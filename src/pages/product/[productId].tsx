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
import { IProduct } from '../../lib/schema/products'
import { useGetSingleProductData } from '../../lib/hooks/products/useGetSingleProductData'
import Loader from '../../components/loader/Loader'

interface Props {
  productData: IProduct
}

const Product = () => {
  const router = useRouter()
  const { data, isLoading, error } = useGetSingleProductData(
    router.query.productId as string
  )

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
        <Loader />
      ) : (
        <ProductPage productData={data.data.data} />
      )}
    </AppPage>
  )
}

export default Product