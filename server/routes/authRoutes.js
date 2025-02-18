import express from 'express'
import { deleteallsuppliers, allSuppliers, allSellers, allUsers, deleteUser, isAunthenticated, login, logout, Register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'

const authRouter  = express.Router()

authRouter.post('/register', Register)
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



export default authRouter