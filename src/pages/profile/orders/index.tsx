import React, { useEffect, useState, useRef } from 'react'
import { AppPage } from '../../../components/layout/AppPage'
import ViewportBlock from '../../../components/ViewportBlock/ViewportBlock'
import { getAllOrdersApi } from '../../../utils/services'
import { useSession } from '../../../lib/hooks/auth/useSessionContext'
import { Constants } from '../../../utils/Constants'
import { useRouter } from 'next/router'
import OrderTable from '../../../components/OrdersTable/OrdersTable'
import OrderTableStatus from '../../../components/OrdersTable/OrderTableStatus/OrderTableStatus'
import { getCookie } from 'cookies-next'
import Loader from '../../../components/loader/Loader'

function Orders() {
  const router = useRouter()
  // const wrapperRef = useRef(null);
  const [ordersData, setOrdersData] = useState([])
  const [page, setPage] = useState(1)
  const [loader, setLoader] = useState(false)
  const getCookies = getCookie('qadamSession')
  const [paginationInfo, setPaginationInfo] = useState(null)
  const [parsedCookies, setParsedCookies] = useState(null)
  const [orderStatus, setOrderStatus] = useState('')

  const { session } = useSession()

  useEffect(() => {
    if (session) {
      getAllOrders()
    }
  }, [page, orderStatus])

  const getAllOrders = async () => {
    setLoader(true)
    let parsedCookies;
    if (getCookies) {
      try {
        parsedCookies = JSON.parse(getCookies)
        setParsedCookies(parsedCookies);
        // Proceed with further processing using parsedCookies
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    } else {
      console.error('getCookies is undefined or null')
      router.push("/login")
      return
    }
    // const parsedCookies = JSON.parse(getCookies)
    // console.log('🚀 ~ getAllOrders ~ parsedCookies:', parsedCookies)
    const data = {
      page,
      status:orderStatus,
    }
    try {
      const response = await getAllOrdersApi(data)
      console.log('🚀 ~ getAllOrders ~ response:', response)
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

  const handleDataChange = (orderStatus: string) => {
    setOrderStatus(orderStatus);
    setPage(1);
  }

  return (
    <>
      <div >
        {/* {loader && <Loader />} */}
          <AppPage
            crumbs={[
              {
                label: 'Home',
                path: '/home',
                isLastChild: false,
              },
              {
                label: 'Profile',
                path: '/profile',
                isLastChild: false,
              },
              {
                label: 'Orders',
                path: '',
                isLastChild: true,
              },
            ]}
          >
            <div>
              <OrderTableStatus onUpdate={handleDataChange} />
            </div>
            {!loader ?
            <div className="my-5">
              {paginationInfo && ordersData && (
                <OrderTable
                  ordersData={ordersData}
                  pagination={paginationInfo}
                  refetchData={null}
                  // parsedCookies={parsedCookies}
                />)}
            </div>
            :
            <Loader />
            }
            {!loader && paginationInfo && ordersData.length > 0 && (
              <div className={`footer-pagination text-center my-24  bottom-0 ${paginationInfo.hasPrevious ? "left-[45%]" : "left-[50%]"}`}>
                <div className="">
                  {paginationInfo.hasPrevious && (
                    <button
                      onClick={() => setPage(page - 1)}
                      type="button"
                      className="text-white bg-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                    >
                      Previous
                    </button>
                  )}

                  <button
                    type="button"
                    className="pointer-events-none text-black bg-transparent border border-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                  >
                    {page}
                  </button>
                  {paginationInfo.hasNext && (
                    <button
                      onClick={() => setPage(page + 1)}
                      type="button"
                      className="text-white bg-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                    >
                      Next
                    </button>
                  )}
                  {/* <button onClick={() => setPage(page + 1)}> Next</button> */}
                </div>
              </div>)
            }
          </AppPage>
      </div>
    </>
  )
}

export default Orders
