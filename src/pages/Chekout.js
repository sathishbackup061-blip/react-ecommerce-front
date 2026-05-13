/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Divider,
  Typography,
  Tag,
  message,
} from "antd";

import { useNavigate } from "react-router-dom";

import { getUserCart, saveUserAddress } from "../functions/user";
import { applyCoupon } from "../functions/coupon";
import { createOrder } from "../functions/order";

import { toast } from "react-toastify";

const { Title, Text } = Typography;

const Checkout = () => {
  const { user, cart } = useSelector((state) => ({
    ...state,
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [savedAddress, setSavedAddress] = useState(null);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);

  // -----------------------------------
  // AUTH CHECK
  // -----------------------------------
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/");
    }
  }, [user, navigate]);

  // -----------------------------------
  // LOAD USER CART
  // -----------------------------------
  useEffect(() => {
    if (user && user.token) {
      getUserCart(user.token)
        .then((res) => {
          console.log("USER CART:", res.data);

          setProducts(res.data.products || []);
          setTotal(res.data.cartTotal || 0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  // -----------------------------------
  // LOAD SAVED ADDRESS FROM USER
  // -----------------------------------
  useEffect(() => {
    if (user?.address?.fullAddress || user?.phone) {
      setAddress(user?.address?.fullAddress || "");
      setPhone(user?.phone || "");

      setSavedAddress({
        address: user?.address?.fullAddress || "",
        phone: user?.phone || "",
      });
    }
  }, [user]);

  // -----------------------------------
  // SAVE ADDRESS
  // -----------------------------------
  const handleSaveAddress = async () => {
    try {
      if (!address || !phone) {
        return message.error("Please fill all delivery details");
      }

      const addressData = {
        fullAddress: address,
        city: "",
        state: "",
        pincode: "",
      };

      const res = await saveUserAddress(
        user.token,
        addressData,
        phone
      );

      console.log("ADDRESS RESPONSE:", res.data);

      if (res.data) {
        setSavedAddress({
          address,
          phone,
        });

        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            ...user,
            address: addressData,
            phone,
          },
        });

        toast.success("Delivery details saved successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to save address");
    }
  };

  // -----------------------------------
  // APPLY COUPON
  // -----------------------------------
  const handleApplyCoupon = () => {
    const totalAmount = cart.cart.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    applyCoupon(coupon, totalAmount, user.token)
      .then((res) => {
        setDiscount(res.data.discount);
        setAppliedCoupon(coupon);
        setFinalTotal(res.data.finalTotal);

        localStorage.setItem(
          "discount",
          JSON.stringify(res.data.discount)
        );

        localStorage.setItem(
          "finalTotal",
          JSON.stringify(res.data.finalTotal)
        );

        dispatch({
          type: "COUPON_APPLIED",
          payload: {
            discount: res.data.discount,
            finalTotal: res.data.finalTotal,
          },
        });

        console.log("COUPON RESPONSE:", res.data);
        message.success("Coupon applied successfully");
      })
      .catch((err) => {
        console.log(err);

        message.error(
          err.response?.data?.err || "Coupon error"
        );
      });
  };

  // -----------------------------------
  // REMOVE COUPON
  // -----------------------------------
  const handleRemoveCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setAppliedCoupon(null);
    setFinalTotal(0);

    localStorage.removeItem("discount");
    localStorage.removeItem("finalTotal");

    dispatch({
      type: "COUPON_APPLIED",
      payload: null,
    });

    message.info("Coupon removed");
  };

  // -----------------------------------
  // GO PAYMENT PAGE
  // -----------------------------------
  const handlePlaceOrder = () => {
    if (!address || !phone) {
      return message.error("Please fill address & phone");
    }

    if (cart.cart.length < 1) {
      return message.error("Cart is empty");
    }

    message.success("Proceeding to payment...");
    navigate("/payment");
  };

  // -----------------------------------
  // COD ORDER
  // -----------------------------------
  const handleCODOrder = async () => {
    try {
      const cartTotal = cart.cart.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );

      const totalAfterDiscount =
        discount > 0
          ? cartTotal - (cartTotal * discount) / 100
          : cartTotal;

      await createOrder(user.token, {
        cart: cart.cart,
        paymentMethod: "COD",

        cartTotal,
        discount,
        totalAfterDiscount,

        address,
        phone,
      });

      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });

      localStorage.removeItem("cart");

      message.success("Order placed (Cash on Delivery)");

      navigate("/user/history");
    } catch (err) {
      console.log(err);
      message.error("COD order failed");
    }
  };

  // -----------------------------------
  // BLOCK RENDER IF NO USER
  // -----------------------------------
  if (!user || !user.token) {
    return null;
  }

  return (
    <Row gutter={24} style={{ padding: 20 }}>
      {/* LEFT SIDE */}
      <Col xs={24} md={12}>
        <Card
          title="Delivery Details"
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <Title level={5}>Address</Title>

          <Input.TextArea
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full address"
          />

          <br />
          <br />

          <Title level={5}>Phone</Title>

          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />

          <br />
          <br />

          <Button
            type="primary"
            size="large"
            block
            onClick={handleSaveAddress}
          >
            Save Delivery Details
          </Button>

          {savedAddress && (
            <Card
              style={{
                marginTop: 20,
                borderRadius: 10,
                background: "#fafafa",
              }}
              title="Saved Address"
            >
              <p>
                <b>Address:</b> {savedAddress.address}
              </p>

              <p>
                <b>Phone:</b> {savedAddress.phone}
              </p>

              <Tag color="green">
                Ready for delivery
              </Tag>
            </Card>
          )}
        </Card>
      </Col>

      {/* RIGHT SIDE */}
      <Col xs={24} md={12}>
        <Card
          title="Order Summary"
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <Input
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            disabled={appliedCoupon}
          />

          {!appliedCoupon ? (
            <Button
              type="primary"
              block
              style={{ marginTop: 10 }}
              onClick={handleApplyCoupon}
            >
              Apply Coupon
            </Button>
          ) : (
            <Button
              danger
              block
              style={{ marginTop: 10 }}
              onClick={handleRemoveCoupon}
            >
              Remove Coupon
            </Button>
          )}

          <Divider />

          {products.map((item, index) => (
            <div key={index}>
              <Text strong>
                {item.product?.title}
              </Text>

              <div style={{ marginTop: 5 }}>
                Qty: {item.count} × ₹{item.price}
              </div>

              <div style={{ marginTop: 8 }}>
                {item.color && (
                  <Tag color="magenta">
                    {item.color}
                  </Tag>
                )}

                {item.product?.brand && (
                  <Tag color="blue">
                    {item.product.brand}
                  </Tag>
                )}
              </div>

              <Divider />
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text>Total</Text>

            <Text delete={discount > 0}>
              ₹{total}
            </Text>
          </div>

          {discount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text>
                Discount ({discount}%)
              </Text>

              <Text type="success">
                - ₹
                {(
                  (total * discount) / 100
                ).toFixed(2)}
              </Text>
            </div>
          )}

          <Divider />

          <Title level={4}>
            Payable: ₹
            {discount > 0
              ? finalTotal.toFixed(2)
              : total.toFixed(2)}
          </Title>

          <Button
            type="primary"
            size="large"
            block
            disabled={
              !savedAddress ||
              cart.cart.length === 0
            }
            onClick={handlePlaceOrder}
          >
            Place Order Online
          </Button>

          <Button
            type="default"
            block
            size="large"
            style={{
              marginTop: 10,
              background: "#222",
              color: "#fff",
            }}
            disabled={
              !savedAddress ||
              cart.cart.length === 0
            }
            onClick={handleCODOrder}
          >
            Cash on Delivery (COD)
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Checkout;