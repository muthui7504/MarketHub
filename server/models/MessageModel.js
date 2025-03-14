const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String },
  sentAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
},
{ timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
