import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col, message, Image } from 'antd';
import apiService from '../../api/api';

const EditBrand = ({ brand, setModalChild, handleRefresh }) => {
    const [form] = Form.useForm();
    const [brandImage, setBrandImage] = useState(brand?.logoUrl || null);

    useEffect(() => {
        setBrandImage(brand?.logoUrl || null);
        form.setFieldsValue({
            brandName: brand?.brandName || '',
            logoUrl: brand?.logoUrl || '',
        });
    }, [brand, form]);

    const onFinishFailed = (errorInfo) => {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    };

    const onFinish = async (values) => {
        if (!brand || !brand._id) {
            message.error('Không tìm thấy thông tin thương hiệu để cập nhật.');
            return;
        }

        const data = {
            brandName: values.brandName || '',
            logoUrl: values.logoUrl || '',
        };

        if (data.brandName === brand.brandName && data.logoUrl === brand.logoUrl) {
            message.info('Không có thay đổi nào để cập nhật.');
            setModalChild(null);
            return;
        }

        try {
            await apiService.updateBrand(brand._id, data);
            message.success('Thương hiệu được cập nhật thành công!');
            handleRefresh();
            setModalChild(null);
        } catch (e) {
            const errorMessage = e.response?.data?.message || e.message || 'Đã xảy ra lỗi khi cập nhật thương hiệu';
            message.error(errorMessage);
        }
    };

    const handleImageUrlChange = (e) => {
        setBrandImage(e.target.value);
    };

    if (!brand) {
        return <div>Không có dữ liệu thương hiệu để chỉnh sửa.</div>;
    }

    return (
        <div style={{ width: 630, margin: 'auto' }}>
            <Form
                form={form}
                name="suaThuongHieu"
                layout="vertical"
                initialValues={{
                    brandName: brand.brandName,
                    logoUrl: brand.logoUrl,
                }}
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
                        Cập Nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditBrand;