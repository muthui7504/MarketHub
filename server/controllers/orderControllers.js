import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Seller from '../models/sellerModel.js';
import Supplier from '../models/supplierModel.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { supplier, products, totalAmount } = req.body;
    const userId = req.user.id;

    // Find the seller based on the logged-in user's ID
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    // Ensure products array is provided and is not empty
    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in the order' });
    }

    // Validate each product exists in the products collection before proceeding
    const productIds = products.map((item) => item.product);
    const validProducts = await Product.find({ _id: { $in: productIds } });

    // If the number of valid products is not equal to the number of products in the order, return an error
    if (validProducts.length !== products.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more products in the order were not found',
      });
    }

    // Create new order with the provided data
    const newOrder = new Order({
      seller: seller._id,
      supplier,
      products,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

export const getOrdersBySupplier = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the supplier associated with the logged-in user
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Calculate the date for 2 weeks ago from today
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Fetch the orders for this supplier made within the last two weeks
    const orders = await Order.find({
      supplier: supplier._id,
      orderDate: { $gte: twoWeeksAgo }
    })
      .populate({
        path: 'seller',
        select: 'user', // Populate seller's user reference
        populate: { path: 'user', select: 'name' } // Populate seller's user's name
      })
      .populate('products.product', 'name'); // Populating product name

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders for the supplier', error: error.message });
  }
};



// Get all orders for a seller
export const getRecentOrdersBySeller = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID

    // Find the seller associated with the logged-in user
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    // Calculate the date for 2 weeks ago from today
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 days ago from now
    console.log('Two weeks ago:', twoWeeksAgo);

    // Fetch the orders for this seller made within the last two weeks
    const orders = await Order.find({
      seller: seller._id, // Match orders for the specific seller
      orderDate: { $gte: twoWeeksAgo } // Filter orders within the last two weeks
    })
      .populate('products.product', 'name image' ) // Populate product names
      .populate('supplier', 'companyName'); // Populate supplier's company name

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders for the seller', error: error.message });
  }
};


export const getOrdersBySeller = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    
    // Find the seller associated with the logged-in user
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    // Fetch all orders for this seller without time restriction
    const orders = await Order.find({
      seller: seller._id // Match orders for the specific seller
    })
      .populate('products.product', 'name') // Populate product names
      .populate({
        path: 'supplier', // Populate supplier
        populate: { path: 'user', select: 'name' } // Populate supplier's user reference and name
      });

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
    const { status } = req.params; 
    const orderId = req.params.orderId;
    const userId = req.user.id; // Assuming req.user contains the authenticated supplier's ID

    // Find the supplier associated with the authenticated user
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const supplierId = supplier._id;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure that the logged-in supplier is the one associated with the order
    if (order.supplier.toString() !== supplierId.toString()) {
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

export const totalOrdersBySupplier = async (req, res) => {
  try {
    const supplierId = req.user.id;
    const total = await Order.count
    ({ supplier: supplierId });
    res.status(200).json({ success: true, total });
  }
  catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch total orders', error: error.message });
  }
}
