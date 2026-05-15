import axios from "axios";

// =============================
// GET ALL BANNERS
// =============================
export const getBanners = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API}/banners`
  );
};

// =============================
// GET SINGLE BANNER
// =============================
export const getBanner = async (id) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/banner/${id}`
  );
};

// =============================
// CREATE BANNER
// =============================
export const createBanner = async (
  banner,
  authtoken
) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/banner`,
    banner,
    {
      headers: {
        authtoken,
      },
    }
  );
};

// =============================
// UPDATE BANNER
// =============================
export const updateBanner = async (
  id,
  banner,
  authtoken
) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/banner/${id}`,
    banner,
    {
      headers: {
        authtoken,
      },
    }
  );
};

// =============================
// DELETE BANNER
// =============================
export const removeBanner = async (
  id,
  authtoken
) => {
  return await axios.delete(
    `${process.env.REACT_APP_API}/banner/${id}`,
    {
      headers: {
        authtoken,
      },
    }
  );
};

// =============================
// GET BANNERS BY TYPE
// =============================
export const getBannersByType = async (
  type
) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/banners/type/${type}`
  );
};