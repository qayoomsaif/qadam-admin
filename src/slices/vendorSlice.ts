// slices/vendorsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { addToCart } from './cartSlice' // Import addToCart action
import { RootState, AppDispatch } from '../store' // Adjust the path based on your project structure

interface Vendor {
  vendorId: string
  orderDetails: Array<any>
}

interface VendorsState {
  vendors: Array<Vendor>
}

const initialState: VendorsState = {
  vendors: [],
}

// Create an async thunk to handle the dispatching of addToCart action
export const addOrder = createAsyncThunk(
  'vendors/addOrder',
  async (vendor: Vendor, { dispatch, getState }) => {
    const existingVendor = (getState() as RootState).vendors.vendors.find(
      (v) => v.vendorId === vendor.vendorId
    )

    if (existingVendor) {
      existingVendor.orderDetails.push(...vendor.orderDetails)
    } else {
      dispatch(vendorsSlice.actions.addVendor(vendor))
    }

    // Dispatch addToCart action for each order item
    vendor.orderDetails.forEach((orderItem) => {
      const { productId, productVariantId, productOfferId, quantity } =
        orderItem
      // dispatch(
      //   // addToCart({ productId, productVariantId, productOfferId, quantity })   // <= original | neechy wala temporary fix
      //   addToCart({
      //     vendorId: vendor.vendorId,
      //     orderDetails: [orderItem],
      //   })
      // )
    })
  }
)

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    addVendor: (state, action: PayloadAction<Vendor>) => {
      state.vendors.push(action.payload)
    },
    // Add other actions as needed
  },
})

export const { addVendor } = vendorsSlice.actions
export default vendorsSlice.reducer
