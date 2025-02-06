interface ProductVariant {
    image_url: string[];
    _id: string;
    variants: { name: string; value: string }[];
    productId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface ProductOffer {
    quantity: { verified: number; reserved: number; sold: number };
    _id: string;
    productId: string;
    productVariantId: string;
    vendorId: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Product {
    _id: string;
    image_url: string[];
    productCode: string;
    name: string;
    description: string;
    category: { _id: string; name: string; image_url: string };
    subCategory: { _id: string; category_id: string; name: string; image_url: string };
    createdAt: string;
    updatedAt: string;
    totalOrders: number;
  }
  
  interface OrderDetail {
    price: number;
    perUnitPrice: number;
    quantity: number;
    profit: number;
    perUnitProfit: number;
    product: Product;
    productVariant: ProductVariant;
    productOffer: ProductOffer;
  }
  
  interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: number;
  }
  
  export interface Order {
    customerDetails: CustomerDetails;
    price: {
      itemsPrice: number;
      deliveryPrice: number;
      totalProfit: number;
      customerPrice: number;
    };
    _id: string;
    orderStatus: string;
    orderDetails: OrderDetail[];
    userId: string;
    orderId: string;
    createdAt: string;
    updatedAt: string;
    vendor: {
      _id: string;
      email: string;
      name: string;
      user_id: string;
      createdAt: string;
      updatedAt: string;
    };
  }
  
  export interface Pagination {
    hasNext: boolean;
    hasPrevious: boolean;
    perPage: string;
    page: string;
    next: string;
    previous: string;
  }
  
  export interface OrderData {
    data: Order[];
    pagination: Pagination;
  }