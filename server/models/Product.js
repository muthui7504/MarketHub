import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String },
  quantity: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  available: { type: Boolean, default: false },
  image: { type: String, default: '' }, // Image URL
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Product = mongoose.model('Product', productSchema);

export default Product;
