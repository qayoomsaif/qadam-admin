import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../store'
import { getProductsApi } from '../../utils/services'
import Loader from '../loader/Loader'
import Pagination from '../Pagination/Paginations'
import Modal from '../Modal'
// import Pagination from '' // Import the Pagination component

type PaginationData = {
  hasNext: boolean
  hasPrevious: boolean
  perPage: number
  page: number
  count: number
  totalPages: number
}

export const AllProducts = () => {
  const { isQadamUser } = useAppSelector((state) => state.session)
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [paginationData, setPaginationData] = useState<PaginationData | null>(
    null
  ) // Default to null
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setSelectedProduct('')
  }

  useEffect(() => {
    fetchProducts(1) // Load the first page by default
  }, [])

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true)
      const response = await getProductsApi(page)
      const data = response.data.data.data
      const pagination = response.data.data.pagination

      setProducts(data)
      setPaginationData({
        hasNext: pagination.hasNext,
        hasPrevious: pagination.hasPrevious,
        perPage: pagination.perPage,
        page: pagination.page,
        count: pagination.count,
        totalPages: pagination.totalPages,
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage)
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
            <div
              onClick={() => {
                if (product?.vendorAuthorized) {
                  router.push(`/product/${product._id}`)
                  return
                }
                setSelectedProduct(product._id)
                openModal()
              }}
            >
              <img
                src={product.image_url[0]}
                alt={product.image_url[0]}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-2 sm:text-sm md:text-base lg:text-lg md:font-medium lg:font-semibold line-clamp-2">
                {product.name}
              </h3>
              <p
                onClick={() => {
                  if (product?.vendorAuthorized) {
                    router.push(`/product/${product._id}`)
                    return
                  }
                  setSelectedProduct(product._id)
                  openModal()
                }}
              >
                <strong className="sm:text-sm md:text-base lg:text-lg md:font-medium lg:font-semibold">
                  Category:{' '}
                </strong>
                {product?.category?.name}
              </p>
              <p>
                <strong className="sm:text-sm md:text-base lg:text-lg md:font-medium lg:font-semibold">
                  Weight:{' '}
                </strong>
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
        {loading && <Loader />}
      </div>

      {/* Show Pagination only after the first page has loaded */}
      {!loading && paginationData && (
        <Pagination
          paginationData={paginationData}
          onPageChange={handlePageChange}
        />
      )}
      {isOpen && <Modal id={selectedProduct} onClose={closeModal} />}
    </div>
  )
}
