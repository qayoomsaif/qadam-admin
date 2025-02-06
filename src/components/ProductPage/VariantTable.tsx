// components/CartonTable.js
import { setOfferPram } from './interface'
import VariantTableItem from './VariantTableItem'
const VariantTable = ({
  headingTable,
  variantOptions,
  variants,
  variantOffers,
  productId,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {headingTable.map((res) => (
              <th className="py-2 px-4 border-b capitalize">{res}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((item, index) => {
            let offer = variantOffers?.find(
              (res) => res?.productVariantId == item?._id
            )
            if (offer?.productVariantId) {
              let newObject: setOfferPram = {}
              newObject.offerId = offer?._id
              newObject.productVariantId = offer.productVariantId
              newObject.vendorPrice = offer?.vendorPrice
              newObject.status = offer?.status
              newObject.quantity = offer?.quantity?.verified
              newObject.options = variantOptions?.map(
                (res) => item.variant[res]
              )
              offer = newObject
            } else {
              let newObject: setOfferPram = {}
              newObject.vendorPrice = ''
              newObject.status = 'inactive'
              newObject.quantity = ''
              newObject.options = variantOptions?.map(
                (res) => item.variant[res]
              )
              offer = newObject
            }
            return (
              <VariantTableItem
                offer={offer}
                index={index}
                productId={productId}
                variantId={item?._id}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default VariantTable
