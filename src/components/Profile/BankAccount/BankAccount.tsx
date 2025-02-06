import React, { useEffect, useState } from 'react'
import { BANK_OPTIONS } from './Banks'
import { getProfile, setBank, uploadFile } from '../../../utils/services'
import { Constants } from '../../../utils/Constants'
import { useSession } from '../../../lib/hooks/auth'
import { getCookie } from 'cookies-next'
import router from 'next/router'
import Loader from '../../loader/Loader'
import { Badge } from '@chakra-ui/react'
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Input,
  InputGroup,
  InputLeftAddon,
  IconButton,
  Icon,
  useDisclosure,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
} from '@chakra-ui/react'
import { FiEye } from 'react-icons/fi'
import { getUserDetail, setUserDetail } from '../../../utils/HelperService'

interface BankAccountState {
  accountTitle: string
  bankName: string
  accountNumber: string | null
  IBAN: string
  file: File | string | null
}

interface BankAccountErrors {
  accountTitle?: string
  bankName?: string
  accountNumber?: string
  IBAN?: string
  file?: string
}
interface bank_details {
  verification: {
    status: 'incomplete' | 'pending' | 'verified'
  }
}

const BankAccount: React.FC = () => {
  const [bankAccount, setBankAccount] = useState<BankAccountState>({
    accountTitle: '',
    bankName: '',
    accountNumber: null,
    IBAN: '',
    file: null,
  })

  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [bankAccountErrors, setBankAccountErrors] = useState<BankAccountErrors>(
    {}
  )
  const [isEditing, setIsEditing] = useState(false)
  const [loader, setLoader] = useState(true)
  const getCookies = getCookie('qadamSession')
  const { session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [profileData, setProfileData] = useState<bank_details | any>({})
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)

  useEffect(() => {
    setLoader(true)
    try {
      getProfileData()
    } catch (error) {
      console.error('Error parsing JSON:', error)
    } finally {
      setLoader(false)
    }
  }, [session])

  useEffect(() => {
    if (bankAccount.file instanceof File) {
      const url = URL.createObjectURL(bankAccount.file)
      setFileUrl(url)
      return () => URL.revokeObjectURL(url) // Cleanup the URL object
    } else if (typeof bankAccount.file === 'string') {
      setFileUrl(bankAccount.file)
    }
  }, [bankAccount.file])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'incomplete':
        return (
          <Badge colorScheme="red" className="flex items-center">
            <WarningIcon mr="2" />
            {status}
          </Badge>
        )
      case 'pending':
        return (
          <Badge colorScheme="yellow" className="flex items-center">
            <InfoIcon mr="2" />
            {status}
          </Badge>
        )
      case 'verified':
        return (
          <Badge colorScheme="green" className="flex items-center">
            <CheckCircleIcon mr="2" />
            {status}
          </Badge>
        )
      default:
        return null
    }
  }
  const getProfileData = async () => {
    try {
      setLoader(true)
      const response = await getProfile()
      if (response.status === Constants.statuses.success) {
        const profileData = response?.data?.data
        setUserDetail(profileData)
        setProfileData(profileData.bank_details)
        if (profileData.bank_details.verification.status === 'incomplete') {
          setIsEditing(true)
        } else {
          const bankName =
            BANK_OPTIONS.find(
              (bank) =>
                bank.name.toLowerCase() ===
                profileData.bank_details.bank_name.toLowerCase()
            )?.name || profileData.bank_details.bank_name
          setBankAccount({
            accountNumber: profileData.bank_details.account_number,
            accountTitle: profileData.bank_details.account_title,
            bankName: bankName,
            IBAN: profileData.bank_details.iban,
            file: profileData.bank_details.cheque_book,
          })
        }
      }
    } catch (error) {
      console.log('Error fetching profile data:', error)
    } finally {
      setLoader(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    let newBankAccount = {
      ...bankAccount,
      [name]: value,
    }
    if (name === 'bankName') {
      const selectedBank = BANK_OPTIONS.find((bank) => bank.name === value)
      newBankAccount = {
        ...newBankAccount,
        IBAN: '',
        accountNumber: '',
        accountTitle: '',
        file: null,
      }
    }
    setBankAccount(newBankAccount)
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const maxSizeInMB = 1
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024

      if (file.size > maxSizeInBytes) {
        setBankAccountErrors({
          ...bankAccountErrors,
          file: `File size exceeds ${maxSizeInMB} MB`,
        })
        return
      } else {
        setBankAccount({
          ...bankAccount,
          file,
        })
        setBankAccountErrors({
          ...bankAccountErrors,
          file: undefined,
        })

        // Preview image in modal if valid image type
        const validImageTypes = [
          'image/png',
          'image/jpg',
          'image/jpeg',
          'image/webp',
        ]
        if (validImageTypes.includes(file.type)) {
          const reader = new FileReader()
          reader.onload = (event) => {
            setImagePreviewUrl(event.target.result as string)
          }
          reader.readAsDataURL(file)
        } else {
          setBankAccountErrors({
            ...bankAccountErrors,
            file: 'Invalid File Type',
          })
        }
      }
    }
  }

  const validateFields = () => {
    const errors: BankAccountErrors = {}
    if (!bankAccount.accountTitle)
      errors.accountTitle = 'Account title is required'
    if (!bankAccount.bankName) errors.bankName = 'Bank name is required'
    if (!bankAccount.accountNumber)
      errors.accountNumber = 'Account number is required'

    const selectedBank = BANK_OPTIONS.find(
      (bank) => bank.name === bankAccount.bankName
    )
    if (selectedBank && !selectedBank.isMicrofinance && !bankAccount.IBAN) {
      errors.IBAN = 'IBAN is required for non-microfinance banks'
    }
    if (selectedBank && !selectedBank.isMicrofinance && !bankAccount.file) {
      errors.file = 'Cheque Book Image is required'
    }

    if (!selectedBank?.isMicrofinance && !bankAccount.file) {
      errors.file = 'File is required'
    } else if (bankAccount.file && bankAccount.file instanceof File) {
      const validFileTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'application/pdf',
      ]
      if (!validFileTypes.includes(bankAccount.file.type)) {
        errors.file = 'Invalid file type'
      }
    }

    setBankAccountErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (validateFields()) {
      setLoader(true)
      let imageUrl
      const selectedBank = BANK_OPTIONS.find(
        (bank) => bank.name === bankAccount.bankName
      )

      if (selectedBank && !selectedBank.isMicrofinance) {
        if (bankAccount.file) {
          const frontFormData = new FormData()
          frontFormData.append('file', bankAccount.file)
          const chequeResponse = await uploadFile(frontFormData)
          if (chequeResponse.status === Constants.statuses.success) {
            imageUrl = chequeResponse.data.data[0]
          } else {
            throw new Error('Failed to upload Cheque image')
          }
        }
      }
      const payload = {
        bankName: bankAccount.bankName,
        accountTitle: bankAccount.accountTitle,
        accountNumber: bankAccount.accountNumber,
        iban: bankAccount.IBAN,
        chequeBook: imageUrl,
      }
      try {
        const response = await setBank(payload)
        if (response.status === Constants.statuses.success) {
          getProfileData()
          setIsEditing(false)
        }
      } catch (error) {
        console.log('Error submitting bank details:', error)
      } finally {
        setLoader(false)
      }
    }
  }

  const selectedBank = BANK_OPTIONS.find(
    (bank) => bank.name === bankAccount.bankName
  )

  const handleCancel = () => {
    setIsEditing(false)
  }
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  return (
    <div className="flex flex-col p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between text-primary-blue-500 font-semibold text-2xl items-center mb-4">
        <span>Bank Account Details</span>
        {getStatusBadge(profileData?.verification?.status)}
      </div>
      <hr className="mb-4" />
      <form className="z-0">
        {isEditing && (
          <div className="relative my-4 w-full sm:w-2/5">
            <label
              htmlFor="bankName"
              className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
            >
              Bank Name
            </label>
            <select
              id="bankName"
              name="bankName"
              // placeholder={`Select Bank`}
              value={bankAccount.bankName}
              onChange={handleInputChange}
              className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
            >
              <option value="" disabled>
                Select a bank
              </option>
              {BANK_OPTIONS.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
            {bankAccountErrors.bankName && (
              <span className="text-red-500">{bankAccountErrors.bankName}</span>
            )}
          </div>
        )}
        {!isEditing && (
          <div className="relative my-4 w-full sm:w-2/5">
            <label
              htmlFor="bankName"
              className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              placeholder="Select Bank"
              value={bankAccount.bankName}
              readOnly={!isEditing}
              className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
            />
          </div>
        )}
        <div className="relative my-4 w-full sm:w-2/5">
          <label
            htmlFor="accountTitle"
            className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
          >
            Account Title
          </label>
          <input
            type="text"
            id="accountTitle"
            name="accountTitle"
            placeholder="Enter Account Title"
            value={bankAccount.accountTitle}
            disabled={!isEditing}
            readOnly={!isEditing}
            onChange={handleInputChange}
            className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
          />
          {bankAccountErrors.accountTitle && (
            <span className="text-red-500">
              {bankAccountErrors.accountTitle}
            </span>
          )}
        </div>

        <div className="relative my-4 w-full sm:w-2/5">
          <label
            htmlFor="accountNumber"
            className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
          >
            Account Number
          </label>
          <input
            type="number"
            id="accountNumber"
            name="accountNumber"
            disabled={!isEditing}
            readOnly={!isEditing}
            placeholder="Enter Account Number"
            value={bankAccount.accountNumber ?? ''}
            onChange={handleInputChange}
            className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
          />
          {bankAccountErrors.accountNumber && (
            <span className="text-red-500">
              {bankAccountErrors.accountNumber}
            </span>
          )}
        </div>

        {!selectedBank?.isMicrofinance && (
          <div className="relative my-4 w-full sm:w-2/5">
            <label
              htmlFor="IBAN"
              className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
            >
              IBAN
            </label>
            <input
              type="text"
              id="IBAN"
              name="IBAN"
              placeholder="Account IBAN"
              value={bankAccount.IBAN}
              disabled={!isEditing}
              readOnly={!isEditing}
              onChange={handleInputChange}
              className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full"
            />
            {bankAccountErrors.IBAN && (
              <span className="text-red-500">{bankAccountErrors.IBAN}</span>
            )}
          </div>
        )}

        {!selectedBank?.isMicrofinance && (
          <div className="relative my-4 w-full sm:w-2/5">
            <label
              htmlFor="file"
              className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
            >
              Cheque Book
            </label>
            <div className="flex items-center">
              {isEditing ? (
                <>
                  <input
                    type="file"
                    id="file"
                    disabled={!isEditing}
                    readOnly={!isEditing}
                    name="file"
                    onChange={handleFileChange}
                    className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full mr-2"
                  />
                  <IconButton
                    aria-label="Preview uploaded cheque book image"
                    icon={<FiEye />}
                    disabled={!bankAccount.file}
                    onClick={() => setIsImagePreviewOpen(true)}
                  />
                </>
              ) : (
                <div
                  className="bg-white border-2 rounded-lg border-primary-blue-300 px-2 py-1 text-lg w-full mr-2 flex items-center justify-left cursor-pointer"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  Click to preview
                </div>
              )}
            </div>
            {bankAccountErrors.file && (
              <span className="text-red-500">{bankAccountErrors.file}</span>
            )}
          </div>
        )}

        <Modal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cheque Book Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isEditing ? (
                //image to show preview in form editing mode
                imagePreviewUrl ? (
                  <Image src={imagePreviewUrl} alt="Cheque Book Preview" />
                ) : (
                  <p>No image uploaded yet.</p>
                )
              ) : (
                // image to show in non editing mode
                fileUrl && <img src={fileUrl} alt="Cheque Book Preview" />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
        <div className="flex flex-col sm:flex-row justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="border-2 text-primary-blue-600 border-primary-blue-600 m-2 mb-0 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary-blue-600 m-2 mb-0 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          )}

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-primary-blue-600 m-2 mb-0 text-white px-4 py-2 rounded-md"
            >
              Edit
            </button>
          )}
        </div>
      </form>
      {loader && <Loader />}
    </div>
  )
}

export default BankAccount
