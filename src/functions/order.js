// functions/order.js

import axios from "axios";

// CREATE ORDER
// ✅ CREATE ORDER
export const createOrder = async (
  authtoken,
  orderData
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    orderData,
    {
      headers: {
        authtoken,
      },
    }
  );

// ✅ GET USER ORDERS
export const getUserOrders = async (
  authtoken
) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/orders`,
    {
      headers: {
        authtoken,
      },
    }
  );

// GET SINGLE ORDER
export const getSingleOrder = async (
  authtoken,
  orderId
) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/order/${orderId}`,
    {
      headers: {
        authtoken,
      },
    }
  );

// UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (
  authtoken,
  orderId,
  orderStatus
) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/order/${orderId}`,
    { orderStatus },
    {
      headers: {
        authtoken,
      },
    }
  );