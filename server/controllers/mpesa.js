const axios = require('axios');
const moment = require('moment');
const MPESAPayment = require('../models/mpesaPayment');

// MPESA configuration (replace with your real values)
const mpesaConfig = {
  shortCode: '123456', // Paybill or Till number
  passkey: 'your_passkey',
  consumerKey: 'your_consumer_key',
  consumerSecret: 'your_consumer_secret',
  callbackUrl: 'https://your-domain.com/api/payment/mpesa-callback',
};

// Function to get MPESA access token
const getMPESAAccessToken = async () => {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const response = await axios.get(url, {
    auth: {
      username: mpesaConfig.consumerKey,
      password: mpesaConfig.consumerSecret,
    },
  });
  return response.data.access_token;
};

// Controller to initiate MPESA payment
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, phoneNumber, orderId } = req.body;

    // Get MPESA access token
    const accessToken = await getMPESAAccessToken();

    // Prepare STK Push data
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${mpesaConfig.shortCode}${mpesaConfig.passkey}${timestamp}`).toString('base64');

    const stkPushData = {
      BusinessShortCode: mpesaConfig.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber, // The buyer's phone number
      PartyB: mpesaConfig.shortCode, // MPESA paybill/till number
      PhoneNumber: phoneNumber,
      CallBackURL: mpesaConfig.callbackUrl,
      AccountReference: `Order_${orderId}`, // Unique order reference
      TransactionDesc: 'MarketHub Payment',
    };

    // Send STK Push request to MPESA
    const mpesaResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushData,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Respond to client
    res.status(200).json({ message: 'Payment initiated', mpesaResponse: mpesaResponse.data });
  } catch (error) {
    console.error('MPESA Payment Error:', error);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// Controller to handle MPESA payment callback
exports.mpesaCallback = async (req, res) => {
  try {
    const { Body: { stkCallback } } = req.body;

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const payment = new MPESAPayment({
        order: stkCallback.CallbackMetadata.Item[0].Value, // Use actual value for order
        seller: 'seller_id', // Replace with actual seller info
        amount: stkCallback.CallbackMetadata.Item[2].Value,
        phoneNumber: stkCallback.CallbackMetadata.Item[4].Value,
        mpesaTransactionId: stkCallback.CallbackMetadata.Item[1].Value,
        paymentStatus: 'Completed',
      });

      await payment.save();
      console.log('MPESA Payment Successful:', payment);
    } else {
      // Payment failed
      console.log('MPESA Payment Failed:', stkCallback.ResultDesc);
    }

    res.status(200).json({ message: 'Callback received successfully' });
  } catch (error) {
    console.error('MPESA Callback Error:', error);
    res.status(500).json({ message: 'Callback processing failed', error: error.message });
  }
};
