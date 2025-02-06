import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../slices/cartSlice'
import Toaster from '../Toaster/Toaster'
import { OrderModalProps } from './interface'
import { useEffect, useState } from 'react'

export const OrderModal = ({
  isOpen,
  onClose,
  orderData,
  productData,
}: OrderModalProps) => {
  const dispatch = useDispatch()
  const [profit, setProfit] = useState<number | undefined>(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    setProfit(undefined)
  }, [isOpen])

  console.log('Profit', typeof profit)

  useEffect(() => {
    setError('')
  }, [profit])

  const onPlaceOrder = () => {
    if (!profit) {
      setError('Profit must be greater than 0')
      return
    }
    const payload = {
      vendorId: orderData.vendorId,
      vendorName: orderData.vendorName,
      orderDetails: [
        {
          productId: orderData.productId,
          productVariantId: orderData.productVariantId,
          productOfferId: orderData.productOfferId,
          quantity: orderData.quantity,
          perUnitProfit: profit,
          productDetail: {
            name: productData.name,
            Image: productData.image_url[0],
            price: orderData.price,
          },
        },
      ],
      deliveryPrice: 200,
    }
    dispatch(addToCart(payload))
    Toaster.success(`${productData.name} added to cart successfully`)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Place Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column">
          <span className="mb-2">Add your profit per unit of product</span>
          <div className="relative mt-4 w-full">
            <label className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]">
              Profit
            </label>
            <span className="absolute bottom-[0.4rem] left-2">Rs.</span>
            <input
              className="border-2 rounded-lg border-primary-blue-600 pl-8 py-1 text-lg w-full"
              type="number"
              value={profit}
              onChange={(e) => {
                if (e.target.value) {
                  setProfit(Number(e.target.value))
                } else {
                  setProfit(undefined)
                }
              }}
            />
          </div>
          <span className="text-red-500 text-sm mt-1">{error}</span>

          {/* <Lorem count={2} /> */}
        </ModalBody>

        <ModalFooter>
          <button
            className="text-white border-2 border-primary-blue-600  bg-primary-blue-600 rounded-lg py-2 px-4 mr-2"
            onClick={onPlaceOrder}
            // onClick={() => setIsOrderModalOpen(true)}
          >
            Add To Cart
          </button>
          <button
            className="border-2 border-primary-blue-600 rounded-lg py-2 px-4 gap-2"
            onClick={onClose}
          >
            Close
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
