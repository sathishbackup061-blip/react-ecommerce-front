import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Button,
  Tooltip,
  Popconfirm,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import laptop from "../images/laptop.jpg";

const { Meta } = Card;

const AdminProductCard = ({ product, handleDeleteProduct }) => {
  // Destructure product data
  const { title, description, images, slug } = product;
  const navigate = useNavigate();

  // Helper function to get correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads")) {
      const apiUrl =
        process.env.REACT_APP_API?.replace("/api", "") ||
        "http://localhost:8000";
      return apiUrl + imagePath;
    }

    const apiUrl =
      process.env.REACT_APP_API?.replace("/api", "") ||
      "http://localhost:8000";
    return apiUrl + "/uploads/" + imagePath;
  };

  // Get first image URL
  const imageUrl =
    images && images.length > 0
      ? getImageUrl(images[0].url)
      : laptop;

  // Handle delete with confirmation
  const onDeleteConfirm = () => {
    handleDeleteProduct(slug, title);
  };

  return (
    <div>
      <Card
        hoverable
        style={{ width: "200px", objectFit: "cover" }}
        className="m-2"
        cover={
          <img
            alt={title}
            src={imageUrl}
            style={{ width: 200, height: 150, objectFit: "cover" }}
            onError={(e) => {
              e.target.src = laptop;
            }}
          />
        }
        actions={[
          <Tooltip title="View">
            <EyeOutlined className="text-info" style={{ cursor: "pointer" }} />
          </Tooltip>,
          <Tooltip title="Edit">
            <EditOutlined className="text-warning" style={{ cursor: "pointer" }}
            onClick={() => navigate(`/admin/product/update/${slug}`)}
            />
          </Tooltip>,
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Product"
              description={`Are you sure you want to delete "${title}"?`}
              onConfirm={onDeleteConfirm}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined
                className="text-danger"
                style={{ cursor: "pointer" }}
              />
            </Popconfirm>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title && title.substring(0, 20)}...`}
          description={`${description && description.substring(0, 10)}...`}
        />
      </Card>
    </div>
  );
};

export default AdminProductCard;