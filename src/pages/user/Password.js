import React, { useState} from 'react';

import UserNav from '../../components/nav/UserNav';
import { Col, Row, Form, Input, Button, message } from 'antd';

import { auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";




const Password = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const currentAuth = getAuth();
            const user = currentAuth.currentUser;
            
            if (user) {
                await updatePassword(user, values.password);
                message.success("Password updated successfully!");
                form.resetFields();
            } else {
                message.error("No user logged in");
            }
        } catch (error) {
            message.error("Error updating password: " + error.message);
        } finally {
            setLoading(false);
        }
    };
  
    return (
        <>
            <Row>
            <Col flex="200px">
                <UserNav />
            </Col>
            <Col flex="auto" style={{ padding: '20px' }}>
                <h4>Update Password</h4>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password 
                            placeholder="Enter new password" 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            disabled={loading}
                        >
                            Update Password
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            </Row>
        </>
    );
};

export default Password;