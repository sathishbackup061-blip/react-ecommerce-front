import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [ loading, setLoading ] = useState(false);
    const navigation = useNavigate();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            // If user is logged in and has a valid token, redirect to home page
            navigation("/");
        }
    }, [user]);

    const handleSubmit = async (values) => {
        setLoading(true);
        // Implement forgot password logic here
        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL || "http://localhost:3000/login",
            handleCodeInApp: true,
        };
        try {
            await sendPasswordResetEmail(getAuth(), values.email, config);
            toast.success("Password reset email sent to " + values.email);
        } catch (error) {
            toast.error("Error sending password reset email: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        }}>
            <Card style={{ width: 400 }}>
                <Typography.Title level={4} style={{ textAlign: 'center' }}>
                    Forgot Password
                </Typography.Title>
                <Typography.Text>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography.Text>

                {loading ? 
                    (
                        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 20 }}>
                            Sending reset link...
                        </Typography.Text>
                    ) : (
                        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 20 }}>
                            Forgot your password
                        </Typography.Text>
                    )
                }

                <Form
                    name="register"
                    onFinish={handleSubmit}
                    layout="vertical"
                    autoComplete="off"
                    >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
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
                           // disabled={!email}
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