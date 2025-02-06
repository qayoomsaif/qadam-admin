import React from 'react'

export interface AppPageProps {
  crumbs?: { label: string; path: string; isLastChild: boolean }[]
  children: React.ReactNode
}
