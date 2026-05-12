import axios from "axios";

// GET ALL ORDERS
export const getOrders = async (authtoken) =>
  await axios.get(
    `${process.env.REACT_APP_API}/admin/orders`,
    {
      headers: {
        authtoken,
      },
    }
  );

// UPDATE ORDER STATUS
export const changeOrderStatus = async (
  authtoken,
  orderId,
  orderStatus
) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/order-status`,
    {
      orderId,
      orderStatus,
    },
    {
      headers: {
        authtoken,
      },
    }
  );