import Connection from '../models/connectionModel.js';
import Seller from '../models/sellerModel.js';
import Supplier from '../models/supplierModel.js';

// Send Connection Request
export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID from middleware
    const { targetId, targetType } = req.body; // targetId is the ID of the seller/supplier being targeted, targetType is either 'seller' or 'supplier'

    // Validate targetId and targetType
    if (!targetId || !targetType) {
      return res.status(400).json({ message: 'Target ID and target type are required' });
    }

    let connectionExists, newConnection, savedConnection, userName;

    if (targetType === 'supplier') {
      // Check if the user is a seller and populate the user details
      const seller = await Seller.findOne({ user: userId }).populate('user');
      if (!seller) {
        return res.status(403).json({ message: 'You are not authorized to send a connection request as a seller' });
      }

      userName = seller.user.name; // Get the associated seller's name

      // Check if the supplier exists and populate the user details
      const supplier = await Supplier.findById(targetId).populate('user');
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      // Check if a connection request already exists
      connectionExists = await Connection.findOne({ seller: seller._id, supplier: supplier._id });
      if (connectionExists) {
        return res.status(400).json({ message: 'Connection request already sent' });
      }

      // Create a new connection request, including the initiator
      newConnection = new Connection({
        seller: seller._id,
        supplier: supplier._id,
        status: 'Pending',
        initiator: userId,  // Set the initiator as the logged-in user
      });

    } else if (targetType === 'seller') {
      // Check if the user is a supplier and populate the user details
      const supplier = await Supplier.findOne({ user: userId }).populate('user');
      if (!supplier) {
        return res.status(403).json({ message: 'You are not authorized to send a connection request as a supplier' });
      }

      userName = supplier.user.name; // Get the associated supplier's name

      // Check if the seller exists and populate the user details
      const seller = await Seller.findById(targetId).populate('user');
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }

      // Check if a connection request already exists
      connectionExists = await Connection.findOne({ supplier: supplier._id, seller: seller._id });
      if (connectionExists) {
        return res.status(400).json({ message: 'Connection request already sent' });
      }

      // Create a new connection request, including the initiator
      newConnection = new Connection({
        supplier: supplier._id,
        seller: seller._id,
        status: 'Pending',
        initiator: userId,  // Set the initiator as the logged-in user
      });
    } else {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    savedConnection = await newConnection.save();

    // Return success message along with the associated user's name
    return res.status(201).json({
      message: 'Connection request sent',
      connection: savedConnection,
      userName: userName, // Include the associated user's name
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    return res.status(500).json({ message: 'Error sending connection request' });
  }
};

// Accept Connection Request
// Accept Connection Request by Seller
// Accept Connection Request (Bidirectional)
export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;  // Get logged-in user ID from middleware
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Check if the user is the seller or supplier in the connection
    const seller = await Seller.findOne({ user: userId });
    const supplier = await Supplier.findOne({ user: userId });

    if (seller && connection.seller.toString() === seller._id.toString()) {
      // The user is the seller accepting a request from the supplier
      if (connection.status !== 'Pending') {
        return res.status(400).json({ message: 'Connection request already processed' });
      }

      connection.status = 'Accepted';
      connection.updatedAt = Date.now();
      await connection.save();

      return res.status(200).json({ message: 'Connection request accepted by seller', connection });

    } else if (supplier && connection.supplier.toString() === supplier._id.toString()) {
      // The user is the supplier accepting a request from the seller
      if (connection.status !== 'Pending') {
        return res.status(400).json({ message: 'Connection request already processed' });
      }

      connection.status = 'Accepted';
      connection.updatedAt = Date.now();
      await connection.save();

      return res.status(200).json({ message: 'Connection request accepted by supplier', connection });
    }

    return res.status(403).json({ message: 'You are not authorized to accept this connection request' });
  } catch (error) {
    return res.status(500).json({ message: 'Error accepting connection request', error });
  }
};



