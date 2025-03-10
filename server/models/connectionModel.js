import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },  // Seller involved in the connection
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },  // Supplier involved in the connection
  
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', ''], 
    default: ''  // Tracks the status of the connection
  },
  
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Tracks who initiated the connection request (seller or supplier)
  
  createdAt: { type: Date, default: Date.now },  // When the connection was created
  updatedAt: { type: Date, default: Date.now },  // Last updated timestamp
});

const connectionModel = mongoose.model('Connection', connectionSchema);

export default connectionModel;
