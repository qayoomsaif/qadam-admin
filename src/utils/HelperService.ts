import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { AuthResponse, UserDetailsParam } from '../lib/schema/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { uploadFile } from './services'
import { Constants } from './Constants'

export const getUserDetail = async () => {
  try {
    let response = await AsyncStorage.getItem('qadamVendorSession')
    if (response) {
      return JSON.parse(response as unknown as string)
    }
  } catch (error) {
    return null
  }
}
export const getToken = () => {
  let res = getCookie('qadamVendorSession')
  if (res && res != 'undefined') {
    let response: AuthResponse = JSON.parse(res)
    if (response?.access_token) {
      return response
    }
    return response
  }
}
export const getVendorUUID = () => {
  let res = getCookie('qadamVendorSession')
  if (res && res != 'undefined') {
    let response: AuthResponse = JSON.parse(res)
    if (response?.vendorUUID) {
      return response?.vendorUUID
    }
    return null
  }
}

export const setToken = async (tokes: AuthResponse) => {
  await removeUserDetail()
  await setCookie('qadamVendorSession', JSON.stringify(tokes))
}

export const setUserDetail = async (userDetail: AuthResponse) => {
  try {
    AsyncStorage.setItem('qadamVendorSession', JSON.stringify(userDetail))
  } catch (error) {
    console.log({ errorerrorerrorerror: error })
  }
}

export const removeUserDetail = () => {
  try {
    deleteCookie('qadamVendorSession')
  } catch (error) {
    return null
  }
}

function validateEmailDomain(email) {
  const domainPattern = /@(qadam\.io|jabe)$/
  return domainPattern.test(email)
}
export const checkEmailDomain = async () => {
  try {
    let res = getCookie('qadamVendorSession')
    if (res && res != 'undefined') {
      let response: AuthResponse = JSON.parse(res)
      if (response?.role == 'admin') {
        return true
      } else {
        return false
      }
    }
  } catch (error) {
    return false
  }
}


export const toTitleCase = (str) => {
  return str?.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
export const getVerifyDetail = () => {
  try {
    let res = getCookie('qadamSession')

    if (!res) {
      console.log("Cookie 'qadamSession' not found.")
      return null
    }

    let response: UserDetailsParam
    try {
      response = JSON.parse(res)
    } catch (error) {
      console.log('Error parsing the cookie data:', error)
      return null
    }

    if (
      response?.userData &&
      response.userData.bank_details &&
      response.userData.profile_verification
    ) {
      return {
        bankVerification: response.userData.bank_details.verification.status,
        profileVerification: response.userData.profile_verification.status,
      }
    } else {
      console.log('Invalid user data structure.')
      return null
    }
  } catch (error) {
    console.log('An unexpected error occurred:', error)
    return null
  }
}
export const truncateText = (text, maxLength = 50) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

interface UploadResult {
  status?: number
  success?: boolean
  data?: any
  error?: string
}

// Generic file upload handler
export const fileUploads = async (file: File): Promise<UploadResult> => {
  try {
    // Check for file existence
    if (!file) {
      return { success: false, error: 'No file provided.' }
    }

    // Check for file type (you can modify this check as per your requirements)
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedFileTypes.includes(file.type)) {
      return { success: false, error: 'Unsupported file type.' }
    }

    // Check for file size (let's say the limit is 5MB)
    const maxSizeInBytes = 10 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return { success: false, error: 'File size exceeds 10MB.' }
    }

    // Create FormData and append the file
    const formData = new FormData()
    formData.append('file', file)

    // Log the FormData entries
    const formDataEntries = Array.from(formData.entries())
    formDataEntries.forEach(([key, value]) => {
      console.log(`FormData Key: ${key}, FormData Value:`, value)
    })

    // Mocking the upload process using the uploadFile function
    const uploadResponse = await uploadFile(formData)

    // Handle the response and return result accordingly
    if (
      uploadResponse.status === Constants.statuses.success &&
      uploadResponse?.data?.data?.length
    ) {
      const imageUrl = uploadResponse.data.data[0]
      console.log('Uploaded Image URL:', imageUrl)

      return { success: true, data: imageUrl }
    } else {
      throw new Error('Failed to upload file.')
    }
  } catch (error) {
    console.error('Upload Error:', error)
    // uploadResponse.data.data
    throw error
    // return { success: false, error: error.message }
  }
}
