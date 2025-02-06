import React, { useState, useEffect } from 'react'

function OrderTableStatus({ onUpdate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 799)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 799)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleClick = (data) => {
    setSelectedStatus(data)
    onUpdate(data)
  }

  const orderStatuses = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Ready to Ship', value: 'ready_to_ship' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Delivery Failed', value: 'delivery_failed' },
    { label: 'Returned', value: 'returned' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Ready for Return', value: 'ready_for_return' },
  ]

  return (
    <>
      {isMobile ? (
        <select
          value={selectedStatus}
          onChange={(e) => handleClick(e.target.value)}
          className="block w-full py-2 px-4 border border-[#001662] rounded-lg text-[#001662] cursor-pointer hover:bg-[#182556] hover:text-white"
        >
          {orderStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      ) : (
        <ul className="flex gap-5 flex-wrap">
          {orderStatuses.map((status) => (
            <li key={status.value} onClick={() => handleClick(status.value)}>
              <input
                type="radio"
                id={status.value}
                name="orderStatus"
                value={status.value}
                defaultChecked={status.value === ''}
                className="hidden peer"
                required
              />
              <label
                htmlFor={status.value}
                className="w-auto block items-center justify-between rounded-full py-2 px-4 peer-checked:bg-[#001662] text-[#001662] border border-[#001662] cursor-pointer peer-checked:border-blue-600 peer-checked:text-white hover:bg-[#182556] hover:text-white"
              >
                <div className="block">
                  <div className="w-full text-md font-semibold">
                    {status.label}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default OrderTableStatus