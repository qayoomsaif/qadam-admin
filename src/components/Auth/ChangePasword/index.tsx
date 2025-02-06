import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import Logo from '../../../assets/logo.svg'
import Image from 'next/image'
import { PhoneIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { useLogIn } from '../../../lib/hooks/auth/useLogIn'
import { useRouter } from 'next/router'
import Toaster from '../../Toaster/Toaster'
import { useSession } from '../../../lib/hooks/auth'
import { useDispatch } from 'react-redux'
import { login, logOut } from '../../../slices/sessionSlice'
import { getCategoriesApi } from '../../../utils/services'
import { addCategories } from '../../../slices/categorySlice'
import { setCookie } from 'cookies-next'
import {
  removeUserDetail,
  setUserDetail,
  setToken,
} from '../../../utils/HelperService'

export const ChangePasword = () => {
  const { mutate, isPending, isError, error } = useLogIn()
  const dispatch = useDispatch()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [oldPassword, setOldPasword] = useState('')
  const [newPassword, setNewPasword] = useState('')
  const [confrimPassword, setConfrimPasword] = useState('')

  const handleResize = () => {
    const width = window.innerWidth
    setIsMobile(width < 800)
    setIsTablet(width >= 800 && width < 940)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    // dispatch(logOut())
    // removeUserDetail()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSubmit = () => {
    console.log({ oldPassword, newPassword, confrimPassword })

    // e.preventDefault()
    // const email = e.target[0].value
    // const password = e.target[1].value
    // mutate(
    //   {
    //     email,
    //     password,
    //   },
    //   {
    //     onSuccess: async (res) => {
    //       if (res?.data?.data?.access_token) {
    //         let tokens = {
    //           access_token: res?.data?.data?.access_token,
    //           refresh_token: res?.data?.data?.refresh_token,
    //           expires_in: Date.now() + res.data.data.expires_in * 1000,
    //           refresh_expires_in:
    //             Date.now() + res.data.data.refresh_expires_in * 1000,
    //         }
    //         dispatch(login(tokens))
    //         setToken(tokens)
    //         setUserDetail(res?.data?.data?.user_data)
    //         const categories = await getCategoriesApi()
    //         dispatch(addCategories(categories?.data?.data))
    //         Toaster.success('Welcome to Qadam.io!')
    //         if (router?.query?.redirect) {
    //           router.push(router?.query?.redirect as string)
    //         } else {
    //           router.push('/home')
    //         }
    //       }
    //     },
    //     onError: (e) => {
    //       console.log(
    //         'errorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerror',
    //         e
    //       )
    //     },
    //   }
    // )
  }

  return (
    <div className="p-8 flex flex-col justify-center items-center gap-4">
      <Image
        style={{
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        src={Logo}
        width={300}
        alt="logo"
      />
      <span className="text-neutral-gray-500 font-semibold text-xl">
        Please chnage your password
      </span>
      <div className="flex flex-col gap-4">
        <Input
          value={oldPassword}
          onChange={(e) => setOldPasword(e.target.value)}
          name="Old password"
          type="password"
          placeholder="Old Password"
        />
        <Input
          value={newPassword}
          onChange={(e) => setNewPasword(e.target.value)}
          name="New password"
          type="password"
          placeholder="New Password"
        />
        <Input
          value={confrimPassword}
          onChange={(e) => setConfrimPasword(e.target.value)}
          name="Confrim password"
          type="password"
          placeholder="Confrim Password"
        />
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          type="submit"
          isLoading={isPending}
          mt="1rem"
        >
          Confrim
        </Button>
      </div>
    </div>
  )
}
