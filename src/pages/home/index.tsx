// import HeroCarousel from '../../components/ImageCarousel'
// import Carousel1 from '../../assets/carousel1.svg'
// import Slider, { Settings } from 'react-slick'
// import CategorySlider from '../../components/CategorySlider'
// import HorizontalProductList from '../../components/HorizontalProductList'
// import ImageCarousel from '../../components/ImageCarousel'
// import RightDrawer from '../../components/RightDrawer'
// import { AppPage } from '../../components/layout/AppPage'
// import Product1 from '../../assets/sample-product-1.jpg'
// import Image from 'next/image'
// import {
//   getCategoriesApi,
//   getProductsApi,
//   getSingleProductApi,
// } from '../../utils/services'
// import { useRouter } from 'next/router'
// import { useDispatch, useSelector } from 'react-redux'
// import { addCategories } from '../../slices/categorySlice'
// import { RootState } from '../../store'

// interface ProductCardProps {
//   id: string
//   name: string
//   price: number
//   options: number
//   imageUrl: string
// }

// // const Home = ({ categories, products }: HomeProps) => {
// const Home = () => {
//   const router = useRouter()
//   return (
//     <AppPage>
//       <div className="flex flex-col gap-8 items-center">
//         <button
//           className="w-[20rem] bg-primary-blue-500 text-white text-lg p-10 rounded-lg"
//           onClick={() => router.push('/add-product')}
//         >
//           Add Products
//         </button>
//         <button
//           className="w-[20rem] bg-primary-blue-500 text-white text-lg p-10 rounded-lg"
//           onClick={() => router.push('/all-products')}
//         >
//           View All Products
//         </button>
//         <button
//           className="w-[20rem] bg-primary-blue-500 text-white text-lg p-10 rounded-lg"
//           onClick={() => router.push('/orders')}
//         >
//           View All Orders
//         </button>
//       </div>
//     </AppPage>
//   )
// }
// export default Home
import { AppPage } from '../../components/layout/AppPage'

import { AllProducts } from '../../components/AllProducts'

const AllProductsPage = () => {
  return (
    <AppPage>
      <AllProducts />
    </AppPage>
  )
}
export default AllProductsPage
