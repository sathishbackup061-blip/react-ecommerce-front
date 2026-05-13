/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";

import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  Result,
  Button,
  message,
} from "antd";

import { createPaymentIntent } from "../functions/stripe";
import { createOrder } from "../functions/order";

const StripeCheckout = () => {
  const dispatch = useDispatch();

  const { user, cart } = useSelector(
    (state) => ({
      ...state,
    })
  );

  const [succeeded, setSucceeded] =
    useState(false);

  const [error, setError] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [disabled, setDisabled] =
    useState(true);

  const [clientSecret, setClientSecret] =
    useState("");

  const stripe = useStripe();
  const elements = useElements();

  // -----------------------------
  // CREATE PAYMENT INTENT
  // -----------------------------
  useEffect(() => {
    if (!user?.token) return;

    if (!cart?.cart?.length) return;

    const cartTotal = cart.cart.reduce(
      (acc, item) =>
        acc + item.price * item.count,
      0
    );

    if (cartTotal <= 0) return;

    createPaymentIntent(user.token, {
      cartTotal,
    })
      .then((res) => {
        setClientSecret(
          res.data.clientSecret
        );
      })
      .catch((err) => {
        console.log(
          "PaymentIntent Error:",
          err
        );
      });
  }, []);

  // -----------------------------
  // HANDLE SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return message.error(
        "Stripe not loaded"
      );
    }

    if (processing) return;

    if (!clientSecret) {
      return message.error(
        "Payment not ready"
      );
    }

    setProcessing(true);

    try {
      const payload =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card:
                elements.getElement(
                  CardElement
                ),
            },
          }
        );

      // -----------------------------
      // PAYMENT ERROR
      // -----------------------------
      if (payload.error) {
        setError(payload.error.message);

        setProcessing(false);

        return;
      }

      // -----------------------------
      // PAYMENT SUCCESS
      // -----------------------------
      const cartTotal = cart.cart.reduce(
        (acc, item) =>
          acc + item.price * item.count,
        0
      );

      const discount =
        JSON.parse(
          localStorage.getItem(
            "discount"
          )
        ) || 0;

      const finalTotal =
        JSON.parse(
          localStorage.getItem(
            "finalTotal"
          )
        ) || cartTotal;

      const orderData = {
        cart: cart.cart,

        paymentIntent:
          payload.paymentIntent,

        cartTotal,

        discount,

        discountAmount:
          cartTotal - finalTotal,

        totalAfterDiscount:
          finalTotal,

        address:
          user?.address
            ?.fullAddress || "",

        phone:
          user?.phone || "",
      };

      const orderRes =
        await createOrder(
          user.token,
          orderData
        );

      console.log(
        "ORDER CREATED:",
        orderRes.data
      );

      // -----------------------------
      // CLEAR CART
      // -----------------------------
      localStorage.removeItem(
        "cart"
      );

      localStorage.removeItem(
        "discount"
      );

      localStorage.removeItem(
        "finalTotal"
      );

      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });

      setSucceeded(true);

      setProcessing(false);

      message.success(
        "Payment & Order successful"
      );
    } catch (err) {
      console.log(
        "ORDER ERROR:",
        err.response?.data || err
      );

      message.error(
        err.response?.data?.err ||
          "Order creation failed"
      );

      setProcessing(false);
    }
  };

  // -----------------------------
  // CARD INPUT CHANGE
  // -----------------------------
  const handleChange = (e) => {
    setDisabled(e.empty);

    setError(
      e.error ? e.error.message : ""
    );
  };

  // -----------------------------
  // SUCCESS UI
  // -----------------------------
  if (succeeded) {
    return (
      <div style={{ padding: 40 }}>
        <Result
          status="success"
          title="Order Placed Successfully!"
          subTitle="Payment completed successfully."
          extra={[
            <Button
              key="shop"
              type="primary"
              href="/shop"
            >
              Continue Shopping
            </Button>,

            <Button
              key="home"
              href="/"
            >
              Go Home
            </Button>,
          ]}
        />
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3>
            Complete Payment
          </h3>

          <form
            onSubmit={handleSubmit}
          >
            <div
              style={{
                padding: 12,
                border:
                  "1px solid #d9d9d9",
                borderRadius: 6,
                background: "#fff",
              }}
            >
              <CardElement
                onChange={
                  handleChange
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={
                processing ||
                disabled ||
                succeeded
              }
            >
              {processing
                ? "Processing..."
                : "Pay Now"}
            </button>

            {error && (
              <div
                style={{
                  color: "red",
                  marginTop: 10,
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;