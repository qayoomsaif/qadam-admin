import React from 'react'
import bannerVendor from '../../../assets/bannerVendor.png'

export const AuthPage = ({
  children,
  isMobile,
}: {
  children: React.ReactNode
  isMobile?: boolean
}) => {
  return (
    <div
      className={`w-full grid ${!isMobile ? 'grid-cols-2' : 'items-center'}`}
    >
      <div className="w-full h-full py-10 hidden md:block">
        <img src={bannerVendor.src} alt="Brand Logo" className="logo"></img>
      </div>
      {children}
    </div>
  )
}