import express from 'express';
import {
  createOrder,
  getOrdersBySupplier,
  getOrdersBySeller,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderControllers.js'; // Import order controller functions
import userAuth from '../middleware/userAuth.js'; // Authentication middleware


const router = express.Router();

// Route for creating a new order (authenticated seller)
router.post('/', userAuth, createOrder);
  
// Route for getting all orders of a specific supplier (authenticated supplier)
router.get('/supplier', userAuth, getOrdersBySupplier);

// Route for getting all orders of a specific seller (authenticated seller)
router.get('/seller', userAuth, getOrdersBySeller);

// Route for getting all orders (optional filtering by supplier or seller)
router.get('/', userAuth, getAllOrders);

// Route for getting a single order by its ID (authenticated user)
router.get('/orders/:orderId', userAuth, getOrderById);

// Route for updating an order's status (authenticated supplier)
router.patch('/orders/:orderId/status', userAuth, updateOrderStatus);

// Route for deleting an order (authenticated user)
router.delete('/orders/:orderId', userAuth, deleteOrder);

export default router;
