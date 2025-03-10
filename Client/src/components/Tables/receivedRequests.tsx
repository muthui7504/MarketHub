import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../Context/appContext';

interface Seller {
  _id: string;
  businessName: string;
  address: string;
  sellerRating: number;
  preferredCategories: string[]; // Seller's preferred categories
  image: string; // Seller's image field
  phone: string;
  user?: { // Marking user as optional
    _id: string;
    name: string;
  };
}

interface ConnectionRequest {
  _id: string;
  seller: Seller;
  supplier: string | null;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: string;
}

const ReceivedRequestsTable = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('ReceivedRequestsTable must be used within an AppContextProvider');
  }

  const { backendUrl, isLoggedin } = appContext;
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/connections/pending-requests`);
        setRequests(Array.isArray(response.data.pendingRequests) ? response.data.pendingRequests : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch connection requests');
        setLoading(false);
      }
    };

    if (isLoggedin) {
      fetchRequests();
    }
  }, [backendUrl, isLoggedin]);

  const handleAccept = async (_id: string) => {
    try {
      await axios.put(`${backendUrl}/api/connections/${_id}/accept`, { withCredentials: true });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === _id ? { ...request, status: 'Accepted' } : request
        )
      );
    } catch (err) {
      setError('Failed to accept request');
    }
  };

  const handleReject = async (_id: string) => {
    try {
      await axios.put(`${backendUrl}/api/connections/${_id}/reject`, { withCredentials: true });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === _id ? { ...request, status: 'Rejected' } : request
        )
      );
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Connection Requests</h2>
      <div className="space-y-0">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-white border border-gray-200 shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300 ease-in-out"
              style={{ marginBottom: '-1px' }} // Remove spacing between cards
            >
              {/* Profile Info */}
              <div className="flex items-center space-x-4">
                {/* Profile Image */}
                <img
                  src={`${backendUrl}${request.seller.image}`} // Use the seller's image directly as returned from the data
                  alt="Seller Profile"
                  className="w-12 h-12 object-cover rounded-full border border-gray-300"
                />

                {/* Seller Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {/* Display user's name if available, otherwise show business name */}
                    {request.seller.user?.name || request.seller.businessName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {/* Preferred Category or Categories - Address */}
                    {request.seller.preferredCategories[0]} - {request.seller.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-x-3">
                {request.status === 'Pending' && (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition duration-300 ease-in-out"
                      onClick={() => handleAccept(request._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-md transition duration-300 ease-in-out"
                      onClick={() => handleReject(request._id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                {request.status === 'Accepted' && (
                  <span className="text-green-500 font-semibold">Accepted</span>
                )}
                {request.status === 'Rejected' && (
                  <span className="text-red-500 font-semibold">Rejected</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No connection requests found</div>
        )}
      </div>
    </div>
  );
};

export default ReceivedRequestsTable;
