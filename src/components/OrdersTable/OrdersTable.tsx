// import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, ChakraProvider, Code, extendTheme,
//   Heading, IconButton, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import { Fragment, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Order, Pagination } from './interface'
import { useRouter } from 'next/router'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import {
  acceptOrder,
  cancelOrder,
  getSingleOrderApi,
} from '../../utils/services'
import moment from 'moment'

import { Constants } from '../../utils/Constants'
import Image from 'next/image'
import AcceptIcon from '../../assets/accept.svg'
import PrintIcon from '../../assets/print.svg'
import CancelIcon from '../../assets/cancel.svg'
import { toTitleCase } from '../../utils/HelperService'
interface TableColumn<T> {
  name: string
  selector: (data: T, index: number) => any
  sortable?: boolean
  width?: string
  conditionalCellStyles?: any // Adjust based on your actual type
}

interface OrderTableProps {
  ordersData?: Order[]
  pagination?: any
  refetchData?: any
}

const OrderTable = ({ ordersData, pagination, refetchData }) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rowData, setRowData] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (ordersData && pagination) {
    console.log('ordersData OrderTable: ', ordersData)
    console.log('pagination OrderTable: ', pagination)
  }

  const handleRowClick = async (row) => {
    const data = row._id
    try {
      const response = await getSingleOrderApi(data)
      // console.log('🚀 ~ getAllOrders ~ response:', response)
      // if (response.status === Constants.statuses.success) {
      setRowData(row)
      setIsModalOpen(true)
      // }
    } catch (error) {
      console.log('Error fetching orders:', error)
      setIsModalOpen(false)
    } finally {
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  const orderAccept = async (ordersData, setIsLoading) => {
    try {
      setIsLoading(true)
      let payload = {
        vendorId: ordersData?.vendorId,
        orderDetails: ordersData?.orderDetails?.map((res) => {
          let a = {
            productId: res.product._id,
            productVariantId: res.productVariant._id,
            productOfferId: res.productOfferId,
            quantity: res.quantity,
          }
          return a
        }),

        customerDetails: ordersData?.customerDetails,
      }
      let response = await acceptOrder(payload, ordersData?._id)
      refetchData()
      console.log({ response })
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }
  const orderLabelPrint = async (label: string) => {
    try {
      console.log({ labellabellabel: label })
      //   let payload = {
      //     vendorId: ordersData?.vendorId,
      //     orderDetails: ordersData?.orderDetails?.map((res) => {
      //       let a = {
      //         productId: res.product._id,
      //         productVariantId: res.productVariant._id,
      //         productOfferId: res.productOfferId,
      //         quantity: res.quantity,
      //       }
      //       return a
      //     }),
      //     customerDetails: ordersData?.customerDetails,
      //   }
      //   let response = await cancelOrder(payload, ordersData?._id)
      //   refetchData()
      // console.log({ response })
    } catch (error) {
      console.log({ error })
    }
  }
  const orderCancel = async (ordersData, setIsLoading) => {
    try {
      setIsLoading(true)
      let payload = {
        vendorId: ordersData?.vendorId,
        orderDetails: ordersData?.orderDetails?.map((res) => {
          let a = {
            productId: res.product._id,
            productVariantId: res.productVariant._id,
            productOfferId: res.productOfferId,
            quantity: res.quantity,
          }
          return a
        }),

        customerDetails: ordersData?.customerDetails,
      }
      let response = await cancelOrder(payload, ordersData?._id)
      refetchData()
      console.log({ response })
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }
  const columns: TableColumn<any>[] = [
    {
      name: 'Sr. No',
      selector: (ordersData, index) => index + 1,
      sortable: false,
      width: '70px', // Adjust the width as needed
    },
    {
      name: 'Order Id',
      selector: (ordersData) => ordersData.orderId,
      sortable: true,
    },
    {
      name: 'Created Date ',
      selector: (ordersData) =>
        ordersData?.createdAt
          ? moment(ordersData.createdAt).format('MMMM DD, YYYY')
          : '--',
      sortable: true,
    },
    {
      name: 'Number of Items',
      selector: (ordersData) => ordersData.orderDetails.length,
      sortable: true,
    },
    {
      name: 'Total Amount',
      selector: (ordersData) => `Rs. ${ordersData.price.customerPrice}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (ordersData) => toTitleCase(ordersData.orderStatus),
      conditionalCellStyles: [
        {
          when: (ordersData) => ordersData.orderStatus,
          style: {
            color: '#000',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
        {
          when: (ordersData) => ordersData.orderStatus == 'pending',
          style: {
            color: '#FFB800',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
        {
          when: (ordersData) => ordersData.orderStatus == 'cancelled',
          style: {
            color: '#f94e4e',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
        {
          when: (ordersData) => ordersData.orderStatus == 'accepted',
          style: {
            color: '#22c55e',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
      ],
    },
    {
      name: 'Actions',
      selector: (ordersData) => {
        const [isLoading, setIsLoading] = useState(false)

        return isLoading ? (
          <div className="loader border-4 border-t-4 border-gray-200 rounded-full w-6 h-6 border-t-blue-500 animate-spin"></div>
        ) : ordersData.orderStatus == 'pending' ? (
          <div className="flex">
            <div
              className="mr-3"
              onClick={() => {
                orderAccept(ordersData, setIsLoading)
              }}
            >
              <Image
                style={{ cursor: 'pointer' }}
                src={AcceptIcon}
                width={25}
                alt="logo"
              />
            </div>
            <div
              onClick={() => {
                orderCancel(ordersData, setIsLoading)
              }}
            >
              <Image
                style={{ cursor: 'pointer' }}
                src={CancelIcon}
                width={25}
                alt="logo"
              />
            </div>
          </div>
        ) : ordersData.orderStatus != 'pending' &&
          ordersData.orderStatus != 'cancelled' ? (
          <div
            className="items-center w-full"
            onClick={() => {
              ordersData?.tracking?.trackingUrl
                ? window.open(ordersData?.tracking?.trackingUrl)
                : null
              refetchData()
            }}
          >
            <Image
              style={{ cursor: 'pointer' }}
              src={PrintIcon}
              width={25}
              alt="Print"
            />
          </div>
        ) : ordersData.orderStatus == 'cancelled' ? null : null
      },
      conditionalCellStyles: [
        {
          when: (ordersData) => ordersData.orderStatus === 'pending',
          style: {
            // background: '#FFB800',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
        {
          when: (ordersData) => ordersData.orderStatus === 'cancelled',
          style: {
            // background: '#f94e4e',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
      ],
    },
  ]
  const ExpandedComponent = ({ data }) => {
    return (
      <div className="relative overflow-x-auto  sm:rounded-lg">
        <table className="w-full text-sm my-1 text-left rtl:text-right text-primary-blue-500 px-24">
          <thead className="text-xs text-gray-700 uppercase  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product Id
              </th>

              <th scope="col" className="px-6 py-3 w-11">
                Name
              </th>
              <th scope="col" className="px-6 py-3 w-11">
                Variant
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.orderDetails.map((detail, index) => {
              let variant = ''
              detail.productVariant?.variants.map((res) => {
                variant += `${variant ? ', ' : ''} ${res?.name}:  ${res?.value}`
              })
              return (
                <tr
                  // onClick={() => router.push(`/product/${detail.product._id}`)}
                  key={index}
                  className={`cursor-pointer ${index % 2 === 0 ? 'even:bg-gray-50 even:dark:bg-gray-800' : 'odd:bg-white odd:dark:bg-gray-900'} dark:border-gray-700`}
                >
                  <td className="px-6 py-4 font-medium text-primary-blue-600 whitespace-nowrap">
                    {detail.product._id}
                  </td>

                  <td className="text-primary-blue-600 px-6 py-4 truncate w-1/4">
                    {/* {detail.product.name} */}
                    {detail.product.name.length > 25
                      ? detail.product.name.substring(0, 25) + '...'
                      : detail.product.name}
                  </td>
                  <td className="text-primary-blue-600 px-6 py-4 truncate w-1/4">
                    {variant}
                  </td>

                  <td className="text-primary-blue-600 px-6 py-4">
                    {detail.quantity}
                  </td>
                  <td className="text-primary-blue-600 px-6 py-4">
                    {detail.perUnitPrice * detail.quantity}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
  // console.log({ rowData: rowData?.orderDetails[0]?.productVariant?.variants })

  return (
    <>
      <div id="orderDatatableWrapper" className="text-xlg">
        <DataTable
          striped={true}
          highlightOnHover={true}
          noDataComponent="No Records to Display"
          columns={columns}
          data={ordersData}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          onRowClicked={handleRowClick}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader className="border-b border-slate-800">
            {`${rowData && rowData.orderId ? rowData.orderId : ''} Order Details`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 ">
              <div className="customerDetails">
                <h4 className="text-primary-blue-500 font-semibold text-2xl">
                  Customer Details
                </h4>
                <hr />
                <div className="my-5">
                  <div>
                    <span className="font-semibold">Name: </span>
                    <span>
                      {rowData && rowData.customerDetails
                        ? rowData.customerDetails.name
                        : ''}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Phone: </span>
                    <span>
                      {rowData && rowData.customerDetails
                        ? rowData.customerDetails.phone
                        : ''}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Email: </span>
                    <span>
                      {rowData && rowData.customerDetails
                        ? rowData.customerDetails.email
                        : ''}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">City: </span>
                    <span>
                      {rowData && rowData.customerDetails
                        ? rowData.customerDetails.city
                        : ''}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Address Line 1: </span>
                    <span>
                      {rowData && rowData.customerDetails
                        ? rowData.customerDetails.addressLine1
                        : ''}
                    </span>
                  </div>
                  {rowData?.customerDetails?.addressLine2 ? (
                    <div>
                      <span className="font-semibold">Address Line 2: </span>
                      <span>
                        {rowData && rowData.customerDetails
                          ? rowData.customerDetails.addressLine2
                          : ''}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="sm:border-l sm:border-slate-800 ">
                <div className="VendorDetails">
                  <h4 className="text-primary-blue-500 font-semibold text-2xl sm:px-5">
                    Vendor Details
                  </h4>
                  <hr />
                  <div className="my-5">
                    <div className="sm:px-5">
                      <span className="font-semibold">Name: </span>
                      <span>
                        {rowData && rowData.vendor ? rowData.vendor.name : ''}
                      </span>
                    </div>
                    <div className="sm:px-5">
                      <span className="font-semibold">Email: </span>
                      <span>
                        {rowData && rowData.vendor ? rowData.vendor.email : ''}
                      </span>
                    </div>
                    <div className="sm:px-5">
                      <span className="font-semibold">Order Id: </span>
                      <span>{rowData && rowData._id ? rowData._id : ''}</span>
                    </div>
                    <div className="sm:px-5">
                      <span className="font-semibold">Order Status: </span>
                      <span
                        className={`text-lg capitalize ${
                          rowData && rowData.orderStatus === 'pending'
                            ? 'text-yellow-500'
                            : rowData && rowData.orderStatus === 'completed'
                              ? 'text-green-500'
                              : rowData && rowData.orderStatus === 'cancelled'
                                ? 'text-red-500'
                                : ''
                        }`}
                      >
                        {rowData && rowData.orderStatus
                          ? rowData.orderStatus
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 py-5">
              <h4 className="text-primary-blue-500 font-semibold text-2xl">
                Order Details
              </h4>
              <hr />
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-5">
                {rowData && rowData.orderDetails && (
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Variant
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Profit Per Unit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData.orderDetails.map((product, index) => {
                        let productVariant = ''
                        if (product.productVariant?.variants?.length) {
                          product.productVariant?.variants.forEach(
                            (element) => {
                              productVariant += productVariant
                                ? `,  ${element?.name}: ${element?.value}`
                                : `${element?.name}: ${element?.value}`
                            }
                          )
                        }

                        return (
                          <tr
                            key={index}
                            className={`cursor-default ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <td
                              className="px-6 py-4 truncate "
                              title={product.product.name}
                            >
                              {product.product.name.substring(0, 50)}...
                            </td>
                            <td className="px-6 py-4'bg-gray-50' capitalize">
                              {productVariant ? productVariant : '--'}
                            </td>
                            <td className="px-6 py-4 text-accent-orange-500">
                              Rs. {product.perUnitPrice}
                            </td>
                            <td className="px-6 py-4">{product.quantity}</td>
                            <td className="px-6 py-4 text-accent-orange-500">
                              Rs. {product.perUnitProfit}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="float-right">
                {rowData && rowData.price && (
                  <table className="w-56 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <tbody>
                      <tr className="bg-white">
                        <th className="px-2 py-1 text-xs text-gray-700 uppercase bg-gray-50 ">
                          Item Price
                        </th>
                        <td className="px-2 py-1 text-accent-orange-500">
                          Rs. {rowData.price.itemsPrice}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th className="px-2 py-1 text-xs text-gray-700 uppercase bg-gray-50 ">
                          Delivery Price
                        </th>
                        <td className="px-2 py-1 text-accent-orange-500">
                          Rs. {rowData.price.deliveryPrice}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th className="px-2 py-1 text-xs text-gray-700 uppercase bg-gray-50 ">
                          Total Profit
                        </th>
                        <td className="px-2 py-1 text-accent-orange-500">
                          Rs. {rowData.price.totalProfit}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th className="px-2 py-1 text-xs text-gray-700 uppercase bg-gray-50 ">
                          Order Price
                        </th>
                        <td className="px-2 py-1 text-accent-orange-500">
                          Rs. {rowData.price.customerPrice}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="border-2 border-primary-blue-600 rounded-lg py-2 px-4 gap-2"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default OrderTable
