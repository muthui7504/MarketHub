import axios from 'axios';
import moment from 'moment';
import CentralAccount from '../models/CentralAccount.js';
import Order from '../models/Order.js';
import { generateMpesaPassword, mpesaAccessToken } from '../utils/mpesaHelper.js';
import Seller from '../models/sellerModel.js';

export const processPayment = async (req, res) => {
  const { orderId, amount, sellerId, supplierId, phoneNumber } = req.body;
  const userId = req.user.id;

  try {
    const seller = await Seller.find({user: userId});
    const sellerId = seller._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Generate the MPESA password
    const mpesaPassword = generateMpesaPassword(); // Generated dynamically from MPESA Business Shortcode, PassKey, and Timestamp

    // Get MPESA access token
    const token = await mpesaAccessToken(); // Function to get an access token

    // Call the MPESA STK Push API
    const mpesaResponse = await axios({
      method: 'POST',
      url: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        "BusinessShortCode": process.env.MPESA_SHORTCODE, // Your Lipa Na MPESA Till Number or PayBill Number (Central Account)
        "Password": mpesaPassword,
        "Timestamp": moment().format('YYYYMMDDHHmmss'), // Current timestamp
        "TransactionType": "CustomerPayBillOnline", // Type of MPESA transaction
        "Amount": amount, // The amount the seller is paying
        "PartyA": phoneNumber, // Seller's phone number (MPESA number)
        "PartyB": process.env.MPESA_SHORTCODE, // The MPESA shortcode (Till/PayBill number) where funds are deposited
        "PhoneNumber": phoneNumber, // Same as PartyA (seller's phone number)
        "CallBackURL": "https://yourdomain.com/api/payment/callback", // The callback URL to confirm payment
        "AccountReference": "MarketHub", // Reference for the transaction (e.g., order ID)
        "TransactionDesc": "Payment for Order " + orderId // Description of the transaction
      }
    });

    // Handle the response from MPESA (STK push success)
    if (mpesaResponse.data.ResponseCode === "0") {
      // Success - Request Sent to the Seller's Phone
      res.status(200).json({
        message: 'Payment request sent successfully. Please complete the payment on your phone.'
      });
    } else {
      // Failure - Handle any MPESA API error codes
      res.status(500).json({
        error: 'Failed to initiate payment. Please try again.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
};
