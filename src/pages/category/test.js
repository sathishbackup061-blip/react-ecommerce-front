import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsListCat } from "../../functions/product";
import { getCategories } from "../../functions/category";
import { Link } from "react-router-dom";

import ProductCard from "../../components/nav/cards/ProductCard";
import { Row, Col, Checkbox, Slider, Button } from "antd";
import CategoryList from "../../components/category/CategoryList";

const CategoryHome = ({match}) => {
  const { catSlug, subSlug } = useParams();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [price, setPrice] = useState([0, 5000]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD PRODUCTS ----------------
  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await getProductsListCat({
        category: catSlug, // filter by category
        sub: subSlug, // filter by subcategory
        brands: selectedBrands,
        price,
        page,
        limit: 8,
      });

      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [catSlug, subSlug, selectedBrands, price, page]);

  // ---------------- EXTRACT BRANDS ----------------
  useEffect(() => {
    const allBrands = [
      ...new Set(products.map((p) => p.brand).filter(Boolean)),
    ];

    setBrands(allBrands);
  }, [products]);

  // ---------------- IMAGE URL ----------------
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/no-image.png";

    if (imagePath.startsWith("http")) return imagePath;

    const apiUrl =
      process.env.REACT_APP_API?.replace("/api", "") ||
      "http://localhost:8000";

    if (imagePath.startsWith("/uploads")) {
      return apiUrl + imagePath;
    }

    return `${apiUrl}/uploads/${imagePath}`;
  };

  return (
    <Row gutter={20} style={{ padding: 20 }}>
      {/* SIDEBAR */}
      <Col span={5}>
        <h3>Brands</h3>

        <Checkbox.Group
          options={brands}
          value={selectedBrands}
          onChange={(values) => setSelectedBrands(values)}
        />

        <h3 style={{ marginTop: 20 }}>Price Range</h3>

        <Slider
          range
          max={10000}
          value={price}
          onChange={(val) => setPrice(val)}
        />

        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            setSelectedBrands([]);
            setPrice([0, 5000]);
            setPage(1);
          }}
        >
          Reset Filters
        </Button>
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

        {/* PAGINATION */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button onClick={() => setPage(page + 1)}>
            Load More
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default CategoryHome;