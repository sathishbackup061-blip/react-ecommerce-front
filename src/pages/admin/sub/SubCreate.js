import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import Form from 'react-bootstrap/Form';
import { Col, Row, Input, Table, Space, Button, Card, Empty, Tag, Tooltip, Popconfirm, Segmented, Badge } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createSub, removeSub, updateSub, getSubs } from "../../../functions/sub";
import { getCategories } from "../../../functions/category";
import { 
    DeleteOutlined, 
    EditOutlined, 
    CheckOutlined, 
    CloseOutlined,
    PlusOutlined,
    FolderOutlined,
    AppstoreOutlined,
    BarsOutlined
} from "@ant-design/icons";
import CategoryForm from "../../../components/nav/forms/CategoryForm";
import LocalSearch from "../../../components/nav/forms/LocalSearch";
import "../../admin/AdminDesign.css";

const SubCreate = () => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subs, setSubs] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

    useEffect(() => {
        loadCategories();
        loadSubs();
    }, []);

    const loadCategories = () => {
        getCategories().then((s) => setCategories(s.data));
    };

    const loadSubs = () => {
        getSubs().then((s) => setSubs(s.data));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Sub category name cannot be empty");
            return;
        }
        if (!category) {
            toast.error("Please select a category");
            return;
        }
        setLoading(true);

        createSub({ name: name.trim(), parent: category }, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                setCategory('');
                toast.success(`✓ Sub Category "${res.data.name}" created successfully!`);
                loadSubs();
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data);
                } else {
                    toast.error("An error occurred while creating the sub category.");
                }
            });
    };

    const startEdit = (sub) => {
        setEditingId(sub.slug);
        setEditName(sub.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleUpdate = (subId) => {
        if (!editName.trim()) {
            toast.error("Sub category name cannot be empty");
            return;
        }
        setLoading(true);

        updateSub(subId, { name: editName.trim() }, user.token)
            .then(res => {
                setLoading(false);
                setEditingId(null);
                setEditName('');
                toast.success(`✓ Sub category updated to "${res.data.name}"`);
                loadSubs();
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data);
                } else {
                    toast.error("Failed to update sub category");
                }
            });
    };

    const handleDelete = (subId, subName) => {
        removeSub(subId, user.token)
            .then(res => {
                setDeletingId(null);
                toast.success(`✓ "${subName}" deleted successfully!`);
                loadSubs();
            })
            .catch(err => {
                setDeletingId(null);
                toast.error("Failed to delete sub category");
            });
    };

    // Group subs by category
    const groupedSubs = categories.map(cat => ({
        category: cat,
        subs: subs.filter(sub => sub.parent === cat._id && sub.name.toLowerCase().includes(keyword.toLowerCase()))
    })).filter(group => group.subs.length > 0);

    const totalSubs = subs.length;
    const totalCategories = categories.length;
    const matchedSubs = keyword ? subs.filter(s => s.name.toLowerCase().includes(keyword.toLowerCase())).length : totalSubs;

    const tableColumns = [
        {
            title: 'Sub Category Name',
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
                    <span className="sub-name">
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
                                    title="Delete Sub Category"
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
        <div className="sub-create-container">
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
                                        <AppstoreOutlined /> Sub Category Management
                                    </h1>
                                    <p className="page-subtitle">Create, edit, and manage your sub categories</p>
                                </Col>
                                <Col>
                                    <Space direction="vertical" align="end">
                                        <div className="stats">
                                            <Badge
                                                count={totalCategories}
                                                showZero
                                                style={{ backgroundColor: '#1890ff' }}
                                                title="Total Categories"
                                            />
                                            <span className="stat-label">Categories</span>
                                        </div>
                                        <div className="stats">
                                            <Badge
                                                count={totalSubs}
                                                showZero
                                                style={{ backgroundColor: '#52c41a' }}
                                                title="Total Sub Categories"
                                            />
                                            <span className="stat-label">Sub Categories</span>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>

                        {/* Create Form Section */}
                        <Card 
                            className="form-card" 
                            title={
                                <span>
                                    <PlusOutlined /> Create New Sub Category
                                </span>
                            }
                            style={{ marginBottom: '24px' }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="form-label">Select Category</Form.Label>
                                            <Form.Select
                                                name="category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="form-select-custom"
                                            >
                                                <option value="">-- Select a Category --</option>
                                                {categories.length > 0 && categories.map((c) => (
                                                    <option key={c._id} value={c._id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col xs={24} sm={12}>
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
                                        Found {matchedSubs} sub categor{matchedSubs !== 1 ? 'ies' : 'y'} matching "{keyword}"
                                    </Tag>
                                </div>
                            )}
                        </Card>

                        {/* Sub Categories Display */}
                        {groupedSubs.length === 0 ? (
                            <Card>
                                <Empty
                                    description={keyword ? "No matching sub categories found" : "No sub categories yet"}
                                    style={{ marginTop: '50px', marginBottom: '50px' }}
                                />
                            </Card>
                        ) : viewMode === 'table' ? (
                            // Table View
                            groupedSubs.map((group) => (
                                <Card
                                    key={group.category._id}
                                    className="category-card"
                                    title={
                                        <span>
                                            <FolderOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                            {group.category.name}
                                            <Tag color="blue" style={{ marginLeft: '12px' }}>
                                                {group.subs.length} sub categor{group.subs.length !== 1 ? 'ies' : 'y'}
                                            </Tag>
                                        </span>
                                    }
                                    style={{ marginBottom: '24px' }}
                                >
                                    <Table
                                        columns={tableColumns}
                                        dataSource={group.subs}
                                        rowKey="_id"
                                        pagination={false}
                                        size="small"
                                        bordered
                                        className="sub-table"
                                    />
                                </Card>
                            ))
                        ) : (
                            // Card View
                            groupedSubs.map((group) => (
                                <div key={group.category._id} style={{ marginBottom: '32px' }}>
                                    <div className="category-header">
                                        <h3>
                                            <FolderOutlined /> {group.category.name}
                                            <Tag color="blue" style={{ marginLeft: '12px', fontSize: '12px' }}>
                                                {group.subs.length}
                                            </Tag>
                                        </h3>
                                    </div>
                                    <Row gutter={[16, 16]}>
                                        {group.subs.map((sub) => (
                                            <Col xs={24} sm={12} lg={8} key={sub._id}>
                                                <Card
                                                    hoverable
                                                    className="sub-card"
                                                    style={{
                                                        borderLeft: '4px solid #1890ff',
                                                        height: '100%'
                                                    }}
                                                >
                                                    {editingId === sub.slug ? (
                                                        <div>
                                                            <Input
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                onPressEnter={() => handleUpdate(sub.slug)}
                                                                autoFocus
                                                                placeholder="Enter sub category name"
                                                            />
                                                            <Space style={{ marginTop: '12px', width: '100%', justifyContent: 'space-around' }}>
                                                                <Button
                                                                    type="primary"
                                                                    size="small"
                                                                    icon={<CheckOutlined />}
                                                                    onClick={() => handleUpdate(sub.slug)}
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
                                                            <h4 className="sub-card-title">
                                                                <FolderOutlined /> {sub.name}
                                                            </h4>
                                                            <Space style={{ marginTop: '12px', width: '100%', justifyContent: 'space-around' }}>
                                                                <Tooltip title="Edit">
                                                                    <Button
                                                                        type="primary"
                                                                        shape="circle"
                                                                        size="small"
                                                                        icon={<EditOutlined />}
                                                                        onClick={() => startEdit(sub)}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title="Delete">
                                                                    <Popconfirm
                                                                        title="Delete Sub Category"
                                                                        description={`Are you sure you want to delete "${sub.name}"?`}
                                                                        onConfirm={() => handleDelete(sub.slug, sub.name)}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                        okButtonProps={{ danger: true }}
                                                                    >
                                                                        <Button
                                                                            danger
                                                                            shape="circle"
                                                                            size="small"
                                                                            icon={<DeleteOutlined />}
                                                                            loading={deletingId === sub.slug}
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
                                </div>
                            ))
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SubCreate;