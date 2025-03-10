const mongoose = require('mongoose');

const CentralAccountSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      amount: Number,
      status: {
        type: String,
        enum: ['Pending', 'Released', 'Refunded'],
        default: 'Pending',
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const CentralAccount = mongoose.model('CentralAccount', CentralAccountSchema);
module.exports = CentralAccount;
