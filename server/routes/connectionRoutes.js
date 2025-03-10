import express from 'express';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getSellerConnections,
  getPendingRequests,
  deleteAllConnectionRequests,
  getUnconnectedEntities,
  getConnectedUserCount,
  getConnectedUsers
} from '../controllers/connectionController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Route to send a connection request
router.post('/', userAuth, sendConnectionRequest);

// Route to accept a connection request
router.put('/:connectionId/accept', userAuth, acceptConnectionRequest);

// Route to reject a connection request
router.put('/:connectionId/reject', userAuth, rejectConnectionRequest);

// Route to get all connection requests for a seller or supplier
router.get('/seller', userAuth, getSellerConnections)


router.get('/pending-requests', userAuth, getPendingRequests)
router.get('/unconnected-entities', userAuth, getUnconnectedEntities)
router.delete('/delete', deleteAllConnectionRequests)
router.get('/connected-users-count', userAuth, getConnectedUserCount)
router.get('/connected-users', userAuth, getConnectedUsers)


export default router;
