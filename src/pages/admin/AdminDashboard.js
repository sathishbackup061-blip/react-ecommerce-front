import React, { useState, useEffect } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { Col, Row, Card, Spin, Empty } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../../functions/product";
import AdminProductCard from "../../components/nav/cards/AdminProductCard";
import { AppstoreOutlined } from "@ant-design/icons";

import AdminOrders from "./AdminOrders";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { user } = useSelector((state) => ({ ...state }));

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProductsLoading(true);
    getProducts()
      .then((res) => {
        console.log("Products loaded:", res.data);
        setProducts(res.data);
        setProductsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        toast.error("Failed to load products");
        setProductsLoading(false);
      });
  };

  // Handle delete product with slug and title
  const handleDeleteProduct = async (productSlug, productTitle) => {
    try {
      setDeletingId(productSlug);
      console.log("🗑️ Deleting product:", productSlug);

      await deleteProduct(productSlug, user?.token);

      toast.success(`✓ "${productTitle}" deleted successfully!`);
      loadProducts();
      setDeletingId(null);
    } catch (err) {
      console.error("❌ Delete error:", err);

      const errorMessage =
        err.response?.data?.error || "Failed to delete product";
      toast.error(errorMessage);
      setDeletingId(null);
    }
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* Left Sidebar - Admin Nav */}
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
          <div style={{ position: "sticky", top: "24px" }}>
            <AdminNav />
          </div>
        </Col>

        {/* Right Content Area */}
        <Col xs={24} sm={24} md={20} lg={20} xl={20}>
          <div className="page-content" style={{ paddingRight: "12px" }}>
            {/* Header Card */}

            <AdminOrders />

            <Card
              title={
                <span>
                  <AppstoreOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  All Products ({products.length})
                </span>
              }
              style={{
                marginTop: "0px",
                marginBottom: "24px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {productsLoading ? (
                <Spin tip="Loading products..." size="large" />
              ) : products.length === 0 ? (
                <Empty description="No products created yet" />
              ) : (
                <p style={{ color: "#666" }}>
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </p>
              )}
            </Card>

            {/* Products Grid */}
            <Spin spinning={productsLoading}>
              {products.length === 0 ? (
                <Empty
                  description="No products created yet"
                  style={{ marginTop: "50px", marginBottom: "50px" }}
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                    padding: "16px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  {products.map((product) => (
                    <div key={product.slug}>
                      <AdminProductCard
                        product={product}
                        handleDeleteProduct={handleDeleteProduct}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;