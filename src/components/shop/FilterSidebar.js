import React from "react";
import { Menu, Slider, Checkbox, Rate, Button } from "antd";
import { DownSquareOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

const FilterSidebar = ({
  price,
  setPrice,
  categories,
  categoryIds,
  setCategoryIds,
  star,
  setStar,
  brandOptions,
  brands,
  setBrands,
  colorOptions,
  colors,
  setColors,
  resetFilters,
}) => {
  const formatter = (value) => `₹${value}`;

  // CATEGORY
  const handleCategory = (value) => {
    let updated = [...categoryIds];

    if (updated.includes(value)) {
      updated = updated.filter((id) => id !== value);
    } else {
      updated.push(value);
    }

    setCategoryIds(updated);
  };

  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          value={c._id}
          checked={categoryIds.includes(c._id)}
          onChange={() => handleCategory(c._id)}
        >
          {c.name}
        </Checkbox>
      </div>
    ));

  // BRANDS
  const showBrands = () =>
    brandOptions.map((b) => (
      <div key={b}>
        <Checkbox
          checked={brands.includes(b)}
          onChange={() => {
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

  // COLORS
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
          padding: 6,
          cursor: "pointer",
          background: colors.includes(c) ? "#eee" : "",
          borderRadius: 4,
          marginBottom: 5,
        }}
      >
        {c}
      </div>
    ));

  return (
    <div>
      <h3>Search / Filter</h3>

      <Menu mode="inline" defaultOpenKeys={["1", "2", "3", "4", "5"]}>
        {/* PRICE */}
        <SubMenu key="1" title="₹ Price">
          <div style={{ padding: 10 }}>
            <Slider
              range
              min={10}
              max={10000}
              value={price}
              onChange={setPrice}
              tooltip={{ formatter }}
            />
          </div>
        </SubMenu>

        {/* CATEGORY */}
        <SubMenu key="2" title={<span><DownSquareOutlined /> Categories</span>}>
          <div style={{ padding: 10 }}>{showCategories()}</div>
        </SubMenu>

        {/* STAR */}
        <SubMenu key="3" title="⭐ Ratings">
          <div style={{ padding: 10 }}>
            {[5, 4, 3, 2, 1].map((s) => (
              <div
                key={s}
                onClick={() => setStar(s)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  background: star === s ? "#f5f5f5" : "",
                  borderRadius: 4,
                }}
              >
                <Rate disabled value={s} /> & up
              </div>
            ))}
          </div>
        </SubMenu>

        {/* BRAND */}
        <SubMenu key="4" title="🏷️ Brands">
          <div style={{ padding: 10 }}>{showBrands()}</div>
        </SubMenu>

        {/* COLOR */}
        <SubMenu key="5" title="🎨 Colors">
          <div style={{ padding: 10 }}>{showColors()}</div>
        </SubMenu>
      </Menu>

      <Button type="primary" danger block onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;