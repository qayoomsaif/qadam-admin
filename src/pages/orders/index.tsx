import React, { useEffect, useState, useRef } from 'react'
import { AppPage } from '../../components/layout/AppPage'
import { getAllOrdersApi } from '../../utils/services'
import { useSession } from '../../lib/hooks/auth/useSessionContext'
import { Constants } from '../../utils/Constants'
import { useRouter } from 'next/router'
import OrderTable from '../../components/OrdersTable/OrdersTable'
import OrderTableStatus from '../../components/OrdersTable/OrderTableStatus/OrderTableStatus'
import Loader from '../../components/loader/Loader'
import { useOrder } from '../../lib/hooks/orders/useOrder'

function Orders() {
  const router = useRouter()
  const [ordersData, setOrdersData] = useState([])
  const [page, setPage] = useState(1)
  const [payload, setPayload] = useState({
    page: 1,
    status: '',
  })

  const [loader, setLoader] = useState(false)
  const [paginationInfo, setPaginationInfo] = useState(null)
  const [orderStatus, setOrderStatus] = useState('')
  const { data, isError, isLoading, isSuccess, error, refetch, isFetching } =
    useOrder(payload)

  const { session } = useSession()

  // useEffect(() => {
  //   refetch()
  // }, [payload])
  useEffect(() => {
    if (data?.data?.data) {
      setOrdersData(data.data.data)
      setPaginationInfo(data.data.pagination)
    }
    // if (session) {
    // getAllOrders()
    // }
  }, [data])

  // const getAllOrders = async () => {
  //   setLoader(true)
  //   const data = {
  //     page,
  //     itemPerPage: Constants.general.ordersPerPage,
  //     orderStatus,
  //   }
  //   try {
  //     const response = await getAllOrdersApi(data)
  //     console.log('🚀 ~ getAllOrders ~ response:', response)
  //     if (response.status === Constants.statuses.success) {
  //       setOrdersData(response.data.data.data)
  //       setPaginationInfo(response.data.data.pagination)
  //     }
  //   } catch (error) {
  //     console.log('Error fetching orders:', error)
  //   } finally {
  //     setLoader(false)
  //   }
  // }

  const handleDataChange = (orderStatus: string) => {
    // setOrderStatus(orderStatus)
    // setPage(1)
    setPayload({ page: 1, status: orderStatus })
  }

  return (
    <>
      <div>
        <AppPage>
          <div>
            <OrderTableStatus onUpdate={handleDataChange} />
          </div>
          {!loader ? (
            <div className="my-5">
              {paginationInfo && ordersData && (
                <OrderTable
                  ordersData={[...ordersData]}
                  pagination={paginationInfo}
                  refetchData={refetch}
                />
              )}
              {!loader && paginationInfo && ordersData.length > 0 && (
                <div
                  className={`footer-pagination text-center my-24 bottom-0 ${paginationInfo.hasPrevious ? 'left-[45%]' : 'left-[50%]'}`}
                >
                  <div className="">
                    {paginationInfo.hasPrevious && (
                      <button
                        onClick={() =>
                          setPayload(({ page, status }) => {
                            return { page: page - 1, status }
                          })
                        }
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
                      {payload.page}
                    </button>
                    {paginationInfo.hasNext && (
                      <button
                        onClick={() =>
                          setPayload(({ page, status }) => {
                            return { page: page + 1, status }
                          })
                        }
                        type="button"
                        className="text-white bg-[#001662] shadow-lg shadow-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-ful my-[10rem] h-full flex justify-center items-center">
              <Loader />
            </div>
          )}
        </AppPage>
      </div>
    </>
  )
}

export default Orders
