import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../Context/appContext';
import { FaUserCircle } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  businessName?: string;
  address: string;
  connectedAt: string;
  image?: string;
}

const ConnectedUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const context = useContext(AppContext);

  if (!context) {
    console.error('AppContext is undefined');
    return null;
  }

  const { backendUrl } = context;

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/connections/connected-users`)
      .then((response) => {
        const { connectedUsers } = response.data;
        if (Array.isArray(connectedUsers)) {
          setUsers(connectedUsers);
        } else {
          console.error('Unexpected data format:', connectedUsers);
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching connected users:', error);
        setLoading(false);
      });
  }, [backendUrl]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading connected users...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Connected Users</h2>
      {users.length === 0 ? (
        <div className="text-gray-500 text-center">No connected users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center p-4 space-x-3">
                {user.image ? (
                  <img
                    src={`${backendUrl}${user.image}`}
                    alt={`${user.name}'s profile`}
                    className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-16 h-16 text-gray-400" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <p className="font-semibold">Company Name:</p>
                    <p>{user.companyName || user.businessName || 'N/A'}</p>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p className="font-semibold">Address:</p>
                    <p>{user.address}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Connected on {new Date(user.connectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-between p-3 border-t">
                <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1 text-sm transition duration-300">
                  Message
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 text-sm transition duration-300">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectedUsers;
