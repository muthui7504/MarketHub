import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  quantity: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  available: { type: Boolean, default: false },
  images: [String], // Array of image URLs
});

const Product = mongoose.model('Product', productSchema);

export default Product;