import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Layout,
  Menu,
  Divider,
  Avatar,
  Button,
  Drawer,
} from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  LockOutlined,
  HeartOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./UserNav.css";

const { Sider } = Layout;

const UserNav = () => {
  const location = useLocation();
  const { user } = useSelector((state) => ({ ...state }));
  const [open, setOpen] = useState(false);

  if (!user || !user._id) return null;

  const navItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/user/profile">Profile</Link>,
      path: "/user/profile",
    },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: <Link to="/user/history">Orders</Link>,
      path: "/user/history",
    },
    {
      key: "wishlist",
      icon: <HeartOutlined />,
      label: <Link to="/user/wishlist">Wishlist</Link>,
      path: "/user/wishlist",
    },
    {
      key: "password",
      icon: <LockOutlined />,
      label: <Link to="/user/password">Security</Link>,
      path: "/user/password",
    },
  ];

  const selectedKey = navItems.find((i) =>
    location.pathname.startsWith(i.path)
  )?.key;

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const NavContent = () => (
    <div className="userNavCard">

      {/* PROFILE HEADER */}
      <div className="userHeader">
        <div>
        <Avatar  icon={<UserOutlined />} className="avatar" />
        </div>
        <div>
          <h3>{user.name || "User"}</h3>
          <p>{user.email}</p>
        </div>
      </div>

      <Divider />

      {/* MENU */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="menu"
        items={navItems}
      />

      <Divider />

      {/* LOGOUT */}
      <Button
        danger
        block
        icon={<LogoutOutlined />}
        onClick={logout}
        className="logout"
      >
        Logout
      </Button>

    </div>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="desktopNav">
        <Sider width={"auto"} className="sider">
          <NavContent />
        </Sider>
      </div>

      {/* MOBILE HEADER */}
      <div className="mobileHeader">
        <Button
          icon={<MenuOutlined />}
          onClick={() => setOpen(true)}
        />
        <span>User Dashboard</span>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        title="Menu"
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={<CloseOutlined />}
      >
        <NavContent />
      </Drawer>
    </>
  );
};

export default UserNav;