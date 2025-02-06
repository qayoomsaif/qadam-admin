import React from 'react'

function Earnings({earningDetails}) {
  return (
   <>
   <div class="bg-gray-100 p-4">
  <div class="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-gray-200">
    <h1 class="text-xl font-bold">Sales Summary</h1>
  </div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="my-2">
      <p class="text-gray-700">Current Earning</p>
      <p class="text-lg font-bold">{earningDetails?.currentEarning}</p>
    </div>
    <div class="my-2">
      <p class="text-gray-700">Outstanding amount from previous statement</p>
      <p class="text-lg font-bold">{earningDetails?.arrears}</p>
    </div>
    <div class="my-2">
      <p class="text-gray-700">Total Earning</p>
      <p class="text-lg font-bold">{earningDetails?.totalEarning}</p>
    </div>
    <div class="my-2">
      <p class="text-gray-700">Total Delivered Orders</p>
      <p class="text-lg font-bold">{earningDetails?.totalDeliveredOrders}</p>
    </div>
    <div class="my-2">
      <p class="text-gray-700">Total Returned Orders</p>
      <p class="text-lg font-bold">{earningDetails?.totalReturnedOrders}</p>
    </div>
  </div>
</div>
   </>
  )
}

export default Earnings