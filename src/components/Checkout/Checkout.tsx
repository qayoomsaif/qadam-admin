import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store'
import { ProductListItem } from '../Cart/CartMenu/ProductListItem'
import { FaUserCircle } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { Input } from '../inputs/Input'
import { useState } from 'react'
import { useSession } from '../../lib/hooks/auth'
import Link from 'next/link'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useCreateOrder } from '../../lib/hooks/orders'
import { emptyCart } from '../../slices/cartSlice'
import error from 'next/error'
import { useRouter } from 'next/router'

const checkoutFields = [
  {
    name: 'name',
    label: 'Full Name',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'phone',
    label: 'Phone Number',
  },
  {
    name: 'addressLine1',
    label: 'Address Line 1',
  },
  {
    name: 'addressLine2',
    label: 'Address Line 2',
  },
  {
    name: 'city',
    label: 'City',
  },
  {
    name: 'state',
    label: 'State',
  },
  {
    name: 'postalCode',
    label: 'Postal Code',
  },
]

export const Checkout = () => {
  const dispatch = useDispatch()
  const [successModalOpen, setSuccessModalOpen] = useState<string | null>(null)
  const router = useRouter()

  const { session } = useSession()

  const cartItems = useAppSelector((state) => state.cart.orders)
  const total = useAppSelector((state) => state.cart.totalPrice)
  const [checkoutState, setCheckoutState] = useState(
    Object.fromEntries(checkoutFields.map((field) => [field.name, '']))
  )

  const { mutate, isPending } = useCreateOrder()

  const handleChange = (name: string, value: string) => {
    setCheckoutState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handlePlaceOrder = () => {
    mutate(
      {
        orders: cartItems,
        customerDetails: {
          name: checkoutState.name,
          email: checkoutState.email,
          phone: '+92' + checkoutState.phone.slice(1),
          addressLine1: checkoutState.addressLine1,
          addressLine2: checkoutState.addressLine2,
          city: checkoutState.city,
          state: checkoutState.state,
          postalCode: Number(checkoutState.postalCode),
        },
      },
      {
        onSuccess: (res) => {
          setSuccessModalOpen(res.data.data[0].orderId)
          dispatch(emptyCart())
        },
        onError: (e) => {
          console.log('ERROR', e)
        },
      }
    )
  }

  return cartItems.length > 0 ? (
    <div className="w-full h-full grid grid-cols-2">
      <div className="flex flex-col items-center px-[1rem]">
        <span className="text-2xl font-medium mb-[2rem] tracking-wide">
          Cart
        </span>
        {cartItems.map((item) => (
          <div className="flex flex-col w-full mb-[1rem]">
            <div className="flex gap-2 text-sm font-semibold px-2">
              <span>From {item.vendorName}</span>
            </div>
            {item.orderDetails.map((order) => (
              <ProductListItem offer={order} vendorId={item.vendorId} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[2rem] border-l">
        <div className="flex flex-col items-center px-[4rem]">
          <span className="text-2xl font-medium tracking-wide">
            Order Details
          </span>
          <div className="flex flex-col w-full mt-[2rem] gap-2">
            <div className="flex justify-between w-full text-lg border-b">
              <span className="font-medium">Total Price</span>
              <span className="font-semibold text-accent-orange-500">
                Rs. {total}
              </span>
            </div>
            <div className="flex justify-between w-full text-lg border-b">
              <span className="font-medium">Weight</span>
              <span className="font-semibold text-accent-orange-500">
                25 Kg
              </span>
            </div>
            <div className="flex justify-between w-full text-lg border-b">
              <span className="font-medium">Delivery Charges</span>
              <span className="font-semibold text-accent-orange-500">
                Rs. 400
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center px-[4rem]">
          <span className="text-2xl font-medium tracking-wide">Checkout</span>
          {session ? (
            <div className="flex flex-col w-full mt-[1rem] gap-2">
              {checkoutFields.map((field) => (
                <Input
                  label={field.label}
                  value={checkoutState[field.name]}
                  onChange={(e) => {
                    handleChange(field.name, e.target.value)
                  }}
                />
              ))}
              <Button
                variant="primary"
                size="lg"
                mt="1rem"
                onClick={handlePlaceOrder}
                isLoading={isPending}
              >
                Place Order
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full mt-[1rem] gap-2 bg-primary rounded-lg p-6">
              <FaUserCircle className="text-neutral-gray-500 text-5xl" />
              <span className=" text-neutral-gray-500 font-medium text-lg text-center">
                Please{' '}
                <Link
                  href="/login?redirect=/checkout"
                  className="text-accent-orange-500"
                >
                  Log in
                </Link>{' '}
                /{' '}
                <Link href="/signup" className="text-accent-orange-500">
                  Sign up
                </Link>{' '}
                to continue with your order
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-[calc(100vh-16rem)] flex items-center justify-center">
      <Modal
        isOpen={successModalOpen ? true : false}
        onClose={() => setSuccessModalOpen(null)}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="1.8rem">Order Placed!</ModalHeader>
          <ModalBody display="flex" flexDirection="column">
            <span className="mb-2 text-sm">Order ID: {successModalOpen}</span>
            <span className="mb-2 text-lg">
              Your order has been placed. To track your order, go to the{' '}
              <Link href="/home" className="text-accent-orange-500">
                Orders
              </Link>{' '}
              page
            </span>

            {/* <Lorem count={2} /> */}
          </ModalBody>

          <ModalFooter>
            <button
              className="text-white border-2 border-primary-blue-600  bg-primary-blue-600 rounded-lg py-2 px-4 mr-2"
              onClick={() => router.push('/home')}
              // onClick={() => setIsOrderModalOpen(true)}
            >
              Continue
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="max-w-[30rem] flex flex-col items-center w-full mt-[1rem] gap-2 bg-primary rounded-lg p-6">
        <IoCartOutline className="text-neutral-gray-500 text-[5rem]" />
        <span className=" text-neutral-gray-500 font-medium text-lg text-center">
          Cart is empty. Please add products to cart to proceed to checkout.{' '}
          <Link href="/signup" className="text-accent-orange-500">
            View Products
          </Link>
        </span>
      </div>
    </div>
  )
}
