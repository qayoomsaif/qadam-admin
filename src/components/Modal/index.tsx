// components/Modal.tsx
import React from 'react'

interface ModalProps {
  id: string
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ id, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    // alert(`Product ID "${id}" copied to clipboard!`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative mx-4 md:mx-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &#10005; {/* Cross Icon */}
        </button>
        {/* Modal Content */}
        <div>
          <p className="text-lg text-gray-800">
            You are not authorized to add an offer on this product <b>{id}</b>.
            If you would like to proceed, please contact our customer support
            team for authorization.
          </p>
          <button
            onClick={handleCopy}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded text-gray-800"
          >
            Copy Product ID
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
