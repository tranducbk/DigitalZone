import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Rate, message, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import apiService from '../../api/api';
import styles from './CommentAndRating.module.css';

const { TextArea } = Input;

const CommentAndRating = ({ product, onOpenPopup, onRated }) => {
    const [form] = Form.useForm();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (product?._id) {
            fetchComments();
            checkLoginStatus();
        }
    }, [product?._id]);

    const checkLoginStatus = () => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    };

    const fetchComments = async () => {
        try {
            console.log('Fetching comments for product:', product._id);
            const response = await apiService.getComments(product._id);
            console.log('Comments response:', response);
            if (response.data && response.data.comments) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error('Lỗi khi tải bình luận:', error);
            if (error.response?.status !== 404) {
                message.error('Không thể tải bình luận. Vui lòng thử lại sau.');
            }
        }
    };

    const handleSubmit = async (values) => {
        if (!isLoggedIn) {
            message.error('Vui lòng đăng nhập để bình luận và đánh giá');
            onOpenPopup?.();
            return;
        }

        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            console.log('Submitting review:', {
                productId: product._id,
                userId,
                rating: values.rating,
                text: values.comment
            });

            const response = await apiService.addComment(
                product._id,
                userId,
                values.comment,
                values.rating
            );

            console.log('Review submission response:', response);

            if (response.data && response.data.comment) {
                message.success('Đánh giá thành công!');
                form.resetFields();
                fetchComments();
                if (typeof onRated === 'function') {
                    onRated();
                }
            } else {
                throw new Error('Lỗi khi gửi đánh giá');
            }
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error);
            message.error('Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!product?._id) {
        return null;
    }

    return (
        <div className={styles.container} id="reviews-section">
            <h2>Đánh giá sản phẩm</h2>
            
            {isLoggedIn ? (
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    className={styles.form}
                >
                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Bình luận"
                        rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Gửi đánh giá
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <div className={styles.loginMessage}>
                    <p>Vui lòng đăng nhập để bình luận và đánh giá</p>
                    <Button type="primary" onClick={onOpenPopup}>
                        Đăng nhập
                    </Button>
                </div>
            )}

            <div className={styles.commentsList}>
                <h3>Bình luận ({comments.length})</h3>
                {comments.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={comments}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={
                                        <div className={styles.commentHeader}>
                                            <span>{item.userName || 'Người dùng'}</span>
                                            <Rate disabled defaultValue={item.rating} />
                                        </div>
                                    }
                                    description={
                                        <div className={styles.commentContent}>
                                            <p>{item.text || item.comment}</p>
                                            <span className={styles.commentDate}>
                                                {formatDate(item.date || item.createdAt)}
                                            </span>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <p className={styles.noComments}>Chưa có bình luận nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                )}
            </div>
        </div>
    );
};

export default CommentAndRating;
