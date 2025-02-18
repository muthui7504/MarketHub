const mongoose = require('mongoose');

const mpesaPaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  amount: { type: Number, required: true },
  phoneNumber: { type: String, required: true }, // Seller's phone number for MPESA payment
  mpesaTransactionId: { type: String, required: true }, // MPESA transaction ID
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentDate: { type: Date, default: Date.now },
});

const MPESAPayment = mongoose.model('MPESAPayment', mpesaPaymentSchema);
module.exports = MPESAPayment;
