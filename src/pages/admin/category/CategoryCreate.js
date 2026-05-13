import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { 
    Col, 
    Row, 
    Input, 
    Table, 
    Space, 
    Button, 
    Card, 
    Empty, 
    Tag, 
    Tooltip, 
    Popconfirm, 
    Segmented, 
    Badge,
    
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createCategory, getCategories, removeCategory, updateCategory } from "../../../functions/category";
import { 
    DeleteOutlined, 
    EditOutlined, 
    CheckOutlined, 
    CloseOutlined,
    PlusOutlined,
    AppstoreOutlined,
    BarsOutlined,
    FolderOutlined
} from "@ant-design/icons";
import CategoryForm from "../../../components/nav/forms/CategoryForm";
import LocalSearch from "../../../components/nav/forms/LocalSearch";
import "../../admin/AdminDesign.css";

const CategoryCreate = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }
        setLoading(true);

        createCategory({ name: name.trim() }, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`✓ Category "${res.data.name}" created successfully!`);
                loadCategories();
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data);
                } else {
                    toast.error("An error occurred while creating the category.");
                }
            });
    };

    const startEdit = (category) => {
        setEditingId(category.slug);
        setEditName(category.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleUpdate = (categoryId) => {
        if (!editName.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }
        setLoading(true);

        updateCategory(categoryId, { name: editName.trim() }, user.token)
            .then(res => {
                setLoading(false);
                setEditingId(null);
                setEditName('');
                toast.success(`✓ Category updated to "${res.data.name}"`);
                loadCategories();
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data);
                } else {
                    toast.error("Failed to update category");
                }
            });
    };

    const handleDelete = (categoryId, categoryName) => {
        removeCategory(categoryId, user.token)
            .then(res => {
                setDeletingId(null);
                toast.success(`✓ "${categoryName}" deleted successfully!`);
                loadCategories();
            })
            .catch(err => {
                setDeletingId(null);
                toast.error("Failed to delete category");
            });
    };

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword.toLowerCase());
    const filteredCategories = categories.filter(searched(keyword));
    const matchedCount = keyword ? filteredCategories.length : categories.length;

    const tableColumns = [
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            width: '60%',
            render: (text, record) => (
                editingId === record.slug ? (
                    <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onPressEnter={() => handleUpdate(record.slug)}
                        autoFocus
                        className="edit-input"
                    />
                ) : (
                    <span className="category-name">
                        <FolderOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        {text}
                    </span>
                )
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '40%',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {editingId === record.slug ? (
                        <>
                            <Tooltip title="Save">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="small"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleUpdate(record.slug)}
                                    loading={loading}
                                />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    type="default"
                                    shape="circle"
                                    size="small"
                                    icon={<CloseOutlined />}
                                    onClick={cancelEdit}
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Edit">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => startEdit(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Delete Category"
                                    description={`Are you sure you want to delete "${record.name}"?`}
                                    onConfirm={() => handleDelete(record.slug, record.name)}
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button
                                        danger
                                        shape="circle"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        loading={deletingId === record.slug}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="category-create-container">
            <Row gutter={[24, 24]}>
                <Col flex="200px">
                    <AdminNav />
                </Col>
                <Col flex="auto">
                    <div className="page-content">
                        {/* Header Section */}
                        <Card className="header-card" style={{ marginBottom: '24px' }}>
                            <Row align="middle" justify="space-between">
                                <Col>
                                    <h1 className="page-title">
                                        <AppstoreOutlined /> Category Management
                                    </h1>
                                    <p className="page-subtitle">Create, edit, and manage your product categories</p>
                                </Col>
                                <Col>
                                    <div className="stats">
                                        <Badge
                                            count={categories.length}
                                            showZero
                                            style={{ backgroundColor: '#1890ff' }}
                                            title="Total Categories"
                                        />
                                        <span className="stat-label">Total Categories</span>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Create Form Section */}
                        <Card
                            className="form-card"
                            title={
                                <span>
                                    <PlusOutlined /> Create New Category
                                </span>
                            }
                            style={{ marginBottom: '24px' }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <CategoryForm
                                        handleSubmit={handleSubmit}
                                        name={name}
                                        setName={setName}
                                        loading={loading}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        {/* Search and View Mode */}
                        <Card style={{ marginBottom: '24px' }}>
                            <Row gutter={[16, 16]} align="middle" justify="space-between">
                                <Col xs={24} sm={12}>
                                    <LocalSearch
                                        keyword={keyword}
                                        setKeyword={setKeyword}
                                    />
                                </Col>
                                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                                    <span style={{ marginRight: '12px', color: '#666' }}>View Mode:</span>
                                    <Segmented
                                        value={viewMode}
                                        onChange={setViewMode}
                                        options={[
                                            { label: 'Table', value: 'table', icon: <BarsOutlined /> },
                                            { label: 'Cards', value: 'card', icon: <AppstoreOutlined /> },
                                        ]}
                                    />
                                </Col>
                            </Row>
                            {keyword && (
                                <div style={{ marginTop: '12px' }}>
                                    <Tag color="blue">
                                        Found {matchedCount} categor{matchedCount !== 1 ? 'ies' : 'y'} matching "{keyword}"
                                    </Tag>
                                </div>
                            )}
                        </Card>

                        {/* Categories Display */}
                        <Card
                            className="categories-card"
                            title={
                                <span>
                                    <FolderOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                    Existing Categories
                                    <Tag color="blue" style={{ marginLeft: '12px' }}>
                                        {matchedCount} categor{matchedCount !== 1 ? 'ies' : 'y'}
                                    </Tag>
                                </span>
                            }
                        >
                            {filteredCategories.length === 0 ? (
                                <Empty
                                    description={keyword ? "No matching categories found" : "No categories yet"}
                                    style={{ marginTop: '50px', marginBottom: '50px' }}
                                />
                            ) : viewMode === 'table' ? (
                                // Table View
                                <Table
                                    columns={tableColumns}
                                    dataSource={filteredCategories}
                                    rowKey="_id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} categories`,
                                    }}
                                    size="small"
                                    bordered
                                    className="categories-table"
                                />
                            ) : (
                                // Card View
                                <Row gutter={[16, 16]}>
                                    {filteredCategories.map((category) => (
                                        <Col xs={24} sm={12} lg={8} key={category._id}>
                                            <Card
                                                hoverable
                                                className="category-card"
                                                style={{
                                                    borderLeft: '4px solid #1890ff',
                                                    height: '100%'
                                                }}
                                            >
                                                {editingId === category.slug ? (
                                                    <div>
                                                        <Input
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            onPressEnter={() => handleUpdate(category.slug)}
                                                            autoFocus
                                                            placeholder="Enter category name"
                                                        />
                                                        <Space style={{ marginTop: '12px', width: '100%', justifyContent: 'space-around' }}>
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                icon={<CheckOutlined />}
                                                                onClick={() => handleUpdate(category.slug)}
                                                                loading={loading}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                onClick={cancelEdit}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Space>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h4 className="category-card-title">
                                                            <FolderOutlined /> {category.name}
                                                        </h4>
                                                        <Space style={{ marginTop: '16px', width: '100%', justifyContent: 'center', gap: '12px' }}>
                                                            <Tooltip title="Edit">
                                                                <Button
                                                                    type="primary"
                                                                    shape="circle"
                                                                    size="small"
                                                                    icon={<EditOutlined />}
                                                                    onClick={() => startEdit(category)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <Popconfirm
                                                                    title="Delete Category"
                                                                    description={`Are you sure you want to delete "${category.name}"?`}
                                                                    onConfirm={() => handleDelete(category.slug, category.name)}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    okButtonProps={{ danger: true }}
                                                                >
                                                                    <Button
                                                                        danger
                                                                        shape="circle"
                                                                        size="small"
                                                                        icon={<DeleteOutlined />}
                                                                        loading={deletingId === category.slug}
                                                                    />
                                                                </Popconfirm>
                                                            </Tooltip>
                                                        </Space>
                                                    </>
                                                )}
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CategoryCreate;