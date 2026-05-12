import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../functions/product";
import { Spin } from "antd";
import SingleProduct from "../components/nav/cards/SingleProduct";

const Product = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  const loadSingleProduct = () => {
    setLoading(true);
    getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setLoading(false);
      });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      const apiUrl =
        process.env.REACT_APP_API?.replace("/api", "") ||
        "http://localhost:8000";
      return apiUrl + imagePath;
    }

    const apiUrl =
      process.env.REACT_APP_API?.replace("/api", "") ||
      "http://localhost:8000";
    return apiUrl + "/uploads/" + imagePath;
  };
  

  return (
    <div className="container product-page">
        <div className="row pt-4">
                <Spin spinning={loading}>
                {product && Object.keys(product).length > 0 ? (
                <SingleProduct product={product} getImageUrl={getImageUrl}  />
                ) : (
                <p>Product not found</p>
                )}
            </Spin>

        </div>

    </div>
  );
};

export default Product;