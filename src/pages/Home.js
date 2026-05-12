import React, { useState, useEffect } from "react";
import { Carousel, Card, Row, Col, Button, Tag, Empty,Statistic, Spin, Space, Rate } from "antd";
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined,
     ProductOutlined

 } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getProducts, getProductsCount, getProductsListCat  } from "../functions/product";
import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";

import ProductCard from "../components/nav/cards/ProductCard";
import { useNavigate } from "react-router-dom";

import NewArrivals from "../components/nav/cards/sections/NewArrivals";
import BestSeller from "../components/nav/cards/sections/BestSeller";
import CategoryList from "../components/category/CategoryList";
import SubCategoryList from "../components/category/SubCategoryList";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";




import "./Home.css";


const Home = () => {

    const [productCount, setProductCount] = useState(0);
    const [countLoading, setCountLoading] = useState(true);

    const [categories, setCategories] = useState([]);


    const [subs, setSubs] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { catSlug, subSlug } = useParams();

     useEffect(() => {
        loadProductCount();
        loadCategories();
    }, []);


  
    

    const loadProducts = async (filter = {}) => {
      try {
        setLoading(true);

        const res = await getProductsListCat(filter);

        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };


   const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };


    const loadProductCount = () => {
    setCountLoading(true);
    getProductsCount()
      .then((res) => {
        console.log("Products count:", res.data);
        setProductCount(res.data.count || 0);
        setCountLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products count:", err);
        setCountLoading(false);
      });
  };


    
  // Carousel banners
  const carouselImages = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop",
      title: "Latest Laptops",
      description: "Discover the newest and most powerful laptops",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop",
      title: "Premium Electronics",
      description: "High-quality electronics at the best prices",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop",
      title: "Tech Gadgets",
      description: "Cutting-edge technology for your lifestyle",
    },
  ];

   return (
    <div className="home-page">
      {/* Hero Carousel Section */}
      <div className="hero-section">
        <Carousel
          autoplay
          effect="fade"
          autoplaySpeed={4000}
          className="hero-carousel"
        >
          {carouselImages.map((item) => (
            <div key={item.id} className="carousel-slide">
              <img
                src={item.image}
                alt={item.title}
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2 className="carousel-title">{item.title}</h2>
                  <p className="carousel-description">{item.description}</p>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
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

      {/* Statistics Section */}
      <div className="stats-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Total Products"
                value={productCount}
                prefix={<ProductOutlined />}
                loading={countLoading}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Happy Customers"
                value={1250}
                prefix="👥"
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Successful Orders"
                value={8543}
                prefix="📦"
                valueStyle={{ color: "#faad14" }}
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
                valueStyle={{ color: "#ff7a45" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Categories Banner */}
      <div className="categories-banner">
        <div className="banner-container">
          <div className="category-item">
            <div className="category-icon">💻</div>
            <h3>Laptops</h3>
          </div>
          <div className="category-item">
            <div className="category-icon">📱</div>
            <h3>Phones</h3>
          </div>
          <div className="category-item">
            <div className="category-icon">⌚</div>
            <h3>Accessories</h3>
          </div>
          <div className="category-item">
            <div className="category-icon">🎮</div>
            <h3>Gaming</h3>
          </div>
        </div>
      </div>

      {/* New Arrivals Section - Imported Component */}
      <NewArrivals />

      {/* Best Seller Section - Imported Component */}
      <BestSeller />


        {/* Categories Section */}
          <div className="category-section">
            <div className="section-header header-section ">
              <h2 class="section-title text-center">Shop by Category</h2>
            </div>

              <CategoryList
                categories={categories}
                onSelect={(c) => {
                  navigate(`/category/${c.slug}`);
                }}
              />

                <div className="section-header header-section ">
           <      h2 className="section-title text-center">Sub Category</h2>
                </div>
            <SubCategoryList  />
      </div>

      {/* Features Section */}
      <section className="features-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payment</h3>
              <p>Safe and encrypted payment methods</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>Hassle-free return and exchange policy</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Always here to help you with any questions</p>
            </div>
          </Col>
        </Row>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <Button type="primary" size="large" className="newsletter-button">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;