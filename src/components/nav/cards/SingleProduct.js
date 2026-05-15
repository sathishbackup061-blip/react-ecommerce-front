/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Tag,
  Rate,
  message,
  Tooltip,
  InputNumber,
  Divider,
  Tabs,
  Popover,
} from "antd";

import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import _ from "lodash";

import "./SingleProduct.css";

import {
  productStar,
  getRelatedProduct,
} from "../../../functions/product";

import ProductCard from "./ProductCard";

const PLACEHOLDER_IMG =
  "/images/no-image.png";

const PLACEHOLDER_THUMB =
  "/images/no-image.png";

const { TabPane } = Tabs;

const SingleProduct = ({
  product,
  getImageUrl,
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(false);

  const [rating, setRating] =
    useState(0);

  const [related, setRelated] =
    useState([]);

  const [toolTip, setToolTip] =
    useState("Click to add");

  // -----------------------------
  // LOAD RELATED PRODUCTS
  // -----------------------------
  const loadRelated =
    useCallback(async () => {
      try {
        if (!product?._id) return;

        const res =
          await getRelatedProduct(
            product._id
          );

        setRelated(res.data || []);
      } catch (error) {
        console.log(
          "RELATED ERROR",
          error
        );
      }
    }, [product]);

  useEffect(() => {
    loadRelated();
  }, [loadRelated]);

  // -----------------------------
  // SAFETY RETURN
  // -----------------------------
  if (!product) return null;

  const isLoggedIn =
    user && user.token;

  const currentUserId =
    user?._id;

  // -----------------------------
  // PRODUCT DATA
  // -----------------------------
  const {
    title = "",
    description = "",
    price = 0,
    discount = 0,
    quantity: stock = 0,
    brand = "Brand",
    color = "N/A",
    images: productImages = [],
    category,
    ratings = [],
  } = product;

  const hasUserRated =
    currentUserId &&
    ratings.some(
      (r) =>
        r.postedBy?.toString() ===
        currentUserId?.toString()
    );

  const images = productImages || [];

  const hasMultipleImages =
    images.length > 1;

  const isOutOfStock =
    stock === 0;

  // -----------------------------
  // IMAGE HANDLERS
  // -----------------------------
  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  };

  // -----------------------------
  // ADD TO CART
  // -----------------------------
  const handleAddToCart = (e) => {
    e.stopPropagation();

    let cart = [];

    if (
      typeof window !== "undefined"
    ) {
      const existingCart =
        localStorage.getItem(
          "cart"
        );

      if (existingCart) {
        cart =
          JSON.parse(existingCart);
      }

      cart.push({
        ...product,
        count: quantity,
      });

      cart = _.uniqBy(cart, "_id");

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });

      setToolTip("Added");

      message.success(
        "Added to cart"
      );
    }
  };

  // -----------------------------
  // BUY NOW
  // -----------------------------
  const handleBuyNow = () => {
    const cart = [
      {
        ...product,
        count: quantity,
      },
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });

    message.success(
      "Proceeding to checkout"
    );

    navigate("/cart");
  };

  // -----------------------------
  // WISHLIST
  // -----------------------------
  const handleWishlist = () => {
    setIsWishlisted(
      !isWishlisted
    );

    message.success(
      isWishlisted
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  // -----------------------------
  // RATING
  // -----------------------------
  const handleRating =
    async (value) => {
      try {
        if (!user?.token) {
          return message.error(
            "Please login first"
          );
        }

        if (!value) {
          return message.error(
            "Please select rating"
          );
        }

        setRating(value);

        await productStar(
          product._id,
          value,
          user.token
        );

        message.success(
          `Thanks for rating ${value} stars!`
        );

        window.location.reload();
      } catch (error) {
        console.log(
          "Rating Error:",
          error
        );

        message.error(
          "Failed to submit rating"
        );
      }
    };

  // -----------------------------
  // IMAGE DATA
  // -----------------------------
  const currentImage =
    images[selectedImage]?.url;

  const mainImageSrc =
    currentImage
      ? getImageUrl(currentImage)
      : PLACEHOLDER_IMG;

  const currentImageIndex =
    selectedImage + 1;

  const totalImages =
    images.length;

  const categoryName =
    category?.name ||
    "Products";

  // -----------------------------
  // PRICE CALCULATIONS
  // -----------------------------
  const discountedPrice =
    price -
    (price * discount) / 100;

  const averageRating =
    ratings.length > 0
      ? ratings.reduce(
          (acc, curr) =>
            acc + curr.star,
          0
        ) / ratings.length
      : 0;

  const totalRatings =
    ratings.length;

  return (
    <div className="single-product-page">
      <Row gutter={[24, 24]}>
        {/* LEFT SIDE */}
        <Col xs={24} lg={11}>
          <div className="product-image-section">
            <div className="main-image-container">
              {/* BADGES */}
              <div className="product-badges">
                {discount > 0 && (
                  <Tag
                    color="red"
                    className="discount-badge"
                  >
                    {discount}% OFF
                  </Tag>
                )}

                {isOutOfStock && (
                  <Tag
                    color="default"
                    className="stock-badge"
                  >
                    OUT OF STOCK
                  </Tag>
                )}
              </div>

              {/* IMAGE NAVIGATION */}
              {hasMultipleImages && (
                <>
                  <Button
                    type="text"
                    icon={
                      <LeftOutlined />
                    }
                    className="image-nav-btn prev-btn"
                    onClick={
                      handlePrevImage
                    }
                  />

                  <Button
                    type="text"
                    icon={
                      <RightOutlined />
                    }
                    className="image-nav-btn next-btn"
                    onClick={
                      handleNextImage
                    }
                  />
                </>
              )}

              {/* MAIN IMAGE */}
              <img
                src={mainImageSrc}
                alt={title || "Product"}
                className="main-product-image"
                onError={(e) => {
                  e.target.src =
                    PLACEHOLDER_IMG;
                }}
              />
            </div>

            {/* THUMBNAILS */}
            <div className="thumbnail-section">
              {images.length > 0 ? (
                images.map(
                  (
                    img,
                    index
                  ) => (
                    <div
                      key={index}
                      className={`thumbnail ${
                        selectedImage ===
                        index
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                    >
                      <img
                        src={getImageUrl(
                          img.url
                        )}
                        alt={`${title} thumbnail ${
                          index + 1
                        }`}
                        onError={(
                          e
                        ) => {
                          e.target.src =
                            PLACEHOLDER_THUMB;
                        }}
                      />
                    </div>
                  )
                )
              ) : (
                <div className="thumbnail active">
                  <img
                    src={
                      PLACEHOLDER_THUMB
                    }
                    alt="No product available"
                  />
                </div>
              )}

              {hasMultipleImages && (
                <div className="image-counter">
                  {
                    currentImageIndex
                  }{" "}
                  / {totalImages}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="action-buttons">
              <Tooltip
                title={toolTip}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={
                    <ShoppingCartOutlined />
                  }
                  block
                  disabled={
                    isOutOfStock
                  }
                  onClick={
                    handleAddToCart
                  }
                  className="add-to-cart-btn"
                >
                  ADD TO CART
                </Button>
              </Tooltip>

              <Button
                type="default"
                size="large"
                icon={
                  isWishlisted ? (
                    <HeartFilled />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={
                  handleWishlist
                }
                className={`wishlist-btn ${
                  isWishlisted
                    ? "wishlisted"
                    : ""
                }`}
              >
                {isWishlisted
                  ? "WISHLISTED"
                  : "WISHLIST"}
              </Button>
            </div>

            {/* TABS */}
            <Tabs
              defaultActiveKey="specs"
              className="product-tabs"
            >
              <TabPane
                tab="Specifications"
                key="specs"
              >
                <div className="tab-content">
                  <h3 className="section-title">
                    Available Offers
                  </h3>

                  <ul className="offers-list">
                    <li>
                      <Tag color="green">
                        Bank Offer
                      </Tag>

                      <span>
                        5% Unlimited
                        Cashback on Axis
                        Bank Credit Card
                      </span>
                    </li>

                    <li>
                      <Tag color="green">
                        Bank Offer
                      </Tag>

                      <span>
                        Starting
                        ₹1,594/month with
                        No Cost EMI
                      </span>
                    </li>

                    <li>
                      <Tag color="green">
                        Special Price
                      </Tag>

                      <span>
                        Get extra ₹
                        {Math.round(
                          price * 0.1
                        )}{" "}
                        off
                      </span>
                    </li>
                  </ul>
                </div>
              </TabPane>

              <TabPane
                tab="Description"
                key="desc"
              >
                <div className="tab-content">
                  <p className="product-description">
                    {description ||
                      "No description available."}
                  </p>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col xs={24} lg={13}>
          <div className="product-details-section">
            {/* BREADCRUMB */}
            <div className="product-breadcrumb">
              <span>Home</span>

              <ArrowRightOutlined />

              <span>
                {categoryName}
              </span>

              <ArrowRightOutlined />

              <span>{title}</span>
            </div>

            {/* TITLE */}
            <h1 className="product-title">
              {title}
            </h1>

            {/* BRAND */}
            <div className="product-meta">
              <span className="brand-tag">
                {brand}
              </span>
            </div>

            {/* PRICE */}
            <div className="price-section">
              <span className="current-price">
                ₹
                {discountedPrice.toFixed(
                  2
                )}
              </span>

              {discount > 0 && (
                <>
                  <span className="original-price">
                    ₹
                    {price.toFixed(
                      2
                    )}
                  </span>

                  <span className="discount-text">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* RATINGS */}
            <div className="leave-rating-section">
              <div className="rating-display">
                <Rate
                  disabled
                  value={
                    averageRating
                  }
                  allowHalf
                />

                <span className="rating-value">
                  {averageRating.toFixed(
                    1
                  )}
                </span>

                <span className="rating-count">
                  (
                  {totalRatings}{" "}
                  ratings)
                </span>
              </div>

              {!isLoggedIn ? (
                <Popover
                  content={
                    <div className="rating-popover">
                      <p className="rating-title">
                        Please login to
                        rate
                      </p>

                      <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                          navigate(
                            "/login"
                          )
                        }
                      >
                        Login
                      </Button>
                    </div>
                  }
                  trigger="click"
                >
                  <Button>
                    <StarOutlined />{" "}
                    Leave a Rating
                  </Button>
                </Popover>
              ) : hasUserRated ? (
                <div className="already-rated">
                  <StarFilled className="rated-icon" />{" "}
                  You rated this
                  product
                </div>
              ) : (
                <Popover
                  content={
                    <div className="rating-popover">
                      <p className="rating-title">
                        Rate this product
                      </p>

                      <Rate
                        onChange={
                          handleRating
                        }
                        value={rating}
                        allowHalf
                      />
                    </div>
                  }
                  trigger="click"
                >
                  <Button>
                    <StarOutlined />{" "}
                    Leave a Rating
                  </Button>
                </Popover>
              )}
            </div>

            <Divider />

            {/* PRODUCT INFO */}
            <div className="product-info-section">
              <h3 className="info-title">
                Product Information
              </h3>

              <div className="info-row">
                <span className="info-label">
                  Brand:
                </span>

                <span className="info-value">
                  {brand}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">
                  Color:
                </span>

                <span className="info-value">
                  {color}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">
                  Availability:
                </span>

                <span
                  className={`info-value ${
                    stock > 0
                      ? "in-stock"
                      : "out-stock"
                  }`}
                >
                  {stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            <Divider />

            {/* QUANTITY */}
            <div className="quantity-section">
              <span className="quantity-label">
                Quantity:
              </span>

              <InputNumber
                min={1}
                max={stock || 1}
                value={quantity}
                onChange={(value) =>
                  setQuantity(
                    value || 1
                  )
                }
                className="quantity-input"
              />
            </div>

            {/* BUY NOW */}
            <Button
              type="primary"
              size="large"
              block
              disabled={
                isOutOfStock
              }
              onClick={handleBuyNow}
              className="buy-now-btn"
            >
              BUY NOW
            </Button>
          </div>
        </Col>
      </Row>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="related-products-section">
          <Divider />

          <h2>
            Related Products
          </h2>

          <Row gutter={[16, 16]}>
            {related.map((p) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={p._id}
              >
                <ProductCard
                  product={p}
                  getImageUrl={
                    getImageUrl
                  }
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;