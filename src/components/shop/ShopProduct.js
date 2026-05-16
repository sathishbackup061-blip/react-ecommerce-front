import React, { useState, useEffect } from "react";

import {
  getImageUrl,
  fetchProductsByFilter,
  getFilterOptions,
} from "../functions/product";

import { getCategories } from "../functions/category";

import ProductCard from "../components/nav/cards/ProductCard";

import {
  Row,
  Col,
  Menu,
  Slider,
  Checkbox,
  Rate,
  Button,
} from "antd";

import { useDispatch, useSelector } from "react-redux";

import { DownSquareOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  // ================= FILTER STATES =================
  const [price, setPrice] = useState([0, 100000]);

  const [categoryIds, setCategoryIds] = useState([]);

  const [star, setStar] = useState(0);

  const [brands, setBrands] = useState([]);

  const [colors, setColors] = useState([]);

  const [brandOptions, setBrandOptions] = useState([]);

  const [colorOptions, setColorOptions] = useState([]);

  const { search } = useSelector((state) => ({
    ...state,
  }));

  const { text } = search;

  const dispatch = useDispatch();

  // ================= INITIAL LOAD =================
  useEffect(() => {
    loadCategories();

    loadFilterOptions();
  }, []);

  // ================= MAIN FILTER EFFECT =================
  useEffect(() => {
    const delayed = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(delayed);

  }, [
    text,
    price,
    categoryIds,
    star,
    brands,
    colors,
  ]);

  // ================= APPLY FILTERS =================
  const applyFilters = async () => {
    try {
      setLoading(true);

      const res = await fetchProductsByFilter({
        query: text || "",

        price,

        category: categoryIds,

        stars: star,

        brand: brands,

        color: colors,
      });

      setProducts(res.data);

    } catch (err) {
      console.log("FILTER ERROR =>", err);

    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD CATEGORIES =================
  const loadCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOAD FILTER OPTIONS =================
  const loadFilterOptions = async () => {
    try {
      const res = await getFilterOptions();

      setBrandOptions(res.data.brands);

      setColorOptions(res.data.colors);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= PRICE CHANGE =================
  const handleSlider = (value) => {
    setPrice(value);
  };

  // ================= CATEGORY CHANGE =================
  const handleCheck = (e) => {
    const value = e.target.value;

    let updated = [...categoryIds];

    if (updated.includes(value)) {
      updated = updated.filter(
        (id) => id !== value
      );

    } else {
      updated.push(value);
    }

    setCategoryIds(updated);
  };

  // ================= CATEGORY UI =================
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          className="pb-2 pl-4 pr-4"
          value={c._id}
          checked={categoryIds.includes(c._id)}
          onChange={handleCheck}
        >
          {c.name}
        </Checkbox>
      </div>
    ));

  // ================= STAR UI =================
  const showStars = () =>
    [5, 4, 3, 2, 1].map((s) => (
      <div
        key={s}
        onClick={() => setStar(s)}
        style={{
          padding: "10px",
          cursor: "pointer",
          background:
            star === s ? "#f5f5f5" : "",

          borderRadius: "4px",

          marginBottom: "5px",
        }}
      >
        <Rate disabled value={s} /> & up
      </div>
    ));

  // ================= BRAND UI =================
  const showBrands = () =>
    brandOptions.map((b) => (
      <div key={b}>
        <Checkbox
          value={b}
          checked={brands.includes(b)}
          onChange={() => {
            let updated = [...brands];

            if (updated.includes(b)) {
              updated = updated.filter(
                (x) => x !== b
              );

            } else {
              updated.push(b);
            }

            setBrands(updated);
          }}
        >
          {b}
        </Checkbox>
      </div>
    ));

  // ================= COLOR UI =================
  const showColors = () =>
    colorOptions.map((c) => (
      <div
        key={c}
        onClick={() => {
          let updated = [...colors];

          if (updated.includes(c)) {
            updated = updated.filter(
              (x) => x !== c
            );

          } else {
            updated.push(c);
          }

          setColors(updated);
        }}
        style={{
          padding: "6px 10px",

          cursor: "pointer",

          background:
            colors.includes(c)
              ? "#eee"
              : "",

          borderRadius: 4,

          marginBottom: 5,
        }}
      >
        {c}
      </div>
    ));

  // ================= PRICE FORMAT =================
  const formatter = (value) =>
    `₹${value}`;

  return (
    <Row
      gutter={20}
      style={{ padding: 20 }}
    >
      {/* ================= SIDEBAR ================= */}
      <Col span={5}>
        <h3>Search / Filter</h3>

        <Menu
          defaultOpenKeys={[
            "1",
            "2",
            "3",
            "4",
            "5",
          ]}
          mode="inline"
        >
          {/* PRICE */}
          <SubMenu
            key="1"
            title={<span>₹ Price</span>}
          >
            <div style={{ padding: 10 }}>
              <Slider
                range
                min={0}
                max={100000}
                value={price}
                onChange={handleSlider}
                tooltip={{
                  formatter,
                }}
              />
            </div>
          </SubMenu>

          {/* CATEGORY */}
          <SubMenu
            key="2"
            title={
              <span>
                <DownSquareOutlined /> Categories
              </span>
            }
          >
            <div style={{ padding: 10 }}>
              {showCategories()}
            </div>
          </SubMenu>

          {/* RATINGS */}
          <SubMenu
            key="3"
            title={<span>⭐ Ratings</span>}
          >
            <div style={{ padding: 10 }}>
              {showStars()}
            </div>
          </SubMenu>

          {/* BRANDS */}
          <SubMenu
            key="4"
            title={<span>🏷️ Brands</span>}
          >
            <div style={{ padding: 10 }}>
              {showBrands()}
            </div>
          </SubMenu>

          {/* COLORS */}
          <SubMenu
            key="5"
            title={<span>🎨 Colors</span>}
          >
            <div style={{ padding: 10 }}>
              {showColors()}
            </div>
          </SubMenu>
        </Menu>

        {/* RESET BUTTON */}
        <Button
          type="primary"
          danger
          block
          style={{ marginTop: 20 }}
          onClick={() => {

            setPrice([0, 100000]);

            setCategoryIds([]);

            setStar(0);

            setBrands([]);

            setColors([]);

            dispatch({
              type: "SEARCH_QUERY",

              payload: {
                text: "",
              },
            });
          }}
        >
          Reset Filters
        </Button>
      </Col>

      {/* ================= PRODUCTS ================= */}
      <Col span={19}>
        {loading ? (
          <h4>Loading products...</h4>

        ) : (
          <h4>
            {products.length} Products
          </h4>
        )}

        {!loading &&
          products.length === 0 && (
            <p>No products found</p>
          )}

        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col
              key={p._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
            >
              <ProductCard
                product={p}
                getImageUrl={getImageUrl}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Shop;