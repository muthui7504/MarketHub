import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, default: ''},
  address: String,
  sellerRating: { type: Number, default: 0 },
  preferredCategories: [String], // Preferred product categories
  image: { type: String, default: '' },
  phone: String,
});

const seller = mongoose.model('Seller', sellerSchema);
 export default seller;