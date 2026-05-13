import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { Row, Col } from "antd";

import ProductCard from "../components/nav/cards/ProductCard";

import {
  getProductsByCount,
  fetchProductsByFilter,
  getFilterOptions,
  getImageUrl,
} from "../functions/product";

import { getCategories } from "../functions/category";

import FilterSidebar from "../components/shop/FilterSidebar";

const Shop = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState([]);

  const [brandOptions, setBrandOptions] =
    useState([]);

  const [colorOptions, setColorOptions] =
    useState([]);

  // -----------------------------
  // FILTERS
  // -----------------------------
  const [price, setPrice] =
    useState([10, 10000]);

  const [categoryIds, setCategoryIds] =
    useState([]);

  const [brands, setBrands] =
    useState([]);

  const [colors, setColors] =
    useState([]);

  const [star, setStar] =
    useState(0);

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  const loadInitial =
    useCallback(async () => {
      try {
        setLoading(true);

        const [p, c, f] =
          await Promise.all([
            getProductsByCount(12),
            getCategories(),
            getFilterOptions(),
          ]);

        setProducts(p.data || []);
        setCategories(c.data || []);

        setBrandOptions(
          f.data?.brands || []
        );

        setColorOptions(
          f.data?.colors || []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // -----------------------------
  // APPLY FILTERS
  // -----------------------------
  const applyFilters =
    useCallback(async () => {
      try {
        setLoading(true);

        const res =
          await fetchProductsByFilter({
            price,
            category: categoryIds,
            brand: brands,
            color: colors,
            stars: star,
          });

        setProducts(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, [
      price,
      categoryIds,
      brands,
      colors,
      star,
    ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // -----------------------------
  // RESET FILTERS
  // -----------------------------
  const resetFilters = () => {
    setPrice([10, 10000]);

    setCategoryIds([]);

    setBrands([]);

    setColors([]);

    setStar(0);
  };

  return (
    <Row
      gutter={20}
      style={{ padding: 20 }}
    >
      {/* FILTER */}
      <Col span={5}>
        <FilterSidebar
          price={price}
          setPrice={setPrice}
          categories={categories}
          categoryIds={categoryIds}
          setCategoryIds={
            setCategoryIds
          }
          star={star}
          setStar={setStar}
          brandOptions={
            brandOptions
          }
          brands={brands}
          setBrands={setBrands}
          colorOptions={
            colorOptions
          }
          colors={colors}
          setColors={setColors}
          resetFilters={
            resetFilters
          }
        />
      </Col>

      {/* PRODUCTS */}
      <Col span={19}>
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <h3>
            {products.length} Products
          </h3>
        )}

        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col
              key={p._id}
              xs={24}
              sm={12}
              md={6}
            >
              <ProductCard
                product={p}
                getImageUrl={
                  getImageUrl
                }
              />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Shop;