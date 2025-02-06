// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OrderDetail {
  productId: string
  productVariantId: string
  productOfferId: string
  quantity: number
  perUnitProfit: number
  productDetail: {
    name: string
    Image: string
    price: number
  }
}

interface Order {
  vendorId: string
  vendorName: string
  orderDetails: OrderDetail[]
  deliveryPrice: number
}

interface CartState {
  orders: Order[]
  totalPrice: number
}

const initialState: CartState = {
  orders: [],
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addToCart: (state, action: PayloadAction<Order>) => {
    //   const newItem = action.payload
    //   const existingItem = state.orders.find(
    //     (item) => item.vendorId === newItem.vendorId
    //   )

    //   if (existingItem) {
    //     // If the vendorId already exists, add orderDetails to the existing vendor
    //     existingItem.orderDetails.push(...newItem.orderDetails)
    //   } else {
    //     // If the vendorId doesn't exist, add a new item to the state
    //     state.orders.push(newItem)
    //   }
    // },
    addToCart: (state, action: PayloadAction<Order>) => {
      const newItem = action.payload
      const existingItemIndex = state.orders.findIndex(
        (item) => item.vendorId === newItem.vendorId
      )

      if (existingItemIndex !== -1) {
        // If the vendorId already exists, check for existing productVariantId
        const existingItem = state.orders[existingItemIndex]
        newItem.orderDetails.forEach((newOrderDetail) => {
          const existingOrderDetailIndex = existingItem.orderDetails.findIndex(
            (orderDetail) =>
              orderDetail.productVariantId === newOrderDetail.productVariantId
          )
          if (existingOrderDetailIndex !== -1) {
            // If productVariantId already exists, increase the quantity
            existingItem.orderDetails[existingOrderDetailIndex].quantity +=
              newOrderDetail.quantity
          } else {
            // If productVariantId doesn't exist, add orderDetails to the existing vendor
            existingItem.orderDetails.push(newOrderDetail)
          }
        })
        // Update the item in the state
        state.orders[existingItemIndex] = existingItem
      } else {
        // If the vendorId doesn't exist, add a new item to the state
        state.orders.push(newItem)
      }
    },
    // removeFromCart: (
    //   state,
    //   action: PayloadAction<{
    //     vendorId: string
    //     productId: string
    //     variantId: string
    //   }>
    // ) => {
    //   const { vendorId, productId, variantId } = action.payload
    //   const existingItem = state.orders.find(
    //     (item) => item.vendorId === vendorId
    //   )

    //   if (existingItem) {
    //     existingItem.orderDetails = existingItem.orderDetails.filter(
    //       (orderDetail) =>
    //         orderDetail.productId !== productId ||
    //         orderDetail.productVariantId !== variantId
    //     )

    //     // Remove the entire vendor if no orderDetails are left
    //     if (existingItem.orderDetails.length === 0) {
    //       state.orders = state.orders.filter((item) => item.vendorId !== vendorId)
    //     }
    //   }
    // },
    removeFromCart: (
      state,
      action: PayloadAction<{
        vendorId: string
        productId: string
        productVariantId: string
      }>
    ) => {
      const { vendorId, productId, productVariantId } = action.payload
      const existingItemIndex = state.orders.findIndex(
        (item) => item.vendorId === vendorId
      )

      if (existingItemIndex !== -1) {
        const existingOrder = state.orders[existingItemIndex]
        const filteredOrderDetails = existingOrder.orderDetails.filter(
          (orderDetail) =>
            orderDetail.productId !== productId ||
            orderDetail.productVariantId !== productVariantId
        )

        // Remove the entire order if no orderDetails are left
        if (filteredOrderDetails.length === 0) {
          state.orders.splice(existingItemIndex, 1)
        } else {
          existingOrder.orderDetails = filteredOrderDetails
        }
      }
    },
    emptyCart: (state) => {
      state.orders = []
      state.totalPrice = 0
    },
    // updateQuantity: (
    //   state,
    //   action: PayloadAction<{
    //     vendorId: string
    //     productId: string
    //     variantId: string
    //     quantity: number
    //   }>
    // ) => {
    //   const { vendorId, productId, variantId, quantity } = action.payload
    //   const existingItem = state.orders.find(
    //     (item) => item.vendorId === vendorId
    //   )

    //   if (existingItem) {
    //     const existingOrderDetail = existingItem.orderDetails.find(
    //       (orderDetail) =>
    //         orderDetail.productId === productId &&
    //         orderDetail.productVariantId === variantId
    //     )

    //     if (existingOrderDetail) {
    //       existingOrderDetail.quantity = quantity
    //     }
    //   }
    // },
    updateQuantity: (
      state,
      action: PayloadAction<{
        vendorId: string
        productId: string
        productVariantId: string
        quantity: number
      }>
    ) => {
      const { vendorId, productId, productVariantId, quantity } = action.payload

      // Find the item with the matching vendorId
      const existingItem = state.orders.find(
        (item) => item.vendorId === vendorId
      )

      if (existingItem) {
        // Find the orderDetail within the item with matching productId and productVariantId
        const existingOrderDetail = existingItem.orderDetails.find(
          (orderDetail) =>
            orderDetail.productId === productId &&
            orderDetail.productVariantId === productVariantId
        )

        if (existingOrderDetail) {
          // Update the quantity of the existing orderDetail
          existingOrderDetail.quantity = quantity
        }
      }
    },
    // calculateTotalPrice: (state) => {
    //   // Calculate total price by multiplying price with quantity for each item in all vendors
    //   const total = state.orders.reduce((acc, item) => {
    //     return (
    //       acc +
    //       item.orderDetails.reduce(
    //         (orderAcc, orderDetail) =>
    //           orderAcc + 500 * orderDetail.quantity,
    //           // orderAcc + orderDetail.price * orderDetail.quantity,
    //         0
    //       )
    //     )
    //   }, 0)

    //   // Update the totalPrice in the state using immer's draft syntax
    //   state.totalPrice = total
    // },
    calculateTotalPrice: (state) => {
      // Calculate total price by multiplying price with quantity for each item in all vendors
      const total = state.orders.reduce((acc, vendor) => {
        // Calculate total price for each vendor
        const vendorTotal = vendor.orderDetails.reduce(
          (vendorAcc, orderDetail) => {
            // Calculate total price for each order detail (including per unit profit)
            const orderDetailTotal =
              (orderDetail.perUnitProfit + orderDetail.productDetail.price) *
              orderDetail.quantity
            return vendorAcc + orderDetailTotal
          },
          0
        )
        // Add delivery price for the vendor
        const vendorTotalWithDelivery = vendorTotal + vendor.deliveryPrice

        // Add vendor total to accumulator
        return acc + vendorTotalWithDelivery
      }, 0)

      // Update the totalPrice in the state using immer's draft syntax
      state.totalPrice = total
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateTotalPrice,
  emptyCart,
} = cartSlice.actions
export default cartSlice.reducer
