import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  InputNumber,
  Card,
  Typography,
  Empty,
  Tag,
  Image,
  Space,
  Divider,
  message,
} from "antd";

import {
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { userCart } from "../functions/user";

import _ from "lodash";

const { Title, Text } = Typography;

const Cart = () => {
    const dispatch = useDispatch();
    const { user, cart } = useSelector((state) => ({ ...state }));
    const navigate = useNavigate();



  // TOTAL
  const getTotal = () => {
    return cart.cart.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
  };

  // REMOVE PRODUCT
  const handleRemove = (productId) => {
    const updatedCart = cart.cart.filter(
      (p) => p._id !== productId
    );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    dispatch({
      type: "ADD_TO_CART",
      payload: updatedCart,
    });

    message.success("Product removed");
  };

  // QUANTITY CHANGE
  const handleQuantityChange = (value, product) => {
    let updatedCart = [...cart.cart];

    const index = updatedCart.findIndex(
      (p) => p._id === product._id
    );

    updatedCart[index].count = value;

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    dispatch({
      type: "ADD_TO_CART",
      payload: updatedCart,
    });
  };
  

  // IMAGE
 const getImage = (product) => {
  if (
    product.images &&
    product.images.length > 0
  ) {
    return `${process.env.REACT_APP_API}${product.images[0].url}`;
  }

  return "https://via.placeholder.com/80";
};

// if am click the Proceed to Checkout button i want to update data to db
  const handleCheckout = async () => {
        if (!user || !user.token) {
            message.warning("Please login to continue checkout");
            navigate("/login", { state: { from: "/cart" } });
            return;
        }
        
        console.log("USER:", user);
        console.log("TOKEN:", user?.token);

        try {
            const res = await userCart(cart.cart, user.token);

            if (res.data.ok) {
            message.success("Cart saved successfully");
            navigate("/checkout");
            } else {
            message.error("Failed to save cart");
            }
        } catch (err) {
            console.log("cart save err", err);
            message.error("Something went wrong");
        }
        };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (_, record) => (
        <Image
          width={70}
          src={getImage(record)}
          preview={false}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Text strong>{text}</Text>
      ),
    },
    // {
    //   title: "Brand",
    //   dataIndex: "brand",
    //   key: "brand",
    //   render: (brand) => (
    //     <Tag color="blue">{brand}</Tag>
    //   ),
    // },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <Tag color="magenta">{color}</Tag>
      ),
    },
    {
      title: "Shipping",
      dataIndex: "shipping",
      key: "shipping",
      render: (shipping) =>
        shipping === "Yes" ? (
          <Tag color="green">Available</Tag>
        ) : (
          <Tag color="red">No</Tag>
        ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price}`,
    },
    {
      title: "Quantity",
      key: "count",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.quantity}
          value={record.count}
          onChange={(value) =>
            handleQuantityChange(value, record)
          }
        />
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => (
        <Text strong>
          ₹{record.price * record.count}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            handleRemove(record._id)
          }
        />
      ),
    },
  ];


  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[24, 24]}>
        {/* LEFT */}
        <Col xs={24} lg={17}>
          <Card>
            <Space align="center">
              <ShoppingCartOutlined
                style={{ fontSize: 24 }}
              />
              <Title level={3} style={{ margin: 0 }}>
                Shopping Cart
              </Title>
            </Space>

            <Divider />

            {cart.cart.length === 0 ? (
              <Empty description="Your cart is empty" />
            ) : (
              <Table
                columns={columns}
                dataSource={cart.cart}
                rowKey="_id"
                pagination={false}
                scroll={{ x: 1000 }}
              />
            )}
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={7}>
          <Card>
            <Title level={4}>Order Summary</Title>

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text>Total Items</Text>
              <Text strong>
                {cart.cart.reduce(
                  (acc, item) => acc + item.count,
                  0
                )}
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text>Total Price</Text>
              <Title level={4}>
                ₹{getTotal()}
              </Title>
            </div>

           <Button
                type="primary"
                size="large"
                block
                disabled={cart.cart.length === 0}
                onClick={handleCheckout}
                >
                Proceed to Checkout
            </Button>

          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;