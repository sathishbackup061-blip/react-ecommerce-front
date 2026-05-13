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
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../../../functions/product";
import { getCategories } from "../../../functions/category";
import { getSubs } from "../../../functions/sub";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "../AdminDesign.css";

const UpdateProduct = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [form] = Form.useForm();
  const { slug } = useParams();
  const navigate = useNavigate();

  // States
  const [values, setValues] = useState({
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
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [allSubs, setAllSubs] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    loadCategories();
    loadSubs();
    loadProduct();
  }, [slug]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (values.category) {
      const filtered = allSubs.filter((sub) => sub.parent === values.category);
      setFilteredSubs(filtered);
    } else {
      setFilteredSubs([]);
    }
  }, [values.category, allSubs]);

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
      });
  };

  const loadProduct = () => {
    setPageLoading(true);
    getProduct(slug)
      .then((res) => {
        console.log("Product loaded:", res.data);
        const product = res.data;

        setValues({
          title: product.title || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category?._id || product.category || "",
          subs: product.subs?.map((sub) => sub._id || sub) || [],
          shipping: product.shipping || "",
          quantity: product.quantity || "",
          images: [],
          colors: ["Black", "Brown", "White", "Red", "Blue", "Green"],
          brands: ["Apple", "LG", "Sony", "Accer"],
          color: product.color || "",
          brand: product.brand || "",
        });

        // Set existing images
        setExistingImages(product.images || []);

        // Pre-populate form
        form.setFieldsValue({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category?._id || product.category,
          subs: product.subs?.map((sub) => sub._id || sub) || [],
          shipping: product.shipping,
          quantity: product.quantity,
          color: product.color,
          brand: product.brand,
        });

        setPageLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        toast.error("Failed to load product");
        setPageLoading(false);
        navigate("/admin/products");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
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

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToRemove([...imagesToRemove, imageToRemove]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
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

    // Check if at least one image exists (existing or new)
    if (existingImages.length === 0 && values.images.length === 0) {
      toast.error("Please keep or add at least one image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    
    // Add basic fields
    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("subs", JSON.stringify(values.subs || []));
    formData.append("quantity", values.quantity);
    formData.append("shipping", values.shipping);
    formData.append("color", values.color);
    formData.append("brand", values.brand);

    // Add existing images as JSON string
    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    // Add new images
    values.images.forEach((image) => {
      formData.append("images", image);
    });

    // Add images to remove as JSON string
    if (imagesToRemove.length > 0) {
      formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
    }

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await updateProduct(slug, formData, user?.token);

    console.log("Update response:", response);
    toast.success("✓ Product updated successfully!");
    
    // Small delay before navigation to show toast
    setTimeout(() => {
      navigate("/admin/products");
    }, 1000);
  } catch (error) {
    console.error("Full error:", error);
    console.error("Error response:", error.response);

    let errorMessage = "Failed to update product";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.details) {
      errorMessage = error.response.data.details;
    } else if (error.response?.data) {
      errorMessage = JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleReset = () => {
    loadProduct();
    setImagePreview([]);
    setImagesToRemove([]);
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  if (pageLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading product..." />
      </div>
    );
  }

  return (
    <div className="product-update-container">
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
                    <ArrowLeftOutlined
                      style={{ marginRight: "10px", cursor: "pointer" }}
                      onClick={handleCancel}
                    />
                    Update Product
                  </h1>
                  <p
                    className="page-subtitle"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                    Edit product details and save changes
                  </p>
                </Col>
              </Row>
            </Card>

            {/* Product Update Form Section */}
            <Card
              title={
                <span>
                  <PlusOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                  Edit Product: {values.title}
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
                      <Form.Item label="Slug (Auto-generated)">
                        <Input
                          name="slug"
                          placeholder={slug}
                          disabled
                          value={slug}
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

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <>
                      <Divider orientation="left">Current Images</Divider>
                      <Row gutter={[16, 16]}>
                        <Col xs={24}>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            {existingImages.map((image, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                }}
                              >
                                <img
                                  src={
                                    image.url?.startsWith("http")
                                      ? image.url
                                      : `${
                                          process.env.REACT_APP_API?.replace(
                                            "/api",
                                            ""
                                          ) || "http://localhost:8000"
                                        }${image.url}`
                                  }
                                  alt={`existing-${index}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                  }}
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/100?text=No+Image";
                                  }}
                                />
                                <Button
                                  type="primary"
                                  danger
                                  size="small"
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-5px",
                                    borderRadius: "50%",
                                    width: "25px",
                                    height: "25px",
                                    padding: "0",
                                  }}
                                  onClick={() => removeExistingImage(index)}
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Images Upload */}
                  <Divider orientation="left">Add New Images</Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Form.Item label="Upload Additional Images">
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
                        <h4>New Image Preview</h4>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          {imagePreview.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`preview-${index}`}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/100?text=No+Image";
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
                        Update Product
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
                    <Col>
                      <Button
                        size="large"
                        onClick={handleCancel}
                        style={{ borderRadius: "4px" }}
                      >
                        Cancel
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

export default UpdateProduct;