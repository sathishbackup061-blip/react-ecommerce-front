import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {
  Col,
  Row,
  Card,
  Table,
  Tag,
  Spin,
  Empty,
  Modal,
  Popconfirm,
  Button,
  Space,
  Tooltip,
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../../../functions/product";
import { getCategories } from "../../../functions/category";
import { getSubs } from "../../../functions/sub";
import { useNavigate } from "react-router-dom";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const ProductList = ({ refreshTrigger }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  // States
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubs, setAllSubs] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Helper function to get correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      const apiUrl = process.env.REACT_APP_API?.replace("/api", "") || "http://localhost:8000";
      return apiUrl + imagePath;
    }

    const apiUrl = process.env.REACT_APP_API?.replace("/api", "") || "http://localhost:8000";
    return apiUrl + "/uploads/" + imagePath;
  };

  // Load data on mount and when refreshTrigger changes
  useEffect(() => {
    loadCategories();
    loadSubs();
    loadProducts();
  }, [refreshTrigger]);

  const loadCategories = () => {
    getCategories()
      .then((res) => {
        console.log("Categories loaded:", res.data);
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
      });
  };

  const loadSubs = () => {
    getSubs()
      .then((res) => {
        console.log("Subs loaded:", res.data);
        setAllSubs(res.data);
      })
      .catch((err) => {
        console.error("Error loading subs:", err);
      });
  };

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

  // ✅ Get category name - Handle both object and string
  const getCategoryName = (categoryData) => {
    if (!categoryData) return "N/A";

    // If it's an object with name property (populated)
    if (typeof categoryData === "object" && categoryData.name) {
      return categoryData.name;
    }

    // If it's just an ID string, find it in categories array
    if (typeof categoryData === "string") {
      const cat = categories.find((c) => c._id === categoryData);
      return cat ? cat.name : categoryData;
    }

    return "N/A";
  };

  // ✅ Get sub category names - Handle array of objects or IDs
  const getSubNames = (subsData) => {
    if (!subsData || subsData.length === 0) return "N/A";

    return subsData
      .map((sub) => {
        // If it's an object with name property (populated)
        if (typeof sub === "object" && sub.name) {
          return sub.name;
        }

        // If it's just an ID string, find it in allSubs array
        if (typeof sub === "string") {
          const foundSub = allSubs.find((s) => s._id === sub);
          return foundSub ? foundSub.name : sub;
        }

        return "";
      })
      .filter((name) => name)
      .join(", ");
  };

  // Table columns
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      width: "80px",
      render: (images) => {
        if (images && images.length > 0) {
          const imageUrl = getImageUrl(images[0].url);
          return (
            <div
              onClick={() => {
                setPreviewImage(imageUrl);
                setPreviewVisible(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={imageUrl}
                alt="product"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/60?text=No+Image";
                }}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </div>
          );
        }
        return <span>No image</span>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "150px",
      render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "90px",
      render: (price) => <span>${price.toFixed(2)}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "110px",
      render: (quantity) => (
        <Tag color={quantity > 0 ? "green" : "red"}>
          {quantity} in stock
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "130px",
      render: (categoryData) => {
        const categoryName = getCategoryName(categoryData);
        return (
          <Tag color="blue" style={{ fontSize: "12px" }}>
            {categoryName}
          </Tag>
        );
      },
    },
    {
      title: "Sub Categories",
      dataIndex: "subs",
      key: "subs",
      width: "180px",
      render: (subsData) => {
        const subNames = getSubNames(subsData);
        return (
          <span style={{ fontSize: "11px", display: "block", whiteSpace: "pre-wrap" }}>
            {subNames === "N/A" ? (
              <Tag>No subs</Tag>
            ) : (
              subNames.split(", ").map((subName, idx) => (
                <Tag key={idx} color="cyan" style={{ marginBottom: "4px" }}>
                  {subName}
                </Tag>
              ))
            )}
          </span>
        );
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: "100px",
      render: (brand) => <Tag color="orange">{brand}</Tag>,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "100px",
      render: (color) => (
        <Tag
          style={{
            backgroundColor:
              color.toLowerCase() === "black"
                ? "#000"
                : color.toLowerCase() === "white"
                ? "#ddd"
                : color.toLowerCase() === "red"
                ? "#ff4d4f"
                : color.toLowerCase() === "blue"
                ? "#1890ff"
                : color.toLowerCase() === "green"
                ? "#52c41a"
                : color.toLowerCase() === "brown"
                ? "#8b4513"
                : undefined,
            color:
              color.toLowerCase() === "white" ||
              color.toLowerCase() === "brown"
                ? "#000"
                : "#fff",
          }}
        >
          {color}
        </Tag>
      ),
    },
    {
      title: "Shipping",
      dataIndex: "shipping",
      key: "shipping",
      width: "100px",
      render: (shipping) => (
        <Tag color={shipping === "Yes" ? "green" : "red"}>{shipping}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "120px",
      render: (createdAt) => (
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "110px",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="default"
              shape="circle"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/product/update/${record.slug}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Product"
              description={`Are you sure you want to delete "${record.title}"?`}
              onConfirm={() => handleDeleteProduct(record.slug, record.title)}
              onCancel={() => {
                console.log("Delete cancelled");
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                danger: true,
                loading: deletingId === record.slug,
              }}
            >
              <Button
                danger
                shape="circle"
                size="small"
                icon={<DeleteOutlined />}
                loading={deletingId === record.slug}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-create-container">
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
            {/* Products List Table Section */}
            <Card
              title={
                <span>
                  <AppstoreOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                  All Products ({products.length})
                </span>
              }
              style={{
                marginTop: "24px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Spin spinning={productsLoading}>
                {products.length === 0 ? (
                  <Empty
                    description="No products created yet"
                    style={{ marginTop: "50px", marginBottom: "50px" }}
                  />
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <Table
                      columns={columns}
                      dataSource={products}
                      rowKey="slug"
                      pagination={{
                        pageSize: 10,
                        total: products.length,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} products`,
                      }}
                      className="products-table"
                      size="small"
                    />
                  </div>
                )}
              </Spin>
            </Card>
          </div>
        </Col>

        {/* Image Preview Modal */}
        <Modal
          title="Product Image"
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img
            alt="product"
            style={{ width: "100%" }}
            src={previewImage}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        </Modal>
      </Row>
    </div>
  );
};

export default ProductList;