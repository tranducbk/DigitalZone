import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col, message, Image } from 'antd';
import apiService from '../../api/api';

const EditCategory = ({ category, setModalChild, handleRefresh }) => {
    const [form] = Form.useForm();
    const [categoryImage, setCategoryImage] = useState(category?.image || null);

    useEffect(() => {
        setCategoryImage(category?.image || null);
        form.setFieldsValue({
            name: category?.name || '',
            image: category?.image || '',
            description: category?.description || '',
        });
    }, [category, form]);

    const onFinishFailed = (errorInfo) => {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    };

    const onFinish = async (values) => {
        if (!category || !category.id) {
            message.error('Không tìm thấy thông tin danh mục để cập nhật.');
            return;
        }

        const data = {
            id: category.id,
            name: values.name || '',
            image: values.image || '',
            description: values.description || '',
        };

        if (data.name === category.name &&
            data.image === category.image &&
            data.description === category.description) {
            message.info('Không có thay đổi nào để cập nhật.');
            setModalChild(null);
            return;
        }

        try {
            await apiService.updateCategory(data);
            message.success('Danh mục được cập nhật thành công!');
            handleRefresh();
            setModalChild(null);
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || 'Đã xảy ra lỗi khi cập nhật danh mục';
            message.error(errorMessage);
        }
    };

    const handleImageChange = (e) => {
        setCategoryImage(e.target.value);
    };

    if (!category) {
        return <div>Không có dữ liệu danh mục để chỉnh sửa.</div>;
    }

    return (
        <div style={{ width: 650, margin: 'auto' }}>
            <Form
                form={form}
                name="suaDanhMuc"
                layout="vertical"
                initialValues={{
                    name: category.name,
                    image: category.image,
                    description: category.description,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col xs={24} sm={16}>
                        <Form.Item
                            label="Tên Danh Mục"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên danh mục!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Url Ảnh Hiển Thị" name="image">
                            <Input onChange={handleImageChange} placeholder="https://example.com/image.png" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item label="Xem trước ảnh">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '10vw', height: '10vw', border: '1px dashed #d9d9d9', borderRadius: '8px', padding: '5px' }}>
                                {categoryImage ? (
                                    <Image
                                        style={{ maxHeight: '10vw', maxWidth: '10vw', objectFit: 'contain' }}
                                        src={categoryImage}
                                    />
                                ) : (
                                    <span style={{ color: '#bfbfbf' }}>Xem trước</span>
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Mô Tả Danh Mục" name="description" rules={[{ required: true, message: 'Hãy nhập mô tả danh mục!' }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginTop: '20px', marginBottom: 0 }}>
                    <Button type="default" onClick={() => setModalChild(null)} style={{ marginRight: 8 }}>
                        Hủy bỏ
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Cập Nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditCategory;