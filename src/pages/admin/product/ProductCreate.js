import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {
  Col,
  Row,
  Input,
  Button,
  Card,
  Form,
  Select,
  InputNumber,
  Upload,
  Spin,
  Divider,
  Badge,
  Space,
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct, getProducts } from "../../../functions/product";
import { getCategories } from "../../../functions/category";
import { getSubs } from "../../../functions/sub";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  UploadOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import "../AdminDesign.css";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "White", "Red", "Blue", "Green"],
  brands: ["Apple", "LG", "Sony", "Accer"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [form] = Form.useForm();

  // States
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allSubs, setAllSubs] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [products, setProducts] = useState([]);

  // Fetch categories, subs, and products on mount
  useEffect(() => {
    loadCategories();
    loadSubs();
    loadProducts();
  }, []);

  // Filter subcategories when category changes
  useEffect(() => {
    if (values.category) {
      const filtered = allSubs.filter((sub) => sub.parent === values.category);
      setFilteredSubs(filtered);
      setValues((prev) => ({
        ...prev,
        subs: [],
      }));
    } else {
      setFilteredSubs([]);
    }
  }, [values.category, allSubs]);

  // Load data when refreshTrigger changes
  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  const loadCategories = () => {
    getCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        toast.error("Failed to load categories");
      });
  };

  const loadSubs = () => {
    getSubs()
      .then((res) => {
        setAllSubs(res.data);
      })
      .catch((err) => {
        console.error("Error loading subs:", err);
        toast.error("Failed to load sub categories");
      });
  };

  const loadProducts = () => {
    getProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      form.setFieldsValue({ slug });
    }
  };

  const handleSelectChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleImageUpload = ({ fileList: newFileList }) => {
    const images = newFileList.map((file) => file.originFileObj || file);
    setValues({
      ...values,
      images: images,
    });

    const previews = newFileList.map((file) => {
      if (file.originFileObj) {
        return URL.createObjectURL(file.originFileObj);
      }
      return file.url;
    });
    setImagePreview(previews);
  };

  const handleSubmit = async () => {
    try {
      if (!values.title.trim()) {
        toast.error("Please enter product title");
        return;
      }
      if (!values.description.trim()) {
        toast.error("Please enter product description");
        return;
      }
      if (!values.price) {
        toast.error("Please enter product price");
        return;
      }
      if (!values.quantity && values.quantity !== 0) {
        toast.error("Please enter quantity");
        return;
      }
      if (!values.category) {
        toast.error("Please select a main category");
        return;
      }
      if (!values.subs || values.subs.length === 0) {
        toast.error("Please select at least one sub category");
        return;
      }
      if (!values.color) {
        toast.error("Please select a color");
        return;
      }
      if (!values.brand) {
        toast.error("Please select a brand");
        return;
      }
      if (!values.shipping) {
        toast.error("Please select shipping option");
        return;
      }
      if (values.images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("description", values.description.trim());
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("subs", JSON.stringify(values.subs || []));
      formData.append("quantity", values.quantity);
      formData.append("shipping", values.shipping);
      formData.append("color", values.color);
      formData.append("brand", values.brand);

      values.images.forEach((image) => {
        formData.append("images", image);
      });

      await createProduct(formData, user?.token);

      toast.success("✓ Product created successfully!");
      setValues(initialState);
      setImagePreview([]);
      form.resetFields();
      
      // Refresh products list
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Full error:", error);

      let errorMessage = "Failed to create product";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues(initialState);
    setImagePreview([]);
    form.resetFields();
  };

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
            {/* Header Section */}
            <Card
              className="header-card"
              style={{
                marginBottom: "24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Row align="middle" justify="space-between">
                <Col xs={24} sm={24} md={12}>
                  <h1
                    className="page-title"
                    style={{
                      color: "#fff",
                      marginBottom: "8px",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    <AppstoreOutlined style={{ marginRight: "10px" }} />
                    Product Management
                  </h1>
                  <p
                    className="page-subtitle"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                    Create, edit, and manage your products
                  </p>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Space direction="vertical" align="end" style={{ width: "100%" }}>
                    <div className="stats">
                      <Badge
                        count={products.length}
                        showZero
                        style={{ backgroundColor: "#52c41a", fontSize: "16px" }}
                        title="Total Products"
                      />
                      <span
                        className="stat-label"
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          marginLeft: "10px",
                          fontSize: "13px",
                        }}
                      >
                        Total Products
                      </span>
                    </div>
                    <div className="stats">
                      <Badge
                        count={categories.length}
                        showZero
                        style={{ backgroundColor: "#1890ff", fontSize: "16px" }}
                        title="Total Categories"
                      />
                      <span
                        className="stat-label"
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          marginLeft: "10px",
                          fontSize: "13px",
                        }}
                      >
                        Categories
                      </span>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>
            {/* End Header Section */}

            {/* Product Create Form Section */}
            <Card
              title={
                <span>
                  <PlusOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                  Create New Product
                </span>
              }
              className="form-card"
              style={{
                marginBottom: "24px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Spin spinning={loading}>
                <Form form={form} layout="vertical" autoComplete="off">
                  {/* Basic Information */}
                  <Divider orientation="left">Basic Information</Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12}>
                      <Form.Item
                        label="Product Title"
                        rules={[
                          {
                            required: true,
                            message: "Please enter product title",
                          },
                          {
                            max: 32,
                            message: "Title must be less than 32 characters",
                          },
                        ]}
                      >
                        <Input
                          name="title"
                          placeholder="Enter product title"
                          value={values.title}
                          onChange={handleChange}
                          maxLength={32}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12}>
                      <Form.Item
                        label="Slug (Auto-generated)"
                        rules={[
                          {
                            required: true,
                            message: "Slug is required",
                          },
                        ]}
                      >
                        <Input
                          name="slug"
                          placeholder="auto-generated-slug"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Form.Item
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "Please enter product description",
                          },
                          {
                            max: 2000,
                            message:
                              "Description must be less than 2000 characters",
                          },
                        ]}
                      >
                        <Input.TextArea
                          name="description"
                          rows={5}
                          placeholder="Enter detailed product description"
                          value={values.description}
                          onChange={handleChange}
                          maxLength={2000}
                          showCount
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Pricing & Inventory */}
                  <Divider orientation="left">Pricing & Inventory</Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        label="Price ($)"
                        rules={[
                          {
                            required: true,
                            message: "Please enter product price",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="0.00"
                          prefix="$"
                          min={0}
                          step={0.01}
                          value={values.price}
                          onChange={(value) =>
                            handleSelectChange("price", value)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        label="Quantity in Stock"
                        rules={[
                          {
                            required: true,
                            message: "Please enter quantity",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="0"
                          min={0}
                          value={values.quantity}
                          onChange={(value) =>
                            handleSelectChange("quantity", value)
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        label="Shipping Available"
                        rules={[
                          {
                            required: true,
                            message: "Please select shipping option",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select shipping option"
                          value={values.shipping || undefined}
                          onChange={(value) =>
                            handleSelectChange("shipping", value)
                          }
                        >
                          <Select.Option value="Yes">Yes</Select.Option>
                          <Select.Option value="No">No</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        label="Brand"
                        rules={[
                          {
                            required: true,
                            message: "Please select brand",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select brand"
                          value={values.brand || undefined}
                          onChange={(value) =>
                            handleSelectChange("brand", value)
                          }
                        >
                          {values.brands.map((brand) => (
                            <Select.Option key={brand} value={brand}>
                              {brand}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Category */}
                  <Divider orientation="left">Categories</Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Main Category"
                        rules={[
                          {
                            required: true,
                            message: "Please select a main category",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select main category"
                          value={values.category || undefined}
                          onChange={(value) =>
                            handleSelectChange("category", value)
                          }
                        >
                          {categories.map((cat) => (
                            <Select.Option key={cat._id} value={cat._id}>
                              {cat.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Sub Categories"
                        rules={[
                          {
                            required: true,
                            message: "Please select at least one sub category",
                          },
                          {
                            validator: (_, value) => {
                              if (!values.category) {
                                return Promise.reject(
                                  new Error("Please select a main category first")
                                );
                              }
                              if (!value || value.length === 0) {
                                return Promise.reject(
                                  new Error("Please select at least one sub category")
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          placeholder={
                            !values.category
                              ? "Select main category first"
                              : filteredSubs.length === 0
                              ? "No sub categories available"
                              : "Select sub categories"
                          }
                          value={values.subs || []}
                          onChange={(value) =>
                            handleSelectChange("subs", value)
                          }
                          disabled={!values.category || filteredSubs.length === 0}
                        >
                          {filteredSubs.map((sub) => (
                            <Select.Option key={sub._id} value={sub._id}>
                              {sub.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {values.category && filteredSubs.length > 0 && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <p style={{ color: "#666", fontSize: "12px" }}>
                          Available sub categories: <strong>{filteredSubs.length}</strong> |
                          Selected: <strong>{values.subs?.length || 0}</strong>
                        </p>
                      </Col>
                    </Row>
                  )}

                  {/* Attributes */}
                  <Divider orientation="left">Product Attributes</Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Color"
                        rules={[
                          {
                            required: true,
                            message: "Please select color",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select color"
                          value={values.color || undefined}
                          onChange={(value) =>
                            handleSelectChange("color", value)
                          }
                        >
                          {values.colors.map((color) => (
                            <Select.Option key={color} value={color}>
                              {color}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Images Upload */}
                  <Divider orientation="left">Product Images</Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Form.Item
                        label="Upload Images"
                        rules={[
                          {
                            required: true,
                            message: "Please upload at least one image",
                          },
                        ]}
                      >
                        <Upload
                          listType="picture-card"
                          fileList={values.images.map((img, idx) => ({
                            uid: -idx,
                            name: `image-${idx}`,
                            status: "done",
                            originFileObj: img,
                          }))}
                          onChange={handleImageUpload}
                          multiple
                          accept="image/*"
                          beforeUpload={() => false}
                        >
                          <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload Images</div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <h4>Image Preview</h4>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {imagePreview.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`preview-${index}`}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/100?text=No+Image";
                              }}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                            />
                          ))}
                        </div>
                      </Col>
                    </Row>
                  )}

                  {/* Action Buttons */}
                  <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
                    <Col>
                      <Button
                        type="primary"
                        size="large"
                        icon={<CheckOutlined />}
                        loading={loading}
                        onClick={handleSubmit}
                        style={{ borderRadius: "4px" }}
                      >
                        Create Product
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        size="large"
                        icon={<CloseOutlined />}
                        onClick={handleReset}
                        style={{ borderRadius: "4px" }}
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Spin>
            </Card>

            
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductCreate;