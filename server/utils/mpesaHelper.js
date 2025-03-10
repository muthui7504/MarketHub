import axios from 'axios';
import base64 from 'base-64';

export const mpesaAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = base64.encode(`${consumerKey}:${consumerSecret}`);

  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
};

export const generateMpesaPassword = (timestamp) => {
  const shortCode = process.env.BUSINESS_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const password = base64.encode(`${shortCode}${passkey}${timestamp}`);
  return password;
};
