import Product from '../models/Product.js';
import Supplier from '../models/supplierModel.js';

// Create a new product

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const userId = req.user.id;

    // Get the supplier ID from the logged-in user
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Handle multiple images (assuming only one is required, pick the first one)
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const available = quantity > 0; // Set availability based on quantity

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      supplier: supplier._id, // Set supplier field correctly
      quantity,
      image,
      available,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};



// Get all products for the logged-in user (supplier)
export const getProducts = async (req, res) => {
  try {
    const userId = req.user.id; // This is the logged-in user's ID

    // Find the supplier associated with the logged-in user
    const supplier = await Supplier.findOne({ user: userId });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Fetch the products for this supplier
    const products = await Product.find({ supplier: supplier._id }).populate('supplier', 'name');

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};




// Get all products (optional filtering by category or supplier)
export const getAllProducts = async (req, res) => {
  try {
    const { category, supplier } = req.query;
    let products;

    if (category) {
      // Filter by category and sort by creation date
      products = await Product.find({ category })
        .populate('supplier', 'name')
        .sort({ createdAt: -1 });
    } else if (supplier) {
      // Filter by supplier and sort by creation date
      products = await Product.find({ supplier })
        .populate('supplier', 'name')
        .sort({ createdAt: -1 });
    } else {
      // Fetch all products and sort by creation date
      products = await Product.find()
        .populate('supplier', 'name')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
}


// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('supplier', 'name contact email'); // Populate with more fields

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
};


// Update a product
// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, image } = req.body;

    // Determine availability based on quantity
    const available = quantity > 0 ? true : false;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { 
        name, 
        description, 
        price, 
        category, 
        quantity, 
        image, 
        available, // Update availability based on quantity
        updatedAt: Date.now() 
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
  }
};

export const deleteAllProduct = async (req, res) => {
  try {
    await Product.deleteMany();
    res.status(200).json({ success: true, message: 'All products deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete products', error: error.message });
  }
}
