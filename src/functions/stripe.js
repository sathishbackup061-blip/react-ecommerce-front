import axios from "axios";

export const createPaymentIntent = (authtoken, data) =>
  axios.post(
    `${process.env.REACT_APP_API}/create-payment-intent`,
    data,
    {
      headers: {
        authtoken,
      },
    }
  );