// Reject Connection Request
// Reject Connection Request (Bidirectional)
export const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;  // Get logged-in user ID from middleware
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Check if the user is the seller or supplier in the connection
    const seller = await Seller.findOne({ user: userId });
    const supplier = await Supplier.findOne({ user: userId });

    if (seller && connection.seller.toString() === seller._id.toString()) {
      // The user is the seller rejecting a request from the supplier
      if (connection.status !== 'Pending') {
        return res.status(400).json({ message: 'Connection request already processed' });
      }

      connection.status = 'Rejected';
      connection.updatedAt = Date.now();
      await connection.save();

      return res.status(200).json({ message: 'Connection request rejected by seller', connection });

    } else if (supplier && connection.supplier.toString() === supplier._id.toString()) {
      // The user is the supplier rejecting a request from the seller
      if (connection.status !== 'Pending') {
        return res.status(400).json({ message: 'Connection request already processed' });
      }

      connection.status = 'Rejected';
      connection.updatedAt = Date.now();
      await connection.save();

      return res.status(200).json({ message: 'Connection request rejected by supplier', connection });
    }

    return res.status(403).json({ message: 'You are not authorized to reject this connection request' });
  } catch (error) {
    return res.status(500).json({ message: 'Error rejecting connection request', error });
  }
};


export const getSellerConnections = async (req, res) =>{
  try {
    const userId = req.user.id;  // Get logged-in user ID from middleware

    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(403).json({ message: 'You are not authorized to view your connections' });
    }

    const connections = await Connection.find({ seller: userId }).populate('supplier');
    if (!connections || connections.length === 0) {
      return res.status(404).json({ message: 'No connections found' });
    }

    return res.status(200).json({ connections });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching connections', error });
  }
};
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;  // The logged-in user ID

    // Find the seller or supplier associated with the user
    const seller = await Seller.findOne({ user: userId });
    const supplier = await Supplier.findOne({ user: userId });

    let pendingRequests;
    if (seller) {
      console.log("Seller found:", seller);  // Log seller details

      // Fetch pending requests for the seller, but exclude those initiated by the seller
      pendingRequests = await Connection.find({ seller: seller._id, status: 'Pending', initiator: { $ne: userId } })
        .populate({
          path: 'supplier',
          populate: { path: 'user', select: 'name image' }
        })
        .populate({
          path: 'seller',  // Populating seller details
          populate: { path: 'user', select: 'name image' }
        });
    } else if (supplier) {
      console.log("Supplier found:", supplier);  // Log supplier details

      // Fetch pending requests for the supplier, but exclude those initiated by the supplier
      pendingRequests = await Connection.find({ supplier: supplier._id, status: 'Pending', initiator: { $ne: userId } })
        .populate({
          path: 'seller',
          populate: { path: 'user', select: 'name image' }
        });
    } else {
      return res.status(403).json({ message: 'You are not authorized to view pending requests' });
    }

    console.log("Pending requests:", pendingRequests);  // Log pending requests
    return res.status(200).json({ pendingRequests });
  } catch (error) {
    console.error('Error fetching pending requests:', error);  // Log error
    return res.status(500).json({ message: 'Error fetching pending requests', error });
  }
};


export const getUnconnectedEntities = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID from middleware
    const { targetType } = req.query; // Query parameter to specify 'seller' or 'supplier'

    let allEntities, connections, connectedEntityIds, unconnectedEntities;

    if (targetType === 'supplier') {
      // Check if the user is a seller
      const seller = await Seller.findOne({ user: userId });
      if (!seller) {
        return res.status(403).json({ message: 'You are not authorized to view unconnected suppliers' });
      }

      // Fetch all suppliers
      allEntities = await Supplier.find().populate('user');
      
      // Get the seller's connections
      connections = await Connection.find({ seller: seller._id }).select('supplier');

      // Get connected supplier IDs
      connectedEntityIds = connections.map(connection => connection.supplier.toString());

      // Find unconnected suppliers
      unconnectedEntities = allEntities.filter(supplier => !connectedEntityIds.includes(supplier._id.toString()));

    } else if (targetType === 'seller') {
      // Check if the user is a supplier
      const supplier = await Supplier.findOne({ user: userId });
      if (!supplier) {
        return res.status(403).json({ message: 'You are not authorized to view unconnected sellers' });
      }

      // Fetch all sellers
      allEntities = await Seller.find().populate('user');
      
      // Get the supplier's connections
      connections = await Connection.find({ supplier: supplier._id }).select('seller');

      // Get connected seller IDs
      connectedEntityIds = connections.map(connection => connection.seller.toString());

      // Find unconnected sellers
      unconnectedEntities = allEntities.filter(seller => !connectedEntityIds.includes(seller._id.toString()));
    } else {
      return res.status(400).json({ message: 'Invalid target type. Please specify "seller" or "supplier"' });
    }

    // Return unconnected entities
    return res.status(200).json({ unconnectedEntities });

  } catch (error) {
    console.error('Error fetching unconnected entities:', error);
    return res.status(500).json({ message: 'Error fetching unconnected entities' });
  }
};

