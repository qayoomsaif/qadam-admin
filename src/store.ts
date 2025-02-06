// store.ts
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import vendorsReducer from './slices/vendorSlice'
import categoriesSlice from './slices/categorySlice'
import sessionSlice from './slices/sessionSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
// import { getDefaultMiddleware } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
}
const reducer = combineReducers({
  cart: cartReducer,
  vendors: vendorsReducer,
  categories: categoriesSlice,
  session: sessionSlice,
  // Add other slices/reducers here
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
