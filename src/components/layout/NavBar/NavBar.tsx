import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import {
  IoMdNotificationsOutline,
  IoIosSearch,
  IoMdPerson,
  IoMdMenu,
  IoMdClose,
} from 'react-icons/io'
import { useSession } from '../../../lib/hooks/auth'
import { useSelector, useDispatch } from 'react-redux'
import { getCookie, hasCookie } from 'cookies-next'
import Link from 'next/link'
import Image from 'next/image'
import { addToCart, emptyCart } from '../../../slices/cartSlice'
import { RootState, useAppSelector } from '../../../store'

// import { getVerifyDetail } from '../../../utils/HelperService'
// import { VerificationType } from '../../../lib/schema/auth'
import Logo from '../../../assets/logo.svg'
import mobLogo from '../../../assets/mob-logo.svg'
import {
  logOut,
  setIsQadamUser,
  setIsVisiableVendorUUIDModal,
} from '../../../slices/sessionSlice'
import styles from '../../navbar//navbar.module.scss'
import { CategoriesMenu } from './CategoriesMenu'
import { CartMenu } from '../../Cart/CartMenu'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  checkEmailDomain,
  removeUserDetail,
} from '../../../utils/HelperService'

export const NavBar = () => {
  const dispatch = useDispatch()
  const session = useAppSelector((state) => state.session)
  const { isQadamUser } = session
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSession, setIsSession] = useState(
    session?.session?.access_token ? true : false
  )
  const [profileVerification, setProfileVerification] = useState('')
  const [bankVerification, setBankVerification] = useState('')
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [textSearch, setTextSearch] = useState('')
  const [isSearchPopupOpen, setSearchPopupOpen] = useState(false)
  const [isToggleMenuOpen, setIsToggleMenuOpen] = useState(false)

  useEffect(() => {
    setIsSession(session?.session?.access_token ? true : false)
    getEmailDomain()
  }, [session])
  const getEmailDomain = async () => {
    let res = await checkEmailDomain()
    // console.log({
    //   checkEmailDomaincheckEmailDomaincheckEmailDomain: res,
    // })
    dispatch(setIsQadamUser(res))

    // setIsQadamUser(res)
  }
  useEffect(() => {
    if (!router.asPath.includes('/search') && textSearch) {
      setTextSearch('')
    }
  }, [router])
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const handleResize = () => {
    const width = window.innerWidth
    setIsMobile(width < 800)
    setIsTablet(width >= 800 && width < 940)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleMenu = () => {
    setIsToggleMenuOpen((prevState) => !prevState)
  }

  const handleMenuItemClick = () => {
    setIsToggleMenuOpen(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (textSearch) {
        router.push(`/search/${textSearch}`)
      }
    }
  }

  return (
    <>
      <header
        id="nav-header"
        className="h-[5rem] w-full bg-white sticky top-0 shadow-md z-50 flex items-center justify-center"
      >
        <div
          className={`grid ${isMobile ? 'grid-cols-2' : 'lg:grid-cols-3 grid-cols-3'} max-w-[1280px] mx-auto w-full px-8`}
        >
          <div className="flex items-center w-full h-full">
            <Link href="/home">
              <Image
                onClick={() => {
                  router.push('/home')
                }}
                className={styles['organization-logo']}
                src={isTablet || isMobile ? mobLogo : Logo}
                alt="logo"
              />
            </Link>
            {/* {!isMobile && (
              <div className="ml-4">
                <CategoriesMenu categories={categories} />
              </div>
            )} */}
          </div>
          {/* {isMobile && (
            <div className="flex items-center justify-center flex-grow relative mx-4">
              <input
                className="border-2 border-gray-300 rounded-lg p-1 pl-5 w-full"
                placeholder="Search..."
                onChange={(event) => setTextSearch(event.target.value)}
                value={textSearch}
                onKeyDown={handleKeyDown}
              />
              <div className="absolute right-0 flex items-center pl-3">
                <IoIosSearch
                  onClick={() => {
                    if (textSearch) {
                      router.push(/Search/${textSearch})
                    }
                  }}
                  fontSize="1.5rem"
                  color="gray"
                />
              </div>
            </div>
          )} */}

          {!isMobile ? (
            <>
              <div className="flex items-center w-full h-full ml-3">
                {isSession ? (
                  <div className="w-[30rem] flex items-center relative">
                    <input
                      className="border-2 border-gray-300 rounded-lg p-1 w-full pl-4"
                      placeholder="Search..."
                      onChange={(event) => setTextSearch(event.target.value)}
                      value={textSearch}
                      onKeyDown={handleKeyDown}
                    />
                    <div
                      onClick={() => {
                        if (textSearch) {
                          router.push(`/search/${textSearch}`)
                        }
                      }}
                      className="absolute right-3 ml-2"
                    >
                      <IoIosSearch fontSize="1.5rem" color="gray" />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-end w-full h-full gap-4">
                {/* {isSession && !isMobile && (
                  <div className="ml-3">
                    <Link href="/profile/orders">
                      <p className="text-primary-blue-500 font-semibold text-l">
                        Orders
                      </p>
                    </Link>
                  </div>
                )} */}
                {/* <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="p-2 mr-1 text-primary-blue-500 rounded-lg"
                  >
                    <span className="sr-only">View notifications</span>
                    <IoMdNotificationsOutline size={24} />
                  </button>
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                      <div>
                        <a
                          href="#"
                          className="flex py-3 px-4 border-b hover:bg-gray-100"
                        >
                          <div className="pl-3 w-full">
                            <div className="text-primary-blue-500 font-normal text-sm mb-1.5">
                              Complete your profile
                            </div>
                            <div className="text-xs font-medium text-primary-700">
                              a few moments ago
                            </div>
                          </div>
                        </a>
                        <a
                          href="#"
                          className="block py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="inline-flex items-center">
                            View all
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div> */}
                {/* <CartMenu /> */}
                {!isSession ? (
                  <button
                    onClick={() => router.push('/login')}
                    className="text-accent-orange-500 font-[600] text-lg hover:bg-accent-orange-500 hover:text-[#ffffff] rounded-lg py-1 px-2 transition-all"
                  >
                    {isTablet ? 'Login' : 'Login / Register'}
                  </button>
                ) : (
                  <div className="relative">
                    <div
                      className="flex items-center cursor-pointer text-accent-orange-500"
                      onMouseEnter={() => setIsMenuOpen(true)}
                      onMouseLeave={() => setIsMenuOpen(false)}
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <IoMdPerson fontSize="2rem" />
                    </div>
                    {isMenuOpen && (
                      <div
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                        className="absolute top-full right-0 w-48 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          {isQadamUser ? (
                            <span
                              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                dispatch(setIsVisiableVendorUUIDModal(true))
                              }}
                            >
                              Change Vendor
                            </span>
                          ) : null}
                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              router.push('/profile')
                              setIsMenuOpen(false)
                            }}
                          >
                            Profile
                          </span>
                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              AsyncStorage.setItem('profile_type', 'ledger')
                              router.push('/profile')
                              setIsMenuOpen(false)
                            }}
                          >
                            Ledger
                          </span>
                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              AsyncStorage.setItem(
                                'profile_type',
                                'bank_details'
                              )
                              router.push('/profile')
                              setIsMenuOpen(false)
                            }}
                          >
                            Bank Details
                          </span>

                          {isQadamUser ? (
                            <span
                              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                router.push('/add-product')
                                setIsMenuOpen(false)
                              }}
                            >
                              Add Product
                            </span>
                          ) : null}

                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              router.push('/all-products')
                              setIsMenuOpen(false)
                            }}
                          >
                            View All products
                          </span>
                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              router.push('/orders')
                              setIsMenuOpen(false)
                            }}
                          >
                            View All Orders
                          </span>
                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              // router.push('/orders')
                              setIsMenuOpen(false)
                            }}
                          >
                            Help & Support
                          </span>
                          <span
                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              dispatch(logOut())
                              removeUserDetail()
                              router.push('/login')
                            }}
                          >
                            Logout
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end w-full h-full gap-0">
              {isSession ? (
                <button
                  className="p-2 text-primary-blue-500"
                  onClick={() => setSearchPopupOpen(true)}
                >
                  <IoIosSearch size={20} />
                </button>
              ) : null}
              {isSearchPopupOpen && (
                <div className="absolute inset-0 bg-white z-50 flex items-center justify-center backdrop-blur-sm p-4 md:p-8">
                  <div className="relative w-full max-w-md">
                    <input
                      className="border-2 border-gray-300 rounded-lg p-2 w-full pl-10"
                      placeholder="Search..."
                      onChange={(event) => setTextSearch(event.target.value)}
                      value={textSearch}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      className="absolute top-2 right-2 text-primary-blue-500"
                      onClick={() => setSearchPopupOpen(false)}
                    >
                      <IoMdClose size={24} />
                    </button>
                  </div>
                </div>
              )}
              {/* <CartMenu /> */}
              {/* <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="p-2 mr-1 text-primary-blue-500 rounded-lg"
                >
                  <span className="sr-only">View notifications</span>
                  <IoMdNotificationsOutline size={20} />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                    <div>
                      <a
                        href="#"
                        className="flex py-3 px-4 border-b hover:bg-gray-100"
                      >
                        <div className="pl-3 w-full">
                          <div className="text-primary-blue-500 font-normal text-sm mb-1.5">
                            Complete your profile
                          </div>
                          <div className="text-xs font-medium text-primary-700">
                            a few moments ago
                          </div>
                        </div>
                      </a>
                      <a
                        href="#"
                        className="block py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="inline-flex items-center">View all</div>
                      </a>
                    </div>
                  </div>
                )}
              </div> */}
              {isSession ? (
                <button
                  onClick={handleToggleMenu}
                  className="p-2 text-accent-orange-500 rounded-lg relative flex items-center justify-center"
                >
                  {isToggleMenuOpen ? (
                    <IoMdClose
                      size={20}
                      className="transition-transform duration-300"
                    />
                  ) : (
                    <IoMdMenu
                      size={20}
                      className="transition-transform duration-300"
                    />
                  )}
                </button>
              ) : null}
              {isToggleMenuOpen && (
                <div className="absolute top-full right-0 w-full bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {isQadamUser ? (
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={() => {
                          dispatch(setIsVisiableVendorUUIDModal(true))
                        }}
                      >
                        Change Vendor
                      </span>
                    ) : null}
                    <Link href="/profile">
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={handleMenuItemClick}
                      >
                        Profile
                      </span>
                    </Link>
                    <div>
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={() => {
                          AsyncStorage.setItem('profile_type', 'ledger')
                          router.push('/profile')
                          setIsMenuOpen(false)
                          handleMenuItemClick()
                        }}
                      >
                        Ledger
                      </span>
                    </div>
                    <div>
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={() => {
                          AsyncStorage.setItem('profile_type', 'bank_details')
                          router.push('/profile')
                          setIsMenuOpen(false)
                          handleMenuItemClick()
                        }}
                      >
                        Bank Details
                      </span>
                    </div>
                    {isQadamUser ? (
                      <Link href="/add-product">
                        <span
                          className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                          onClick={handleMenuItemClick}
                        >
                          Add Product
                        </span>
                      </Link>
                    ) : null}
                    <Link href="/all-products">
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={handleMenuItemClick}
                      >
                        View All products
                      </span>
                    </Link>
                    <Link href="/orders">
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={handleMenuItemClick}
                      >
                        View All Orders
                      </span>
                    </Link>
                    <Link href="/profile">
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={handleMenuItemClick}
                      >
                        Help & Support
                      </span>
                    </Link>
                    {!isSession ? (
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700"
                        onClick={() => {
                          dispatch(logOut())
                          removeUserDetail()
                          router.push('/login')
                          handleMenuItemClick()
                        }}
                      >
                        Login / Register
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          dispatch(logOut())
                          removeUserDetail()
                          router.push('/login')
                          handleMenuItemClick()
                        }}
                      >
                        Logout
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  )
}
