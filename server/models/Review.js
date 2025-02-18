const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  reviewDate: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
