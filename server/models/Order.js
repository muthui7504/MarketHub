import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;