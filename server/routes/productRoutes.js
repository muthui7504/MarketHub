import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getAllProducts 
} from '../controllers/productsController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Create a product (only authenticated users)
router.post('/create', userAuth, createProduct);

// Get all products for a logged-in user (supplier)
router.get('/', userAuth, getProducts);

// Get all products (optionally filter by category or supplier)
router.get('/all', getAllProducts);

// Get a single product by ID
router.get('/:productId', getProductById);

// Update a product (only authenticated users)
router.put('/:productId', userAuth, updateProduct);

// Delete a product (only authenticated users)
router.delete('/:productId', userAuth, deleteProduct);

export default router;
