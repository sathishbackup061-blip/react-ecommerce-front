import React, { useState } from 'react';
import { HomeOutlined, UserAddOutlined, UserOutlined, LogoutOutlined, UserCircleOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Avatar, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

import SearchProduct from './forms/SearchProduct';

const Header = () => {
    const [current, setCurrent] = useState('home');
    const dispatch = useDispatch();
    
    // Get user from Redux store
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart.cart);


    const handleClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch({ type: 'LOGOUT', payload: null });
            toast.success("Logged out successfully!");
            window.location.href = "/login";
        } catch (error) {
            toast.error("Logout failed: " + error.message);
        }
    };

    // Left menu items (Home)
    const leftItems = [
        {
            key: 'home',
            label: (
                <Link to="/">
                    <HomeOutlined /> Home
                </Link>
            ),
        },
         {
            key: 'shop',
            label: (
                <Link to="/shop">
                    <ShoppingCartOutlined /> Shop
                </Link>
            ),
        },
         {
            key: 'cart',
            label: (
                <Link to="/cart">
                    <ShoppingOutlined /> 
                        <Badge count = {cart.length} 
                            offset={[10, 4]} 
                            // style={{ marginTop:'10px' }}
                        >
                       <span> Cart </span>
                    </Badge>
                    
                </Link>
            ),
        },
    ];

    // Right menu items - when NOT logged in
    const guestItems = [
         {
            key: 'search',
            label: (
                <SearchProduct />
            ),
        },
        {
            key: 'login',
            label: (
                <Link to="/login">
                    <UserOutlined /> Login
                </Link>
            ),
        },
        {
            key: 'register',
            label: (
                <Link to="/register">
                    <UserAddOutlined /> Register
                </Link>
            ),
        },
    ];

    // Right menu items - when logged in (username dropdown)
    const userItems = [
        
        {
            key: 'username',
            label: (
                <Dropdown menu={{ 
                    items: [
                        {
                            key: 'email',
                            label: user?.email || 'User',
                            disabled: true,
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: 'dashboard',
                            label: (
                                <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/user/history'}>
                                     Dashboard
                                </Link>
                            )
                        },
                        {
                            key: 'logout',
                            label: (
                                <span onClick={handleLogout}>
                                    <LogoutOutlined /> Logout
                                </span>
                            ),
                        },
                    ]
                }} trigger={['click']}>
                    <span style={{ cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 8 }} />
                        {user?.email?.split('@')[0] || 'User'}
                    </span>
                </Dropdown>
            ),
        },
    ];

    // Choose items based on login status
    const rightItems = user ? userItems : guestItems;

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #036467' }}>
            <Menu 
                onClick={handleClick} 
                selectedKeys={[current]} 
                mode="horizontal" 
                items={leftItems} 
                style={{ border: 'none', flex: 1 }}
            />
            <Menu 
                onClick={handleClick} 
                selectedKeys={[current]} 
                mode="horizontal" 
                items={rightItems} 
                style={{ border: 'none', minWidth: 200, textAlign: 'right' }}
            />
        </header>
    );
};

export default Header;