// components/Pagination.tsx
import React, { useState } from 'react'

type PaginationProps = {
  paginationData: PaginationData
  onPageChange: (newPage: number) => void
}

type PaginationData = {
  hasNext: boolean
  hasPrevious: boolean
  perPage: number
  page: number
  count: number
  totalPages: number
}

const Pagination: React.FC<PaginationProps> = ({
  paginationData,
  onPageChange,
}) => {
  const { hasNext, hasPrevious, page, totalPages } = paginationData
  const [inputValue, setInputValue] = useState<string>(page.toString())
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numeric values and restrict input length
    if (
      /^\d*$/.test(value) &&
      (value === '' || parseInt(value, 10) <= totalPages)
    ) {
      setInputValue(value)
    }
  }

  const handleInputBlur = () => {
    const parsedValue = parseInt(inputValue, 10)
    if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > totalPages) {
      setError(`Please enter a valid page number between 1 and ${totalPages}.`)
    } else {
      setError(null)
      if (parsedValue !== page) {
        onPageChange(parsedValue)
      }
    }
  }

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
        <button
          className={`px-4 py-2 text-sm rounded transition-colors duration-200 ${
            hasPrevious
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
        >
          Previous
        </button>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress}
            className="w-16 text-center p-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Page"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>
        <button
          className={`px-4 py-2 text-sm rounded transition-colors duration-200 ${
            hasNext
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  )
}

export default Pagination
