import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaUser, FaCalendarAlt, FaBox, FaHashtag, FaDollarSign, FaTag } from 'react-icons/fa';
import { AppContext } from '../../Context/appContext';

interface OrderDetailsProps {
  orderId: string;
  sellerName: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  orderDate: string;
  status: string;
  productImage: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  sellerName,
  productName,
  quantity,
  totalAmount,
  orderDate,
  status,
  productImage,
}) => {
  // Function to handle dynamic status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-200 text-green-800';
      case 'Shipped':
        return 'bg-blue-200 text-blue-800';
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="w-full p-2">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-600 flex items-center">
        {/* Product Image */}
        <div className="w-1/4 p-2">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-24 object-cover rounded-md"
          />
        </div>

        {/* Order Details */}
        <div className="w-3/4 p-2 flex flex-col justify-between gap-2">
          {/* Order Title */}
          <div className="flex items-center">
            <FaShoppingCart className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Order #{orderId}</h2>
          </div>

          {/* Seller and Product Info */}
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center">
              <FaUser className="text-blue-500 mr-1" />
              <div>
                <p className="text-xs text-gray-500">Seller</p>
                <p className="text-sm font-medium text-gray-800">{sellerName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaBox className="text-blue-500 mr-1" />
              <div>
                <p className="text-xs text-gray-500">Product</p>
                <p className="text-sm font-medium text-gray-800">{productName}</p>
              </div>
            </div>
          </div>

          {/* Quantity and Total Amount */}
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center">
              <FaHashtag className="text-blue-500 mr-1" />
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-800">{quantity}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaDollarSign className="text-blue-500 mr-1" />
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-sm font-medium text-gray-800">${totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Order Date and Status */}
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-1" />
              <div>
                <p className="text-xs text-gray-500">Order Date</p>
                <p className="text-sm font-medium text-gray-800">{orderDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaTag className="text-blue-500 mr-1" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SellerOrdersTable = () => {
  const [orders, setOrders] = useState<OrderDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error("SellerOrdersTable component must be used within an AppContextProvider");
  }

  const { backendUrl } = appContext;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/orders/recent-orders`);
        const fetchedOrders = response.data.orders.map((order: any) => ({
          orderId: order._id,
          sellerName: order.seller.companyName || order.supplier.companyName,
          productName: order.products[0].product.name,
          quantity: order.products[0].quantity,
          totalAmount: order.totalAmount,
          orderDate: new Date(order.orderDate).toLocaleDateString(),
          status: order.status,
          productImage: `${backendUrl}${order.products[0].product.image}`,
        }));
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {orders.map((order) => (
        <OrderDetails key={order.orderId} {...order} />
      ))}
    </div>
  );
};

export default SellerOrdersTable;
