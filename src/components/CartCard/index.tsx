// CartItemCard.tsx

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from '../../slices/cartSlice'
import styles from './CartCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

interface ProductDetails {
  name: string
  image: string
  variant: {
    size: string
    color: string
    material: string | null
  }
  productId: string
  productVariantId: string
  productOfferId: string
  quantity: number
  price: number
}

export interface CartItemCardProps {
  productDetail: ProductDetails
  vendorId: string
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  productDetail,
  vendorId,
}) => {
  const dispatch = useDispatch()
  const { name, image, variant, productVariantId, productId, quantity, price } =
    productDetail

  const [newQuantity, setNewQuantity] = useState(quantity)

  const handleRemoveFromCart = (
    vendorId: string,
    Productid: string,
    variantId: string
  ) => {
    const removeData = {
      vendorId: vendorId,
      productId: productId,
      variantId: variantId,
    }

    // dispatch(removeFromCart(removeData))
  }

  const increaseQuantity = (
    vendorId: string,
    Productid: string,
    variantId: string
  ) => {
    const qty = newQuantity + 1
    const Data = {
      vendorId: vendorId,
      productId: productId,
      variantId: variantId,
      quantity: qty,
    }
    setNewQuantity(qty)
    // dispatch(updateQuantity(Data))
  }

  const decreaseQuantity = (
    vendorId: string,
    Productid: string,
    variantId: string
  ) => {
    const qty = newQuantity - 1
    const Data = {
      vendorId: vendorId,
      productId: productId,
      variantId: variantId,
      quantity: qty,
    }
    setNewQuantity(qty)
    // dispatch(updateQuantity(Data))
  }

  return (
    <tr key={productId} className={styles.container}>
      <td>
        <img
          src={image}
          alt={'product-image'}
          className={styles.productImage}
        />
      </td>
      <td>{name}</td>
      <td>{price}</td>
      <td className={styles.size}>
        {Object.keys(variant).map((key) =>
          variant[key] ? <p key={key}>{variant[key]}</p> : ''
        )}
      </td>
      <td className={styles.quantity}>
        <button
          onClick={() => {
            decreaseQuantity(vendorId, productId, productVariantId)
          }}
        >
          -
        </button>
        <input readOnly type="number" value={Math.max(newQuantity, 1)} />
        <button
          onClick={() => {
            increaseQuantity(vendorId, productId, productVariantId)
          }}
        >
          +
        </button>
      </td>
      <td>
        <FontAwesomeIcon
          icon={faTrashCan}
          onClick={() => {
            handleRemoveFromCart(vendorId, productId, productVariantId)
          }}
          className={styles.icon}
        />
      </td>
    </tr>
  )
}

export default CartItemCard
