import React, { useEffect, useState } from 'react'
import styles from './ProductDetail.module.scss'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../slices/cartSlice'
import ImageCarousel from '../ImageCarousel'
import RightDrawer from '../RightDrawer'
import Toaster from '../Toaster/Toaster'
import Loader from '../loader/Loader'

interface Quantity {
  verified: number
  reserved: number
  sold: number
}

interface ProductVariant {
  _id: string
  size: string
  color: string
  material: string | null
  productId: string
  createdAt: string
  updatedAt: string
}

interface ProductVariants {
  uniqueVariants: {
    size: string[]
    color: string[]
    material: string[]
  }
  variants: ProductVariant[]
}

interface Vendor {
  name: string
  email: string
  vendor_id: string
}

interface ProductOffer {
  productOfferId: string
  productId: string
  productVariantId: string
  price: number
  quantity: Quantity
  status: string
  createdAt: string
  updatedAt: string
}

interface VariantsOffered {
  productOfferId: string
  productId: string
  productVariantId: string
  price: number
  quantity: Quantity
  status: string
  createdAt: string
  updatedAt: string
  variant: {
    _id: string
    size: string
    color: string
    material: string | null
    productId: string
    createdAt: string
    updatedAt: string
  }
}

interface ProductOffers {
  vendor: Vendor
  variantsOffered: VariantsOffered[]
  vendorOrder: number
}

