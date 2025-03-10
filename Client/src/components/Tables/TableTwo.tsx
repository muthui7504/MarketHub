import { useEffect, useState, useContext } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AppContext } from '../../Context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const OrderProductsTable = () => {
  interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string[];
  }

  const appContext = useContext(AppContext); // Access the context values
  if (!appContext) {
    throw new Error("SignIn component must be used within an AppContextProvider");
  }

  const { backendUrl, userData, isLoggedin } = appContext;
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedin && userData) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/products`);
          setProducts(response.data.products);
          console.log('Products:', response.data.products); // Debugging line
        } catch (error: any) {
          console.error('Error fetching products:', error);
          setError(error.response?.data?.message || 'Failed to load products.');
          toast.error('Failed to fetch products.');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [backendUrl, isLoggedin, userData]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`);
        setProducts((prev) => prev.filter((product) => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product.');
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">Order Products</h4>
        <Link to="/forms/addProduct">
          <button className="rounded-md bg-primary px-4 py-2 text-white text-sm hover:bg-primary-dark">
            Add New Product
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price (KES)</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Quantity</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Total (KES)</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {loading ? (
        <div className="py-4.5 px-4 text-center">
          <p className="text-sm text-black dark:text-white">Loading...</p>
        </div>
      ) : error ? (
        <div className="py-4.5 px-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : products && products.length > 0 ? (
        products.map((product) => (
          <div
            className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
            key={product._id}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <img
                    src={`${backendUrl}${product.image}`}
                    alt={product.name}
                    className="object-cover h-full w-full"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">{product.name}</p>
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{product.category}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">KES {product.price.toFixed(2)}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{product.quantity}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">KES {(product.price * product.quantity).toFixed(2)}</p>
            </div>
            <div className="col-span-1 flex items-center space-x-2">
              <button className="rounded-md bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600 flex items-center">
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600 flex items-center"
                onClick={() => handleDelete(product._id)}
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="py-4.5 px-4 text-center">
          <p className="text-sm text-black dark:text-white">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default OrderProductsTable;
