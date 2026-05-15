// src/App.js
import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";

import { auth } from "./firebase";
import { currentUser } from "./functions/auth";

// -----------------------------
// COMPONENTS
// -----------------------------
import Header from "./components/nav/Header";
import UserRoute from "./components/nav/routes/UserRoute";
import AdminRoute from "./components/nav/routes/AdminRoute";

// -----------------------------
// LAZY LOAD PAGES
// -----------------------------
const Home = lazy(() => import("./pages/Home"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplite = lazy(() =>
  import("./pages/auth/RegisterComplite")
);
const ForgotPassword = lazy(() =>
  import("./pages/auth/ForgotPassword")
);

// USER
const History = lazy(() => import("./pages/user/History"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const Password = lazy(() => import("./pages/user/Password"));

// ADMIN
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard")
);

const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);

const SubCreate = lazy(() =>
  import("./pages/admin/sub/SubCreate")
);

const ProductCreate = lazy(() =>
  import("./pages/admin/product/ProductCreate")
);

const ProductList = lazy(() =>
  import("./pages/admin/product/ProductList")
);

const UpdateProduct = lazy(() =>
  import("./pages/admin/product/UpdateProduct")
);

const AdminCoupon = lazy(() =>
  import("./pages/admin/coupon/AdminCoupon")
);

const HomeBanner = lazy(() =>
  import("./pages/admin/banner/HomeBanner")
);

// SHOP
const Product = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Chekout"));
const Payment = lazy(() => import("./pages/Payment"));

const CategoryHome = lazy(() =>
  import("./pages/category/CategoryHome")
);

const SubCategoryHome = lazy(() =>
  import("./pages/category/SubCategoryHome")
);

// -----------------------------
// LOADER COMPONENT
// -----------------------------
const PageLoader = () => {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "600",
      }}
    >
      Loading...
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();

  // -----------------------------
  // RESTORE USER
  // -----------------------------
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          try {
            const idTokenResult =
              await user.getIdTokenResult();

            const res = await currentUser(
              idTokenResult.token
            );

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

            console.log(
              "Redux user restored:",
              res.data.email
            );
          } catch (err) {
            console.log("AUTH ERROR", err);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Header />

      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop
        pauseOnHover={false}
      />

      {/* ----------------------------- */}
      {/* SUSPENSE WRAPPER */}
      {/* ----------------------------- */}
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/register/complete"
            element={<RegisterComplite />}
          />

          <Route
            path="/forgot/password"
            element={<ForgotPassword />}
          />

          {/* USER */}
          <Route
            path="/user/history"
            element={
              <UserRoute>
                <History />
              </UserRoute>
            }
          />

          <Route
            path="/user/wishlist"
            element={
              <UserRoute>
                <Wishlist />
              </UserRoute>
            }
          />

          <Route
            path="/user/password"
            element={
              <UserRoute>
                <Password />
              </UserRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/category"
            element={
              <AdminRoute>
                <CategoryCreate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/sub"
            element={
              <AdminRoute>
                <SubCreate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/product"
            element={
              <AdminRoute>
                <ProductCreate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductList />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/product/update/:slug"
            element={
              <AdminRoute>
                <UpdateProduct />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/coupon"
            element={
              <AdminRoute>
                <AdminCoupon />
              </AdminRoute>
            }
          />

           <Route
            path="/admin/add-banner"
            element={
              <AdminRoute>
                <HomeBanner />
              </AdminRoute>
            }
          />

          {/* PRODUCT */}
          <Route
            path="/product/:slug"
            element={<Product />}
          />

          {/* CATEGORY */}
          <Route
            path="/category/:slug"
            element={<CategoryHome />}
          />

          <Route
            path="/sub/:slug"
            element={<SubCategoryHome />}
          />

          {/* SHOP */}
          <Route path="/shop" element={<Shop />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;