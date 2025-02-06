// CartPage.tsx

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CartItemCard from '../../components/CartCard'
import styles from './Cart.module.scss'
import { useRouter } from 'next/router'
import { FaArrowRight } from 'react-icons/fa'
import { RootState } from '../../store'
import { calculateTotalPrice } from '../../slices/cartSlice'
import { AppPage } from '../../components/layout/AppPage'
import { Checkout } from '../../components/Checkout'

const CartPage: React.FC = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart)
  const [total, setTotal] = useState(0)

  const router = useRouter()
  const totalAmount = useSelector((state: RootState) => state.cart.totalPrice)

  useEffect(() => {
    // dispatch(calculateTotalPrice())
  }, [cartItems])

  return (
    <div className={styles.CartPage}>
      <div className={styles['breadcrumbs']}>
        <a
          onClick={() => {
            router.push('./home')
          }}
        >
          Home
        </a>
        <span> / </span>
        <a
          onClick={() => {
            router.push('./Cart')
          }}
          className={styles['current-page']}
        >
          Cart
        </a>
      </div>

      {/* {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className={styles.container}>
          {cartItems.map((item) => (
            <div key={item.vendorId}>
              <p className={styles.vendorName}>Vendor: {item.vendorName}</p>
              <table className={styles.cartTable}>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Size</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {item.orderDetails.map((orderDetail, index) => (
                    <CartItemCard
                      productDetail={orderDetail}
                      vendorId={item.vendorId}
                      key={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div className={styles.constainer2}>
            <p>Total Amount: {totalAmount}</p>
            <div className={styles['button-container']}>
              <button
                className={styles['arrow-button']}
                onClick={() => {
                  router.push('./checkout')
                }}
              >
                Proceed to Checkout
                <FaArrowRight className="arrow" />
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default CartPage
