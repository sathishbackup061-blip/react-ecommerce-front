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

import {
  getProducts,
  deleteProduct,
} from "../../../functions/product";

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

  const { user } = useSelector((state) => ({
    ...state,
  }));

  const navigate = useNavigate();

  // ================= STATES =================
  const [products, setProducts] = useState([]);

  const [productsLoading, setProductsLoading] =
    useState(false);

  const [categories, setCategories] = useState([]);

  const [allSubs, setAllSubs] = useState([]);

  const [previewImage, setPreviewImage] =
    useState("");

  const [previewVisible, setPreviewVisible] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  // ================= LOAD ONCE =================
  useEffect(() => {

    loadCategories();

    loadSubs();

  }, []);

  // ================= LOAD PRODUCTS =================
  useEffect(() => {

    loadProducts();

  }, [refreshTrigger]);

  // ================= LOAD CATEGORIES =================
  const loadCategories = async () => {

    try {

      const res = await getCategories();

      setCategories(res.data);

    } catch (err) {

      console.error(
        "Error loading categories:",
        err
      );
    }
  };

  // ================= LOAD SUBS =================
  const loadSubs = async () => {

    try {

      const res = await getSubs();

      setAllSubs(res.data);

    } catch (err) {

      console.error(
        "Error loading subs:",
        err
      );
    }
  };

  // ================= LOAD PRODUCTS =================
  const loadProducts = async () => {

    try {

      setProductsLoading(true);

      const res = await getProducts();

      console.log(
        "Products =>",
        res.data
      );

      setProducts(res.data);

    } catch (err) {

      console.error(
        "Error loading products:",
        err
      );

      toast.error(
        "Failed to load products"
      );

    } finally {

      setProductsLoading(false);
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDeleteProduct = async (
    productSlug,
    productTitle
  ) => {

    try {

      setDeletingId(productSlug);

      await deleteProduct(
        productSlug,
        user?.token
      );

      // instant UI update
      setProducts((prev) =>
        prev.filter(
          (p) => p.slug !== productSlug
        )
      );

      toast.success(
        `✓ "${productTitle}" deleted successfully!`
      );

    } catch (err) {

      console.error(
        "❌ Delete error:",
        err
      );

      const errorMessage =
        err.response?.data?.error ||
        "Failed to delete product";

      toast.error(errorMessage);

    } finally {

      setDeletingId(null);
    }
  };

  // ================= CATEGORY NAME =================
  const getCategoryName = (
    categoryData
  ) => {

    if (!categoryData) {
      return "N/A";
    }

    // populated category
    if (
      typeof categoryData === "object" &&
      categoryData.name
    ) {
      return categoryData.name;
    }

    // category id
    if (
      typeof categoryData === "string"
    ) {

      const cat = categories.find(
        (c) =>
          c._id === categoryData
      );

      return cat
        ? cat.name
        : categoryData;
    }

    return "N/A";
  };

  // ================= SUB CATEGORY NAMES =================
  const getSubNames = (subsData) => {

    if (
      !subsData ||
      subsData.length === 0
    ) {
      return "N/A";
    }

    return subsData
      .map((sub) => {

        // populated sub
        if (
          typeof sub === "object" &&
          sub.name
        ) {
          return sub.name;
        }

        // sub id
        if (
          typeof sub === "string"
        ) {

          const foundSub =
            allSubs.find(
              (s) =>
                s._id === sub
            );

          return foundSub
            ? foundSub.name
            : sub;
        }

        return "";
      })
      .filter((name) => name)
      .join(", ");
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      width: "90px",

      render: (images) => {

        const imageUrl =
          images?.[0]?.url ||
          "/images/no-image.png";

        return (
          <div
            onClick={() => {

              setPreviewImage(
                imageUrl
              );

              setPreviewVisible(true);
            }}
            style={{
              cursor: "pointer",
            }}
          >

            <img
              src={imageUrl}
              alt="product"
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "/images/no-image.png";
              }}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
                border:
                  "1px solid #eee",
              }}
            />

          </div>
        );
      },
    },

    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "150px",

      render: (text) => (
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "90px",

      render: (price) => (
        <span>
          ₹{price?.toFixed(2)}
        </span>
      ),
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "110px",

      render: (quantity) => (
        <Tag
          color={
            quantity > 0
              ? "green"
              : "red"
          }
        >
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

        const categoryName =
          getCategoryName(
            categoryData
          );

        return (
          <Tag color="blue">
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

        const subNames =
          getSubNames(subsData);

        return (
          <span
            style={{
              fontSize: "11px",
              display: "block",
              whiteSpace:
                "pre-wrap",
            }}
          >

            {subNames === "N/A" ? (

              <Tag>
                No subs
              </Tag>

            ) : (

              subNames
                .split(", ")
                .map(
                  (
                    subName,
                    idx
                  ) => (
                    <Tag
                      key={idx}
                      color="cyan"
                      style={{
                        marginBottom:
                          "4px",
                      }}
                    >
                      {subName}
                    </Tag>
                  )
                )
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

      render: (brand) => (
        <Tag color="orange">
          {brand}
        </Tag>
      ),
    },

    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "100px",

      render: (color) => (
        <Tag>
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
        <Tag
          color={
            shipping === "Yes"
              ? "green"
              : "red"
          }
        >
          {shipping}
        </Tag>
      ),
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "120px",

      render: (createdAt) => (
        <span>
          {new Date(
            createdAt
          ).toLocaleDateString()}
        </span>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      width: "120px",
      fixed: "right",

      render: (_, record) => (
        <Space size="small">

          {/* VIEW */}
          <Tooltip title="View">
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={
                <EyeOutlined />
              }
              onClick={() => {

                const imageUrl =
                  record.images?.[0]?.url ||
                  "/images/no-image.png";

                setPreviewImage(
                  imageUrl
                );

                setPreviewVisible(true);
              }}
            />
          </Tooltip>

          {/* EDIT */}
          <Tooltip title="Edit">
            <Button
              type="default"
              shape="circle"
              size="small"
              icon={
                <EditOutlined />
              }
              onClick={() =>
                navigate(
                  `/admin/product/update/${record.slug}`
                )
              }
            />
          </Tooltip>

          {/* DELETE */}
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Product"
              description={`Are you sure you want to delete "${record.title}"?`}
              onConfirm={() =>
                handleDeleteProduct(
                  record.slug,
                  record.title
                )
              }
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                danger: true,
                loading:
                  deletingId ===
                  record.slug,
              }}
            >
              <Button
                danger
                shape="circle"
                size="small"
                icon={
                  <DeleteOutlined />
                }
                loading={
                  deletingId ===
                  record.slug
                }
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

        {/* LEFT SIDEBAR */}
        <Col
          xs={0}
          sm={0}
          md={4}
          lg={4}
          xl={4}
        >
          <div
            style={{
              position: "sticky",
              top: "24px",
            }}
          >
            <AdminNav />
          </div>
        </Col>

        {/* RIGHT CONTENT */}
        <Col
          xs={24}
          sm={24}
          md={20}
          lg={20}
          xl={20}
        >

          <div
            className="page-content"
            style={{
              paddingRight: "12px",
            }}
          >

            <Card
              title={
                <span>
                  <AppstoreOutlined
                    style={{
                      marginRight:
                        "8px",
                      color:
                        "#1890ff",
                    }}
                  />

                  All Products (
                  {products.length}
                  )
                </span>
              }
              style={{
                marginTop: "24px",
                borderRadius: "8px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >

              <Spin
                spinning={
                  productsLoading
                }
              >

                {products.length ===
                0 ? (

                  <Empty
                    description="No products created yet"
                    style={{
                      marginTop:
                        "50px",
                      marginBottom:
                        "50px",
                    }}
                  />

                ) : (

                  <div
                    style={{
                      overflowX:
                        "auto",
                    }}
                  >

                    <Table
                      columns={columns}
                      dataSource={products}
                      rowKey="slug"
                      pagination={{
                        pageSize: 10,
                        total:
                          products.length,
                        showSizeChanger: true,
                        showTotal: (
                          total
                        ) =>
                          `Total ${total} products`,
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

        {/* IMAGE PREVIEW MODAL */}
        <Modal
          title="Product Image"
          open={previewVisible}
          footer={null}
          onCancel={() =>
            setPreviewVisible(false)
          }
        >

          <img
            alt="product"
            style={{
              width: "100%",
              borderRadius: "6px",
            }}
            src={previewImage}
            onError={(e) => {
              e.target.src =
                "/images/no-image.png";
            }}
          />

        </Modal>

      </Row>

    </div>
  );
};

export default ProductList;