import React, { useState, useEffect } from "react";

import AdminNav from "../../../components/nav/AdminNav";

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Spin,
} from "antd";

import {
  UploadOutlined,
} from "@ant-design/icons";

import { toast } from "react-toastify";

import { useSelector } from "react-redux";

import {
  createProduct,
} from "../../../functions/product";

import { getCategories } from "../../../functions/category";

import { getSubs } from "../../../functions/sub";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  quantity: "",
  shipping: "",
  color: "",
  brand: "",
  images: [],
};

const colors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Brown",
];

const brands = [
  "Apple",
  "LG",
  "Sony",
  "Acer",
];

const ProductCreate = () => {

  const { user } = useSelector(
    (state) => ({ ...state })
  );

  const [values, setValues] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState([]);

  const [subs, setSubs] =
    useState([]);

  const [filteredSubs, setFilteredSubs] =
    useState([]);

  // ================= LOAD DATA =================

  useEffect(() => {

    loadCategories();

    loadSubs();

  }, []);

  const loadCategories = async () => {

    try {

      const res =
        await getCategories();

      setCategories(res.data);

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load categories"
      );
    }
  };

  const loadSubs = async () => {

    try {

      const res =
        await getSubs();

      setSubs(res.data);

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load sub categories"
      );
    }
  };

  // ================= CATEGORY CHANGE =================

  useEffect(() => {

    if (values.category) {

      const filtered =
        subs.filter(
          (s) =>
            s.parent?._id ===
              values.category ||
            s.parent ===
              values.category
        );

      setFilteredSubs(filtered);

    } else {

      setFilteredSubs([]);
    }

  }, [values.category, subs]);

  // ================= INPUT CHANGE =================

  const handleChange = (
    name,
    value
  ) => {

    setValues({
      ...values,
      [name]: value,
    });
  };

  // ================= IMAGE CHANGE =================

  const handleImageChange = ({
    fileList,
  }) => {

    const files =
      fileList.map(
        (file) =>
          file.originFileObj
      );

    setValues({
      ...values,
      images: files,
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {

    try {

      if (!values.title) {
        return toast.error(
          "Title required"
        );
      }

      if (
        values.images.length === 0
      ) {
        return toast.error(
          "Upload images"
        );
      }

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        values.title
      );

      formData.append(
        "description",
        values.description
      );

      formData.append(
        "price",
        values.price
      );

      formData.append(
        "category",
        values.category
      );

      formData.append(
        "subs",
        JSON.stringify(
          values.subs
        )
      );

      formData.append(
        "quantity",
        values.quantity
      );

      formData.append(
        "shipping",
        values.shipping
      );

      formData.append(
        "color",
        values.color
      );

      formData.append(
        "brand",
        values.brand
      );

      values.images.forEach(
        (file) => {

          formData.append(
            "images",
            file
          );
        }
      );

      await createProduct(
        formData,
        user?.token
      );

      toast.success(
        "Product created"
      );

      setValues(initialState);

    } catch (err) {

      console.log(err);

      toast.error(
        err.response?.data?.error ||
          "Create product failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <Row gutter={20}>

      {/* SIDEBAR */}

      <Col
        xs={24}
        md={4}
      >
        <AdminNav />
      </Col>

      {/* FORM */}

      <Col
        xs={24}
        md={20}
      >

        <Card title="Create Product">

          <Spin spinning={loading}>

            <Form layout="vertical">

              {/* TITLE */}

              <Form.Item label="Title">

                <Input
                  value={values.title}
                  onChange={(e) =>
                    handleChange(
                      "title",
                      e.target.value
                    )
                  }
                />

              </Form.Item>

              {/* DESCRIPTION */}

              <Form.Item label="Description">

                <Input.TextArea
                  rows={4}
                  value={
                    values.description
                  }
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                />

              </Form.Item>

              {/* PRICE + QUANTITY */}

              <Row gutter={16}>

                <Col span={12}>

                  <Form.Item label="Price">

                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                      min={0}
                      value={
                        values.price
                      }
                      onChange={(value) =>
                        handleChange(
                          "price",
                          value
                        )
                      }
                    />

                  </Form.Item>

                </Col>

                <Col span={12}>

                  <Form.Item label="Quantity">

                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                      min={0}
                      value={
                        values.quantity
                      }
                      onChange={(value) =>
                        handleChange(
                          "quantity",
                          value
                        )
                      }
                    />

                  </Form.Item>

                </Col>

              </Row>

              {/* CATEGORY */}

              <Row gutter={16}>

                <Col span={12}>

                  <Form.Item label="Category">

                    <Select
                      value={
                        values.category ||
                        undefined
                      }
                      onChange={(value) =>
                        handleChange(
                          "category",
                          value
                        )
                      }
                    >

                      {categories.map(
                        (c) => (
                          <Select.Option
                            key={c._id}
                            value={
                              c._id
                            }
                          >
                            {c.name}
                          </Select.Option>
                        )
                      )}

                    </Select>

                  </Form.Item>

                </Col>

                <Col span={12}>

                  <Form.Item label="Sub Categories">

                    <Select
                      mode="multiple"
                      value={
                        values.subs
                      }
                      onChange={(value) =>
                        handleChange(
                          "subs",
                          value
                        )
                      }
                    >

                      {filteredSubs.map(
                        (s) => (
                          <Select.Option
                            key={s._id}
                            value={
                              s._id
                            }
                          >
                            {s.name}
                          </Select.Option>
                        )
                      )}

                    </Select>

                  </Form.Item>

                </Col>

              </Row>

              {/* COLOR + BRAND */}

              <Row gutter={16}>

                <Col span={12}>

                  <Form.Item label="Color">

                    <Select
                      value={
                        values.color ||
                        undefined
                      }
                      onChange={(value) =>
                        handleChange(
                          "color",
                          value
                        )
                      }
                    >

                      {colors.map((c) => (
                        <Select.Option
                          key={c}
                          value={c}
                        >
                          {c}
                        </Select.Option>
                      ))}

                    </Select>

                  </Form.Item>

                </Col>

                <Col span={12}>

                  <Form.Item label="Brand">

                    <Select
                      value={
                        values.brand ||
                        undefined
                      }
                      onChange={(value) =>
                        handleChange(
                          "brand",
                          value
                        )
                      }
                    >

                      {brands.map((b) => (
                        <Select.Option
                          key={b}
                          value={b}
                        >
                          {b}
                        </Select.Option>
                      ))}

                    </Select>

                  </Form.Item>

                </Col>

              </Row>

              {/* SHIPPING */}

              <Form.Item label="Shipping">

                <Select
                  value={
                    values.shipping ||
                    undefined
                  }
                  onChange={(value) =>
                    handleChange(
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

              {/* IMAGES */}

              <Form.Item label="Images">

                <Upload
                  multiple
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={
                    handleImageChange
                  }
                >

                  <div>
                    <UploadOutlined />
                    <div>
                      Upload
                    </div>
                  </div>

                </Upload>

              </Form.Item>

              {/* BUTTONS */}

              <Button
                type="primary"
                onClick={
                  handleSubmit
                }
                loading={loading}
              >
                Create Product
              </Button>

            </Form>

          </Spin>

        </Card>

      </Col>

    </Row>
  );
};

export default ProductCreate;