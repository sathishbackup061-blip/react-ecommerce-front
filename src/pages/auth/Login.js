import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { UserAddOutlined, MailOutlined, LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    let dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get user from Redux store
    const user = useSelector((state) => state.user);

    // Wait for auth state to initialize
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(() => {
            setIsInitializing(false);
        });
        return () => unsubscribe();
    }, []);

    // Skip redirect during initialization or when restoring user
    useEffect(() => {
        if (isInitializing) return;
        
        // Only redirect if user exists and is fully restored (has email)
        if (user && user.token && user.email) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "subscriber") {
                navigate("/user/history");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate, isInitializing]);

    // Show spinner while initializing
    if (isInitializing) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: '#f5f5f5'
            }}>
                <Spin size="large" tip="Restoring session..." />
            </div>
        );
    }

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Use v9+ modular syntax
            const result = await signInWithEmailAndPassword(auth, values.email, values.password);
            console.log("Login result:", result);

            const user = result.user;
            const idTokenResult = await user.getIdTokenResult();

            // Call API to create/update user and get full user data
            const res = await createOrUpdateUser(idTokenResult.token);
            
            // Dispatch user data to Redux store
            dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                    email: res.data.email,
                    name: res.data.name,
                    token: idTokenResult.token,
                    role: res.data.role,
                    _id: res.data._id,
                },
            });

            toast.success("Login successful!");

            // based on role redirect admin to admin dashboard and user to user dashboard
            const role = res?.data?.role;
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "subscriber") {
                navigate("/user/history");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("Google login result:", result);

            const user = result.user;
            const idTokenResult = await user.getIdTokenResult();

            // Call API to create/update user
            const res = await createOrUpdateUser(idTokenResult.token);
            
            // Dispatch user data to Redux store
            dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                    email: res.data.email,
                    name: res.data.name,
                    token: idTokenResult.token,
                    role: res.data.role,
                    _id: res.data._id,
                },
            });
            
            toast.success("Google login successful!");
            
            // based on role redirect
            const role = res?.data?.role;
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "subscriber") {
                navigate("/user/history");
            } else {
                navigate("/");
            }
            
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Google login failed: " + error.message);
        } finally {
            setLoading(false);
        }         
    }


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
                    <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <Title level={2} style={{ marginTop: 16, marginBottom: 0 }}>
                        Login
                    </Title>
                    <Typography.Text type="secondary">
                        Enter your email to login
                    </Typography.Text>
                </div>

                <Form
                    name="login"
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

                        <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />}
                            placeholder="Your Password"
                            size="large"
                            autoFocus
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                            size="large"
                            icon={<LockOutlined />}
                           // disabled = {!email || password.length < 6}
                        >
                            {
                                loading ? (
                                <span>Loading.......</span>
                                ) : (
                                <span className="text-danger"> Login with Email/Password</span>
                                )
                            }
                            
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            onClick={googleLogin}
                            danger
                            htmlType="submit" 
                            shape="round"
                            loading={loading}
                            block
                            size="large"
                            icon={<GoogleOutlined />}
                        >
                            Login with Google
                        </Button>
                    </Form.Item> 
                </Form>

             {/* forgot password link */}
                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                    <Typography.Text danger >
                        <a href="/forgot/password">Forgot Password?</a>
                    </Typography.Text>
                </div>  
            </Card>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default Login;