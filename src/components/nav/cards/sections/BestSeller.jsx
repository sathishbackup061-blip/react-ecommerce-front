import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Spin, Badge, Pagination } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getProducts } from "../../../../functions/product";
import ProductCard from "../ProductCard";
import "./BestSeller.css";

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    getProducts()
      .then((res) => {
        console.log("Products loaded:", res.data);

        // Sort products by sold count (best sellers first)
        const sorted = [...res.data].sort(
          (a, b) => (b.sold || 0) - (a.sold || 0)
        );
        setProducts(sorted.length > 0 ? sorted : res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        toast.error("Failed to load best sellers");
        setLoading(false);
      });
  };

  // Get products for current page
  const getCurrentPageProducts = () => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({
      top: document.querySelector(".best-seller-section")?.offsetTop - 100,
      behavior: "smooth",
    });
  };

  // Helper function to get correct image URL
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
    <section className="best-seller-section">
      <div className="section-header">
        <h2 className="section-title">
          <FireOutlined className="fire-icon" /> Best Sellers
        </h2>
        <p className="section-subtitle">
          The most popular products that customers love
        </p>
      </div>

      <Spin spinning={loading} size="large">
        {products.length === 0 ? (
          <Empty
            description="No best sellers available"
            style={{ marginTop: "50px", marginBottom: "50px" }}
          />
        ) : (
          <div className="products-grid">
            <Row gutter={[16, 16]}>
              {getCurrentPageProducts().map((product, index) => {
                const globalIndex = (currentPage - 1) * productsPerPage + index;
                return (
                  <Col
                    key={product.slug}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    className="product-col"
                  >
                    <div className="best-seller-badge-wrapper">
                      {globalIndex < 3 && (
                        <Badge
                          count={`#${globalIndex + 1}`}
                          style={{
                            backgroundColor:
                              globalIndex === 0
                                ? "#FFD700"
                                : globalIndex === 1
                                ? "#C0C0C0"
                                : "#CD7F32",
                            color: "#000",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                      <ProductCard product={product} getImageUrl={getImageUrl} />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
      </Spin>

      {products.length > productsPerPage && (
        <div className="pagination-section">
          <Pagination
            current={currentPage}
            total={products.length}
            pageSize={productsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} products`
            }
          />
        </div>
      )}
    </section>
  );
};

export default BestSeller;