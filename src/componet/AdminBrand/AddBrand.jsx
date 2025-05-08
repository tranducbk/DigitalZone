import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, message, Image } from 'antd';
import apiService from '../../api/api';

const AddBrand = ({ setModalChild, handleRefresh }) => {
    const [form] = Form.useForm();
    const [brandImage, setBrandImage] = useState(null);

    const onFinishFailed = (errorInfo) => {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    };

    const onFinish = async (values) => {
        const data = {
            brandName: values.brandName || '',
            logoUrl: values.logoUrl || '',
        };

        try {
            await apiService.addBrand(data);
            message.success('Thương hiệu được thêm thành công!');
            handleRefresh();
            setModalChild(null);
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || 'Đã xảy ra lỗi khi thêm thương hiệu';
            message.error(errorMessage);
        }
    };

    const handleImageUrlChange = (e) => {
        setBrandImage(e.target.value);
    };

    return (
        <div style={{ width: 650, margin: 'auto' }}>
            <Form
                form={form}
                name="themThuongHieu"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col xs={24} sm={16}>
                        <Form.Item
                            label="Tên Thương Hiệu"
                            name="brandName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập tên thương hiệu!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Url Logo"
                            name="logoUrl"
                        >
                            <Input onChange={handleImageUrlChange} placeholder="https://example.com/logo.png" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item label="Xem trước logo">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '140px', height: '140px', border: '1px dashed #d9d9d9', borderRadius: '8px', padding: '5px' }}>
                                {brandImage ? (
                                    <Image
                                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                        src={brandImage}
                                    />
                                ) : (
                                    <span style={{ color: '#bfbfbf' }}>Xem trước</span>
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'right', marginTop: '20px', marginBottom: 0 }}>
                    <Button type="default" onClick={() => setModalChild(null)} style={{ marginRight: 8 }}>
                        Hủy bỏ
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Thêm Thương Hiệu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddBrand;