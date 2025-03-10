import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../Context/appContext';

interface Entity {
  _id: string;
  businessName?: string;
  companyName?: string;
  companyDescription?: string;
  address: string;
  image: string;
  phone: string;
  categories?: string[];
  preferredCategories?: string[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  userType: 'seller' | 'supplier';
}

const TableFour = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("TableFour component must be used within an AppContextProvider");
  }

  const { backendUrl, isLoggedin, userData } = appContext;
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedin && userData) {
      const fetchEntities = async () => {
        try {
          const targetType = userData?.userType === 'seller' ? 'supplier' : 'seller';
          const response = await axios.get(`${backendUrl}/api/connections/unconnected-entities?targetType=${targetType}`, { withCredentials: true });
          const unconnectedEntities = response.data.unconnectedEntities || [];
          setEntities(unconnectedEntities);
          setLoading(false);
        } catch (err) {
          setError('Error fetching unconnected entities');
          setLoading(false);
        }
      };

      fetchEntities();
    } else {
      setLoading(false);
      setError('Please log in to view entities.');
    }
  }, [backendUrl, isLoggedin, userData]);

  const handleConnect = async (targetId: string) => {
    const targetType = userData?.userType === 'seller' ? 'supplier' : 'seller';

    if (!targetId || !targetType) {
      console.error('Error: Missing targetId or targetType');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/connections`, {
        targetId,
        targetType
      });

      console.log('Connection successful', response.data);

      // Remove the connected entity from the list
      setEntities((prevEntities) =>
        prevEntities.filter((entity) => entity._id !== targetId)
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.response ? error.response.data : error.message);
      } else {
        console.error('Error:', error);
      }
    }
  };

  if (loading) return <p>Loading entities...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-wrap gap-4 p-4 justify-start">
      {Array.isArray(entities) && entities.length > 0 ? (
        entities.map((entity) => (
          <div
            key={entity._id}
            className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            style={{ width: '250px' }}
          >
            {entity.image ? (
              <img
                src={`${backendUrl}${entity.image}`}
                alt={`${entity.companyName || entity.businessName || 'Entity'} profile`}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 14l9-5-9-5-9 5zm0 7v-5l9-5-9 5-9-5v5z"
                  />
                </svg>
              </div>
            )}

            <div className="text-center">
              {entity.user && entity.user.name && (
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  {entity.user.name}
                </h2>
              )}
              {entity.companyName ? (
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {entity.companyName}
                </h3>
              ) : entity.businessName ? (
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {entity.businessName}
                </h3>
              ) : null}
              {entity.companyDescription && (
                <p className="text-gray-600 text-xs mb-1">
                  {entity.companyDescription}
                </p>
              )}
              {entity.address && (
                <p className="text-gray-500 text-xs mb-1">
                  <strong>Address:</strong> {entity.address}
                </p>
              )}
              {Array.isArray(entity.categories) && entity.categories.length > 0 && (
                <p className="text-gray-500 text-xs mb-2">
                  <strong>Categories:</strong> {entity.categories.join(', ')}
                </p>
              )}
              {Array.isArray(entity.preferredCategories) && entity.preferredCategories.length > 0 && (
                <p className="text-gray-500 text-xs mb-2">
                  <strong>Preferred Categories:</strong> {entity.preferredCategories.join(', ')}
                </p>
              )}
              <button
                className="bg-blue-500 text-white px-3 py-1 text-xs rounded-lg mt-2 transition-colors hover:bg-blue-600"
                style={{ display: 'block', margin: '0 auto' }}
                onClick={() => handleConnect(entity._id)}
              >
                {userData?.userType === 'seller' ? 'Connect to Supplier' : 'Connect to Seller'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No entities available</p>
      )}
    </div>
  );
};

export default TableFour;
