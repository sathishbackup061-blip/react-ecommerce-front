import axios from "axios";

export const userCart = async (cart, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart`,
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  );

  export const getUserCart = async (authtoken) =>
    await axios.get(
        `${process.env.REACT_APP_API}/user/cart`,
        {
        headers: {
            authtoken,
        },
        }
    );

// functions/user.js

export const saveUserAddress = async (
  authtoken,
  address,
  phone
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/address`,
    {
      address,
      phone,
    },
    {
      headers: {
        authtoken,
      },
    }
  );



  // ADD
export const addToWishlist = async (
  productId,
  authtoken
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: {
        authtoken,
      },
    }
  );

// GET
export const getWishlist = async (
  authtoken
) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/wishlist`,
    {
      headers: {
        authtoken,
      },
    }
  );

// REMOVE
export const removeWishlist = async (
  productId,
  authtoken
) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {
      headers: {
        authtoken,
      },
    }
  );