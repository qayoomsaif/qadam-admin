// components/OtpInput.tsx

import React, {
  useState,
  useRef,
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from 'react'

interface OtpInputProps {
  length?: number
  onChange: (otp: string) => void
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputRefs = useRef<HTMLInputElement[]>([])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return
    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    // Focus the next input box
    if (element.nextElementSibling) {
      ;(element.nextElementSibling as HTMLInputElement).focus()
    }

    // Call onChange callback with the OTP value
    onChange(newOtp.join(''))
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, length).split('')
    setOtp([...otp.map((_, idx) => pasteData[idx] || '')])

    pasteData.forEach((data, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = data
        if (idx < length - 1) {
          inputRefs.current[idx + 1].focus()
        }
      }
    })

    // Call onChange callback with the OTP value
    onChange(pasteData.join(''))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)

      if (index > 0) {
        inputRefs.current[index - 1].focus()
      }
      onChange(newOtp.join(''))
    }
  }

  return (
    <div onPaste={handlePaste} className="otp-container">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          ref={(el) => {
            if (el) inputRefs.current[index] = el
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target, index)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(e, index)
          }
          className="otp-input"
        />
      ))}
      <style jsx>{`
        .otp-container {
          display: flex;
          justify-content: space-between;
        }

        .otp-input {
          width: 40px;
          height: 40px;
          text-align: center;
          margin: 0 5px;
          font-size: 18px;
          border-radius: 8px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: border 0.2s;
        }

        .otp-input:focus {
          border: 2px solid #3b82f6; /* Blue border color on focus */
          outline: none;
        }
      `}</style>
    </div>
  )
}

export default OtpInput
  