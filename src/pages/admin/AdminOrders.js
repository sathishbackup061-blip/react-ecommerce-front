import React, { useEffect, useState } from "react";

import {
  Table,
  Select,
  Tag,
  message,
  Card,
} from "antd";

import { useSelector } from "react-redux";

import {
  getOrders,
  changeOrderStatus,
} from "../../functions/admin";

const { Option } = Select;

const AdminOrders = () => {
  const { user } = useSelector((state) => ({
    ...state,
  }));

  const [orders, setOrders] = useState([]);

  // LOAD ORDERS
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrders(user.token);

      setOrders(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // STATUS UPDATE
  const handleStatusChange = async (
    orderId,
    value
  ) => {
    try {
      await changeOrderStatus(
        user.token,
        orderId,
        value
      );

      message.success("Order status updated");

      loadOrders();

    } catch (err) {
      console.log(err);

      message.error("Update failed");
    }
  };

  // TABLE
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
    },

    {
      title: "Customer",
      render: (_, order) => (
        <div>
          <div>
            {order.user?.name}
          </div>

          <small>
            {order.user?.email}
          </small>
        </div>
      ),
    },

    {
      title: "Total",
      render: (_, order) => (
        <b>
          ₹{order.totalAfterDiscount}
        </b>
      ),
    },

    {
      title: "Payment",
      render: (_, order) => (
        <Tag color="green">
          {order.paymentIntent?.status}
        </Tag>
      ),
    },

    {
      title: "Order Status",

      render: (_, order) => (
        <Select
          defaultValue={order.orderStatus}
          style={{ width: 160 }}
          onChange={(value) =>
            handleStatusChange(
              order._id,
              value
            )
          }
        >
          <Option value="Processing">
            Processing
          </Option>

          <Option value="Paid">
            Paid
          </Option>

          <Option value="Shipped">
            Shipped
          </Option>

          <Option value="Delivered">
            Delivered
          </Option>

          <Option value="Cancelled">
            Cancelled
          </Option>
        </Select>
      ),
    },
  ];

  return (
    <Card title="Admin Orders">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
      />
    </Card>
  );
};

export default AdminOrders;