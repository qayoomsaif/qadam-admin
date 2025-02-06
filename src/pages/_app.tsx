import '../styles/globals.css'
import { Footer } from '../components/Footer'
import { Provider } from 'react-redux'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { chakraTheme } from '../styles/chakraTheme'
import store from '../store'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AppWrapper } from '../components/layout/AppWrapper'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { SessionContextProvider } from '../lib/context/sessionContext/sessionContext'
import { useEffect } from 'react'
import {
  checkEmailDomain,
  getToken,
  getUserDetail,
} from '../utils/HelperService'
import { useRouter } from 'next/router'
import { logOut, setIsVisiableVendorUUIDModal } from '../slices/sessionSlice'
import Modal from '../components/Modal'
import VendorUUIDModal from '../components/VendorUUIDModal'

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: any) {
  const router = useRouter()
  let presister = persistStore(store)
  const { vendorUUID, session, isQadamUser, isVisiableVendorUUIDModal } =
    store?.getState()?.session
  useEffect(() => {
    //   if (!session?.access_token) {
    //     // store.dispatch(logOut())
    //     router.pathname != '/login' &&
    //     router.pathname != '/reset-password' &&
    //     router.pathname != '/signup'
    //       ? router.push('/login')
    //       : null
    //   } else {
    checkIsQadamUser()
    // }
  }, [router])
  const checkIsQadamUser = async () => {
    let isQadamUser = await checkEmailDomain()
    if (!isQadamUser) {
      router.pathname.includes('/edit-product') ||
      router.pathname == '/add-product'
        ? router.push('/home')
        : null
    }
  }

  return (
    <>
      <Provider store={store}>
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap"
          rel="stylesheet"
        />
        <ChakraProvider theme={chakraTheme}>
          <SessionContextProvider>
            <QueryClientProvider client={queryClient}>
              <PersistGate persistor={presister}>
                <AppWrapper>
                  <Component {...pageProps} />
                </AppWrapper>
              </PersistGate>
            </QueryClientProvider>
          </SessionContextProvider>
        </ChakraProvider>
      </Provider>
      <ToastContainer />
    </>
  )
}
