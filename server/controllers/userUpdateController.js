import supplierModel from '../models/supplierModel.js';
import sellerModel from '../models/sellerModel.js';
import userModel from '../models/userModels.js'; 


// Update supplier details
export const updateSupplier = async (req, res) => {
    try {
      const userId  = req.user.id; // Assuming userId is available in req.user
      const { companyName, companyDescription, categories, phone, address } = req.body;
  
      // Check if file is uploaded
      const image = req.file ? `/uploads/${req.file.filename}` : null;
  
      // Find and update the supplier
      const supplier = await supplierModel.findOneAndUpdate(
        { user: userId }, // Find the supplier by user ID
        { companyName, companyDescription, categories, phone, address, image }, // Update fields
        { new: true } // Return the updated document
      );
  
      if (!supplier) {
        return res.status(404).json({ success: false, message: 'Supplier not found' });
      }
  
      // Return the updated supplier in the response
      res.status(200).json({
        success: true,
        message: 'Supplier profile updated successfully',
        supplier, // Include the updated supplier object
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Update seller details
export const updateSeller = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming userId is available in req.user
      const { businessName, preferredCategories, phone, address } = req.body;

      const image = req.file ? `/uploads/${req.file.filename}` : null;
      const seller = await sellerModel.findOneAndUpdate(
        { user: userId }, // Find the seller by user ID
        { businessName, preferredCategories, phone, address, image }, // Update fields
        { new: true } // Return the updated document
      );

      if (!seller) {
        return res.status(404).json({ success: false, message: 'Seller not found' });
      }

      res.status(200).json({  
        success: true,
        message: 'Seller profile updated successfully',
        seller, // Include the updated seller object
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


export const getSupplier = async (req, res) => {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }
  
    try {
      // Find the user by ID
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Find the supplier by user ID and populate the user data
      const supplier = await supplierModel
        .findOne({ user: userId })
        .populate('user', 'name email phone dateJoined isVerified') // Populating the user fields you want
        .exec();
  
      if (!supplier) {
        return res.status(404).json({ success: false, message: 'Supplier not found' });
      }
  
      // Merge user and supplier data to return a combined response
      const profile = {
        name: supplier.user.name,
        email: supplier.user.email,
        phone: supplier.user.phone,
        dateJoined: supplier.user.dateJoined,
        isVerified: supplier.user.isVerified,
        companyName: supplier.companyName,
        companyDescription: supplier.companyDescription,
        rating: supplier.rating,
        categories: supplier.categories,
        address: supplier.address,
        image: supplier.image,
      };
  
      return res.json({ success: true, profile });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const getSeller = async (req, res) => {
    const userId = req.user?.id;
  
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }
  
    try {
      // Find the user by ID
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Find the seller by user ID and populate the user data
      const seller = await sellerModel
        .findOne({ user: userId })
        .populate('user', 'name email phone dateJoined isVerified') // Populating the user fields you want
        .exec();
  
      if (!seller) {
        return res.status(404).json({ success: false, message: 'Seller not found' });
      }
  
      // Merge user and seller data to return a combined response
      const profile = {
        name: seller.user.name,
        email: seller.user.email,
        phone: seller.user.phone,
        dateJoined: seller.user.dateJoined,
        isVerified: seller.user.isVerified,
        businessName: seller.businessName,
        rating: seller.rating,
        preferredCategories: seller.preferredCategories,
        address: seller.address,
        image: seller.image,
      };
  
      return res.json({ success: true, profile });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }