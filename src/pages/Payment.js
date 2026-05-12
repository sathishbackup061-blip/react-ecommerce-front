import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";
import "../stripe.css";

// Load stripe outside component
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY
);

const Payment = () => {
  return (
    <div className="container p-5 text-center">

      <Elements stripe={stripePromise}>
        <div className="col-md-8 offset-md-2">
          
            <StripeCheckout />

        </div>
      </Elements>
    </div>
  );
};

export default Payment;