import { AppPage } from '../../components/layout/AppPage'
import dynamic from 'next/dynamic'
const AddProduct = dynamic(
  () => import('../../components/AddProduct/AddProduct'),
  {
    ssr: false,
  }
)

const AddProductPage = () => {
  return (
    <AppPage>
      <AddProduct />
    </AppPage>
  )
}
export default AddProductPage
