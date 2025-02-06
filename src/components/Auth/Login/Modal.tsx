import React from 'react'
import Link from 'next/link'

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9998]">
      <div className="modal-content bg-white p-4 sm:p-6 rounded-lg max-w-xs sm:max-w-lg w-full text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Sign Up for an Account
        </h2>
        <p className="mb-4 text-sm sm:text-base">
          To register, please fill this{' '}
          <Link
            className="text-accent-orange-500 underline"
            href="https://forms.gle/xByUDqMCoAcKHeXW6"
            target="_blank"
          >
            form
          </Link>
        </p>

        <div className="flex items-center space-x-2 sm:space-x-4 justify-center mt-4">
          <button
            className="bg-primary-blue-600 text-white text-sm sm:text-base py-1 sm:py-2 px-3 sm:px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal