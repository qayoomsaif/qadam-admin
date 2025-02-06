export interface ILoginData {
  email: string
  password: string
}

export interface ISignupData {
  email: string
  name: string
  password: string
}

export interface IVerifyOTPData {
  otp?: string
  token?: string
  email?: string
  newPassword?: string
}

interface EmailVerification {
  token: string
  expires_at: number
  otp: string
}

interface ResetPassword {
  token: string | null
  expires_at: number | null
  otp: string | null
}

interface UserData {
  _id: string
  email_verification: EmailVerification
  reset_password: ResetPassword
  email: string
  name: string
  user_id: string
  createdAt: string
  updatedAt: string
  city: string
  city_id: string
  phone: string
}

export interface AuthResponse {
  access_token?: string
  expires_in?: number
  refresh_expires_in?: number
  vendorUUID?: string
  refresh_token?: string
  token_type?: string
  not_before_policy?: number
  session_state?: string
  scope?: string
  role?: string
  user_data?: UserData
}
export interface VerificationType {
  bankVerification: 'incomplete' | 'pending' | 'verified' | undefined
  profileVerification: 'incomplete' | 'pending' | 'verified' | undefined
}
export interface UserDetailsParam {
  access_token: string
  expires_in: number
  refreshTokenExpireTime: number
  refresh_token: number
  token_type: string
  'not-before-policy': number
  session_state: string
  scope: string
  userData: {
    _id: string
    phone: string
    user_id: string
    bank_details: {
      verification: {
        status: 'incomplete' | 'pending' | 'verified'
        message: []
      }
    }
    profile_verification: {
      status: 'incomplete' | 'pending' | 'verified'
      message: []
    }
    createdAt: string
    updatedAt: string
  }
}
