import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../Context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderTable = () => {
  interface Order {
    _id: string;
    seller: {
      user: {
        name: string;
      };
    };
    supplier: {
      name: string;
    };
    products: {
      product: {
        name: string;
      };
      quantity: number;
    }[];
    totalAmount: number;
    status: string;
  }

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("OrderTable component must be used within an AppContextProvider");
  }

  const { backendUrl, isLoggedin, userData } = appContext;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedin && userData) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/orders/supplier`, { withCredentials: true });
          setOrders(response.data.orders);
        } catch (err: any) {
          console.error('Error fetching orders:', err);
          setError(err.response?.data?.message || 'Failed to fetch orders.');
          toast.error('Failed to fetch orders.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [backendUrl, isLoggedin, userData]);

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    const newStatus = event.target.value;

    try {
      await axios.patch(
        `${backendUrl}/api/orders/${orderId}/${newStatus}`,  // Corrected URL structure
        {},
        { withCredentials: true }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated successfully');
    } catch (err) {
      console.error('Failed to update order status', err);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Recent Orders</h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Buyer Name</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Product</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Quantity</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Total</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5>
          </div>
        </div>

        {orders.map((order) => (
          <div className="grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark" key={order._id}>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{order.seller.user.name}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{order.products[0].product.name}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{order.products[0].quantity}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e, order._id)}
                className="px-3 py-1.5 bg-white border border-stroke rounded text-sm text-black dark:bg-boxdark dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelded</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTable;
