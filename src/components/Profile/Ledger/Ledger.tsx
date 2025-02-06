import React, { useEffect, useState, useRef } from 'react'
import { AppPage } from '../../layout/AppPage'
import { getAllOrdersApi } from '../../../utils/services'
import { getAllPaymentrLedgerApi } from '../../../utils/services'
import { useSession } from '../../../lib/hooks/auth/useSessionContext'
import { Constants } from '../../../utils/Constants'
import { useRouter } from 'next/router'
import OrderTable from '../../OrderOverview/OrdersTable'
import { getCookie } from 'cookies-next'
import Loader from '../../loader/Loader'
import LedgerTable from '../../Ledger/LedgerTable'

function Ledger() {
  const router = useRouter()
  const [ordersData, setOrdersData] = useState([])
  const [ledgerData, setLedgerData] = useState([])
  console.log('ledgerDataledgerDataledgerData', ledgerData)

  const [page, setPage] = useState(1)
  const [loader, setLoader] = useState(false)
  const getCookies = getCookie('qadamSession')
  const [paginationInfo, setPaginationInfo] = useState(null)
  const [ledgerInfo, setLedgerInfo] = useState(null)

  const [parsedCookies, setParsedCookies] = useState(null)
  const [orderStatus, setOrderStatus] = useState('')

  const { session } = useSession()

  useEffect(() => {
    // if (session) {
    getAllOrders(page)
    getAllPaymentLedger(page)
    // }
  }, [page])

  const getAllOrders = async (page) => {
    setLoader(true)
    let parsedCookies
    // if (getCookies) {
    // try {
    //   // parsedCookies = JSON.parse(getCookies)
    //   // setParsedCookies()
    // } catch (error) {
    //   console.error('Error parsing JSON:', error)
    // }
    // } else {
    //   console.error('getCookies is undefined or null')
    //   router.push("/login")
    //   return
    // }
    const data = {
      page,
      itemPerPage: Constants.general.ordersPerPage,
      orderStatus,
    }
    try {
      const response = await getAllOrdersApi({ page, status: '' })
      if (response.data.data) {
        setOrdersData(response.data.data)
        setPaginationInfo(response.data.pagination)
      }
    } catch (error) {
      console.log('Error fetching orders:', error)
    } finally {
      setLoader(false)
    }
  }

  const getAllPaymentLedger = async (page) => {
    setLoader(true)
    let parsedCookies
    // if (getCookies) {
    // try {
    //   // parsedCookies = JSON.parse(getCookies)
    //   // setParsedCookies()
    // } catch (error) {
    //   console.error('Error parsing JSON:', error)
    // }
    // } else {
    //   console.error('getCookies is undefined or null')
    //   router.push("/login")
    //   return
    // }
    const data = {
      page,
      itemPerPage: Constants.general.ordersPerPage,
      //   orderStatus,
    }
    try {
      const response = await getAllPaymentrLedgerApi(page)
      if (response?.data?.data) {
        setLedgerData(response?.data?.data)
        setLedgerInfo(response?.data?.pagination)
      }
    } catch (error) {
      console.log('Error fetching orders:', error)
    } finally {
      setLoader(false)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4">
        {!loader ? (
          <div className="my-5">
            {paginationInfo && ordersData && (
              <LedgerTable
                ordersData={ledgerData}
                pagination={ledgerInfo}
                parsedCookies={parsedCookies}
              />
            )}
          </div>
        ) : (
          <Loader />
        )}
        {!loader && paginationInfo && ordersData.length > 0 && (
          <div className="footer-pagination text-center my-24 bottom-0 flex justify-center">
            <div className="flex space-x-2">
              {paginationInfo.hasPrevious && (
                <button
                  onClick={() => setPage(page - 1)}
                  type="button"
                  className="text-white bg-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Previous
                </button>
              )}
              <button
                type="button"
                className="pointer-events-none text-black bg-transparent border border-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                {page}
              </button>
              {paginationInfo.hasNext && (
                <button
                  onClick={() => setPage(page + 1)}
                  type="button"
                  className="text-white bg-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Ledger
