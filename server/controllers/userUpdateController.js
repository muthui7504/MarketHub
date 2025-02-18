import supplierModel from '../models/supplierModel.js';
import sellerModel from '../models/sellerModel.js';
import userModel from '../models/userModels.js'; 

// Update supplier details
export const updateSupplier = async (req, res) => {
  const userId = req.user?.id;

  const { image, categories, phone, address, companyName, companyDescription } = req.body;

  if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
  }

  try {
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      const supplier = await supplierModel.findOne({ user: userId });
      if (!supplier) {
          return res.status(404).json({ success: false, message: 'Supplier not found' });
      }

      // Update supplier details
      supplier.phone = phone || supplier.phone;
      supplier.address = address || supplier.address;
      supplier.companyName = companyName || supplier.companyName;
      supplier.companyDescription = companyDescription || supplier.companyDescription;
      supplier.categories = categories || supplier.categories;
      supplier.image = image || supplier.image;

      await supplier.save();
      return res.json({ success: true, message: 'Supplier profile updated successfully' });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
};

// Update seller details
export const updateSeller = async (req, res) => {
  const userId = req.user?.id;

  const { phone, address, bussinessName, image, preferredCategories } = req.body;

  if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
  }

  try {
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      const seller = await sellerModel.findOne({ user: userId });
      if (!seller) {
          return res.status(404).json({ success: false, message: 'Seller not found' });
      }

      // Update seller details
      seller.phone = phone || seller.phone;
      seller.address = address || seller.address;
      seller.bussinessName = bussinessName || seller.bussinessName;
      seller.preferredCategories = preferredCategories || seller.preferredCategories;
      seller.image = image || seller.image;

      await seller.save();
      return res.json({ success: true, message: 'Seller profile updated successfully' });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSupplier = async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID required' });
    }
    
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        const supplier = await supplierModel.findOne({ user: userId });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
    
        return res.json({ success: true, supplier });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
    }