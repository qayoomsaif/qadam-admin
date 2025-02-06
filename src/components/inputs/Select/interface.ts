import React from 'react'

export interface SelectProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  label: string
  value: string | number
  options: { key: string; value: string }[]
}
