import React, { useState, useEffect, useContext, useMemo } from 'react';
// Import Antd components
import { 
    Layout, Row, Col, Card, Typography, Descriptions, 
    List, Avatar, Table, Tag, Button, message, Spin, 
    Modal, Space, Tooltip, Divider, Image
} from 'antd';
import { 
    UserOutlined, PhoneOutlined, HomeOutlined, 
    ShoppingOutlined, // Icon cho đơn hàng
    InfoCircleOutlined, CalendarOutlined, CreditCardOutlined, 
    CarOutlined, CheckCircleOutlined, CloseCircleOutlined, 
    QuestionCircleOutlined, DollarCircleOutlined, DeleteOutlined, // Icon xóa
    StopOutlined, // Icon hủy
    ExclamationCircleFilled
} from '@ant-design/icons';
import CartContext from '../../components/CartContext/CartContext'; // Vẫn cần nếu bạn xử lý cart từ đây (ít khả thi)
import styles from './Checkout.module.css'; // Import CSS Module (đổi tên file nếu cần)
import apiService from '../../api/api';
import { MdDelete } from "react-icons/md"; // Có thể bỏ nếu dùng DeleteOutlined

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

// --- Các hàm helper và component Tag giữ nguyên ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

const formatDate = (isoString) => {
    if (!isoString) return 'Không xác định';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const DeliveryStatusTag = ({ status }) => {
    const statusConfig = {
        'Processing': { color: 'processing', text: 'Đang xử lý' },
        'Shipped': { color: 'warning', text: 'Đang giao hàng' },
        'Delivered': { color: 'success', text: 'Đã giao hàng' },
        'Cancelled': { color: 'error', text: 'Đã hủy' },
        'Pending': { color: 'default', text: 'Chờ xử lý' }
    };

    const config = statusConfig[status] || { color: 'default', text: status || 'Không xác định' };
    return <Tag color={config.color}>{config.text}</Tag>;
};

const PaymentStatusTag = ({ status }) => {
    const statusConfig = {
        'Paid': { color: 'success', text: 'Đã thanh toán' },
        'Unpaid': { color: 'error', text: 'Chưa thanh toán' },
        'Pending': { color: 'warning', text: 'Đang xử lý' },
        'Refunded': { color: 'default', text: 'Đã hoàn tiền' }
    };

    const config = statusConfig[status] || { color: 'default', text: status || 'Không xác định' };
    return <Tag color={config.color}>{config.text}</Tag>;
};
// -------------------------------------------------

const Checkout = () => { // Có thể đổi tên component thành OrderHistory
    const isLoggedIn = !!localStorage.getItem('authToken'); // Kiểm tra token
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false); // Loading riêng cho danh sách đơn hàng

    // Fetch user info
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn) {
                setIsLoading(false);
                return; // Không fetch nếu chưa đăng nhập
            }
            setIsLoading(true);
            try {
                const response = await apiService.getUserProfile();
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    message.warning("Không thể tải thông tin người dùng.");
                }
            } catch (error) {
                console.error('Lỗi tải thông tin người dùng:', error);
                // message.error('Lỗi tải thông tin người dùng.'); // Có thể không cần báo lỗi này
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [isLoggedIn]);

    // Fetch user orders khi có user._id
    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user?._id) {
                setLoadingOrders(true);
                try {
                    const response = await apiService.getUserOrders(user._id);
                    if (response.data && Array.isArray(response.data.orders)) {
                        // Sắp xếp đơn hàng mới nhất lên đầu và kiểm tra dữ liệu
                        const validOrders = response.data.orders.filter(order => {
                            return order && order.items && Array.isArray(order.items);
                        }).map(order => ({
                            ...order,
                            items: order.items.map(item => ({
                                ...item,
                                productId: item.productId || {},
                                variant: item.variant || {},
                                quantity: item.quantity || 0,
                                price: item.price || 0,
                                sale: item.sale || 0
                            }))
                        }));
                        setUserOrders(validOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                    } else {
                        setUserOrders([]);
                    }
                } catch (error) {
                    console.error('Lỗi tải đơn hàng:', error);
                    setUserOrders([]);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };
        fetchUserOrders();
    }, [user, isLoggedIn, isLoading]);

    const handleRefreshOrders = async () => {
         if (user?._id) {
                setLoadingOrders(true);
                try {
                    const response = await apiService.getUserOrders(user._id);
                    if (response.data && Array.isArray(response.data.orders)) {
                        setUserOrders(response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                    } else { 
                        setUserOrders([]); 
                    }
                } catch (error) { 
                    setUserOrders([]);
                } finally { 
                    setLoadingOrders(false); 
                }
            }
    }

    // --- Xử lý Hủy đơn hàng ---
    const handleCancelOrder = async (orderId) => {
        confirm({
            title: 'Xác nhận hủy đơn hàng',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này có thể không thể hoàn tác.',
            okText: 'Hủy đơn hàng',
            okType: 'danger',
            cancelText: 'Không',
            centered: true,
            onOk: async () => {
                try {
                    setLoadingOrders(true); // Có thể thêm loading riêng cho từng card
                    const response = await apiService.cancelOrder(orderId);
                    if (response.data && response.data.success) {
                        message.success('Đã hủy đơn hàng thành công!');
                        handleRefreshOrders(); // Tải lại danh sách đơn hàng
                    } else {
                        message.error(response.data?.message || 'Hủy đơn hàng thất bại.');
                    }
                } catch (error) {
                    console.error('Lỗi khi hủy đơn hàng:', error);
                    message.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng.');
                } finally {
                     setLoadingOrders(false);
                }
            },
        });
    };

    // --- Columns cho bảng chi tiết sản phẩm trong đơn hàng ---
    const itemColumns = [
        {
        title: "Sản phẩm",
        dataIndex: ["productId", "name"],
        key: "productName",
        render: (name, record) => {
            return (
                <Space>
                    <Image
                        width={50}
                        src={record.variant?.image || record.productId?.images?.[0] || '/images/default-product.png'} 
                        preview={false}
                    />
                    <span>{record.productId?.name || 'Sản phẩm không tồn tại'}</span>
                </Space>
            );
        },
        },
        {
            title: "Phân loại",
            dataIndex: ["variant", "color"],
            key: "variantColor", 
            render: (color) => color || 'N/A'
        },
        { 
            title: "Đơn giá", 
            key: "price", 
            align: 'right', 
            render: (_, record) => {
                const price = record.price || record.productId?.price || 0;
                const sale = record.sale || record.variant?.sale || 0;
                const discountedPrice = price * (100 - sale) / 100;
                return formatCurrency(discountedPrice);
            }
        },
        { 
            title: "SL", 
            dataIndex: "quantity", 
            key: "quantity", 
            align: 'center', 
            render: (qty) => qty || 0
        },
        { 
            title: "Thành tiền", 
            key: "total", 
            align: 'right', 
            render: (_, record) => {
                const price = record.price || record.productId?.price || 0;
                const sale = record.sale || record.variant?.sale || 0;
                const quantity = record.quantity || 0;
                const discountedPrice = price * (100 - sale) / 100;
                return formatCurrency(discountedPrice * quantity);
            }
        },
    ];

    // --- Render ---
    if (isLoading) {
        return <div className={styles.loadingContainer}><Spin size="large" /></div>;
    }

    if (!isLoggedIn || !user) {
        return (
            <div className={styles.checkoutPageContainer}>
                <div className={styles.checkoutContent}>
                    <div className={styles.noUserInfo}>
                        <Title level={4}>Vui lòng đăng nhập</Title>
                        <Paragraph>Bạn cần đăng nhập để xem lịch sử đơn hàng.</Paragraph>
                        <Button type="primary" href="/login">Đăng nhập ngay</Button>
                    </div>
                </div>
            </div>
        );
    }

     const userAddress = user.diaChi && (user.diaChi.ward || user.diaChi.district || user.diaChi.city) && user.diaChi.ward !== "Phường/xã"
        ? `${user.diaChi.ward || ''}, ${user.diaChi.district || ''}, ${user.diaChi.city || ''}`.replace(/^(,\s*)+|(,\s*)+$/g, '') // Xóa dấu phẩy thừa
        : 'Chưa cập nhật';

    return (
        <Layout className={styles.checkoutPageContainer}>
            <Content className={styles.checkoutContent}>
                <Title level={2} className={styles.pageTitle}>Lịch Sử Đơn Hàng</Title>

                {/* Card thông tin người dùng */}
                <Card title={<Space><UserOutlined />Thông tin người nhận mặc định</Space>} className={styles.sectionCard}>
                    <Descriptions bordered size="small" column={1} className={styles.userInfoDescriptions}>
                        <Descriptions.Item label="Tên người nhận">{user.userName || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{user.phoneNumber || 'Chưa cập nhật'}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">{userAddress}</Descriptions.Item>
                    </Descriptions>
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                        <Button type="link" href="/profile">Chỉnh sửa thông tin</Button>
                    </div>
                </Card>

                {/* Danh sách đơn hàng */}
                <Title level={4} style={{ marginTop: 30, marginBottom: 15 }}>Danh sách đơn hàng đã đặt</Title>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }} // Luôn hiển thị 1 card mỗi dòng
                    dataSource={userOrders}
                    loading={loadingOrders}
                    className={styles.orderList}
                    locale={{ emptyText: 'Bạn chưa có đơn hàng nào.' }}
                    renderItem={item => (
                        <List.Item>
                            <Card 
                                className={styles.orderCard}
                                title={
                                    <Space size="middle">
                                        <span>Mã đơn: <Text strong copyable={{text: item._id}}>{item._id}</Text></span>
                                        <Divider type="vertical" />
                                        <span>Ngày đặt: <Text type="secondary">{formatDate(item.createdAt)}</Text></span>
                                    </Space>
                                }
                                extra={<PaymentStatusTag status={item.paymentStatus} />}
                            >
                                <Table
                                    columns={itemColumns}
                                    dataSource={item.items || []}
                                    rowKey={(record) => record._id || record.productId?._id + record.variant?.color}
                                    pagination={false}
                                    size="small"
                                    className={styles.orderItemsTable}
                                    summary={(pageData) => {
                                        // Tính tổng tiền hàng trong summary
                                        let sum = pageData.reduce((acc, currentItem) => {
                                            const price = currentItem.price || currentItem.productId?.price || 0;
                                            const sale = currentItem.sale || currentItem.variant?.sale || 0;
                                            const quantity = currentItem.quantity || 0;
                                            const discountedPrice = price * (100 - sale) / 100;
                                            return acc + (discountedPrice * quantity);
                                        }, 0);
                                        return (
                                            <Table.Summary.Row>
                                                <Table.Summary.Cell index={0} colSpan={4}><strong>Tổng tiền hàng</strong></Table.Summary.Cell>
                                                <Table.Summary.Cell index={1} align="right"><strong>{formatCurrency(sum)}</strong></Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        );
                                    }}
                                />
                                <div className={styles.orderFooter}>
                                    <Space>
                                        <Text strong>Trạng thái:</Text>
                                        <DeliveryStatusTag status={item.orderStatus} />
                                    </Space>
                                    <Space>
                                        {/* Chỉ hiển thị nút Hủy khi đơn hàng đang xử lý */}
                                        {item.orderStatus === 'Processing' && (
                                            <Button 
                                                danger 
                                                icon={<StopOutlined />} 
                                                onClick={() => handleCancelOrder(item._id)}
                                                size="small"
                                                className={styles.actionButton}
                                            >
                                                Hủy đơn
                                            </Button>
                                        )}
                                    </Space>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </Content>
        </Layout>
    );
};

export default Checkout;