import { Dispatch, SetStateAction } from 'react'
import { ISignupData } from '../../../lib/schema/auth'

export enum FormStates {
  UserDetails = 'USER_DETAILS',
  Verification = 'VERIFICATION',
}

export interface IFormData {
  name: string
  email: string
  password: string
  otp: string
  token: string
}

export interface UserDetailsProps {
  setFormData: Dispatch<SetStateAction<IFormData>>
  setFormState: Dispatch<SetStateAction<FormStates>>
  formData: {
    email: string
    name: string
    password: string
  }
}

export interface VerificationProps {
  setFormData: Dispatch<SetStateAction<IFormData>>
  setFormState: Dispatch<SetStateAction<FormStates>>
  formData: IFormData
}
