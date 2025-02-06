export interface ICategory {
  _id: string
  name: string
  image_url: string
}

export interface IVariant {
  _id: string
  size: string
  color: string
  productId: string
}

export interface IProductOffers {
  [key: string]: {
    _id: string
    quantity: any
    productId: string
    productVariantId: string
    vendorId: string
    price: number
    status: string
    createdAt: string
    updatedAt: string
    vendor: any
    totalScore: number
  }[]
}

export interface IProduct {
  _id: string
  image_url: string[]
  productCode: string
  name: string
  description: string
  category: ICategory
  subCategory: ICategory
  weight?: number
  productVariants: {
    variants: IVariant[]
    uniqueVariants: {
      size: string[]
      color: string[]
      material: string[]
    }
  }
  productOffers: IProductOffers[]
}

export interface IAddProduct {
  name: string
  description: string
  category: string
  subCategory: string
  image_url: string[]
  variants: { [key: string]: string[] }
}

export interface IBulkUpdateVariants {
  productId: string
  variants: { id: string; image_url: string[] }[]
}
