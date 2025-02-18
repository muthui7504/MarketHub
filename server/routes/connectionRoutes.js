import express from 'express';
import {
  createConnection,
  getConnectionRequests,
  updateConnectionStatus,
  getSuggestedConnections
} from '../controllers/connectionController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Create a new connection request (middleware ensures user is authenticated)
router.post('/connections', userAuth, createConnection);

// Get all connection requests for the authenticated user
router.get('/connections', userAuth, getConnectionRequests);

// Update connection status (accept/reject) - also protected by userAuth
router.put('/connections/:connectionId', userAuth, updateConnectionStatus);

// Get suggested connections for the authenticated user
router.get('/suggestions', userAuth, getSuggestedConnections);

export default router;
