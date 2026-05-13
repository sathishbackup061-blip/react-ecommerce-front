/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import {
  Carousel,
  Card,
  Row,
  Col,
  Button,
  Statistic,
} from "antd";

import {
  ShoppingCartOutlined,
  ProductOutlined,
} from "@ant-design/icons";

import {
  getProductsCount,
} from "../functions/product";

import { getCategories } from "../functions/category";

import CategoryList from "../components/category/CategoryList";
import SubCategoryList from "../components/category/SubCategoryList";

import NewArrivals from "../components/nav/cards/sections/NewArrivals";
import BestSeller from "../components/nav/cards/sections/BestSeller";

import { useNavigate } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [productCount, setProductCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // ---------------- LOAD INITIAL DATA ----------------
  useEffect(() => {
    loadProductCount();
    loadCategories();
  }, []);

  // ---------------- LOAD PRODUCT COUNT ----------------
  const loadProductCount = async () => {
    try {
      setCountLoading(true);

      const res = await getProductsCount();

      console.log("Products count:", res.data);

      setProductCount(res.data.count || 0);

      setCountLoading(false);
    } catch (err) {
      console.log(err);

      setCountLoading(false);
    }
  };

  // ---------------- LOAD CATEGORIES ----------------
  const loadCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- CAROUSEL DATA ----------------
  const carouselImages = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop",
      title: "Latest Laptops",
      description:
        "Discover the newest and most powerful laptops",
    },

    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop",
      title: "Premium Electronics",
      description:
        "High-quality electronics at the best prices",
    },

    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop",
      title: "Tech Gadgets",
      description:
        "Cutting-edge technology for your lifestyle",
    },
  ];

  return (
    <div className="home-page">
      {/* HERO CAROUSEL */}
      <div className="hero-section">
        <Carousel
          autoplay
          effect="fade"
          autoplaySpeed={4000}
          className="hero-carousel"
        >
          {carouselImages.map((item) => (
            <div
              key={item.id}
              className="carousel-slide"
            >
              <img
                src={item.image}
                alt={item.title}
                className="carousel-image"
              />

              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2 className="carousel-title">
                    {item.title}
                  </h2>

                  <p className="carousel-description">
                    {item.description}
                  </p>

                  <Button
                    type="primary"
                    size="large"
                    icon={
                      <ShoppingCartOutlined />
                    }
                    className="carousel-button"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* STATISTICS */}
      <div className="stats-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Total Products"
                value={productCount}
                prefix={<ProductOutlined />}
                loading={countLoading}
                valueStyle={{
                  color: "#1890ff",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Happy Customers"
                value={1250}
                prefix="👥"
                valueStyle={{
                  color: "#52c41a",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Successful Orders"
                value={8543}
                prefix="📦"
                valueStyle={{
                  color: "#faad14",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Quality Guarantee"
                value={100}
                suffix="%"
                prefix="⭐"
                valueStyle={{
                  color: "#ff7a45",
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* CATEGORY BANNER */}
      <div className="categories-banner">
        <div className="banner-container">
          <div className="category-item">
            <div className="category-icon">
              💻
            </div>

            <h3>Laptops</h3>
          </div>

          <div className="category-item">
            <div className="category-icon">
              📱
            </div>

            <h3>Phones</h3>
          </div>

          <div className="category-item">
            <div className="category-icon">
              ⌚
            </div>

            <h3>Accessories</h3>
          </div>

          <div className="category-item">
            <div className="category-icon">
              🎮
            </div>

            <h3>Gaming</h3>
          </div>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <NewArrivals />

      {/* BEST SELLERS */}
      <BestSeller />

      {/* CATEGORY SECTION */}
      <div className="category-section">
        <div className="section-header header-section">
          <h2 className="section-title text-center">
            Shop by Category
          </h2>
        </div>

        <CategoryList
          categories={categories}
          onSelect={(c) => {
            navigate(`/category/${c.slug}`);
          }}
        />

        <div className="section-header header-section">
          <h2 className="section-title text-center">
            Sub Category
          </h2>
        </div>

        <SubCategoryList />
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">
                🚚
              </div>

              <h3>Fast Shipping</h3>

              <p>
                Quick and reliable delivery
                to your doorstep
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">
                🛡️
              </div>

              <h3>Secure Payment</h3>

              <p>
                Safe and encrypted payment
                methods
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">
                🔄
              </div>

              <h3>Easy Returns</h3>

              <p>
                Hassle-free return and
                exchange policy
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">
                💬
              </div>

              <h3>24/7 Support</h3>

              <p>
                Always here to help you with
                any questions
              </p>
            </div>
          </Col>
        </Row>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>
            Subscribe to Our Newsletter
          </h2>

          <p>
            Get the latest updates on new
            products and upcoming sales
          </p>

          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />

            <Button
              type="primary"
              size="large"
              className="newsletter-button"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;