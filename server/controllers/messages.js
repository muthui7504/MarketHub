import Message from '../models/messageModel.js'; // Import the message model
import Connection from '../models/connectionModel.js'; // Import the connection model

export const sendMessage = async (req, res) => {
  const { recipientId, text, image } = req.body;
  const senderId = req.user.id; // Use the authenticated user's ID as the sender

  try {
    // Check if a connection exists between the sender and recipient
    const connection = await Connection.findOne({
      $or: [
        { seller: senderId, supplier: recipientId },
        { seller: recipientId, supplier: senderId },
      ],
      status: 'Accepted' // Ensure the connection is accepted
    });

    if (!connection) {
      return res.status(400).json({ message: 'No valid connection found between the users.' });
    }

    // If connection exists, create and save the message
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      text,
      image,
      sentAt: new Date(),
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending the message' });
  }
};
