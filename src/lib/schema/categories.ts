export interface ISubCategory {
  _id: string
  name: string
  image_url: string
  category_id: string
}

export interface ICategory {
  _id: string
  name: string
  image_url: string
  subcategory: ISubCategory[]
}

export interface ICategories extends Array<ICategory> {}
