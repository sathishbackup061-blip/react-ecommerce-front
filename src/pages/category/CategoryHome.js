import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../functions/product";
import { getCategory } from "../../functions/category";
import { useParams } from "react-router-dom";

import ProductCard from "../../components/nav/cards/ProductCard";
import { Row, Col } from "antd";

const CategoryHome = () => {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);

    getCategory(slug)
      .then((res) => {
        console.log(res.data);

        setCategory(res.data.category);
        setProducts(res.data.products);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [slug]);

  console.log("Category:", category);

  return (
        <Row gutter={20} style={{ padding: 20 }}>
            <Col span={5}>
            
                {
                    loading ? (
                        <p className="text-danger diplay-4 jumbotron">Loading...</p>
                    ) : (
                        <p>
                            {products.length} products in "{slug}" category
                        </p>
                    )
                }

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

export default CategoryHome;