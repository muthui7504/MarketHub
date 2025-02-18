import userModel from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import supplierModel from '../models/supplierModel.js';
import sellerModel from '../models/sellerModel.js';


export const Register = async (req, res) => {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            userType: userType.toLowerCase(),
        });

        await user.save();

        // 🔹 If userType is supplier, create supplier entry
        if (user.userType === "supplier") {
            const supplier = new supplierModel({
                user: user._id, // Assign user ID to supplier model
                companyName: "", // Default empty values
                companyDescription: "",
                address: "",
                phone: "",
                categories: [],
                image: "",
            });
            await supplier.save();
        }

        // 🔹 If userType is seller, create seller entry
        if (user.userType === "seller") {
            const seller = new sellerModel({
                user: user._id, // Assign user ID to seller model
                businessName: "", // Default empty values
                address: "",
                phone: "",
                preferredCategories: [],
                image: "",
            });
            await seller.save();
        }

        // Create token and send response
        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({ success: true, userType: user.userType, message: "User added successfully" });

    } catch (error) {
        console.error("An error occurred in register", error);
        return res.status(500).json({ success: false, message: 'An error occurred while registering the user' });
    }
};


export const login  = async (req,res) =>{
    const {email, password} = req.body;

    if (!email || !password){
        return res.json({success: false, message: "email and passord are required"})
    }
    
    try{
        const user = await userModel.findOne({email});

        if (!user){
            return res.json({success: false, message: 'innvalid email'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            return res.json({success: false, message: 'invalid password'} )
        }
        const token = jwt.sign({id:user._id, userType:user.userType}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: 7 * 24 *60 * 60 * 1000
        })

        return res.json({success: true, userType:user.userType, message: 'login successfull'})
    }catch(error){
        res.json({sucess:false, message:error.message})
    }
        
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
        })
        return res.json({success:true, message: 'logged out '})

    }catch(error){
        console.error('error during login', error);
        return res.status(500).json({success:false, message: 'server error'})
    }
}
/// fetchind all users in the  added in usermodel

export const allUsers = async (req, res) =>{
    const users = await userModel.find();

    if(!users){
        return res.json({message: 'no users found'})
    }
    return res.json({users})
}
// fetcching all users in byyer model
export const allSellers = async (req, res) =>{
    const Sellers = await sellerModel.find();

    if(!Sellers){
        return res.json({message: 'no Sellers found'})
    }
    return res.json({Sellers})
}
// fetching all users in supplier model
export const allSuppliers = async (req, res) =>{
    const suppliers = await supplierModel.find();

    if(!suppliers){
        return res.json({message: 'no suppliers found'})
    }
    return res.json({suppliers})
}

// deleting a user from the db
export const deleteUser = async (req, res) =>{
    const {email} = req.body 
    if (!email){
        return res.json({success: false, message:'No email enterd'})
    }

    
    try{
        const user = await userModel.findOne({email})
        if (!user){
            return res.json({success: false, message: "no user found with the specified email"})
    }
        const result = await userModel.deleteOne({email})
        return res.json({success:true, user, message:'user deleted sucessfully'})
    }catch(error){
        console.error(error)
    }


}
// send verification otp to email
export const sendVerifyOtp = async (req, res) =>{

    try{
        const {userId} = req.body
     
        const user = await userModel.findById(userId)

        if (user.isAccountVerified){
            return res.json({sucess: false, message:'account already verified'})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24*60*60*1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification Otp',
            text: `your verification otp is ${otp}. Verify you account using this otp!`
          
        }
        await transporter.sendMail(mailOptions)
        return res.json({success: true, message: 'verify otp send on email'})
    }
    catch(error){
        return res.json({success: false, message: error.message})
    }
    

}
// email verification using otp
export const verifyEmail = async (req,res) =>{
    const {userId, otp} = req.body

    if(!userId || !otp){
        return res.json({success: false, message: 'missing details'})
    }
    try{
        const user = await userModel.findById(userId)

        if(!user){
            return res.json({sucess: false, message: 'user not found'})
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false, message: 'invalid otp'});
        }
        if (user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message: 'OTP expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({success:true, message :'Email  verified successfully'})


    }catch(error){
        return res.json({sucess: false, message: error.message})
    }
}

//check if user is authenticated

export const isAunthenticated = async(req, res) =>{
    try{
        return res.json({success:true})
    }
    catch(error){
        return res.json({success:false, message: error.message})
    }
}

// send  password  reset otp
export const sendResetOtp = async (req, res) =>{
    const {email} = req.body;

    if (!email){
        return res.json({success:false, message:'email required please!'})
    }
    try{

        const user = await userModel.findOne({email})

        if (!user){
            return res.json({success: false, message: 'invalid email. Please Try again!'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            text: `your password reset otp is ${otp}. reset your passord using this otp!`
          
        }
        await transporter.sendMail(mailOptions)
        return res.json({success: true, message: 'passowrd reset otp send to your email'})

    }catch(error){
        return res.json({success: false, message:error.message})
    }
}
// reset user password
export const resetPassword = async (req,res) =>{
    const {email, otp, newPassword} = req.body
    if (!email || !otp || !newPassword){
        return res.json({success:false, message:'missing details'})
    }

    try{

        const user = await userModel.findOne({email})

        if (!user){
            return res.json({success:false, message: 'user not found'});
        }

        if (user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success: false, message: 'invalid otp'})
        }

        if (user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message: 'expired otp'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: "password has been reset successfully"})

    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const deleteallsuppliers = async (req, res) =>{
    try{
        const result = await supplierModel.deleteMany()
        return res.json({success:true, message:'all suppliers deleted successfully'})
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}