import mongoose from 'mongoose';
import User from './userModels.js'; // Import the User model

const supplierSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: false},
  companyDescription: String,
  rating: { type: Number, default: 0 },
  categories: [String], // Product categories supplied
  address: String,
  image: { type: String, default: '' }, 
  phone: String,
});

const supplierModel = mongoose.model('Supplier', supplierSchema);
export default supplierModel;
