import React, { useEffect, useState } from "react";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { createOrder } from "../functions/order";

import { Result, Button, message } from "antd";

const StripeCheckout = () => {
  const dispatch = useDispatch();

  const { user, cart } = useSelector((state) => ({ ...state }));

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [savedAddress, setSavedAddress] = useState(null);

  const [discount, setDiscount] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  // -----------------------------
  // CREATE PAYMENT INTENT (ONLY ONCE)
  // -----------------------------
  useEffect(() => {
    if (!user?.token) return;
    if (!cart?.cart?.length) return;

    const cartTotal = cart.cart.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    if (cartTotal <= 0) return;

    createPaymentIntent(user.token, { cartTotal })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.log("PaymentIntent Error:", err);
      });

  }, []); // ✅ IMPORTANT: run once only

  // -----------------------------
  // HANDLE PAYMENT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) return; // ✅ prevent double click

    if (!clientSecret) {
      return message.error("Payment not ready");
    }

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    // -----------------------------
    // ERROR
    // -----------------------------
    if (payload.error) {
      setError(payload.error.message);
      setProcessing(false);
      return;
    }

    // -----------------------------
    // SUCCESS PAYMENT
    // -----------------------------
    try {
      const paymentIntent = payload.paymentIntent;

      // CREATE ORDER
       // StripeCheckout.js (inside success block)
       

        // calculate totals
        const cartTotal = cart.cart.reduce(
            (acc, item) => acc + item.price * item.count,
            0
          );

          const discount = JSON.parse(
            localStorage.getItem("discount")
          ) || 0;

          const finalTotal = JSON.parse(
            localStorage.getItem("finalTotal")
          ) || cartTotal;

          const discountAmount =
            cartTotal - finalTotal;

         const orderRes = await createOrder(user.token, {
            cart: cart.cart,
            paymentIntent: payload.paymentIntent,

            cartTotal,
            discount,
            discountAmount: cartTotal - finalTotal,
            totalAfterDiscount: finalTotal,

            address: savedAddress?.address || user?.address?.fullAddress || "",
            phone: savedAddress?.phone || user?.phone || "",
          });


      console.log("ORDER CREATED:", orderRes.data);

      // CLEAR CART AFTER ORDER
      localStorage.removeItem("cart");

      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });

      setSucceeded(true);
      setProcessing(false);

      message.success("Payment & Order successful");

    } catch (err) {
      console.log("ORDER ERROR:", err.response?.data || err);

      message.error(
        err.response?.data?.err || "Order creation failed"
      );

      setProcessing(false);
    }
  };

  // -----------------------------
  // CARD CHANGE
  // -----------------------------
  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  // -----------------------------
  // SUCCESS SCREEN
  // -----------------------------
  if (succeeded) {
    return (
      <div style={{ padding: 40 }}>
        <Result
          status="success"
          title="Order Placed Successfully!"
          subTitle="Payment completed successfully."
          extra={[
            <Button type="primary" href="/shop">
              Continue Shopping
            </Button>,
            <Button href="/">
              Go Home
            </Button>,
          ]}
        />
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">

          <h3>Complete Payment</h3>

          <form onSubmit={handleSubmit}>

            <CardElement
              onChange={handleChange}
            />

            <button
              className="btn btn-primary mt-4"
              disabled={processing || disabled || succeeded}
            >
              {processing ? "Processing..." : "Pay Now"}
            </button>

            {error && (
              <div style={{ color: "red", marginTop: 10 }}>
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