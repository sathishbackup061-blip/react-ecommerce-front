import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Empty,
  Spin,
  Typography,
  Button,
} from "antd";

import { useSelector } from "react-redux";
import { getUserOrders } from "../../functions/order";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;

const History = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // LOAD ORDERS
  useEffect(() => {
    if (user && user.token) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await getUserOrders(user.token);

      console.log("ORDERS:", res.data);

      setOrders(res.data || []);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // DOWNLOAD PDF
const downloadPDF = (order) => {
  const doc = new jsPDF();

  // =========================
  // HEADER
  // =========================
  doc.setFillColor(22, 119, 255);
  doc.rect(0, 0, 220, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("ORDER INVOICE", 14, 20);

  // =========================
  // COMPANY INFO
  // =========================
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);

  doc.text("My Ecommerce Store", 14, 40);
  doc.text("Chennai, Tamil Nadu", 14, 47);
  doc.text("Phone: +91 9876543210", 14, 54);
  doc.text("Email: support@mystore.com", 14, 61);

  // =========================
  // ORDER INFO
  // =========================
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 70, 182, 40, "F");

  doc.setFontSize(11);

  doc.text(`Order ID: ${order._id}`, 18, 80);

  doc.text(
    `Order Date: ${new Date(
      order.createdAt
    ).toLocaleString()}`,
    18,
    88
  );

  doc.text(
    `Payment Status: ${
      order.paymentIntent?.status || "N/A"
    }`,
    18,
    96
  );

  doc.text(
    `Transaction ID: ${
      order.paymentIntent?.id || "N/A"
    }`,
    18,
    104
  );

  // =========================
  // CUSTOMER INFO
  // =========================
  doc.setFontSize(13);
  doc.text("Customer Details", 14, 125);

  doc.setFontSize(11);

  doc.text(
    `Delivery Address: ${
      order.address || "N/A"
    }`,
    14,
    135
  );

  doc.text(
    `Phone Number: ${
      order.phone || "N/A"
    }`,
    14,
    143
  );

  // =========================
  // PRODUCTS TABLE
  // =========================
  const tableColumn = [
    "Title",
    "Brand",
    "Color",
    "Price",
    "Qty",
    "Shipping",
    "Subtotal",
  ];

  const tableRows = [];

  (order.products || []).forEach((item) => {
    tableRows.push([
      item.product?.title || "Product",

      item.product?.brand || "No Brand",

      item.color || "N/A",

      `₹${item.price}`,

      item.count,

      item.product?.shipping || "Yes",

      `₹${item.price * item.count}`,
    ]);
  });

  autoTable(doc, {
    startY: 155,

    head: [tableColumn],

    body: tableRows,

    theme: "grid",

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [22, 119, 255],
      textColor: [255, 255, 255],
    },
  });

  // =========================
  // TOTALS
  // =========================
  const finalY =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(12);

  doc.text(
    `Cart Total: ₹${order.cartTotal}`,
    140,
    finalY
  );

  doc.text(
    `Discount (${order.discount || 0}%): ₹${
      order.discountAmount || 0
    }`,
    140,
    finalY + 10
  );

  doc.setFontSize(14);

  doc.setTextColor(0, 128, 0);

  doc.text(
    `Final Paid: ₹${order.totalAfterDiscount}`,
    140,
    finalY + 22
  );

  // =========================
  // FOOTER
  // =========================
  doc.setTextColor(120);

  doc.setFontSize(10);

  doc.text(
    "Thank you for shopping with us!",
    14,
    finalY + 45
  );

  doc.text(
    "This is a computer-generated invoice.",
    14,
    finalY + 52
  );

  // =========================
  // SAVE PDF
  // =========================
  doc.save(`invoice-${order._id}.pdf`);
};

  // TABLE COLUMNS
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },

    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },

    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <Tag color="magenta">
          {color}
        </Tag>
      ),
    },

    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },

    {
      title: "Shipping",
      dataIndex: "shipping",
      key: "shipping",
      render: (shipping) => (
        <Tag color={shipping === "Yes" ? "green" : "red"}>
          {shipping}
        </Tag>
      ),
    },
  ];

  return (
    <Row gutter={24}>
      {/* LEFT NAV */}
      <Col xs={24} md={5}>
        <UserNav />
      </Col>

      {/* RIGHT CONTENT */}
      <Col xs={24} md={19} style={{ padding: 20 }}>
        <Title level={3}>
          📦 Order History
        </Title>


        {loading ? (
          <Spin size="large" />
        ) : orders.length === 0 ? (
          <Empty description="No Orders Found" />
        ) : (
          orders.map((order, index) => {
            // FORMAT PRODUCTS FOR TABLE
            const dataSource = (order.products || []).map(
              (p, i) => ({
                key: i,

                title:
                  p.product?.title || "Product",

                price: p.price,

                brand:
                  p.product?.brand || "No Brand",

                color: p.color || "N/A",

                count: p.count,

                shipping:
                  p.product?.shipping || "Yes",
              })
            );

            return (
              <Card
                key={index}
                style={{
                  marginBottom: 25,
                  borderRadius: 12,
                }}
                title={
                  <div>
                    <div>
                      Order ID: {order._id}
                    </div>

                    <Tag color="blue">
                      {order.orderStatus}
                    </Tag>

                    
                    <Tag color={order.paymentIntent?.method === "COD" ? "orange" : "green"}>
                      {order.paymentIntent?.method || "Online"}
                    </Tag>

                  </div>
                }
                extra={
                  <Button
                    type="primary"
                    onClick={() =>
                      downloadPDF(order)
                    }
                  >
                    Download PDF
                  </Button>
                }
              >
                
                {/* PAYMENT DETAILS */}
                    <Card
                    size="small"
                    style={{
                        marginBottom: 20,
                        background: "#fafafa",
                        borderRadius: 10,
                    }}
                    >
                    <Row gutter={[16, 16]}>
                        
                        <Col xs={24} md={6}>
                        <div>
                            <b>Payment Status</b>
                        </div>

                        <Tag
                            color={
                            order.paymentIntent?.status === "succeeded"
                                ? "green"
                                : "red"
                            }
                        >
                            {order.paymentIntent?.status || "N/A"}
                        </Tag>
                        </Col>

                        <Col xs={24} md={6}>
                        <div>
                            <b>Total Amount</b>
                        </div>

                        <div>
                            ₹{order.cartTotal}
                        </div>
                        </Col>

                        <Col xs={24} md={6}>
                        <div>
                            <b>Discount</b>
                        </div>

                        <div>
                            {order.discount || 0}% (
                            ₹{order.discountAmount || 0})
                        </div>
                        </Col>

                        <Col xs={24} md={6}>
                        <div>
                            <b>Final Paid</b>
                        </div>

                        <div
                            style={{
                            color: "green",
                            fontWeight: "bold",
                            }}
                        >
                            ₹{order.totalAfterDiscount}
                        </div>
                        </Col>

                        <Col xs={24} md={12}>
                        <div>
                            <b>Transaction ID</b>
                        </div>

                        <div
                            style={{
                            wordBreak: "break-all",
                            color: "#666",
                            }}
                        >
                            {order.paymentIntent?.id || "N/A"}
                        </div>
                        </Col>

                        <Col xs={24} md={12}>
                        <div>
                            <b>Order Date</b>
                        </div>

                        <div>
                            {new Date(order.createdAt).toLocaleString()}
                        </div>
                        </Col>
                    </Row>
                    </Card>

                <br />

                <Row gutter={16}>
                  <Col span={16}>
                    <b>Address:</b>{" "}
                    {order.address || "N/A"}
                  </Col>

                  <Col span={8}>
                    <b>Phone:</b>{" "}
                    {order.phone || "N/A"}
                  </Col>
                </Row>

                <br />

                {/* PRODUCTS TABLE */}
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  bordered
                />
              </Card>
            );
          })
        )}
      </Col>
    </Row>
  );
};

export default History;