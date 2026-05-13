import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useParams } from "react-router-dom";

import { Spin } from "antd";

import { getProduct } from "../functions/product";

import SingleProduct from "../components/nav/cards/SingleProduct";

const Product = () => {
  const [product, setProduct] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const { slug } = useParams();

  // -----------------------------
  // LOAD PRODUCT
  // -----------------------------
  const loadSingleProduct =
    useCallback(() => {
      setLoading(true);

      getProduct(slug)
        .then((res) => {
          setProduct(res.data);

          setLoading(false);
        })
        .catch((err) => {
          console.error(
            "Error loading product:",
            err
          );

          setLoading(false);
        });
    }, [slug]);

  // -----------------------------
  // EFFECT
  // -----------------------------
  useEffect(() => {
    loadSingleProduct();
  }, [loadSingleProduct]);

  // -----------------------------
  // IMAGE URL
  // -----------------------------
  const getImageUrl = (
    imagePath
  ) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith(
        "http"
      )
    ) {
      return imagePath;
    }

    const apiUrl =
      process.env.REACT_APP_API?.replace(
        "/api",
        ""
      ) ||
      "http://localhost:8000";

    if (
      imagePath.startsWith(
        "/uploads"
      )
    ) {
      return apiUrl + imagePath;
    }

    return `${apiUrl}/uploads/${imagePath}`;
  };

  return (
    <div className="container product-page">
      <div className="row pt-4">
        <Spin spinning={loading}>
          {product &&
          Object.keys(product)
            .length > 0 ? (
            <SingleProduct
              product={product}
              getImageUrl={
                getImageUrl
              }
            />
          ) : (
            !loading && (
              <p>
                Product not found
              </p>
            )
          )}
        </Spin>
      </div>
    </div>
  );
};

export default Product;