/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Space,
  Tag,
  message,
  Popconfirm,
  Divider,
  Col,
  Row,
} from "antd";

import axios from "axios";

import AdminNav from "../../../components/nav/AdminNav";
import { useSelector } from "react-redux";

const AdminCoupon = () => {
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => state);

  const [form, setForm] = useState({
    code: "",
    discount: "",
    expiry: "",
  });

  // ---------------- FETCH COUPONS ----------------
  const loadCoupons = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/coupons`,
        {
          headers: {
            authtoken: user?.token,
          },
        }
      );

      setCoupons(res.data);
    } catch (err) {
      console.log(err);
      message.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadCoupons();
    }
  }, [user]);

  // ---------------- CREATE COUPON ----------------
  const createCoupon = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/coupon`,
        form,
        {
          headers: {
            authtoken: user?.token,
          },
        }
      );

      message.success("Coupon created");

      setForm({
        code: "",
        discount: "",
        expiry: "",
      });

      loadCoupons();
    } catch (err) {
      console.log(err);

      message.error(
        err.response?.data?.err || "Error creating coupon"
      );
    }
  };

  // ---------------- DELETE COUPON ----------------
  const deleteCoupon = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/coupon/${id}`,
        {
          headers: {
            authtoken: user?.token,
          },
        }
      );

      message.success("Coupon deleted");

      loadCoupons();
    } catch (err) {
      console.log(err);

      message.error("Delete failed");
    }
  };

  // ---------------- TABLE COLUMNS ----------------
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      ),
    },

    {
      title: "Discount",
      dataIndex: "discount",
      render: (discount) => (
        <b>{discount}%</b>
      ),
    },

    {
      title: "Expiry",
      dataIndex: "expiry",
      render: (expiry) =>
        expiry
          ? new Date(expiry).toLocaleDateString()
          : "N/A",
    },

    {
      title: "Status",
      render: (_, record) => {
        const isExpired =
          new Date(record.expiry) < new Date();

        return isExpired ? (
          <Tag color="red">Expired</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        );
      },
    },

    {
      title: "Action",
      render: (_, record) => (
        <Popconfirm
          title="Delete coupon?"
          onConfirm={() =>
            deleteCoupon(record._id)
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
      <Col xs={0} sm={0} md={4} lg={4} xl={4}>
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
      <Col xs={24} sm={24} md={20} lg={20} xl={20}>
        <div
          className="page-content"
          style={{ paddingRight: "12px" }}
        >
          <Card title="🎟️ Coupon Management">
            {/* CREATE FORM */}
            <Space
              wrap
              style={{ marginBottom: 20 }}
            >
              <Input
                placeholder="Coupon Code"
                value={form.code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value,
                  })
                }
              />

              <InputNumber
                placeholder="Discount %"
                min={1}
                max={100}
                value={form.discount}
                onChange={(value) =>
                  setForm({
                    ...form,
                    discount: value,
                  })
                }
              />

              <DatePicker
                onChange={(
                  date,
                  dateString
                ) =>
                  setForm({
                    ...form,
                    expiry: dateString,
                  })
                }
              />

              <Button
                type="primary"
                onClick={createCoupon}
              >
                Create Coupon
              </Button>
            </Space>

            <Divider />

            {/* TABLE */}
            <Table
              dataSource={coupons}
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

export default AdminCoupon;