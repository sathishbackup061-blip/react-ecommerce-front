import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  getImageUrl,
  fetchProductsByFilter,
  getFilterOptions,
} from "../functions/product";

import { getCategories } from "../functions/category";

import ProductCard from "../components/nav/cards/ProductCard";

import { Row, Col, Menu, Slider, Checkbox, Rate , Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { DownSquareOutlined } from "@ant-design/icons";

import FilterSidebar from "../components/shop/FilterSidebar";

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  // FILTER STATES
  const [price, setPrice] = useState([0, 100000]);
  const [categoryIds, setCategoryIds] = useState([]);

  const [star, setStar] = useState(0);

  const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);

    const [brandOptions, setBrandOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);

  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const dispatch = useDispatch();

  // INITIAL LOAD
  useEffect(() => {
    loadAllProducts();
    loadCategories();
    loadFilterOptions();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);

      const res = await getProductsByCount(12);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // MAIN FILTER EFFECT
  useEffect(() => {
    const delayed = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(delayed);
  }, [text, price, categoryIds, star, brands, colors]);

  // APPLY ALL FILTERS TOGETHER
  const applyFilters = async () => {
    try {
      setLoading(true);

      const res = await fetchProductsByFilter({
        query: text,
        price,
        category: categoryIds,
        stars: star,
        brand: brands,
        color: colors,
      });

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
        const res = await getFilterOptions();

        setBrandOptions(res.data.brands);
        setColorOptions(res.data.colors);
    } catch (err) {
        console.log(err);
    }
    };

  // PRICE CHANGE
  const handleSlider = (value) => {
    setPrice(value);
  };

  // CATEGORY CHANGE
  const handleCheck = (e) => {
    const value = e.target.value;

    let updated = [...categoryIds];

    if (updated.includes(value)) {
      updated = updated.filter((id) => id !== value);
    } else {
      updated.push(value);
    }

    setCategoryIds(updated);
  };

  // CATEGORY UI
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

    const showStars = () =>
        [5, 4, 3, 2, 1].map((s) => (
        <div
        key={s}
        onClick={() => setStar(s)}
        style={{
            padding: "10px",
            cursor: "pointer",
            background: star === s ? "#f5f5f5" : "",
            borderRadius: "4px",
            marginBottom: "5px",
        }}
        >
        <Rate disabled value={s} /> & up
        </div>
    ));

const showBrands = () =>
  brandOptions.map((b) => (
    <div key={b}>
      <Checkbox
        value={b}
        checked={brands.includes(b)}
        onChange={(e) => {
          let updated = [...brands];

          if (updated.includes(b)) {
            updated = updated.filter((x) => x !== b);
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

const showColors = () =>
  colorOptions.map((c) => (
    <div
      key={c}
      onClick={() => {
        let updated = [...colors];

        if (updated.includes(c)) {
          updated = updated.filter((x) => x !== c);
        } else {
          updated.push(c);
        }

        setColors(updated);
      }}
      style={{
        padding: "6px 10px",
        cursor: "pointer",
        background: colors.includes(c) ? "#eee" : "",
        borderRadius: 4,
        marginBottom: 5,
      }}
    >
      {c}
    </div>
  ));

  const showActiveFilters = () => (
  <div style={{ marginBottom: 10 }}>
    {brands.map((b) => (
      <span key={b} className="badge">
        {b} ✖
      </span>
    ))}

    {colors.map((c) => (
      <span key={c} className="badge">
        {c} ✖
      </span>
    ))}
  </div>
);

  const formatter = (value) => `₹${value}`;



  return (
    <Row gutter={20} style={{ padding: 20 }}>
      {/* SIDEBAR */}
      <Col span={5}>
        <h3>Search / Filter</h3>

        <Menu defaultOpenKeys={["1", "2", "3", "4", "5"]} mode="inline">
          {/* PRICE */}
          <SubMenu
            key="1"
            title={<span>₹ Price</span>}
          >
            <div style={{ padding: 10 }}>
              <Slider
                range
                min={10}
                max={10000}
                value={price}
                onChange={handleSlider}
                tooltip={{ formatter }}
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

          {/* STAR FILTER */}
            <SubMenu
                key="3"
                title={
                    <span>
                    ⭐ Ratings
                    </span>
                }
            >
            <div style={{ padding: 10 }}>
                {showStars()}
            </div>
            </SubMenu>

            <SubMenu
                key="4"
                title={<span>🏷️ Brands</span>}
                >
                <div style={{ padding: 10 }}>
                    {showBrands()}
                </div>
            </SubMenu>

            <SubMenu
                key="5"
                title={<span>🎨 Colors</span>}
                >
                <div style={{ padding: 10 }}>
                    {showColors()}
                </div>
            </SubMenu>

        </Menu>

        <Button
            type="primary"
            danger
            block
            onClick={() => {
                setPrice([10, 10000]);
                setCategoryIds([]);
                setStar(0);

                dispatch({
                type: "SEARCH_QUERY",
                payload: { text: "" },
                });
            }}
            >
            Reset Filters
            </Button>

      </Col>

      {/* PRODUCTS */}
      <Col span={19}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <h4>{products.length} Products</h4>
        )}

        {!loading && products.length === 0 && (
          <p>No products found</p>
        )}

        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col key={p._id} xs={24} sm={12} md={6}>
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