export const deleteAllConnectionRequests = async (req, res) => {
  try {
    await Connection.deleteMany();
    return res.status(200).json({ message: 'All connection requests deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting connection requests', error });
  }
}
export const getConnectedUserCount = async (req, res) => {
  try {
    const userId = req.user.id;  // Get logged-in user ID from middleware

    // Find if the user is a seller or a supplier
    const seller = await Seller.findOne({ user: userId });
    const supplier = await Supplier.findOne({ user: userId });

    if (!seller && !supplier) {
      return res.status(403).json({ message: 'You are not authorized to view your connections' });
    }

    let connections;
    if (seller) {
      // If the user is a seller, get all suppliers they are connected to
      connections = await Connection.find({ seller: seller._id, status: 'Accepted' }).populate('supplier');
    } else if (supplier) {
      // If the user is a supplier, get all sellers they are connected to
      connections = await Connection.find({ supplier: supplier._id, status: 'Accepted' }).populate('seller');
    }

    if (!connections || connections.length === 0) {
      return res.status(404).json({ message: 'No connections found' });
    }

    return res.status(200).json({ connections, count: connections.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching connections', error });
  }
};

// Controller to get the list of connected users where the connection status is 'Accepted'
export const getConnectedUsers = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID from middleware

    // Check if the user is a seller or supplier
    const seller = await Seller.findOne({ user: userId });
    const supplier = await Supplier.findOne({ user: userId });
    let connections;

    if (seller) {
      // If the user is a seller, find all accepted connections where the seller is the current user
      connections = await Connection.find({ seller: seller._id, status: 'Accepted' })
        .populate({
          path: 'supplier',
          populate: {
            path: 'user',
            select: 'name email image', // Include profile image in the populated user info
          },
        })
        .select('companyName address') // Select relevant supplier fields
        .exec();
    } else if (supplier) {
      // If the user is a supplier, find all accepted connections where the supplier is the current user
      connections = await Connection.find({ supplier: supplier._id, status: 'Accepted' })
        .populate({
          path: 'seller',
          populate: {
            path: 'user',
            select: 'name email image', // Include profile image in the populated user info
          },
        })
        .select('businessName address') // Select relevant seller fields
        .exec();
    } else {
      return res.status(403).json({ message: 'You are not authorized to view connected users' });
    }

    // Format the connected users data
    const connectedUsers = connections.map((connection) => {
      if (seller) {
        return {
          id: connection.supplier._id,
          name: connection.supplier.user.name,
          email: connection.supplier.user.email,
          image: connection.supplier.user.image, // Include profile image
          companyName: connection.supplier.companyName, // Use supplier's company name
          address: connection.supplier.address, // Use supplier's address
          connectedAt: connection.updatedAt, // Timestamp of the connection acceptance
        };
      } else if (supplier) {
        return {
          id: connection.seller._id,
          name: connection.seller.user.name,
          email: connection.seller.user.email,
          image: connection.seller.user.image, // Include profile image
          businessName: connection.seller.businessName, // Use seller's business name
          address: connection.seller.address, // Use seller's address
          connectedAt: connection.updatedAt, // Timestamp of the connection acceptance
        };
      }
    });

    return res.status(200).json({ connectedUsers });
  } catch (error) {
    console.error('Error fetching connected users:', error);
    return res.status(500).json({ message: 'Error fetching connected users' });
  }
};




