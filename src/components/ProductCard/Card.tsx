import Image from 'next/image'
import { useGetAllProducts } from '../../lib/hooks/products/useGetAllProducts'
import { useRouter } from 'next/router'
import { Interface } from 'readline'
import { IProduct } from '../../lib/schema/products'
import { useAppSelector } from '../../store'
import { truncateText } from '../../utils/HelperService'
interface Props {
  allProducts: IProduct[]
}
export const Card = ({ allProducts }: Props) => {
  const session = useAppSelector((state) => state.session)
  const { isQadamUser } = session
  const router = useRouter()
  const products = allProducts
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
            <div
              onClick={() => {
                router.push(`/product/${product._id}`)
              }}
            >
              {/* <div className=" w-full h-48 rounded-md">
                <Slider {...settings}>
                  {product.image_url.map((url, index) => (
                    <div key={index} className="flex justify-center">
                      <img
                        src={url}
                        alt={`Product image ${index}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </Slider>
              </div> */}
              <img
                src={product.image_url[0]}
                alt={product.image_url[0]}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-2 text-lg font-semibold line-clamp-2">
                {product.name}
              </h3>
              <p>
                {' '}
                <strong>Category: </strong>
                {product?.category?.name}
              </p>
              <p>
                <strong>Weight: </strong>
                {product.weight} GM
              </p>
            </div>
            {isQadamUser && (
              <button
                onClick={() => {
                  router.push(`/edit-product/${product._id}`)
                }}
                className="text-blue-500 mt-2 inline-block"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
