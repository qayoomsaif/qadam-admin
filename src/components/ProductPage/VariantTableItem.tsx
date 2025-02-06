import { useEffect, useState } from 'react'
import { addProductOffer, deleteProductOffer } from '../../utils/services'
import { setOfferPram } from './interface'
import { useQueryClient } from '@tanstack/react-query'
const VariantTableItem = ({ offer, index, productId, variantId }) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    setNewOffer(offer)
  }, [offer])
  const [newOffer, setNewOffer] = useState<setOfferPram>({})
  const handlevendorPriceChange = (value) => {
    let regex = /^[0-9]+$/
    setNewOffer({
      ...newOffer,
      vendorPrice: (value && regex.test(value)) || !value ? value : newOffer.quantity,
    })
  }
  const handleStatusChange = (value) => {
    if (newOffer?.offerId && value == 'active') {
      handleDelete(newOffer?.offerId)
    } else if (newOffer?.offerId) {
      handleSave()
    }
    if (newOffer?.offerId) {
      setNewOffer({
        ...newOffer,
        status: value == 'active' ? 'inactive' : 'active',
      })
    }
  }
  const handleQuantityChange = (value) => {
    let regex = /^[0-9]+$/

    setNewOffer({
      ...newOffer,
      quantity:
        (value && regex.test(value)) || !value ? value : newOffer.quantity,
    })
  }
  const handleSave = async () => {
    let payload = {
      productId: productId,
      productVariantId: variantId,
      vendorPrice: Number(newOffer?.vendorPrice),
      quantity: Number(newOffer.quantity),
    }
    try {
      console.log(payload)
      let response = await addProductOffer(payload)
      queryClient.invalidateQueries({
        queryKey: ['GET_PRODUCT_DATA', productId],
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  const handleDelete = async (offerId) => {
    let payload = {
      productId: productId,
      productVariantId: variantId,
      vendorPrice: Number(newOffer?.vendorPrice),
      quantity: Number(newOffer.quantity),
    }
    try {
      console.log(payload)
      let response = await deleteProductOffer(offerId)
      queryClient.invalidateQueries({
        queryKey: ['GET_PRODUCT_DATA', productId],
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <tr key={index} className="items-center text-center justify-center">
      {newOffer?.options?.map((res) => (
        <td className="py-2 px-4 border-b capitalize tracking-wider">{res}</td>
      ))}
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className="border rounded py-1 px-2 w-full"
          value={newOffer.vendorPrice ? newOffer.vendorPrice : ''}
          onChange={(e) => handlevendorPriceChange(e.target.value)}
        />
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className="border rounded py-1 px-2 w-full"
          value={newOffer.quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
        />
      </td>
      <td className="py-2 px-4 border-b">
        <div
          onClick={() => handleStatusChange(newOffer.status)}
          className={`${
            newOffer.status == 'active' ? 'bg-primary-blue-600' : 'bg-gray-300'
          } w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
              newOffer.status == 'active' ? 'translate-x-7' : 'translate-x-0'
            } transition-transform duration-300`}
          />
        </div>
      </td>
      <td className="py-2 px-4 border-b items-center  justify-center">
        <button
          onClick={handleSave}
          className="px-4 w-full py-1 bg-primary-blue-600 text-white rounded-lg"
        >
          {newOffer?.productVariantId ? 'Update' : 'Save'}
        </button>
      </td>
    </tr>
  )
}

export default VariantTableItem
