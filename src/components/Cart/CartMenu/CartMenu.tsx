import React, { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '../../../store'
import { useRouter } from 'next/router'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'
import { IoBagCheckOutline } from 'react-icons/io5'
import { IoCartOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { calculateTotalPrice } from '../../../slices/cartSlice'

import { ProductListItem } from './ProductListItem'

export function CartMenu() {
  const dispatch = useDispatch()
  const router = useRouter()

  const cartItems = useAppSelector((state) => state.cart)
  const totalCartPrice = useAppSelector((state) => state.cart.totalPrice)

  const cartItemsCount = useMemo(() => {
    const totalQuantity = cartItems?.orders.reduce((total, item) => {
      return (
        total +
        item.orderDetails.reduce(
          (subTotal, offer) => subTotal + offer.quantity,
          0
        )
      )
    }, 0)
    dispatch(calculateTotalPrice())
    return totalQuantity
  }, [cartItems])

  return (
    <>
      <Menu closeOnSelect={true} placement="bottom">
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
          <MenuList width="30rem" padding={0}>
            <div className="w-full overflow-auto h-full max-h-[20rem]">
              {cartItems?.orders.map((item, index) => (
                <div className=" border-b py-2">
                  <div className="flex gap-2 text-sm font-semibold px-2">
                    <span>From {item.vendorName}</span>
                  </div>

                  {item.orderDetails.map((offer) => (
                    <ProductListItem offer={offer} vendorId={item.vendorId} />
                  ))}
                </div>
              ))}
            </div>
            <MenuItem p="0" autoFocus={false} _focus={{ bg: '#00000000' }}>
              <div className="w-full flex justify-between items-center px-2 py-2 border-t">
                <span className="text-lg">
                  Total:{' '}
                  <span className=" text-accent-orange-500">
                    Rs. {totalCartPrice}
                  </span>
                </span>
                <button
                  onClick={() => router.push('/checkout')}
                  className="text-white  bg-primary-blue-600 rounded-lg text-lg py-2 px-4 flex items-center justify-center gap-2"
                >
                  <IoBagCheckOutline /> Checkout
                </button>
              </div>
            </MenuItem>
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
