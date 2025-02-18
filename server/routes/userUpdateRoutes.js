import { getSupplier, updateSupplier, updateSeller } from '../controllers/userUpdateController.js'; // Assuming both controllers are in the same file
import userAuth from '../middleware/userAuth.js';
import express from 'express';

const Router = express.Router();

Router.put('/update-supplier', userAuth, updateSupplier);
Router.put('/update-seller', userAuth, updateSeller);
Router.get('/get-supplier', userAuth, getSupplier);

export default Router;