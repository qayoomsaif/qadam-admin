import { IProduct } from '../../lib/schema/products'

export interface ProductPageProps {
  productData: IProduct
}

export interface ImageCarouselProps {
  images: string[]
}

interface OrderDetail {
  productId: string
  productVariantId: string
  productOfferId: string
  quantity: number
  vendorPrice: number
  profit: number
}

// interface CustomerDetails {
//   name: string;
//   email: string;
//   phone: string;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   postalCode: number;
// }

interface Order {
  vendorId: string
  orderDetails: OrderDetail[]
  deliveryPrice: number
}

interface Payload {
  orders: Order[]
  // customerDetails: CustomerDetails;
  customerPrice: number
}
export interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    productId: string
    productVariantId: string
    productOfferId: string
    vendorId: string
    vendorName: string
    price: number
    quantity: number
  }
  productData: IProduct
}
export interface setOfferPram {
  offerId?: string
  productVariantId?: string
  vendorPrice?: string | number
  status?: string
  quantity?: string | number
  options?: any
}
