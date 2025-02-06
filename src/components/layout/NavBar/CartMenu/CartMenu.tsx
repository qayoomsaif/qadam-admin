import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../../store'
import Router, { useRouter } from 'next/router'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Image,
} from '@chakra-ui/react'
import { PiShoppingCartLight } from 'react-icons/pi'
import { IoBagCheckOutline } from 'react-icons/io5'
import { IoCartOutline } from 'react-icons/io5'
import { FaMinus, FaPlus, FaRegTrashCan } from 'react-icons/fa6'
import { useDispatch } from 'react-redux'
import {
  removeFromCart,
  updateQuantity,
  calculateTotalPrice,
} from '../../../../slices/cartSlice'

function CartDropdown() {
  const dispatch = useDispatch()
  const router = useRouter()

  const cartItems = useAppSelector((state) => state.cart)
  const totalCartPrice = useAppSelector((state) => state.cart.totalPrice)
  const [cartItemsCount, setCartItemsCount] = useState(0)

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
  useEffect(() => {
    const totalQuantity = cartItems?.orders.reduce((total, item) => {
      return (
        total +
        item.orderDetails.reduce(
          (subTotal, offer) => subTotal + offer.quantity,
          0
        )
      )
    }, 0)
    setCartItemsCount(totalQuantity)
    dispatch(calculateTotalPrice())
  }, [cartItems])

  console.log('Cart items', cartItems)

  return (
    <>
      <Menu closeOnSelect={false} placement="bottom">
        <MenuButton
          variant="ghost"
          aria-label="Cart"
          _focus={{ bg: '#00000000' }}
          _hover={{ bg: '#00000000' }}
          as={IconButton}
        >
          <span className="flex justify-center relative">
            <IoCartOutline fontSize="2rem" />
            {cartItemsCount > 0 && (
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center top-[-0.2rem] right-[-0rem] absolute text-white text-sm">
                {cartItemsCount}
              </div>
            )}
          </span>
        </MenuButton>
        {cartItemsCount > 0 ? (
          <MenuList width="30rem" minHeight="30rem">
            <div className="w-full h-full">
              {cartItems?.orders.map((item, index) => (
                <div className="overflow-auto">
                  {item.orderDetails.map((offer) => (
                    <div
                      key={offer.productId}
                      onClick={() => router.push(`/product/${offer.productId}`)}
                    >
                      <div className="flex">
                        <Image
                          boxSize="2rem"
                          borderRadius="full"
                          src={offer.productDetail.Image}
                          alt="Product Image"
                          mr="12px"
                        />
                        <span className=" text-xl font-semibold">
                          {offer.productDetail.name}
                        </span>
                      </div>
                      <div>
                        <span>Rs. {offer.productDetail.price}</span>
                        <div className="ml-4 pt-2 inline-flex justify-center items-center">
                          <span className="inline-flex justify-center items-center">
                            <FaMinus
                              className="mx-2"
                              onClick={() => {
                                if (offer.quantity > 1) {
                                  handleUpdateQuantity(
                                    item.vendorId,
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
                              onClick={() => {
                                handleUpdateQuantity(
                                  item.vendorId,
                                  offer.productId,
                                  offer.productVariantId,
                                  offer.quantity + 1
                                )
                              }}
                            />
                          </span>
                          <span className="ml-4">
                            <FaRegTrashCan
                              onClick={() =>
                                removeItemFromCart(
                                  item.vendorId,
                                  offer.productId,
                                  offer.productVariantId
                                )
                              }
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <MenuDivider />
            <div className="flex justify-between items-center">
              <span className="ml-3">Total Price: {totalCartPrice}</span>
            </div>
            <MenuDivider />
            <div className="grid grid-cols-2 gap-4 mx-4">
              <button className="border-2 border-primary-blue-600 rounded-lg text-lg py-2 flex items-center justify-center gap-2">
                <PiShoppingCartLight /> View Cart
              </button>
              {/* onClick={handleAddToCart} */}
              <button className="text-white bg-primary-blue-600 rounded-lg text-lg py-2 flex items-center justify-center gap-2">
                <IoBagCheckOutline /> Checkout
              </button>
            </div>
          </MenuList>
        ) : (
          <MenuList _hover={{ bg: 'bg-transparent' }}>
            <MenuItem
              _focus={{ bg: '#00000000' }}
              minH="48px"
              autoFocus={false}
            >
              <span>Cart is Empty</span>
            </MenuItem>
          </MenuList>
        )}
      </Menu>
    </>
  )
}

export default CartDropdown
