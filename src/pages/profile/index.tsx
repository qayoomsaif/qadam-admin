import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader/Loader'
// import ProductCard from '../../components/ProductCard/ProductCard'
import { RootState } from '../../store'
import { AppPage } from '../../components/layout/AppPage'
import { getProductsBySubCategory, getProfile } from '../../utils/services'
import { Constants } from '../../utils/Constants'
import ViewportBlock from '../../components/ViewportBlock/ViewportBlock'
import PersonalDetails from '../../components/Profile/PersonalDetails/PersonalDetails'
import BankAccount from '../../components/Profile/BankAccount/BankAccount'
import AccountStatement from '../../components/Profile/AccountStatement/AccountStatement'
import OrderOverview from '../../components/Profile/OrderOverview/OrderOverview'
import Ledger from '../../components/Profile/Ledger/Ledger'
import Earnings from '../../components/Profile/Earnings/Earnings'
import { getVerifyDetail } from '../../utils/HelperService'
import { VerificationType } from '../../lib/schema/auth'
import { getCookie } from 'cookies-next'
import { useSession } from '../../lib/hooks/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { log } from 'console'

const Profile = () => {
  const router = useRouter()
  const { categoryId, subcategory } = router.query
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  )
  const [activeTab, setActiveTab] = useState('personal-details')
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }
  useEffect(() => {
    checkStatus()
  }, [router])
  const checkStatus = async () => {
    let response: VerificationType = getVerifyDetail()
    let profile_type
    try {
      let profile_type = await AsyncStorage.getItem('profile_type')
      if (profile_type == 'ledger') {
        setActiveTab('ledger')
        AsyncStorage.removeItem('profile_type')
        return
      } else if (profile_type == 'bank_details') {
        setActiveTab('bank-account')
        AsyncStorage.removeItem('profile_type')
        return
      }

      AsyncStorage.removeItem('profile_type')
    } catch (error) {}
    if (
      (response?.profileVerification != 'incomplete' &&
        response?.bankVerification == 'incomplete') ||
      profile_type == 'bank_details'
    ) {
      setActiveTab('bank-account')
    } else {
      setActiveTab('personal-details')
    }
    AsyncStorage.removeItem('profile_type')
  }

  useEffect(() => {
    if (categories.length > 0) {
      const selectedCategory = categories.find(
        (category) => category._id === categoryId
      )
      if (selectedCategory) {
        if (subcategory) {
          setActiveTab(subcategory.toString())
        } else {
          setActiveTab(
            selectedCategory.subcategory.length > 0
              ? selectedCategory.subcategory[0]._id
              : ''
          )
        }
      }
    }
  }, [categoryId, categories, subcategory])
  const [loader, setLoader] = useState(true)
  const getCookies = getCookie('qadamVendorSession')
  const [parsedCookies, setParsedCookies] = useState(null)
  const { session } = useSession()


  useEffect(() => {
    setLoader(true)
    try {
      getProfileData()
    } catch (error) {
      console.error('Error parsing JSON:', error)
    } finally {
      setLoader(false)
    }

    // }
  }, [])

  const [earningDetails, setEarningDetails] = useState({
    currentEarning: '',
    totalEarning: '',
    arrears: '',
    totalDeliveredOrders: '',
    totalReturnedOrders: '',
  })
  const getProfileData = async () => {
    setLoader(true)
    // console.log({ 'earningData: earningData': 's' })

    try {
      const response = await getProfile()
      const earningData = response.data.data
      // console.log({ earningData: earningData })
      setEarningDetails({
        currentEarning: earningData?.currentEarning,
        totalEarning: earningData?.totalEarning,
        arrears: earningData?.arrears,
        totalDeliveredOrders: earningData?.totalDeliveredOrders,
        totalReturnedOrders: earningData?.totalReturnedOrders,
      })
    } catch (error) {
      console.log('Error fetching Earnings:', error)
    } finally {
      setLoader(false)
    }
  }

  console.log({ earningDetailsearningDetailsearningDetails: earningDetails })

  return (
    <AppPage
      crumbs={[
        {
          label: 'Home',
          path: '/home',
          isLastChild: false,
        },
        {
          label: 'Profile',
          path: '',
          isLastChild: true,
        },
      ]}
    >
      {loader ? (
        <Loader />
      ) : (
        <div className="mt-20 mb-4 border-b overflow-x-auto">
          <ul
            className="overflow-x-auto flex flex-nowrap text-sm font-medium text-center whitespace-nowrap mb-1"
            id="default-styled-tab"
            role="tablist"
          >
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabClick('personal-details')}
                type="button"
                role="tab"
                aria-controls="styled-tab-1"
                aria-selected={activeTab === 'personal-details'}
                className={`font-[600] text-lg sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg inline-block p-4 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-4 rounded-t-lg ${
                  activeTab === 'personal-details'
                    ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600'
                    : 'hover:text-accent-orange-500'
                }`}
              >
                Personal Details
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabClick('bank-account')}
                type="button"
                role="tab"
                aria-controls="styled-tab-2"
                aria-selected={activeTab === 'bank-account'}
                className={`font-[600] text-lg sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg inline-block p-4 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-4 rounded-t-lg ${
                  activeTab === 'bank-account'
                    ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600'
                    : 'hover:text-accent-orange-500'
                }`}
              >
                Bank Account
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabClick('account-statment')}
                type="button"
                role="tab"
                aria-controls="styled-tab-3"
                aria-selected={activeTab === 'account-statment'}
                className={`font-[600] text-lg sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg inline-block p-4 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-4 rounded-t-lg ${
                  activeTab === 'account-statment'
                    ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600'
                    : 'hover:text-accent-orange-500'
                }`}
              >
                Account Statement
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabClick('order-overview')}
                type="button"
                role="tab"
                aria-controls="styled-tab-4"
                aria-selected={activeTab === 'order-overview'}
                className={`font-[600] text-lg sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg inline-block p-4 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-4 rounded-t-lg ${
                  activeTab === 'order-overview'
                    ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600'
                    : 'hover:text-accent-orange-500'
                }`}
              >
                Order Overview
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabClick('earning')}
                type="button"
                role="tab"
                aria-controls="styled-tab-5"
                aria-selected={activeTab === 'earning'}
                className={`font-[600] text-lg sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg inline-block p-4 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-4 rounded-t-lg ${
                  activeTab === 'earning'
                    ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600'
                    : 'hover:text-accent-orange-500'
                }`}
              >
                Earning
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabClick('ledger')}
                type="button"
                role="tab"
                aria-controls="styled-tab-5"
                aria-selected={activeTab === 'ledger'}
                className={`font-[600] text-lg sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-lg inline-block p-4 sm:p-2 md:p-3 lg:p-4 xl:p-4 2xl:p-4 rounded-t-lg ${
                  activeTab === 'ledger'
                    ? 'text-[#ffffff] bg-accent-orange-500 hover:bg-accent-orange-600'
                    : 'hover:text-accent-orange-500'
                }`}
              >
                Ledger
              </button>
            </li>
          </ul>

          <div id="default-styled-tab-content mt-1">
            <div
              id="styled-tab-1"
              role="tabpanel"
              className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'personal-details' ? '' : 'hidden'}`}
            >
              <PersonalDetails />
            </div>
            <div
              id="styled-tab-2"
              role="tabpanel"
              className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'bank-account' ? '' : 'hidden'}`}
            >
              <BankAccount />
            </div>
            <div
              id="styled-tab-3"
              role="tabpanel"
              className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'account-statment' ? '' : 'hidden'}`}
            >
              <AccountStatement />
            </div>
            <div
              id="styled-tab-4"
              role="tabpanel"
              className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'order-overview' ? '' : 'hidden'}`}
            >
              <OrderOverview />
            </div>
            <div
              id="styled-tab-5"
              role="tabpanel"
              className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'earning' ? '' : 'hidden'}`}
            >
              <Earnings earningDetails={earningDetails} />
            </div>

            <div
              id="styled-tab-5"
              role="tabpanel"
              className={`p-4 rounded-lg bg-gray-50 ${activeTab === 'ledger' ? '' : 'hidden'}`}
            >
              <Ledger />
            </div>
          </div>
        </div>
      )}
    </AppPage>
  )
}

export default Profile