import axios from "axios";

export const applyCoupon = async (code, cartTotal, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/coupon/validate`,
    { code, cartTotal },
    {
      headers: {
        authtoken: authtoken, // MUST NOT be undefined
      },
    }
  );