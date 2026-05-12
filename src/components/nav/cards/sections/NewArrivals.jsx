import React, { useState, useEffect } from "react";
import { Row, Col, Empty, Spin, Pagination } from "antd";
import { toast } from "react-toastify";

import { getProducts } from "../../../../functions/product";
import ProductCard from "../ProductCard";
import "./NewArrivals.css";

const PAGE_SIZE = 4;

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const loadProducts = (currentPage) => {
    setLoading(true);
    getProducts(currentPage, PAGE_SIZE)
      .then((res) => {
        const data = res.data;

        // Handle both response shapes:
        // New: { products: [...], total: N }
        // Old (plain array): [...]
        if (Array.isArray(data)) {
          // Backend still returning plain array — paginate client-side
          const sorted = [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setProducts(sorted);
          setTotal(sorted.length);
        } else {
          // New paginated response shape
          setProducts(data.products || []);
          setTotal(data.total || 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        toast.error("Failed to load new arrivals");
        setProducts([]);
        setTotal(0);
        setLoading(false);
      });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;

    const apiUrl =
      process.env.REACT_APP_API?.replace("/api", "") || "http://localhost:8000";

    if (imagePath.startsWith("/uploads")) return apiUrl + imagePath;
    return apiUrl + "/uploads/" + imagePath;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    document
      .querySelector(".new-arrivals-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Paginate client-side when backend returns plain array
  const displayedProducts = Array.isArray(products) && total === products.length
    ? products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : products;

  return (
    <section className="new-arrivals-section">
      <div className="section-header">
        <h2 className="section-title">New Arrivals</h2>
        <p className="section-subtitle">
          Discover the latest products just added to our store
        </p>
      </div>

      <Spin spinning={loading} size="large">
        {displayedProducts.length === 0 && !loading ? (
          <Empty
            description="No products available"
            style={{ marginTop: "50px", marginBottom: "50px" }}
          />
        ) : (
          <div className="products-grid">
            <Row gutter={[16, 16]}>
              {displayedProducts.map((product) => (
                <Col
                  key={product.slug}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  className="product-col"
                >
                  <ProductCard product={product} getImageUrl={getImageUrl} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Spin>

      {total > PAGE_SIZE && (
        <div className="pagination-section">
          <Pagination
            current={page}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(t, range) => `${range[0]}–${range[1]} of ${t} products`}
          />
        </div>
      )}
    </section>
  );
};

export default NewArrivals;