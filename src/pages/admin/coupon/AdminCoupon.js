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
  Col, Row, Spin, Empty
} from "antd";
import axios from "axios";

//import moment from "moment";


import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
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
          headers: { authtoken: user.token },
        }
      );
      setCoupons(res.data);
    } catch (err) {
      message.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // ---------------- CREATE COUPON ----------------
   const createCoupon = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/coupon`,
        form,
        {
          headers: {
            authtoken: user?.token,
          },
        }
      );

      message.success("Coupon created");
      loadCoupons();
    } catch (err) {
      message.error(err.response?.data?.err || "Error");
    }
  };

  // ---------------- DELETE ----------------
  const deleteCoupon = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/coupon/${id}`,
        {
          headers: { authtoken: user.token },
        }
      );

      message.success("Coupon deleted");
      loadCoupons();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // ---------------- TABLE ----------------
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (d) => <b>{d}%</b>,
    },

    {
      title: "Expiry",
      dataIndex: "expiry",
      //render: (date) => moment(date).format("YYYY-MM-DD"),
    },

    {
      title: "Status",
      render: (_, record) => {
        const isExpired = new Date(record.expiry) < new Date();

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
          onConfirm={() => deleteCoupon(record._id)}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

 const applyCoupon = (code, cartTotal, authtoken) =>
    axios.post(
        `${process.env.REACT_APP_API}/coupon/validate`,
        { code, cartTotal },
        {
        headers: {
            authtoken,
        },
        }
    );

  return (
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
                        <Card title="🎟️ Coupon Management">

                            {/* CREATE FORM */}
                            <Space wrap style={{ marginBottom: 20 }}>

                            <Input
                                placeholder="Coupon Code"
                                value={form.code}
                                onChange={(e) =>
                                setForm({ ...form, code: e.target.value })
                                }
                            />

                            <InputNumber
                                placeholder="Discount %"
                                value={form.discount}
                                onChange={(v) =>
                                setForm({ ...form, discount: v })
                                }
                            />

                            <DatePicker
                                onChange={(date, dateString) =>
                                setForm({ ...form, expiry: dateString })
                                }
                            />

                            <Button type="primary" onClick={createCoupon}>
                                Create Coupon
                            </Button>
                            </Space>

                            <Divider />

                            {/* TABLE */}
                            <Table
                            dataSource={coupons}
                            columns={columns}
                            rowKey="_id"
                            />
                        </Card>
                    </div>
                </Col> 
      </Row>
  );
};

export default AdminCoupon;