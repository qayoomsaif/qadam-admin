import { Fragment, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useRouter } from 'next/router'

const LedgerTable = ({ ordersData, pagination, parsedCookies }) => {
  const router = useRouter()

  const columns = [
    {
      name: 'Sr. No',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px', // Adjust the width as needed
    },
    {
      name: 'Id',
      selector: (ordersData) => ordersData.id,
      sortable: true,
    },
    {
      name: 'Doc Type',
      selector: (ordersData) => ordersData.documentType,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (ordersData) => ordersData.date,
      sortable: true,
      className: 'random',
    },
    {
      name: 'Credit',
      selector: (ordersData) => ordersData.credit,
      sortable: true,
      className: 'random',
    },
    {
      name: 'Debit',
      selector: (ordersData) => ordersData.debit,
      sortable: true,
      className: 'random',
    },
    {
      name: 'Balance',
      selector: (ordersData) => ordersData.balance,
      sortable: true,
      className: 'random',
    },
  ]

  const ExpandedComponent = ({ data }) => {
    return (
      <div className="relative overflow-x-auto sm:rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {data.orders.length > 0 ? (
            data.orders.map((detail, subIndex) => (
              <div
                key={subIndex}
                className="cursor-pointer text-primary-blue-600 font-medium whitespace-nowrap py-2 px-4 bg-white"
              >
                {detail.orderId}
              </div>
            ))
          ) : (
            <div className="col-span-10 text-center text-red-500 font-medium py-2 px-4">
              No orders found
            </div>
          )}
        </div>
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

export default LedgerTable
