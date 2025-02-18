import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { supplier, products, totalAmount } = req.body;
    const seller = req.user.id; // Assuming req.user contains the authenticated seller's ID

    
    // Ensure products array is provided and is not empty
    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in the order' });
    }

    // Validate that each product exists before proceeding
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.product} not found` });
      }
    }

    // Create new order with the provided data
    const newOrder = new Order({
      seller,
      supplier,
      products,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

// Get all orders for a supplier
export const getOrdersBySupplier = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const orders = await Order.find({ supplier: supplierId })
      .populate('products.product', 'name')
      .populate('seller', 'name');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders for the supplier', error: error.message });
  }
};

// Get all orders for a seller
export const getOrdersBySeller = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orders = await Order.find({ seller: sellerId })
      .populate('products.product', 'name')
      .populate('supplier', 'name');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders for the seller', error: error.message });
  }
};

// Get all orders (optional filtering by supplier or seller)
export const getAllOrders = async (req, res) => {
  try {
    const { supplier, seller } = req.query;
    let orders;

    if (supplier) {
      orders = await Order.find({ supplier })
        .populate('products.product', 'name')
        .populate('seller', 'name');
    } else if (seller) {
      orders = await Order.find({ seller })
        .populate('products.product', 'name')
        .populate('supplier', 'name');
    } else {
      orders = await Order.find()
        .populate('products.product', 'name')
        .populate('supplier seller', 'name');
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId)
      .populate('products.product', 'name')
      .populate('supplier seller', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

// Update order status (for suppliers)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;
    const supplierId = req.user.id; // Assuming req.user contains the authenticated supplier's ID

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure that the logged-in supplier is the one associated with the order
    if (order.supplier.toString() !== supplierId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this order' });
    }

    // Update the order status and updatedAt field
    order.status = status;
    order.updatedAt = Date.now();
    const updatedOrder = await order.save();

    res.status(200).json({ success: true, message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
  }
};
