import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from '../loader/Loader'
import { ProductPageProps } from './interface'

const ProductCard = ({ productData }) => {
  // console.log("🚀 ~ ProductCard ~ productData:", productData)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Update loading state when productData changes
  useEffect(() => {
    if (productData) {
      setIsLoading(false)
    }
  }, [productData])

  // If productData is not defined or loading, return null or a loading indicator
  if (!productData || isLoading) {
    return <Loader /> // or return a loading indicator
  }

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {productData.map((product) => (
            <div
              key={product._id}
              className="group my-4 mx-2 flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
            >
              {/* {product.image_url && product.image_url.length > 0 && (
                <div className="cursor-pointer relative flex h-60 overflow-hidden rounded-xl" onClick={() => router.push(`/product/${product._id}`)}>
                  <img
                    className="absolute top-0 right-0 h-full w-full object-cover"
                    src={product.image_url[0]}
                    alt="product image"
                  />
                </div>
              )} */}
              {product.image_url && product.image_url.length > 0 && (
                <div
                  className="cursor-pointer relative flex h-60 overflow-hidden rounded-xl"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  {product.image_url.length === 1 ? (
                    <img
                      className="absolute top-0 right-0 h-full w-full object-cover"
                      src={product.image_url[0]}
                      alt="product image"
                    />
                  ) : (
                    <>
                      <img
                        className="peer absolute top-0 right-0 h-full w-full object-cover"
                        src={product.image_url[0]}
                        alt="product image"
                      />
                      <img
                        className="peer absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 hover:right-0 peer-hover:right-0"
                        src={product.image_url[1]}
                        alt="product image"
                      />
                    </>
                  )}
                </div>
              )}
              <div className="mt-4 px-5 pb-5">
                <h5
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="cursor-pointer text-xl tracking-tight text-slate-900"
                >
                  {product.name}
                </h5>
                <div className="mt-2 mb-5 flex items-center justify-between">
                  <p>
                    <span className="text-3xl font-bold text-slate-900">
                      PKR{' '}
                      {
                        product.productOffers[
                          Object.keys(product.productOffers)[0]
                        ][0].price
                      }
                    </span>
                  </p>
                </div>
                <p
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="cursor-pointer flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  View Product
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default ProductCard
