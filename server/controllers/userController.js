import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the authenticated user's token

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Useru not found!' });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        id: user._id.toString(), // Convert ObjectId to string
        userType: user.userType,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error); // Log the error for debugging
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};