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
  background,
} from '@chakra-ui/react'
import { getSingleOrderApi } from '../../utils/services'
import { Constants } from '../../utils/Constants'
import { toTitleCase } from '../../utils/HelperService'

interface OrderTableProps {
  ordersData: Order[]
  pagination: any
}

const OrderTable = ({ ordersData, pagination, parsedCookies }) => {
  const router = useRouter()

  if (ordersData && pagination) {
    console.log('ordersData OrderTable: ', ordersData)
    console.log('pagination OrderTable: ', pagination)
  }
  const columns = [
    {
      name: 'Sr. No',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px', // Adjust the width as needed
    },
    {
      name: 'Order Id',
      selector: (ordersData) => ordersData.orderId,
      sortable: true,
    },
    {
      name: 'Items Quantity',
      selector: (ordersData) => ordersData.orderDetails.length,
      sortable: true,
    },
    {
      name: 'Total Amount',
      selector: (ordersData) => `Rs. ${ordersData.price.itemsPrice}`,
      sortable: true,
      className: 'random',
    },
    {
      name: 'Order Date',
      selector: (ordersData) => {
        const date = new Date(ordersData.createdAt)
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        }).format(date)
      },
      sortable: true,

      style: {
        color: 'black !important',
        justifyContent: 'start !important',
        // width: '50px',
        // maxWidth: '50px',
      },
    },
    // {
    //   name: 'Cost of goods',
    //   selector: (ordersData) => `Rs. ${ordersData.price.itemsPrice}`,
    //   sortable: true,
    // },
    // {
    //   name: 'Delivery Charges',
    //   selector: (ordersData) => `Rs. ${ordersData.price.deliveryPrice}`,
    //   sortable: true,
    // },
    // {
    //   name: 'Profit',
    //   selector: (ordersData) => `Rs. ${ordersData.price.totalProfit}`,
    //   sortable: true,
    // },
    {
      name: 'Order Status',
      selector: (ordersData) => toTitleCase(ordersData.orderStatus),
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
    {
      name: 'Payout Status',
      selector: (ordersData) =>
        ordersData.paymentStatus === 'failed'
          ? toTitleCase(ordersData.paymentStatus)
          : ordersData.paymentStatus === 'paid' || ordersData.paymentStatus === 'deducted'
            ? "Paid"
            : 'Pending',

      conditionalCellStyles: [
        {
          when: (ordersData) => ordersData.paymentStatus === 'pending',
          style: {
            // background: '#FFB800',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
        {
          when: (ordersData) => ordersData.paymentStatus === 'cancelled',
          style: {
            // 'font-color': '',
            // background: '#f94e4e',
            // width: '50px',
            // maxWidth: '50px',
          },
        },
      ],
      style: {
        marginLeft: '10px',
      },
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
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.orderDetails.map((detail, index) => (
              <tr
                onClick={() => router.push(`/product/${detail.product._id}`)}
                key={index}
                className={`cursor-pointer ${index % 2 === 0 ? 'even:bg-gray-50 even:dark:bg-gray-800' : 'odd:bg-white odd:dark:bg-gray-900'} dark:border-gray-700`}
              >
                <td className="px-6 py-4 font-medium text-primary-blue-600 whitespace-nowrap">
                  {detail.product._id}
                </td>
                <td className="text-primary-blue-600 px-6 py-4 truncate w-1/4">
                  {detail.product.name}
                </td>
                <td className="text-primary-blue-600 px-6 py-4">
                  {detail.quantity}
                </td>
                <td className="text-primary-blue-600 px-6 py-4">
                  {detail.perUnitPrice * detail.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  const customStyles = {
    headCells: {
      style: {
        minWidth: 'auto !important',
      },
    },
  }

  return (
    <DataTable
      striped={true}
      highlightOnHover={true}
      noDataComponent="No Records to Display"
      columns={columns}
      data={ordersData}
      expandableRows
      expandableRowsComponent={ExpandedComponent}
      customStyles={customStyles}
    />
  )
}
export default OrderTable
