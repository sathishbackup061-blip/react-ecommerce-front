import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../functions/product";
import { getSub } from "../../functions/sub";
import { useParams } from "react-router-dom";

import ProductCard from "../../components/nav/cards/ProductCard";
import { Row, Col } from "antd";

const SubCategoryHome = () => {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);

    getSub(slug)
      .then((res) => {
        console.log(res.data);

        setSub(res.data.sub);
        setProducts(res.data.products);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [slug]);

  return (
    <Row gutter={20} style={{ padding: 20 }}>
      <Col span={5}>
        {loading ? (
          <p className="text-danger diplay-4 jumbotron">
            Loading...
          </p>
        ) : (
          <p className="text-danger">
            {products.length} products in "
            {sub?.name || slug}" Sub category
          </p>
        )}
      </Col>

      {/* PRODUCTS */}
      <Col span={19}>
        <Row gutter={[16, 16]}>
          {products.length > 0 ? (
            products.map((p) => (
              <Col key={p._id} xs={24} sm={12} md={6}>
                <ProductCard
                  product={p}
                  getImageUrl={getImageUrl}
                />
              </Col>
            ))
          ) : (
            <p>No products found</p>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default SubCategoryHome;