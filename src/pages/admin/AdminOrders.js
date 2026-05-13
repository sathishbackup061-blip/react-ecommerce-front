import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

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
  const { user } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // -----------------------------
  // LOAD ORDERS
  // -----------------------------
  const loadOrders =
    useCallback(async () => {
      try {
        if (!user?.token) return;

        setLoading(true);

        const res =
          await getOrders(
            user.token
          );

        setOrders(
          res.data || []
        );
      } catch (err) {
        console.log(err);

        message.error(
          "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    }, [user]);

  // -----------------------------
  // EFFECT
  // -----------------------------
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // -----------------------------
  // STATUS UPDATE
  // -----------------------------
  const handleStatusChange =
    async (orderId, value) => {
      try {
        await changeOrderStatus(
          user.token,
          orderId,
          value
        );

        message.success(
          "Order status updated"
        );

        loadOrders();
      } catch (err) {
        console.log(err);

        message.error(
          "Update failed"
        );
      }
    };

  // -----------------------------
  // TABLE COLUMNS
  // -----------------------------
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
            {order.user?.name ||
              "N/A"}
          </div>

          <small>
            {order.user?.email ||
              "No Email"}
          </small>
        </div>
      ),
    },

    {
      title: "Total",

      render: (_, order) => (
        <b>
          ₹
          {order.totalAfterDiscount?.toFixed(
            2
          ) || "0.00"}
        </b>
      ),
    },

    {
      title: "Payment",

      render: (_, order) => (
        <Tag color="green">
          {order
            .paymentIntent
            ?.status || "N/A"}
        </Tag>
      ),
    },

    {
      title: "Order Status",

      render: (_, order) => (
        <Select
          value={
            order.orderStatus
          }
          style={{
            width: 160,
          }}
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
        loading={loading}
      />
    </Card>
  );
};

export default AdminOrders;