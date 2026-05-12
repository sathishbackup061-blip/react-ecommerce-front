import React, { useState , useEffect } from "react";

import { Form, Input, Button, Card, Typography } from "antd";
import { UserAddOutlined, MailOutlined } from "@ant-design/icons";
import { auth } from "../../firebase";
import { sendSignInLinkToEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const { Title } = Typography;

const Register = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            // If user is logged in and has a valid token, redirect to home page
            navigate("/");
        }
    }, [user]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const actionCodeSettings = {
                url: process.env.REACT_APP_REGISTER_REDIRECT_URL || "http://localhost:3000/register/complete",
                handleCodeInApp: true,
            };
            await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
            toast.success(`Email is sent to ${values.email}. Click the link to complete your registration.`);
            window.localStorage.setItem('emailForRegistration', values.email);
            setEmail("");
        } catch (error) {
            toast.error("Failed to send email: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            background: '#f5f5f5'
        }}>
            <Card 
                style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                bordered={false}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <UserAddOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <Title level={2} style={{ marginTop: 16, marginBottom: 0 }}>
                        Register
                    </Title>
                    <Typography.Text type="secondary">
                        Enter your email to create an account
                    </Typography.Text>
                </div>

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
                            placeholder="Your Email" 
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
                            Send Verification Link
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Typography.Text type="secondary">
                        Already have an account?{' '}
                        <a href="/login">Login</a>
                    </Typography.Text>
                </div>

            </Card>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default Register;