import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Subcategory {
  _id: string;
  category_id: string;
  name: string;
  image_url: string;
  product_count: number;
}

interface Category {
  _id: string;
  name: string;
  image_url: string;
  product_count: number;
  subcategory: Subcategory[];
}

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { addCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;