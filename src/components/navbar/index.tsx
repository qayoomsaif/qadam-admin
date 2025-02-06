import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FaUser, FaShoppingCart, FaBell } from 'react-icons/fa'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import Logo from '../../assets/logo.svg'
import styles from './navbar.module.scss'
import Router, { useRouter } from 'next/router'
import Notification from '../Notification'
import { useAppSelector } from '../../store'
import axios from '../../utils/axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Toaster from '../Toaster/Toaster'
import { getCategoriesApi, refreshTokenApi } from '../../utils/services'
import { Constants } from '../../utils/Constants'
import { removeUserDetail } from '../../utils/HelperService'

const notification = {
  content: 'Lorem ipsum dolor  amet, consectetur adipiscing elit',
  time: '25m ago',
}

interface CategoriesType {
  name: string
  subcategory: any
}

const TopNavbar = () => {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [categories, setCategories] = useState<CategoriesType>()
  const [open, setOpen] = useState(false)
  const [authentication, setAuthentication] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const isFirstRun = useRef(true)

  const cartItemsCount = useAppSelector((state) => state.cart.orders.length)

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick)
    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const getNewToken = async () => {
    const payload = {
      refreshToken: localStorage.getItem('refresh_token'),
    }
    try {
      const response = await refreshTokenApi(payload)
      if (response.status === Constants.statuses.success) {
        const { access_token, refresh_token } = response.data.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      localStorage.clear()
      setAuthentication(false)
      router.push('/login')
    }
  }

  const handleLogout = () => {
    setAuthentication(false)
    localStorage.clear()
    removeUserDetail()
    router.push('/login')
  }

  const toggleNotifications = (e) => {
    e.stopPropagation()
    setShowNotifications(!showNotifications)
  }

  const dropdownRef = useRef(null)

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowNotifications(false)
      setActiveCategory(null)
    }
    if (!e.target.closest('.notificationBtn')) {
      setShowNotifications(false)
    }
  }

  const handleCategoryClick = (e, category) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const menuShow = (mItems) => {
    return mItems?.map((item, index) => {
      if (item.subcategory) {
        return (
          <NavDropdown
            title={item.name}
            key={index}
            className="dropdown-menu-dark dropend"
          >
            {menuShow(item.subcategory)}
          </NavDropdown>
        )
      } else {
        return (
          <Nav.Link href={''} key={index}>
            {item.name}
          </Nav.Link>
        )
      }
    })
  }

  const navStyle = {
    color: 'black',
    fontWeight: 'bold',
  }

  return (
    <>
      <div className={styles['container']}>
        <Image
          onClick={() => {
            router.push('/home')
          }}
          className={styles['organization-logo']}
          src={Logo}
          alt="logo"
        />

        <div className={styles['nav-buttons']}>
          <button
            className={styles['nav-item']}
            onClick={() => {
              router.push('/home')
            }}
          >
            Home
          </button>

          <Navbar>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" style={navStyle}>
                <NavDropdown
                  title={'Categories'}
                  className="dropdown-menu-dark dropend"
                >
                  {menuShow(categories?.subcategory)}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <button
            className={styles['nav-item']}
            onClick={() => {
              router.push('/orders')
            }}
          >
            Orders
          </button>
        </div>

        <div className={styles['search-bar']}>
          <input
            type="text"
            placeholder="Search..."
            className={styles['search-input']}
          />
        </div>

        <div>
          <FaBell className={styles['icon']} onClick={toggleNotifications} />
          {showNotifications && (
            <div className={styles.notificationContent}>
              <Notification notification={notification} />
              <Notification notification={notification} />
              <Notification notification={notification} />
            </div>
          )}
          <FaUser className={styles['icon']} />
          <div className={styles.cartIcon}>
            <FaShoppingCart
              className={styles['icon']}
              onClick={() => {
                router.push('./cart')
              }}
            />
            {cartItemsCount > 0 && (
              <span className={styles.badge}>{cartItemsCount}</span>
            )}
          </div>
        </div>

        {authentication ? (
          <button
            onClick={() => handleLogout()}
            className={styles['small-button']}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              router.push('/login')
            }}
            className={styles['small-button']}
          >
            Login / Register
          </button>
        )}
      </div>
    </>
  )
}

export default TopNavbar
