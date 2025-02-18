import Connection from '../models/connectionModel.js';
import User from '../models/userModels.js'; // Assuming you have a User model for buyers and suppliers

// Create a new connection request (from buyer to supplier)
export const createConnection = async (req, res) => {
  try {
    const {userId, supplierId } = req.body;
     // Extract sellerId from the token

    // Debugging logs
    console.log('Seller ID from token:', userId);
    console.log('Supplier ID from body:', supplierId);

    if (!supplierId) {
      return res.status(400).json({ success: false, message: 'Supplier ID is required' });
    }

    // Create the new connection
    const newConnection = new Connection({
      seller: userId,  // This should now be populated with the ID from the token
      supplier: supplierId,
      status: 'Pending',
    });

    await newConnection.save();

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      connection: newConnection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get all connection requests for a user (either a buyer or a supplier)
export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all connection requests for the user
    const connections = await Connection.find({
      $or: [{ buyer: userId }, { supplier: userId }]
    }).populate('buyer supplier', 'name email');

    res.status(200).json({ success: true, connections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching connection requests', error });
  }
};

// Update the status of a connection (Accept/Reject)
export const updateConnectionStatus = async (req, res) => {
  try {
    const connectionId = req.params.connectionId;
    const { status } = req.body; // Accepted or Rejected

    // Update connection status
    const updatedConnection = await Connection.findByIdAndUpdate(connectionId, {
      status,
      updatedAt: Date.now()
    }, { new: true });

    if (!updatedConnection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    res.status(200).json({ success: true, message: `Connection ${status}`, updatedConnection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating connection status', error });
  }
};

// Get suggested connections for a buyer or supplier
export const getSuggestedConnections = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Fetch all users except the one making the request (you can filter by type if needed)
    const suggestedUsers = await User.find({
      _id: { $ne: userId }
    }).select('name email avatar'); // You can add any other fields

    res.status(200).json({ success: true, suggestedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching suggested connections', error });
  }
};
