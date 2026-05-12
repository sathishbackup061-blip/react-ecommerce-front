import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button, Card, Typography } from "antd";
import { UserAddOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { auth } from "../../firebase";
import { signInWithEmailLink, updatePassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const { Title } = Typography;



const RegisterComplite = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    useEffect(() => {
        const storedEmail = window.localStorage.getItem('emailForRegistration');
        if (storedEmail) {
            form.setFieldsValue({ email: storedEmail });
        }   
    }, [form]);


    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            console.log("Starting sign-in with email link...");
            const storedEmail = window.localStorage.getItem('emailForRegistration');
            const result = await signInWithEmailLink(auth, storedEmail, window.location.href);
            console.log("Sign-in result:", result);
            
            if (result.user.emailVerified) {
                window.localStorage.removeItem('emailForRegistration');

                // Use result.user (the signed-in user) with form values
                await updatePassword(result.user, values.password);
                const idTokenResult = await result.user.getIdTokenResult();
                toast.success("Registration completed successfully!");
                
              //  console.log("User:", result.user, "ID Token Result:", idTokenResult);

               createOrUpdateUser(idTokenResult.token)
                .then( res => {
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
                }).catch(err => console.log(err));

                navigate("/login");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Registration failed: " + error.message);
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
                        Complete Registration
                    </Title>
                    <Typography.Text type="secondary">
                        Set your password to activate account
                    </Typography.Text>
                </div>

                <Form
                    form={form}
                    name="registerComplete"
                    onFinish={handleSubmit}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                    >
                        <Input 
                            prefix={<MailOutlined />}
                            size="large"
                            disabled
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
                            Create Account
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

export default RegisterComplite;