import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SessionState {
  session: {
    access_token?: string
    refresh_token?: string
    expires_in?: string
    refresh_expires_in?: string
  }
  isQadamUser?: boolean
  isVisiableVendorUUIDModal?: boolean
  vendorUUID?: string
}

const initialState: SessionState = {
  session: {
    access_token: undefined,
    refresh_token: undefined,
    expires_in: undefined,
    refresh_expires_in: undefined,
  },
  isQadamUser: false,
  vendorUUID: undefined,
  isVisiableVendorUUIDModal: false,
}

export interface access_tokenAction {
  access_token?: string
  refresh_token?: string
  expires_in?: string
  refresh_expires_in?: string
}
export interface QadamUserAction {
  isQadamUser: boolean
}
export interface vendorUUIDAction {
  vendorUUID?: string
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<access_tokenAction>) => {
      state.session = action.payload
    },
    setIsQadamUser: (state, action: PayloadAction<boolean>) => {
      state.isQadamUser = action.payload
    },
    setVendorUUID: (state, action: PayloadAction<string>) => {
      state.vendorUUID = action.payload
    },
    setIsVisiableVendorUUIDModal: (state, action: PayloadAction<boolean>) => {
      state.isVisiableVendorUUIDModal = action.payload
    },
    logOut: (state) => {
      state.session = undefined
      state.vendorUUID = undefined
      state.isQadamUser = undefined
      state.isVisiableVendorUUIDModal = undefined
    },
  },
})

export const {
  login,
  logOut,
  setIsQadamUser,
  setVendorUUID,
  setIsVisiableVendorUUIDModal,
} = sessionSlice.actions
export default sessionSlice.reducer
