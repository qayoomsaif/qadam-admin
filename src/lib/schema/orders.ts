export interface IOrderDetails {
  productId: string
  productVariantId: string
  productOfferId: string
  quantity: number
  perUnitProfit: number
}

export interface IVendorOrder {
  vendorId: string
  orderDetails: IOrderDetails[]
  deliveryPrice: number
}

export interface ICustomerDetails {
  name: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: number
}

export interface IOrderData {
  orders: IVendorOrder[]
  customerDetails: ICustomerDetails
}
