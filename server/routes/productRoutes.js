import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getAllProducts,
  deleteAllProduct
} from '../controllers/productsController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../config/multerConfig.js';


const router = express.Router();

// Route to create a new product (requires authentication)
router.post('/create', userAuth, upload, createProduct);

// Route to get all products for a logged-in user (supplier-specific)
router.get('/', userAuth, getProducts);

// Route to get all products, with optional filtering (e.g., by category or supplier)
router.get('/all', getAllProducts);

// Route to get details of a single product by its ID
router.get('/:productId', getProductById);

// Route to update an existing product (requires authentication)
router.put('/:productId', userAuth, updateProduct);

router.delete('/delete-all-products', userAuth, deleteAllProduct);

// Route to delete a product (requires authentication)
router.delete('/:productId', userAuth, deleteProduct);

export default router;
