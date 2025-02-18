import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Seller initiating the connection
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Supplier being connected to
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected'], 
    default: 'Pending' // Tracks the status of the connection
  },
  createdAt: { type: Date, default: Date.now }, // When the connection was created
  updatedAt: { type: Date, default: Date.now }, // Last updated timestamp
});

const connectionModel = mongoose.model('Connection', connectionSchema);

export default connectionModel;