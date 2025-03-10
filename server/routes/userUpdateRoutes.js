import express from 'express';
import { getSeller ,getSupplier, updateSupplier, updateSeller } from '../controllers/userUpdateController.js'; // Assuming both controllers are in the same file
import userAuth from '../middleware/userAuth.js';
import upload from '../config/multerConfig.js'; // Import Multer config

const Router = express.Router();

Router.put('/update-supplier', userAuth, upload, updateSupplier);
Router.put('/update-seller', userAuth, upload, updateSeller);
Router.get('/get-supplier', userAuth, getSupplier);
Router.get('/get-seller', userAuth, getSeller);

export default Router;
