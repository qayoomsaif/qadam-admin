import React, { useEffect, useState } from 'react'
import { getProducts } from '../../utils/services'
import { AppPage } from '../../components/layout/AppPage'
import ViewportBlock from '../../components/ViewportBlock/ViewportBlock'
import { Card } from '../../components/ProductCard/Card'
import { Box, Text } from '@chakra-ui/react'
import { IProduct } from '../../lib/schema/products'

interface Props {
  textSearch: string
}

const Search = ({ textSearch }: Props) => {
  const [products, setProducts] = useState<Array<IProduct>>(null)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    getProductsData()
  }, [textSearch])
  const getProductsData = async () => {
    try {
      setIsLoading(true)
      const productData = await getProducts({
        search: textSearch,
        page: 1,
        perPage: 30,
      })
      setIsLoading(false)
      console.log({
        'productData?.data?.data': productData?.data?.data,
      })
      if (productData?.data?.data?.data) {
        setProducts(productData?.data?.data?.data)
      }
    } catch (err) {
      setIsLoading(false)
      console.log({ err })
    }
  }
  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <AppPage
      crumbs={[
        {
          label: 'Home',
          path: '/home',
          isLastChild: false,
        },
        {
          label: textSearch,
          path: '',
          isLastChild: true,
        },
      ]}
    >
      {products?.length > 0 ? (
        <div>{products && <Card allProducts={products} />}</div>
      ) : (
        !isLoading && (
          <Box
            className="flex flex-col items-center justify-center h-full p-4"
            bg="gray.100"
            borderRadius="md"
            boxShadow="md"
            textAlign="center"
          >
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              No results found
            </Text>
            <Text fontSize="md">
              We couldn't find any results for <b>{textSearch}</b>. Please try a
              different search term.
            </Text>
          </Box>
        )
      )}

      <ViewportBlock onEnterViewport={() => handleLoadMore()} />
    </AppPage>
  )
}

export default Search

export function getServerSideProps(context) {
  const textSearch = context?.params?.textSearch || ''
  try {
    return {
      props: {
        textSearch,
      },
    }
  } catch (e) {
    return {
      props: {
        textSearch,
      },
    }
  }
}
