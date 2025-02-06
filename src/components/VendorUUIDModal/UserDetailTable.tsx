import React, { useEffect, useState } from 'react'
import { getAllVendor } from '../../utils/services'

type User = {
  _id: string
  name: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  postalCode: number
  state: string
  user_id: string
  role: string
  shop_name: string
  shop_phone: string
}

interface ModalProps {
  id: string
  onSelect: (id: string) => void
}

const UserDetailTable: React.FC<ModalProps> = ({ id, onSelect }) => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(id)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    getAllVendors()
  }, [])

  const getAllVendors = async () => {
    try {
      let response = await getAllVendor()
      if (response.data?.data) {
        setUsers(response.data.data)
      }
      console.log({ response })
    } catch (error) {
      console.log({ error })
    }
  }

  // Filter users based on the search term (name, shop_name, city, state)
  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Vendor Lists </h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by id, name, email, shop name, city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-x-auto mb-3">
        {' '}
        {/* Add margin for the fixed button */}
        <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Select
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Shop Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                User ID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                City
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                onClick={() => setSelectedUserId(user.user_id)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="radio"
                    name="selectedUser"
                    value={user.user_id}
                    checked={selectedUserId === user.user_id}
                    onChange={() => setSelectedUserId(user.user_id)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.shop_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user._id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          {selectedUserId ? (
            <p>Selected Vendor ID: {selectedUserId}</p>
          ) : (
            <p>No user selected</p>
          )}
        </div>
      </div>
      <div className="flex items-end justify-end">
        <button
          disabled={!selectedUserId}
          onClick={() => onSelect(selectedUserId || '')}
          className={`${selectedUserId ? 'bg-blue-500' : 'bg-blue-200'} text-white px-4 py-2 rounded-md text-sm`}
        >
          {'Change Vendor'}
        </button>
      </div>
    </div>
  )
}

export default UserDetailTable
