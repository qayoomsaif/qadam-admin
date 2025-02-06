import Image from 'next/image'
import { useRouter } from 'next/router'
import { FaMinus, FaPlus, FaRegTrashCan } from 'react-icons/fa6'
import { useDispatch } from 'react-redux'
import {
  removeFromCart,
  updateQuantity,
  calculateTotalPrice,
} from '../../../slices/cartSlice'

export const ProductListItem = ({ offer, vendorId }: ProductListItemProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const removeItemFromCart = (
    vendorId: string,
    productId: string,
    productVariantId: string
  ) => {
    dispatch(removeFromCart({ vendorId, productId, productVariantId }))
  }
  const handleUpdateQuantity = (
    vendorId: string,
    productId: string,
    productVariantId: string,
    quantity: number
  ) => {
    dispatch(
      updateQuantity({ vendorId, productId, productVariantId, quantity })
    )
  }

  return (
    <div key={offer.productId} className="p-2">
      <div
        className="flex cursor-pointer"
        onClick={() => router.push(`/product/${offer.productId}`)}
      >
        <div className="w-[3rem] min-w-[3rem] h-[3rem] relative overflow-hidden">
          <Image
            // boxSize="2rem"
            // borderRadius="full"
            layout="fill"
            objectFit="contain"
            alt="Product image"
            src={offer.productDetail.Image}
            // mr="12px"
          />
        </div>

        <span className="text-lg font-semibold">
          {offer.productDetail.name}
        </span>
      </div>
      <div>
        <span className="text-accent-orange-500">
          Rs. {offer.productDetail.price}
        </span>
        <div className="ml-4 pt-2 inline-flex justify-center items-center">
          <span className="inline-flex justify-center items-center">
            <FaMinus
              className="mx-2"
              cursor="pointer"
              onClick={() => {
                if (offer.quantity > 1) {
                  handleUpdateQuantity(
                    vendorId,
                    offer.productId,
                    offer.productVariantId,
                    offer.quantity - 1
                  )
                }
              }}
            />
            {offer.quantity}
            <FaPlus
              className="mx-2"
              cursor="pointer"
              onClick={() => {
                handleUpdateQuantity(
                  vendorId,
                  offer.productId,
                  offer.productVariantId,
                  offer.quantity + 1
                )
              }}
            />
          </span>
          <span className="ml-4">
            <FaRegTrashCan
              cursor="pointer"
              onClick={() =>
                removeItemFromCart(
                  vendorId,
                  offer.productId,
                  offer.productVariantId
                )
              }
            />
          </span>
        </div>
      </div>
    </div>
  )
}
