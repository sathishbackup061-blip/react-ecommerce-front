import React from "react";
import { Button, Space } from "antd";

const CategoryList = ({ categories = [], onSelect }) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <Space wrap>
        {categories.map((cat) => (
          <Button key={cat._id} onClick={() => onSelect(cat)}>
            {cat.name}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default CategoryList;