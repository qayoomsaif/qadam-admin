import React from 'react'

export interface TextAreaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label: string
  value: string | number
}
