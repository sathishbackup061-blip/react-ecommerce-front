import React, { useState } from "react";
import { Card, Button,  Rate, Tooltip, Space ,message  } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../../functions/user";
import { toast } from "react-toastify";


const { Meta } = Card;

const ProductCard = ({ product, getImageUrl }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [tootlTip, setToolTip] = useState('Click to add');

  const { title, description, price, images, slug, quantity } = product;
  const dispatch = useDispatch();

  const {user } = useSelector((state) => ({ ...state }));

  const imageUrl =
     product.images && product.images.length > 0
      ? getImageUrl(images[0].url)
      : "https://via.placeholder.com/250?text=No+Image";


// const imageUrl =
//   product?.images?.length > 0
//     ? `${process.env.REACT_APP_API}/product/image/${product.images[0].url}`
//     : "/images/laptops/lap4.jpg";

  const handleViewProduct = () => {
    navigate(`/product/${slug}`);
  };


  const handleAddToCart = (e) => {
    e.stopPropagation();

    let cart = [];

    if (typeof window !== "undefined") {
      // get cart from localStorage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // add product
      cart.push({
        ...product,
        count: 1,
      });

      // remove duplicates
      cart = _.uniqBy(cart, "_id");

      // save localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // save redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
      
      message.success("Added to cart");
      // show tootlTip
      setToolTip('Added');
      console.log("Cart:", cart);

    }
  };


    const handleAddToWishlist = (e) => {
  e.stopPropagation();

  if (!user || !user.token) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  addToWishlist(product._id, user.token)
    .then(() => {
      toast.success("Added to wishlist ❤️");
      setIsWishlisted(true);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to add wishlist");
    });
};



  const averageRating =
  product.ratings && product.ratings.length > 0
    ? product.ratings.reduce((acc, curr) => acc + curr.star, 0) /
      product.ratings.length
    : 0;


  return (
    <div className="product-card-wrapper">
      <Card
        hoverable
        className="product-card"
        cover={
          <div className="product-image-container">
            {quantity === 0 && (
              <div className="out-of-stock-badge">
                <span>Out of Stock</span>
              </div>
            )}
            {quantity > 0 && quantity < 5 && (
              <div className="limited-badge">
                <span>Limited Stock</span>
              </div>
            )}
            <img
              alt={title}
              src={imageUrl}
              className="product-image"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/250?text=No+Image";
              }}
            />
            <div className="product-overlay">
              <Space size="middle">
                <Tooltip title="View Details">
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={handleViewProduct}
                    className="action-button"
                  />
                </Tooltip>
                <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
                  <Button
                    shape="circle"
                    size="large"
                    icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleAddToWishlist} 

                    className={`action-button ${isWishlisted ? "wishlisted" : ""}`}
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
        }
        actions={[
           <Tooltip title={tootlTip} >
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            block
            disabled={quantity === 0}
            onClick={handleAddToCart}
            className="add-to-cart-button"
          >
           { quantity === 0 ? 'Out of stock': 'Add to Cart'}
          </Button>
          </Tooltip>,
        ]}
      >
        <div className="product-info">
          {/* <div className="product-header">
            <Tag color="blue">{brand}</Tag>
            <Tag>{color}</Tag>
          </div> */}
          <Meta
            title={
              <h3 className="product-title">
                {title && title.substring(0, 25)}
                {title && title.length > 25 ? "..." : ""}
              </h3>
            }
            description={
              <div className="product-description">
                <p className="desc-text">
                  {description && description.substring(0, 50)}
                  {description && description.length > 50 ? "..." : ""}
                </p>
              </div>
            }
          />
          <div className="product-footer">
            <div className="price-section">
              <span className="product-price">₹{price.toFixed(2)}</span>
            </div>
            <div className="rating-section">
              <Rate
                disabled
                allowHalf
                value={averageRating}
                size="small"
                className="product-rating"
              />
              <span className="rating-count">
                <span className="rating-value">
                  {averageRating.toFixed(1)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;