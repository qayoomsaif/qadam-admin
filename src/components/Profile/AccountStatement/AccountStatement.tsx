import React, { useEffect, useState } from 'react'
import { getAllOrdersApi, getPayouts } from '../../../utils/services'
import { useSession } from '../../../lib/hooks/auth/useSessionContext'
import { Constants } from '../../../utils/Constants'
import { useRouter } from 'next/router'
import Loader from '../../loader/Loader'
import { getCookie } from 'cookies-next'
import { Badge } from '@chakra-ui/react'
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons'

function AccountStatement() {
  const router = useRouter()
  const [ordersData, setOrdersData] = useState([])
  const [page, setPage] = useState(1)
  const [loader, setLoader] = useState(false)
  const getCookies = getCookie('qadamSession')
  const [paginationInfo, setPaginationInfo] = useState(null)
  const [parsedCookies, setParsedCookies] = useState(null)
  const initialStartDate = new Date('2023-01-23')
  const [holidayStartDate, setHolidayStartDate] = useState(initialStartDate)
  const [dateRanges, setDateRanges] = useState([])
  const [orderStatus, setOrderStatus] = useState('')
  const [formattedData, setFormattedData] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedDetails, setSelectedDetails] = useState(null)

  // console.log('selectedDetailsselectedDetails', selectedDetails)
  const { session } = useSession()

  useEffect(() => {
    getAllOrders()
    getAllPayouts()
  }, [page, orderStatus])

  useEffect(() => {
    const today = new Date()
    const numberOfWeeks = getNumberOfWeeks(holidayStartDate, today)
    setDateRanges(generateWeeklyRanges(holidayStartDate, numberOfWeeks))
  }, [holidayStartDate])

  useEffect(() => {
    if (formattedData.length > 0) {
      const firstRange = formattedData[0]._id
      setSelectedId(firstRange)
      handleSelectChange({ target: { value: firstRange } })
    }
  }, [formattedData])

  const getAllOrders = async () => {
    // setLoader(true)
    // let parsedCookies
    // if (getCookies) {
    //   try {
    //     parsedCookies = JSON.parse(getCookies)
    //     setParsedCookies(parsedCookies)
    //   } catch (error) {
    //     console.error('Error parsing JSON:', error)
    //   }
    // } else {
    //   console.error('getCookies is undefined or null')
    //   router.push('/login')
    //   return
    // }

    const data = {
      page,
      status: orderStatus,
    }
    try {
      const response = await getAllOrdersApi(data)
      if (response.status === Constants.statuses.success) {
        setOrdersData(response.data.data.data)
        setPaginationInfo(response.data.data.pagination)
      }
    } catch (error) {
      console.log('Error fetching orders:', error)
    } finally {
      setLoader(false)
    }
  }

  const getAllPayouts = async () => {
    setLoader(true)
    try {
      const response = await getPayouts()
      const formatDate = (dateString) => {
        return new Date(dateString).toDateString()
      }
      const formatted = response?.data?.data.map((item) => ({
        _id: item._id,
        formattedRange: `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
        totalEarnings: item.totalEarnings,
        totalDeductions: item.totalDeductions,
        arrears: item.arrears,
        netAmount: item.netAmount,
        status: item.status,
        endDate: item.endDate,
      }))
      setFormattedData(formatted)
    } catch (error) {
      console.log('Error fetching payouts:', error)
    } finally {
      setLoader(false)
    }
  }

  const handleSelectChange = (event) => {
    const selectedId = event.target.value
    setSelectedId(selectedId)
    console.log({ selectedId, formattedData })

    const selectedItem = formattedData.find((item) => item._id === selectedId)
    setSelectedDetails(selectedItem)
  }

  const calculateExpectedPayoutDate = (endDate) => {
    const start = new Date(endDate)
    start.setDate(start.getDate() + 5)
    const end = new Date(start)
    end.setDate(end.getDate() + 2)
    // const options = { month: 'short', day: 'numeric', year: 'numeric' }
    const options: Intl.DateTimeFormatOptions = {
      month: 'long', // 'long' | 'short' | 'narrow' | 'numeric' | '2-digit'
      day: 'numeric', // 'numeric' | '2-digit'
      year: 'numeric', // 'numeric' | '2-digit'
    }

    return `${start.toLocaleDateString('en-US', options)} to ${end.toLocaleDateString('en-US', options)}`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'fail':
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
      case 'paid':
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

  return (
    <div>
      <div className="relative my-4 w-full sm:w-4/5 z-0">
        <label
          htmlFor="endDate"
          className="font-semibold absolute ml-2 px-1 z-10 bg-white block top-[-0.8rem]"
        >
          Select Time Period
        </label>
        <select
          value={selectedId || ''}
          onChange={handleSelectChange}
          className="border-2 rounded-lg border-primary-blue-600 px-2 py-1 text-lg w-full"
        >
          {formattedData.map((range) => (
            <option key={range._id} value={range._id}>
              {range.formattedRange}
            </option>
          ))}
        </select>
      </div>
      {!loader ? (
        selectedDetails && (
          <div className="my-5">
            <div className="bg-gray-100 p-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h1 className="text-xl font-bold">Receipt</h1>
                <p className="text-gray-600">
                  {getStatusBadge(selectedDetails.status)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="my-2">
                  <p className="text-gray-700">Total payout</p>
                  <p className="text-lg font-bold">
                    PKR {selectedDetails.netAmount}
                  </p>
                </div>
                <div className="my-2">
                  <p className="text-gray-700">Total Delivered Earning</p>
                  <p className="text-lg font-bold">
                    PKR {selectedDetails.totalEarnings}
                  </p>
                </div>
                <div className="my-2">
                  <p className="text-gray-700">Total Returned Charges</p>
                  <p className="text-lg font-bold">
                    PKR {selectedDetails.totalDeductions}
                  </p>
                </div>
                <div className="my-2">
                  <p className="text-gray-700">
                    Outstanding amount from previous statement
                  </p>
                  <p className="text-lg font-bold">
                    PKR {selectedDetails.arrears}
                  </p>
                </div>
                <div className="my-2">
                  <p className="text-gray-700">Expected Payout Date</p>
                  <p className="text-lg font-bold">
                    {calculateExpectedPayoutDate(selectedDetails.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default AccountStatement

const getNumberOfWeeks = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffInTime = end.getTime() - start.getTime()
  const diffInDays = diffInTime / (1000 * 3600 * 24)
  return Math.ceil(diffInDays / 7)
}

const generateWeeklyRanges = (startDate, numberOfWeeks) => {
  const ranges = []
  let currentStartDate = new Date(startDate)

  for (let i = 0; i < numberOfWeeks; i++) {
    const endDate = new Date(currentStartDate)
    endDate.setDate(currentStartDate.getDate() + 6)

    if (endDate > new Date()) {
      break
    }

    ranges.push({
      start: new Date(currentStartDate),
      end: endDate,
    })

    // Move to the next week
    currentStartDate.setDate(currentStartDate.getDate() + 7)
  }

  return ranges
}
