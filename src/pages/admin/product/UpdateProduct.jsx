import React, { useState, useEffect, useCallback } from "react";
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

  // ---------------- LOAD CATEGORIES ----------------
  const loadCategories = useCallback(async () => {
    try {
      const res = await getCategories();

      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);

      toast.error("Failed to load categories");
    }
  }, []);

  // ---------------- LOAD SUBS ----------------
  const loadSubs = useCallback(async () => {
    try {
      const res = await getSubs();

      setAllSubs(res.data);
    } catch (err) {
      console.error("Error loading subs:", err);
    }
  }, []);

  // ---------------- LOAD PRODUCT ----------------
  const loadProduct = useCallback(async () => {
    try {
      setPageLoading(true);

      const res = await getProduct(slug);

      const product = res.data;

      console.log("Product loaded:", product);

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

      setExistingImages(product.images || []);

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
    } catch (err) {
      console.error("Error loading product:", err);

      toast.error("Failed to load product");

      navigate("/admin/products");
    } finally {
      setPageLoading(false);
    }
  }, [slug, form, navigate]);

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    loadCategories();
    loadSubs();
    loadProduct();
  }, [loadCategories, loadSubs, loadProduct]);

  // ---------------- FILTER SUBS ----------------
  useEffect(() => {
    if (values.category) {
      const filtered = allSubs.filter(
        (sub) => sub.parent === values.category
      );

      setFilteredSubs(filtered);
    } else {
      setFilteredSubs([]);
    }
  }, [values.category, allSubs]);

  // ---------------- CLEANUP PREVIEWS ----------------
  useEffect(() => {
    return () => {
      imagePreview.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreview]);

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- HANDLE SELECT CHANGE ----------------
  const handleSelectChange = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = ({ fileList: newFileList }) => {
    const images = newFileList.map(
      (file) => file.originFileObj || file
    );

    setValues((prev) => ({
      ...prev,
      images,
    }));

    const previews = newFileList.map((file) => {
      if (file.originFileObj) {
        return URL.createObjectURL(file.originFileObj);
      }

      return file.url;
    });

    setImagePreview(previews);
  };

  // ---------------- REMOVE EXISTING IMAGE ----------------
  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];

    setImagesToRemove((prev) => [...prev, imageToRemove]);

    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ---------------- SUBMIT ----------------
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

      if (
        existingImages.length === 0 &&
        values.images.length === 0
      ) {
        toast.error("Please keep or add at least one image");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      // Basic fields
      formData.append("title", values.title.trim());
      formData.append(
        "description",
        values.description.trim()
      );
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append(
        "subs",
        JSON.stringify(values.subs || [])
      );
      formData.append("quantity", values.quantity);
      formData.append("shipping", values.shipping);
      formData.append("color", values.color);
      formData.append("brand", values.brand);

      // Existing images
      if (existingImages.length > 0) {
        formData.append(
          "existingImages",
          JSON.stringify(existingImages)
        );
      }

      // New images
      values.images.forEach((image) => {
        formData.append("images", image);
      });

      // Remove images
      if (imagesToRemove.length > 0) {
        formData.append(
          "imagesToRemove",
          JSON.stringify(imagesToRemove)
        );
      }

      const response = await updateProduct(
        slug,
        formData,
        user?.token
      );

      console.log("Update response:", response);

      toast.success("✓ Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      console.error("Full error:", error);

      let errorMessage = "Failed to update product";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET ----------------
  const handleReset = () => {
    loadProduct();

    setImagePreview([]);
    setImagesToRemove([]);
  };

  // ---------------- CANCEL ----------------
  const handleCancel = () => {
    navigate("/admin/products");
  };

  // ---------------- LOADING ----------------
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
        {/* Sidebar */}
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
          <div style={{ position: "sticky", top: "24px" }}>
            <AdminNav />
          </div>
        </Col>

        {/* Content */}
        <Col xs={24} sm={24} md={20} lg={20} xl={20}>
          <div
            className="page-content"
            style={{ paddingRight: "12px" }}
          >
            {/* Header */}
            <Card
              className="header-card"
              style={{
                marginBottom: "24px",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                borderRadius: "8px",
              }}
            >
              <Row align="middle" justify="space-between">
                <Col xs={24} md={12}>
                  <h1
                    style={{
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                  >
                    <ArrowLeftOutlined
                      style={{
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={handleCancel}
                    />
                    Update Product
                  </h1>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    Edit product details and save changes
                  </p>
                </Col>
              </Row>
            </Card>

            {/* Form */}
            <Card
              title={
                <span>
                  <PlusOutlined
                    style={{
                      marginRight: "8px",
                      color: "#1890ff",
                    }}
                  />
                  Edit Product: {values.title}
                </span>
              }
            >
              <Spin spinning={loading}>
                <Form
                  form={form}
                  layout="vertical"
                  autoComplete="off"
                >
                  <Divider orientation="left">
                    Basic Information
                  </Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Product Title">
                        <Input
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          placeholder="Enter product title"
                          maxLength={32}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Slug">
                        <Input value={slug} disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Description">
                    <Input.TextArea
                      name="description"
                      rows={5}
                      value={values.description}
                      onChange={handleChange}
                      maxLength={2000}
                      showCount
                    />
                  </Form.Item>

                  <Divider orientation="left">
                    Pricing & Inventory
                  </Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={6}>
                      <Form.Item label="Price">
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          step={0.01}
                          value={values.price}
                          onChange={(value) =>
                            handleSelectChange(
                              "price",
                              value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Form.Item label="Quantity">
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          value={values.quantity}
                          onChange={(value) =>
                            handleSelectChange(
                              "quantity",
                              value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Form.Item label="Shipping">
                        <Select
                          value={values.shipping || undefined}
                          onChange={(value) =>
                            handleSelectChange(
                              "shipping",
                              value
                            )
                          }
                        >
                          <Select.Option value="Yes">
                            Yes
                          </Select.Option>

                          <Select.Option value="No">
                            No
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={6}>
                      <Form.Item label="Brand">
                        <Select
                          value={values.brand || undefined}
                          onChange={(value) =>
                            handleSelectChange(
                              "brand",
                              value
                            )
                          }
                        >
                          {values.brands.map((brand) => (
                            <Select.Option
                              key={brand}
                              value={brand}
                            >
                              {brand}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">
                    Categories
                  </Divider>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Main Category">
                        <Select
                          value={values.category || undefined}
                          onChange={(value) =>
                            handleSelectChange(
                              "category",
                              value
                            )
                          }
                        >
                          {categories.map((cat) => (
                            <Select.Option
                              key={cat._id}
                              value={cat._id}
                            >
                              {cat.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Sub Categories">
                        <Select
                          mode="multiple"
                          value={values.subs || []}
                          disabled={
                            !values.category ||
                            filteredSubs.length === 0
                          }
                          onChange={(value) =>
                            handleSelectChange(
                              "subs",
                              value
                            )
                          }
                        >
                          {filteredSubs.map((sub) => (
                            <Select.Option
                              key={sub._id}
                              value={sub._id}
                            >
                              {sub.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">
                    Product Attributes
                  </Divider>

                  <Form.Item label="Color">
                    <Select
                      value={values.color || undefined}
                      onChange={(value) =>
                        handleSelectChange("color", value)
                      }
                    >
                      {values.colors.map((color) => (
                        <Select.Option
                          key={color}
                          value={color}
                        >
                          {color}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <>
                      <Divider orientation="left">
                        Current Images
                      </Divider>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        {existingImages.map((image, index) => (
                          <div
                            key={image.url || index}
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
                                      ) ||
                                      "http://localhost:8000"
                                    }${image.url}`
                              }
                              alt={`existing-${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/100";
                              }}
                            />

                            <Button
                              type="primary"
                              danger
                              size="small"
                              onClick={() =>
                                removeExistingImage(index)
                              }
                              style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-5px",
                                borderRadius: "50%",
                              }}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Upload */}
                  <Divider orientation="left">
                    Add New Images
                  </Divider>

                  <Upload
                    listType="picture-card"
                    multiple
                    accept="image/*"
                    beforeUpload={() => false}
                    onChange={handleImageUpload}
                    fileList={values.images.map((img, idx) => ({
                      uid: `${idx}`,
                      name: `image-${idx}`,
                      status: "done",
                      originFileObj: img,
                    }))}
                  >
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>
                        Upload Images
                      </div>
                    </div>
                  </Upload>

                  {/* Preview */}
                  {imagePreview.length > 0 && (
                    <>
                      <Divider orientation="left">
                        Preview
                      </Divider>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        {imagePreview.map((preview, index) => (
                          <img
                            key={preview}
                            src={preview}
                            alt={`preview-${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Buttons */}
                  <Row
                    gutter={[16, 16]}
                    style={{ marginTop: "30px" }}
                  >
                    <Col>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={loading}
                        onClick={handleSubmit}
                      >
                        Update Product
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </Col>

                    <Col>
                      <Button onClick={handleCancel}>
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