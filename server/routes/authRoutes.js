import express from 'express'
import { deleteallsuppliers, allSuppliers, allSellers, allUsers, deleteUser, isAunthenticated, login, logout, Register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, deleteallsellers, deleteallusers, getUser } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'
import upload from '../config/multerConfig.js'; // Import Multer config
import { get } from 'mongoose';


const authRouter  = express.Router()

authRouter.post('/register', upload, Register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/allUsers', allUsers)
authRouter.get('/allSellers', allSellers)
authRouter.get('/allSuppliers', allSuppliers)
authRouter.delete('/deleteUser', deleteUser)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)
authRouter.get('/is-auth', userAuth, isAunthenticated)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.delete('/delete-all-suppliers', deleteallsuppliers)
authRouter.delete('/delete-all-sellers', deleteallsellers)
authRouter.delete('/delete-all-users', deleteallusers)
authRouter.get('/get-user', userAuth, getUser)



export default authRouter