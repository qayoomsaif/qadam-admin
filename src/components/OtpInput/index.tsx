import React, { useState, useRef, useEffect } from 'react'
import styles from './OtpInput.module.scss'

interface OTPInputProps {
  length: number
  onChange: (otp: string) => void
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputsRef = useRef<HTMLInputElement[]>(Array(length).fill(null))

  useEffect(() => {
    const storedOtp = localStorage.getItem('otp')
    if (storedOtp) {
      try {
        const parsedOtp = storedOtp.split('')
        if (Array.isArray(parsedOtp) && parsedOtp.length === length) {
          setOtp(parsedOtp)
          onChange(localStorage.getItem('otp'))
        } else {
          console.error('Stored OTP format is incorrect.')
        }
      } catch (error) {
        console.error('Error parsing stored OTP:', error)
      }
    }
  }, [length])

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    onChange(newOtp.join(''))
    //onChange(newOtp.join(''));

    if (value !== '' && index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputsRef.current[index - 1].focus()
    }
  }

  return (
    <div>
      {Array.from({ length: length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(input) => {
            inputsRef.current[index] = input as HTMLInputElement
          }}
          className={styles['inputStyle']}
        />
      ))}
    </div>
  )
}

export default OTPInput
