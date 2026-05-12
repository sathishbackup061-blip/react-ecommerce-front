import axios from "axios";


// Create product
export const createProduct = async (data, authtoken) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/product`,
    data,
    {
      headers: {
        authtoken,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Get all products
export const getProducts = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/products`);
};

export const getProductsListCat = async (params) => {
  return await axios.get(`${process.env.REACT_APP_API}/products`, {
    params,
  });
};

// Get single product by slug
export const getProduct = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/${slug}`);
};

// Delete product by slug ✅
export const deleteProduct = async (slug, authtoken) => {
  const url = `${process.env.REACT_APP_API}/product/${slug}`;
  console.log("🗑️ DELETE URL:", url);
  console.log("🔑 Token:", authtoken?.substring(0, 20) + "...");
  console.log("📦 Product Slug:", slug);
  
  return await axios.delete(url, {
    headers: {
      authtoken,
    },
  });
};

// Update product by slug ✅
export const updateProduct = async (slug, data, authtoken) => {
  const url = `${process.env.REACT_APP_API}/product/${slug}`;
  console.log("🔄 UPDATE URL:", url);
  console.log("🔑 Token:", authtoken?.substring(0, 20) + "...");
  console.log("📦 Product Slug:", slug);
  
  return await axios.put(url, data, {
    headers: {
      authtoken,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get products count ✅
export const getProductsByCount = async (count) => {
  return await axios.get(`${process.env.REACT_APP_API}/products/${count}`);
};

// Get products count ✅
export const getProductsCount = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/products/count/total`);
};

// In your functions/product.js — update getProducts to accept page & pageSize
export const getProductsList = (page = 1, pageSize = 8) =>
  axios.get(`${process.env.REACT_APP_API}/products?page=${page}&pageSize=${pageSize}`);


// function productStar
export const productStar = async (productId, star, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/product/star/${productId}`,
    { star },
    {
      headers: {
        authtoken,
      },
    }
  );

  // get Related product
export const getRelatedProduct = async (productId) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/product/related/${productId}`
  );
};

// Get products 
export const fetchProductsByFilter = async (arg) => {
  return await axios.post(`${process.env.REACT_APP_API}/search/filters`, arg);
};

export const getFilterOptions = async () => {
  return axios.get(`${process.env.REACT_APP_API}/filters`);

};

 // ---------------- IMAGE URL ----------------
  export const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/no-image.png";

    if (imagePath.startsWith("http")) return imagePath;

    const apiUrl =
      process.env.REACT_APP_API?.replace("/api", "") ||
      "http://localhost:8000";

    if (imagePath.startsWith("/uploads")) {
      return apiUrl + imagePath;
    }

    return `${apiUrl}/uploads/${imagePath}`;
  };