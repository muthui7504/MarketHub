import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../Context/appContext';
import { useNavigate } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

const RecentlyAddedItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  if (!appContext) {
    throw new Error('RecentlyAddedItems component must be used within an AppContextProvider');
  }

  const { backendUrl } = appContext;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products/all`);
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
          setError('Unexpected response format.');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load products.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Navigate to ProductDetails page on card click
  const handleCardClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Recently Added Items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(product._id)} // Navigate to product details on click
          >
            {product.image ? (
              <img
                src={`${backendUrl}${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-lg mb-4">
                <FaImage size={48} className="text-gray-400" />
              </div>
            )}
            <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-700">Price: KSh {product.price.toFixed(2)}</p>
            <p className="text-gray-600">Available: {product.quantity} items</p>
            <p className="text-gray-500 mt-2">{product.description || 'No description available'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedItems;
