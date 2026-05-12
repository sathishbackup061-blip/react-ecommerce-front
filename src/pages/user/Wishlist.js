import React, { useEffect, useState } from "react";
import { Card, Row, Col, Empty, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getWishlist, removeWishlist } from "../../functions/user";
import UserNav from "../../components/nav/UserNav";

const Wishlist = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist(user.token);
      setWishlist(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED IMAGE FUNCTION (IMPORTANT)
  const getImage = (p) => {
    if (!p?.images || p.images.length === 0) {
      return "https://via.placeholder.com/250?text=No+Image";
    }

    const img = p.images[0];

    if (typeof img === "object" && img.url) {
      return `${process.env.REACT_APP_API}${img.url}`;
    }

    return `${process.env.REACT_APP_API}${img}`;
  };

  const handleRemove = async (productId) => {
    try {
      await removeWishlist(productId, user.token);
      message.success("Removed from wishlist");
      loadWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Row gutter={24}>
      <Col xs={24} md={5}>
        <UserNav />
      </Col>

      <Col xs={24} md={19} style={{ padding: 20 }}>
        <h2>❤️ My Wishlist</h2>

        {wishlist.length === 0 ? (
          <Empty description="No wishlist items" />
        ) : (
          <Row gutter={[16, 16]}>
            {wishlist.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={p.title}
                      src={getImage(p)}
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  }
                  actions={[
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(p._id)}
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <h4>{p.title}</h4>
                  <p>₹{p.price}</p>
                  <p>{p.brand}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default Wishlist;