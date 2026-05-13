import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaBoxes,
  FaTags,
  FaTicketAlt,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminNav = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const styles = {
    container: {
      width: "280px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "30px 0",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
      minHeight: "100vh",
      position: "sticky",
      top: "0",
    },
    header: {
      padding: "20px 25px",
      borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
      marginBottom: "20px",
    },
    headerTitle: {
      color: "#fff",
      fontSize: "20px",
      fontWeight: "bold",
      margin: "0",
      display: "flex",
      alignItems: "center",
    },
    headerIcon: {
      marginRight: "12px",
      fontSize: "24px",
    },
    navList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
    },
    navItem: {
      margin: "0",
      padding: "0",
    },
    link: {
      display: "flex",
      alignItems: "center",
      padding: "15px 25px",
      color: "rgba(255, 255, 255, 0.7)",
      textDecoration: "none",
      transition: "all 0.3s ease",
      borderLeft: "4px solid transparent",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
    },
    linkHover: {
      color: "#fff",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderLeftColor: "#fff",
    },
    activeLinkStyle: {
      color: "#fff",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderLeftColor: "#ffd700",
    },
    icon: {
      marginRight: "15px",
      fontSize: "18px",
      width: "20px",
      textAlign: "center",
    },
    sectionTitle: {
      padding: "20px 25px 10px",
      color: "rgba(255, 255, 255, 0.5)",
      fontSize: "12px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    divider: {
      height: "1px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      margin: "15px 0",
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      padding: "15px 25px",
      color: "rgba(255, 255, 255, 0.7)",
      textDecoration: "none",
      transition: "all 0.3s ease",
      borderLeft: "4px solid transparent",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      border: "none",
      background: "none",
      width: "100%",
      textAlign: "left",
    },
  };

  const NavLink = ({ to, icon: Icon, label, path }) => (
    <li style={styles.navItem}>
      <Link
        to={to}
        style={{
          ...styles.link,
          ...(isActive(path) ? styles.activeLinkStyle : {}),
        }}
        onMouseEnter={(e) =>
          !isActive(path) &&
          Object.assign(e.target.style, styles.linkHover)
        }
        onMouseLeave={(e) =>
          !isActive(path) && Object.assign(e.target.style, {})
        }
      >
        <span style={styles.icon}>
          <Icon />
        </span>
        {label}
      </Link>
    </li>
  );

  return (
    <nav style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <span style={styles.headerIcon}>⚙️</span>
          Admin
        </h2>
      </div>

      {/* Dashboard Section */}
      <div style={styles.sectionTitle}>Dashboard</div>
      <ul style={styles.navList}>
        <NavLink
          to="/admin/dashboard"
          icon={FaTachometerAlt}
          label="Dashboard"
          path="/admin/dashboard"
        />
      </ul>

      <div style={styles.divider}></div>

      {/* Products Section */}
      <div style={styles.sectionTitle}>Products</div>
      <ul style={styles.navList}>
        <NavLink
          to="/admin/product"
          icon={FaBox}
          label="Product"
          path="/admin/product"
        />
        <NavLink
          to="/admin/products"
          icon={FaBoxes}
          label="All Products"
          path="/admin/products"
        />
      </ul>

      <div style={styles.divider}></div>

      {/* Categories Section */}
      <div style={styles.sectionTitle}>Categories</div>
      <ul style={styles.navList}>
        <NavLink
          to="/admin/category"
          icon={FaTags}
          label="Category"
          path="/admin/category"
        />
        <NavLink
          to="/admin/sub"
          icon={FaTags}
          label="Sub Category"
          path="/admin/sub"
        />
      </ul>

      <div style={styles.divider}></div>

      {/* Promotions Section */}
      <div style={styles.sectionTitle}>Promotions</div>
      <ul style={styles.navList}>
        <NavLink
          to="/admin/coupon"
          icon={FaTicketAlt}
          label="Coupon"
          path="/admin/coupon"
        />
      </ul>

      <div style={styles.divider}></div>

      {/* Account Section */}
      <div style={styles.sectionTitle}>Account</div>
      <ul style={styles.navList}>
        <NavLink
          to="/user/password"
          icon={FaLock}
          label="Change Password"
          path="/user/password"
        />
      </ul>

      <div style={styles.divider}></div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={styles.logoutBtn}
        onMouseEnter={(e) =>
          Object.assign(e.target.style, {
            color: "#fff",
            backgroundColor: "rgba(255, 100, 100, 0.2)",
            borderLeftColor: "#ff6464",
          })
        }
        onMouseLeave={(e) =>
          Object.assign(e.target.style, {
            color: "rgba(255, 255, 255, 0.7)",
            backgroundColor: "transparent",
            borderLeftColor: "transparent",
          })
        }
      >
        <span style={styles.icon}>
          <FaSignOutAlt />
        </span>
        Logout
      </button>
    </nav>
  );
};

export default AdminNav;