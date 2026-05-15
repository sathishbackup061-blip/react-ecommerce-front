/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";

import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  message,
  Popconfirm,
  Divider,
  Col,
  Row,
  Switch,
  Select,
} from "antd";

import AdminNav from "../../../components/nav/AdminNav";

import { useSelector } from "react-redux";

// ================= API FUNCTIONS =================
import {
  getBanners,
  createBanner,
  removeBanner,
} from "../../../functions/banner";

const { Option } = Select;

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);

  const { user } = useSelector((state) => state);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    images: [""],
    link: "",
    type: "hero",
    active: true,
  });

  // ================= FETCH BANNERS =================
  const loadBanners = async () => {
    try {
      const res = await getBanners();

      setBanners(res.data);

      console.log("BANNERS =>", res.data);

    } catch (err) {
      console.log(err);

      message.error("Failed to load banners");
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // ================= CREATE BANNER =================
  const handleCreateBanner = async () => {
    try {
      await createBanner(
        form,
        user?.token
      );

      message.success("Banner created");

      setForm({
        title: "",
        subtitle: "",
        description: "",
        images: [""],
        link: "",
        type: "hero",
        active: true,
      });

      loadBanners();

    } catch (err) {
      console.log(err);

      message.error(
        err.response?.data?.err ||
          "Error creating banner"
      );
    }
  };

  // ================= DELETE BANNER =================
  const handleDeleteBanner = async (
    id
  ) => {
    try {
      await removeBanner(
        id,
        user?.token
      );

      message.success("Banner deleted");

      loadBanners();

    } catch (err) {
      console.log(err);

      message.error("Delete failed");
    }
  };

  // ================= TYPE TAG COLORS =================
  const getTypeColor = (type) => {
    switch (type) {
      case "hero":
        return "purple";

      case "offer":
        return "green";

      case "category":
        return "orange";

      case "sidebar":
        return "blue";

      default:
        return "default";
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "Image",
      dataIndex: "images",

      render: (images) => (
        <img
          src={
            images &&
            images.length > 0 &&
            images[0]
              ? images[0]
              : "https://via.placeholder.com/100x60?text=No+Image"
          }
          alt="banner"
          style={{
            width: 100,
            height: 60,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ),
    },

    {
      title: "Title",
      dataIndex: "title",

      render: (text) => (
        <Tag color="blue">
          {text}
        </Tag>
      ),
    },

    {
      title: "Type",
      dataIndex: "type",

      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
    },

    {
      title: "Subtitle",
      dataIndex: "subtitle",
    },

    {
      title: "Link",
      dataIndex: "link",
    },

    {
      title: "Status",
      dataIndex: "active",

      render: (active) =>
        active ? (
          <Tag color="green">
            Active
          </Tag>
        ) : (
          <Tag color="red">
            Inactive
          </Tag>
        ),
    },

    {
      title: "Action",

      render: (_, record) => (
        <Popconfirm
          title="Delete banner?"
          onConfirm={() =>
            handleDeleteBanner(
              record._id
            )
          }
          okText="Yes"
          cancelText="No"
        >
          <Button danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
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
          <Card title="🖼️ Banner Management">
            {/* CREATE FORM */}
            <Space
              direction="vertical"
              style={{
                width: "100%",
                marginBottom: 20,
              }}
            >
              <Input
                placeholder="Banner Title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Subtitle"
                value={form.subtitle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subtitle:
                      e.target.value,
                  })
                }
              />

              <Input.TextArea
                placeholder="Description"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />

              {/* IMAGE URL */}
              <Input
                placeholder="Banner Image URL"
                value={form.images[0]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: [
                      e.target.value,
                    ],
                  })
                }
              />

              <Input
                placeholder="Redirect Link"
                value={form.link}
                onChange={(e) =>
                  setForm({
                    ...form,
                    link: e.target.value,
                  })
                }
              />

              {/* BANNER TYPE */}
              <Select
                value={form.type}
                onChange={(value) =>
                  setForm({
                    ...form,
                    type: value,
                  })
                }
                style={{
                  width: "100%",
                }}
              >
                <Option value="hero">
                  Hero Banner
                </Option>

                <Option value="offer">
                  Offer Banner
                </Option>

                <Option value="category">
                  Category Banner
                </Option>

                <Option value="sidebar">
                  Sidebar Banner
                </Option>
              </Select>

              {/* ACTIVE SWITCH */}
              <Space>
                <span>Active:</span>

                <Switch
                  checked={form.active}
                  onChange={(checked) =>
                    setForm({
                      ...form,
                      active: checked,
                    })
                  }
                />
              </Space>

              <Button
                type="primary"
                size="large"
                onClick={
                  handleCreateBanner
                }
              >
                Create Banner
              </Button>
            </Space>

            <Divider />

            {/* TABLE */}
            <Table
              dataSource={banners}
              columns={columns}
              rowKey="_id"
              pagination={{
                pageSize: 5,
              }}
            />
          </Card>
        </div>
      </Col>
    </Row>
  );
};

export default AdminBanner;