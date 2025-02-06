import React, { useEffect } from 'react'
import { NavBar } from '../NavBar'
import { Footer } from '../../Footer'
import VendorUUIDModal from '../../../components/VendorUUIDModal'
import { RootState, useAppSelector } from '../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import {
  logOut,
  setIsVisiableVendorUUIDModal,
  setVendorUUID,
} from '../../../slices/sessionSlice'
import {
  checkEmailDomain,
  getToken,
  getUserDetail,
} from '../../../utils/HelperService'

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const { isVisiableVendorUUIDModal, vendorUUID } = useSelector(
    (state: RootState) => state.session
  )
  const router = useRouter()

  useEffect(() => {
    let session = getToken()
    if (!session?.access_token) {
      if (router.pathname === '/reset-password') {
        return
      } else {
        dispatch(logOut())
        router.pathname != '/login' ? router.push('/login') : null
      }
    } else {
      router.pathname != '/change-password' ? checkIsQadamUser() : null
    }
  }, [router])
  const checkIsQadamUser = async () => {
    let res = await getUserDetail()
    let isQadamUser = await checkEmailDomain()
    if (isQadamUser) {
      if (!res?.first_login) {
        if (vendorUUID) {
        } else {
          dispatch(setIsVisiableVendorUUIDModal(true))
        }
      } else {
        router.push('/change-password')
      }
    }
  }

  return (
    <main className="w-full min-h-screen">
      <NavBar />

      <div className="w-full max-w-[1280px] mx-auto px-8 pb-8">{children}</div>
      <Footer />
      {isVisiableVendorUUIDModal ? (
        <VendorUUIDModal
          id={vendorUUID}
          onClose={() => dispatch(setIsVisiableVendorUUIDModal(false))}
          onSelect={(id) => {
            dispatch(setVendorUUID(id))
            dispatch(setIsVisiableVendorUUIDModal(false))
            // setTimeout(() => {
            router.reload()
            // }, 100)
          }}
        />
      ) : null}
    </main>
  )
}
