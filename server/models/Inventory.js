const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
