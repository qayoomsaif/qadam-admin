import { Checkout } from '../../components/Checkout'
import { AppPage } from '../../components/layout/AppPage'
import styles from './checkout.module.scss'
import React, { useState } from 'react'

const checkout = () => {
  return (
    <AppPage>
      <Checkout />
    </AppPage>
  )
}

export default checkout
