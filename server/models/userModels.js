import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['supplier', 'seller'], required: true }, // User type
  phone: { type: String, required: false },
  dateJoined: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }, // Email verification status
  otp: { type: String }, // OTP for email verification
  otpExpires: { type: Date }, // Expiry for OTP
  resetOtp:{type:String, default:''},
  resetOtpExpireAt: {type:String, default: 0},
  image: { type: String, default: '' },
});

userSchema.pre('remove', async function(next) {
  await this.model('Connection').deleteMany({ $or: [{ supplier: this._id }, { seller: this._id }] });
  next();
});

const userModel = mongoose.model('User', userSchema);
export default userModel