interface ProductDetailsProps {
  product: {}
  productId: string
  name: string
  image: string[]
  description: string
  productVariants: ProductVariants
  productOffers: ProductOffers[]
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  name,
  image,
  description,
  productVariants,
  productOffers,
}) => {
  // console.log("productId: ", productId)
  // console.log("name: ", name)
  // console.log("image: ", image)
  // console.log("description: ", description)
  // console.log("product: ", product)
  // console.log("productVariants: ", productVariants)
  // console.log("productOffers: ", productOffers)
  // console.log("Object.values(productOffers)[0][0]: ", Object.values(productOffers)[0][0])
  const [price, setPrice] = useState(Object.values(productOffers)[0][0].price)
  const [currentVendor, setCurrentVendor] = useState(
    Object.values(productOffers)[0][0]
  )
  const [otherVendors, setotherVendor] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({
    size: null,
    color: null,
    material: null,
  })
  const [quantity, setQuantity] = useState(1)
  const currentVarientOffers = Object.values(productOffers)[0] as any

  const [currentVariants, setCurrentVariants] = useState(productOffers)
  const [enableOptions, setEnableOptions] = useState({})

  useEffect(() => {
    if (Object.keys(currentVendor).length > 0) {
      const productVariantId = currentVendor.productVariantId
      const matchingVariant = productVariants.variants.find(
        (variant) => variant._id === productVariantId
      )
      // if (matchingVariant) {
      //   console.log("Matching variant found:", matchingVariant);
      // }

      Object.entries(productVariants.uniqueVariants).map(
        ([propertyKey, propertyValues]) =>
          setSelectedOptions((prevState) => ({
            ...prevState,
            [propertyKey]: matchingVariant[propertyKey],
          }))
      )
    }
    if (currentVarientOffers.length > 1) {
      const [, ...rest] = currentVarientOffers
      setotherVendor(rest)
    }
  }, [])
  // console.log("otherVendors: ", otherVendors);

  const dispatch = useDispatch()

  const handleAddToCart = () => {
    const OrderData = {
      vendorId: currentVendor.vendor.vendor_id,
      vendorName: currentVendor.vendor.name,
      orderDetails: [
        {
          name: name,
          image: image[0],
          variant: selectedOptions,
          productId: productId,
          // productVariantId: selectedVariantOffer.variant._id,
          productVariantId: '',
          // productOfferId: selectedVariantOffer?.productOfferId,
          productOfferId: '',
          quantity: quantity,
          price: price,
        },
      ],
    }
    // dispatch(addToCart(OrderData))
    alert('added to cart!')
  }

  const increaseQuantity = () => {
    const qty = quantity + 1
    setQuantity(qty)
  }

  const decreaseQuantity = () => {
    if (1 >= quantity) return
    const qty = quantity - 1
    setQuantity(qty)
  }

  const handleSetCurrentOffer = (vendor: any) => {
    // console.log('recieved', vendor)
    const productVariantId = vendor.productVariantId
    setPrice(vendor.price)
    setCurrentVendor(vendor)
    const otherVendors = productOffers[productVariantId]
    // console.log("🚀 ~ handleSetCurrentOffer ~ otherVendors:", otherVendors)
    const updatedOtherVendors = (otherVendors as any).filter(
      (obj) => obj._id !== vendor._id
    )
    // console.log("🚀 ~ updatedOtherVendors:", updatedOtherVendors);
    setotherVendor(updatedOtherVendors)
  }

  const isVariantAvailable = (propertyKey, value) => {
    const extractedVariant = currentVariants.find((variant) => {
      const propertyValues = variant[propertyKey]
      return propertyValues && propertyValues.includes(value)
    })

    // console.log('ext', !!extractedVariant)
    return !!extractedVariant
  }

  const VariantAvailable = (propertyKey: string, value: string) => {
    if (enableOptions[propertyKey]) {
      if (enableOptions[propertyKey]?.includes(value)) return true
      else return false
    } else {
      return true
    }
  }

  const findMatchingVariantId = (variants, options) => {
    for (const variant of variants) {
      let match = true
      for (const key in options) {
        if (options[key] !== null && variant[key] !== options[key]) {
          match = false
          break
        }
      }
      if (match) {
        return variant._id
      }
    }
    return null
  }

  const updateAttributes = (propertyKey: string, value: string) => {
    const updatedOptions = { ...selectedOptions, [propertyKey]: value }
    setSelectedOptions(updatedOptions)
    const matchingVariantId = findMatchingVariantId(
      productVariants.variants,
      updatedOptions
    )
    const offer = productOffers[matchingVariantId] as any
    if (offer && offer.length > 0) {
      setCurrentVendor(offer[0])
      setPrice(offer[0].price)
      const restVendors = offer.slice(1)
      setotherVendor(restVendors)
    } else {
      Toaster.error('Variant not available')
    }
  }

  if (!currentVendor) {
    return <Loader />
  }
  return (
    <>
      <div className={styles['product-container']}>
        <div className={styles['product-image-wrapper']}>
          <ImageCarousel images={image} />
        </div>

        <div>
          <p className={styles['id']}>Id: {currentVendor.productId}</p>
          <p className={styles['id']}>
            Product Varient Id: {currentVendor.productVariantId}
          </p>
          <p className={styles['id']}>
            Total Score: {currentVendor.totalScore}
          </p>
          <h2 className={styles['title']}>{name}</h2>
          <h2 className={styles['time']}>Delivery Time: 3-5 days</h2>

          <div>
            {typeof productVariants === 'object' &&
              productVariants !== null &&
              Object.entries(productVariants.uniqueVariants).map(
                ([propertyKey, propertyValues]) => (
                  <div key={propertyKey} className={styles.size}>
                    {propertyValues !== null && propertyValues.length !== 0 ? (
                      <div className={styles.size}>
                        <p>{propertyKey}:</p>
                        {propertyValues.map((value, index) => (
                          // disabled={ enableOptions[propertyKey] ? !VariantAvailable(propertyKey, value) : !isVariantAvailable(propertyKey, value)}
                          <button
                            key={index}
                            onClick={() => updateAttributes(propertyKey, value)}
                            className={`${styles.button} ${selectedOptions[propertyKey] === value ? styles.selected : ''}`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              )}
          </div>

          <div className={styles['quantity']}>
            <p>Quantity:</p>
            <button onClick={decreaseQuantity}>-</button>
            <input readOnly type="number" value={quantity} />
            <button onClick={increaseQuantity}>+</button>
          </div>

          <div className={styles.price}>
            <p className={styles.heading}>price</p>
            <div className={styles.details}>
              <h2 className={styles.amount}>Rs. {price}</h2>
              <RightDrawer
                setCurrentOffer={handleSetCurrentOffer}
                productOffers={otherVendors}
              />
            </div>
          </div>

          <p className={styles.delivery}>Delivery Charges: Rs. 100</p>

          <div className={styles['seller']}>
            <p>
              <span className={styles['label']}>Seller:</span>
              {/* <span className={styles['seller-name']}>
                {productOffers[0].vendor.name}
              </span> */}
              <span className={styles['seller-name']}>
                {currentVendor && currentVendor.vendor?.email}
              </span>
            </p>
            <button>Visit Shop</button>
          </div>

          <div className={styles['buttons-container']}>
            <button className={styles['import-button']}>Import</button>
            <button
              className={styles['order-button']}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className={styles['description']}>
        <h2>Description</h2>
        <p>{description}</p>
      </div>
    </>
  )
}

export default ProductDetails