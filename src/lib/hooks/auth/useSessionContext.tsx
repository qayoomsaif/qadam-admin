import { useContext } from 'react'

import {
  Session,
  SessionContext,
} from '../../context/sessionContext/sessionContext'
import { getCategoriesApi } from '../../../utils/services'
import { useDispatch } from 'react-redux'
import { addCategories } from '../../../slices/categorySlice'
import { deleteCookie, setCookie } from 'cookies-next'

export const useSession = () => {
  const sessionContext = useContext(SessionContext)
  const reduxDispatch = useDispatch()

  if (sessionContext === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }

  const { state, dispatch } = sessionContext

  const logIn = async (payload: Session) => {
    const response = await getCategoriesApi()
    reduxDispatch(addCategories(response.data.data))
    localStorage.setItem('qadamVendorSession', JSON.stringify(payload))
    dispatch({
      type: 'LOGIN',
      payload,
    })
  }

  const logOut = () => {
    localStorage.removeItem('qadamVendorSession')
    deleteCookie('qadamVendorSession')
    dispatch({ type: 'LOGOUT' })
  }

  return {
    session: state.session,
    logIn,
    logOut,
  }
}
