import React, { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { getProfile, setProfile } from '../../../utils/services'
import { Constants } from '../../../utils/Constants'
import Loader from '../../loader/Loader'
import { setUserDetail } from '../../../utils/HelperService'

// Define interfaces for personal details state and errors
interface PersonalDetailsState {
  name: string
  email: string
  phone: string
  dob?: Date | string | null
  frontCnicImage?: File | string | null
  backCnicImage?: File | string | null
  addressLine1?: string
  addressLine2?: string
  city?: string
  postalCode?: string
  state?: string
  shop_name?: string
  shop_phone?: string
}

interface PersonalDetailsErrors {
  name?: string
  email?: string
  phone?: string
  frontCnicImage?: string
  backCnicImage?: string
  addressLine1?: string
  city?: string
  state?: string
  postalCode?: string
  shop_name?: string
  shop_phone?: string
}

// Define interface for profile verification status
interface ProfileVerification {
  status: 'incomplete' | 'pending' | 'verified'
}

const PersonalDetails: React.FC = () => {
  // State to manage the editing mode, loader, profile data, error message, and personal details
  const [isEditing, setIsEditing] = useState(false)
  const [loader, setLoader] = useState(true)
  const [profileData, setProfileData] = useState<ProfileVerification | any>({})
  const [msgErr, setMsgErr] = useState<string>('')
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsState>({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    shop_name: '',
    shop_phone: '',
  })
  const [personalDetailsErrors, setPersonalDetailsErrors] = useState<
    Partial<PersonalDetailsErrors>
  >({})

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoader(true) // Start loader
      try {
        const response = await getProfile() // Fetch profile data
        const profileData = response.data.data
        setUserDetail(profileData) // Set user details in the context or storage
        setProfileData(profileData) // Update profile data state
        setPersonalDetails(profileData) // Set personal details state
      } catch (error) {
        console.error('Error fetching profile data:', error) // Log error
      } finally {
        setLoader(false) // Stop loader
      }
    }
    fetchProfileData()
  }, [])

  // Handle changes to personal details inputs
  const handlePersonalDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value, // Update the specific field in personal details state
    }))
  }

  // Validate personal details before submission
  const validateDetails = (): Partial<PersonalDetailsErrors> => {
    const errors: Partial<PersonalDetailsErrors> = {}
    // Required field validation
    if (!personalDetails.name) errors.name = 'Name is required'
    if (!personalDetails.email) errors.email = 'Email is required'
    if (!personalDetails.phone) errors.phone = 'Phone number is required'
    if (!personalDetails.addressLine1)
      errors.addressLine1 = 'Address Line 1 is required'
    if (!personalDetails.city) errors.city = 'City is required'
    if (!personalDetails.state) errors.state = 'State is required'
    if (!personalDetails.postalCode)
      errors.postalCode = 'Postal Code is required'
    if (!personalDetails.shop_name) errors.shop_name = 'Shop Name is required'
    // Shop phone validation
    if (!personalDetails.shop_phone) {
      errors.shop_phone = 'Shop Phone number is required'
    } else {
      if (personalDetails.shop_phone.length !== 11) {
        errors.shop_phone = 'Shop Phone must be 11 digits'
      }
      if (!/^03\d{9}$/.test(personalDetails.shop_phone)) {
        errors.shop_phone = 'Shop Phone should start with 03'
      }
    }
    return errors // Return any validation errors
  }

  // Handle submission of personal details
  const handlePersonalDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission
    const errors = validateDetails() // Validate the details
    setPersonalDetailsErrors(errors) // Set validation errors in state
    if (Object.keys(errors).length) return // If there are errors, stop submission

    // Prepare data for submission
    const data = {
      ...personalDetails,
      postalCode: Number(personalDetails.postalCode), // Ensure postal code is a number
    }

    try {
      const response = await setProfile(data) // Submit profile data
      if (response.status === Constants.statuses.success) {
        const profileData = response.data.data
        setUserDetail(profileData) // Update user details in context or storage
        setIsEditing(false) // Exit editing mode
      }
    } catch (error) {
      // Handle submission errors
      if (error?.response?.data?.status?.message) {
        setMsgErr(error.response.data.status.message)
      }
      console.error('Error updating profile:', error)
    }
  }

  // Handle entering edit mode
  const handleEdit = () => setIsEditing(true)
  // Handle canceling edit mode
  const handleCancel = () => setIsEditing(false)

  return (
    <>
      {loader && <Loader />}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="customerDetails">
            <div className="flex text-primary-blue-500 font-semibold text-2xl items-center justify-between">
              Personal Details
              <div
                className={`${profileData?.status == 'verified' ? 'text-green-700' : 'text-primary-blue-500'} font-semibold text-xl capitalize mr-4`}
              >
                {profileData?.status}
              </div>
            </div>
            <hr />
            <div className="my-5">
              <form>
                <div className="mb-4">
                  <div className="mt-4">
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="name"
                        className="font-semibold absolute ml-2 px-1 z-10  bg-white block top-[-0.8rem]"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        maxLength={40}
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.name}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                      {personalDetailsErrors.name && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="email"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.email}
                        onChange={handlePersonalDetailsChange}
                        disabled={true}
                        readOnly={true}
                      />
                      {personalDetailsErrors.email && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="phone"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Mobile
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.phone}
                        minLength={11}
                        maxLength={11}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                      {personalDetailsErrors.phone && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.phone}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="phone"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        id="addressLine1"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.addressLine1}
                        maxLength={30}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                      {personalDetailsErrors.addressLine1 && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.addressLine1}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="phone"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        id="addressLine2"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.addressLine2}
                        maxLength={30}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                      {personalDetailsErrors.addressLine1 && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.addressLine1}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="city"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.city}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                        onChange={handlePersonalDetailsChange}
                      />
                      {personalDetailsErrors.city && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.city}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="state"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.state}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                        // disabled
                        // readOnly
                        // minLength={11}
                        // maxLength={11}
                        onChange={handlePersonalDetailsChange}
                      />
                      {personalDetailsErrors.state && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.state}
                        </p>
                      )}
                    </div>
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="phone"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Postal Code
                      </label>
                      <input
                        type="number"
                        name="postalCode"
                        id="postalCode"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.postalCode}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                        minLength={6}
                        maxLength={6}
                        onChange={handlePersonalDetailsChange}
                      />
                      {personalDetailsErrors.postalCode && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="sm:border-l sm:border-slate-800">
            <div className="VendorDetails">
              <h4 className="text-primary-blue-500 font-semibold text-2xl sm:px-5">
                Business Details
              </h4>
              <hr />
              <form>
                <div className="my-5">
                  <div className="sm:px-5">
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="name"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Shop Name
                      </label>
                      <input
                        type="text"
                        name="shop_name"
                        id="shop_name"
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.shop_name}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                      {personalDetailsErrors.shop_name && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.shop_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:px-5">
                    <div className="relative my-4 w-full sm:w-4/5 z-0">
                      <label
                        htmlFor="phone"
                        className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
                      >
                        Business Phone
                      </label>
                      <input
                        type="number"
                        name="shop_phone"
                        id="shop_phone"
                        placeholder="03xxxxxxxxx"
                        minLength={11}
                        maxLength={11}
                        className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
                        value={personalDetails.shop_phone}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                      {personalDetailsErrors.shop_phone && (
                        <p className="text-red-500 text-sm">
                          {personalDetailsErrors.shop_phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end items-center space-x-4">
          {msgErr && <p className="text-red-500 text-sm">{msgErr}</p>}
          {isEditing && (
            <button
              onClick={handleCancel}
              className="border-2 text-primary-blue-600 border-primary-blue-600 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
          {isEditing && (
            <button
              onClick={handlePersonalDetailsSubmit}
              className="bg-primary-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          )}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="bg-primary-blue-600 text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default PersonalDetails
