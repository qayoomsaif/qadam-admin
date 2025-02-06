import { pages } from 'next/dist/build/templates/app-page'
import { ILoginData, ISignupData, IVerifyOTPData } from '../lib/schema/auth'
import { IOrderData } from '../lib/schema/orders'
import { IAddProduct, IBulkUpdateVariants } from '../lib/schema/products'
import { Constants } from './Constants'
import axios from './axios'

export const refreshTokenApi = async (data) => {
  let response = await axios.post(Constants.endPoints.refreshToken, data)
  return response
}

export const getCategoriesApi = async () => {
  try {
    let response = await axios.get(
      Constants.endPoints.getCategories
      // setBearerToken(token)
    )
    return response
  } catch (error) {
    JSON.stringify(error)
  }
}

export const loginApi = async (data: ILoginData) => {
  let response = await axios.post(Constants.endPoints.login, data, {
    headers: {},
  })
  return response
}

export const signupApi = async (data: ISignupData) => {
  let response = await axios.post(Constants.endPoints.signup, data)
  return response
}

export const verifyOtp = async (data: IVerifyOTPData) => {
  const response = await axios.put(Constants.endPoints.verifyOTP, data)
  return response
}
export const resetPassword = async (data: IVerifyOTPData, token: string) => {
  const response = await axios.put(
    `${Constants.endPoints.resetPassword}?reset_token=${token}`,
    data
  )
  return response
}
export const sendVerifyEmail = async (email) => {
  console.log({ email })
  const response = await axios.post(Constants.endPoints.sendVerifyEmail, {
    email: email,
  })
  return response
}

export const getProductsApi = async (page: number = 1) => {
  const response = await axios.get(
    `${Constants.endPoints.getSingleProduct}?page=${page}&perPage=${12}`
  )
  return response
}
export const getAllVendor = async () => {
  const response = await axios.get(`/api/vendor`)
  return response
}
export const getProducts = async (payload) => {
  const response = await axios.get(
    `${Constants.endPoints.getProduct}?page=${payload.page}&perPage=${payload?.perPage ? payload?.perPage : 10}&search=${payload.search}`
  )
  return response
}
export const getSingleProductApi = async (data, token) => {
  const response = await axios.get(
    `${Constants.endPoints.getSingleProduct}${data}`
  )
  return response
}
export const addProductOffer = async (payload) => {
  const response = await axios.post(
    `${Constants.endPoints.addProductOffers}`,
    payload
  )
  return response?.data
}
export const deleteProductOffer = async (offerId) => {
  const response = await axios.delete(
    `${Constants.endPoints.deleteProductOffers}${offerId}`
  )
  return response?.data
}
export const createOrderApi = async (data: IOrderData, token: string) => {
  const response = await axios.post(Constants.endPoints.order, data)
  return response
}

export const addProductApi = async (data: IAddProduct) => {
  const response = await axios.post(Constants.endPoints.addProduct, data, {
    maxBodyLength: Infinity,
  })
  return response
}
export const editProductApi = async (data: IAddProduct, id: string) => {
  const response = await axios.put(
    `${Constants.endPoints.editProduct}/${id}/update`,
    data,
    {
      maxBodyLength: Infinity,
    }
  )
  return response
}

export const getProductsBySubCategory = async (data) => {
  const response = await axios.get(
    `${Constants.endPoints.getProductsBySubCategories}?page={page}&perPage={itemPerPage}`
      .replace('{categoryId}', data.categoryId)
      .replace('{subcategoryId}', data.subcategoryId)
      .replace('{page}', data.page)
      .replace('{itemPerPage}', data.itemPerPage)
  )
  return response.data
}

export const uploadImageApi = async (data: FormData) => {
  const response = await axios.post(Constants.endPoints.uploadImage, data, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
  return response
}

export const bulkUpdateVariantsApi = async (
  data: IBulkUpdateVariants,
  token: string
) => {
  const response = await axios.put(
    Constants.endPoints.bulkUpdateVariants + `?productId=${data.productId}`,
    data
    // setBearerToken(token)
  )
  return response
}
export const getAllOrdersApi = async ({ page, status }) => {
  const response = await axios.get(
    `${Constants.endPoints.orderAll}?perPage=10&page=${page}${status ? '&orderStatus=' + status : ''}`
  )
  return response.data
}

export const getAllPaymentrLedgerApi = async (pages) => {
  const response = await axios.get(
    `${Constants.endPoints.getPaymentLedger}?perPage=10&page=${pages}`
  )
  return response.data
}
export const getSingleOrderApi = async (data) => {
  const response = await axios.get(
    `${Constants.endPoints.getSingleOrder}${data}`
  )
  return response.data
}
export const acceptOrder = async (payload, id) => {
  const response = await axios.post(
    `${Constants.endPoints.acceptOrder}${id}/accept`,
    payload
  )
  return response.data
}
export const cancelOrder = async (payload, id) => {
  const response = await axios.post(
    `${Constants.endPoints.cancelOrder}${id}/cancel`,
    payload
  )
  return response.data
}

export const setProfile = async (data) => {
  const response = await axios.put(Constants.endPoints.setProfile, data)
  return response
}
export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
}) => {
  const response = await axios.patch(Constants.endPoints.changePassword, data)
  return response
}

export const getProfile = async () => {
  const response = await axios.get(Constants.endPoints.getProfile)
  return response
}

export const setBank = async (data) => {
  const response = await axios.put(Constants.endPoints.setBank, data)
  return response
}

// export const uploadFile = async (data) => {
//   const response = await axios.post(Constants.endPoints.fileUpload, data)
//   return response
// }

export const uploadFile = async (data) => {
  try {
    const response = await axios.post(Constants.endPoints.fileUpload, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

export const getPayouts = async () => {
  const response = await axios.get(Constants.endPoints.getPayouts)
  return response
}
