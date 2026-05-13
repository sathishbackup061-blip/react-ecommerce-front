import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Card,
  Typography,
} from "antd";

import { MailOutlined } from "@ant-design/icons";

import {
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { user } = useSelector((state) => ({
    ...state,
  }));

  // ---------------- REDIRECT IF LOGGED IN ----------------
  useEffect(() => {
    if (user?.token) {
      navigate("/");
    }
  }, [user, navigate]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const config = {
        url:
          process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL ||
          "http://localhost:3000/login",

        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(
        getAuth(),
        values.email,
        config
      );

      toast.success(
        `Password reset email sent to ${values.email}`
      );
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error?.message ||
          "Failed to send password reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography.Title
          level={4}
          style={{
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Forgot Password
        </Typography.Title>

        <Typography.Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Enter your email address and we’ll send
          you a link to reset your password.
        </Typography.Text>

        {loading && (
          <Typography.Text
            type="secondary"
            style={{
              display: "block",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Sending reset link...
          </Typography.Text>
        )}

        <Form
          name="forgot-password"
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message:
                  "Please enter a valid email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter registered email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;