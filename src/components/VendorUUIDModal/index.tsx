import React from 'react'
import UserDetailTable from './UserDetailTable'

interface ModalProps {
  id: string
  onClose: () => void
  onSelect: (id: string) => void
}

const VendorUUIDModal: React.FC<ModalProps> = ({ id, onClose, onSelect }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    // alert(`Product ID "${id}" copied to clipboard!`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative mx-4 md:mx-0 max-h-screen md:max-h-[80vh] overflow-auto">
        {id ? (
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-xl text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            &#10005; {/* Cross Icon */}
          </button>
        ) : (
          <span className="absolute top-4 right-4 text-l text-blue-500 hover:text-gray-700">
            Logout
          </span>
        )}
        <UserDetailTable onSelect={onSelect} id={id} />
      </div>
    </div>
  )
}

export default VendorUUIDModal
