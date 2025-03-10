import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../Context/appContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartQuantity, setCartQuantity] = useState<number>(0); // Cart quantity state
  const [totalAmount, setTotalAmount] = useState<number>(0); // Total amount based on cart quantity
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false); // Track order status
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('ProductDetails component must be used within an AppContextProvider');
  }

  const { backendUrl } = appContext;

  useEffect(() => {
    // Fetch the product data by ID
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products/${id}`);
        console.log('Product response:', response.data); // Debugging line
        setProduct(response.data.product); // Access the product from the response
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, backendUrl]);

  const handleAddToCart = () => {
    setCartQuantity(1); // Start with 1 item when added to cart
    setTotalAmount(product.price); // Set total amount based on 1 item
  };

  const increaseCartQuantity = () => {
    setCartQuantity((prevQuantity) => prevQuantity + 1); // Increase quantity
    setTotalAmount((prevAmount) => prevAmount + product.price); // Increase total amount
  };

  const decreaseCartQuantity = () => {
    setCartQuantity((prevQuantity) => Math.max(0, prevQuantity - 1)); // Decrease quantity, not below 0
    setTotalAmount((prevAmount) => Math.max(0, prevAmount - product.price)); // Decrease total amount, not below 0
  };

  const handleOrderNow = async () => {
    try {
      const supplierId = product.supplier?._id; // Get supplier ID from product
      const productId = product._id; // Get product ID from product
      const quantity = cartQuantity; // Use cart quantity

      const orderData = {
        supplier: supplierId,
        products: [
          {
            product: productId,
            quantity: quantity,
          },
        ],
        totalAmount: totalAmount,
      };
  
      const response = await axios.post(
        `${backendUrl}/api/orders`,
        orderData
      );
      console.log("Order success:", response.data);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error("Order failed:", error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      {/* Floating card container */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl w-full transition-transform transform hover:scale-105 hover:shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex justify-center">
            <img 
              src={`${backendUrl}${product.image}`} 
              alt={product.name} 
              className="rounded-lg w-64 h-64 object-cover shadow-lg" 
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg mb-2">{product.description}</p>
            <p className="text-xl font-semibold text-green-600 mb-4">KSh {product.price}</p>
            <p className="text-sm text-gray-600">Category: {product.category}</p>

            {/* Supplier details */}
            <p className="text-sm text-gray-600 mb-4">
              Supplier: {product.supplier?.name || 'Unknown Supplier'}
            </p>

            {/* Display rating if it exists */}
            {product.rating && (
              <p className="text-sm text-yellow-500 mb-4">Rating: {product.rating}⭐</p>
            )}

            {cartQuantity === 0 ? (
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            ) : (
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <button 
                    className="bg-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-400 transition"
                    onClick={decreaseCartQuantity}
                  >
                    -
                  </button>
                  <span className="text-xl font-bold">{cartQuantity}</span>
                  <button 
                    className="bg-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-400 transition"
                    onClick={increaseCartQuantity}
                  >
                    +
                  </button>
                </div>

                {/* Display total amount */}
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  Total Amount: KSh {totalAmount}
                </p>

                {/* Order Now Button */}
                {cartQuantity > 0 && (
                  <button 
                    className={`${
                      orderPlaced
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    } px-4 py-2 rounded-lg transition`}
                    onClick={handleOrderNow}
                    disabled={orderPlaced}
                  >
                    {orderPlaced ? 'Order Placed' : 'Order Now'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
