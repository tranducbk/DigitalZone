import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Import Antd components
import { 
    Layout, Row, Col, Card, Typography, Button, Checkbox, 
    InputNumber, Table, message, Spin, Empty, Space, 
    Divider, Tooltip, Modal, Image
} from 'antd';
import { 
    DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined, 
    DollarCircleOutlined, CreditCardOutlined,
    ExclamationCircleFilled, CheckCircleOutlined, StopOutlined
} from '@ant-design/icons';
import apiInstance from "../../api/api";
import styles from './CartPage.module.css';
import Payment from "../../components/Payment/Payment";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [orderDataForPayment, setOrderDataForPayment] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("userId");

    const formatPrice = (price) => {
        const num = Number(price);
        if (isNaN(num) || num === null || num === undefined) return '0₫';
        return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const fetchCartItemsWithNames = async () => {
        setLoading(true);
        try {
            const response = await apiInstance.getCart();
            const cartData = response.data.cart || { items: [] };
            const itemsFromApi = cartData.items || [];

            const itemsWithDetails = await Promise.all(
                itemsFromApi.map(async (item) => {
                    try {
                        const productResponse = await apiInstance.getProductById(item.productId);
                        return {
                            ...item,
                            key: item._id || `${item.productId}-${item.variant?.color}`,
                            productName: productResponse.data.product.name,
                            price: productResponse.data.product.price,
                            image: item.variant?.image || productResponse.data.product.images?.[0],
                            maxQuantity: item.variant?.quantity || 0,
                            selected: true,
                        };
                    } catch (prodError) {
                        console.error(`Lỗi lấy chi tiết SP ${item.productId}:`, prodError);
                        return { ...item, key: item._id, productName: 'Sản phẩm lỗi', price: 0, image: null, maxQuantity: 0, selected: false };
                    }
                })
            );
            setCartItems(itemsWithDetails);
        } catch (error) {
            console.error("Lỗi tải giỏ hàng:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) {
            message.warning("Vui lòng đăng nhập để xem giỏ hàng!");
            navigate("/login");
            return;
        }
        fetchCartItemsWithNames();
        // eslint-disable-next-line
    }, [userId]);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'cartNeedsUpdate' && event.newValue === 'true') {
                fetchCartItemsWithNames();
                localStorage.removeItem('cartNeedsUpdate');
            }
        };
        window.addEventListener('storage', handleStorage);

        if (localStorage.getItem('cartNeedsUpdate') === 'true') {
            fetchCartItemsWithNames();
            localStorage.removeItem('cartNeedsUpdate');
        }

        return () => window.removeEventListener('storage', handleStorage);
        // eslint-disable-next-line
    }, [userId, location.pathname]);

    useEffect(() => {
        if (location.state && location.state.fromBuyNow) {
            navigate(location.pathname, { replace: true, state: {} });
            window.location.reload();
        }
        // eslint-disable-next-line
    }, [location.state]);

    const handleToggleSelect = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.key === itemId ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const selectedItems = useMemo(() => cartItems.filter(item => item.selected), [cartItems]);
    const isAllSelected = useMemo(() => cartItems.length > 0 && selectedItems.length === cartItems.length, [cartItems, selectedItems]);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setCartItems(prevItems => prevItems.map(item => ({ ...item, selected: checked })));
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        const itemToUpdate = cartItems.find(item => item.key === itemId);
        if (!itemToUpdate) return;

        const quantity = Math.max(1, Math.min(newQuantity, itemToUpdate.maxQuantity));
        
        if (quantity !== newQuantity) {
            message.warning(`Số lượng tồn kho của sản phẩm này là ${itemToUpdate.maxQuantity}.`);
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.key === itemId ? { ...item, quantity: quantity } : item
            )
        );

        setIsUpdating(true);
        try {
            await apiInstance.updateCartQuantity(itemToUpdate.productId, itemToUpdate.variant.color, quantity);
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
            message.error("Cập nhật số lượng thất bại.");
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.key === itemId ? { ...item, quantity: itemToUpdate.quantity } : item
                )
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveItem = async (itemToRemove) => {
        confirm({
            title: `Xóa sản phẩm`,
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc muốn xóa "${itemToRemove.productName}" (${itemToRemove.variant.color}) khỏi giỏ hàng?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            onOk: async () => {
                 setIsUpdating(true);
                 try {
                    await apiInstance.removeProductFromCart(itemToRemove.productId, itemToRemove.variant.color);
                    message.success(`Đã xóa "${itemToRemove.productName}" khỏi giỏ hàng.`);
                    setCartItems(prevItems => prevItems.filter(item => item.key !== itemToRemove.key));
                 } catch (error) {
                     console.error("Lỗi xóa sản phẩm:", error);
                     message.error("Xóa sản phẩm thất bại.");
                 } finally {
                    setIsUpdating(false);
                 }
            }
        });
    };

    const handleDeleteSelected = () => {
         confirm({
            title: `Xóa các sản phẩm đã chọn`,
            icon: <ExclamationCircleFilled />,
            content: `Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn khỏi giỏ hàng?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            onOk: async () => {
                setIsUpdating(true);
                try {
                    await Promise.all(selectedItems.map(item => 
                        apiInstance.removeProductFromCart(item.productId, item.variant.color)
                    ));
                    message.success(`Đã xóa ${selectedItems.length} sản phẩm.`);
                    fetchCartItemsWithNames();
                } catch (error) {
                     console.error("Lỗi xóa sản phẩm đã chọn:", error);
                     message.error("Xóa sản phẩm thất bại.");
                } finally {
                     setIsUpdating(false);
                }
            }
        });
    }

    const totalAmount = useMemo(() => {
        return selectedItems.reduce((total, item) => {
            const itemPrice = item.price * (100 - (item.variant?.sale || 0)) / 100;
            return total + (itemPrice * item.quantity);
        }, 0);
    }, [selectedItems]);

    const handleProceedToCheckout = (paymentMethodType = "PayPal") => {
        if (selectedItems.length === 0) {
            message.warning("Vui lòng chọn ít nhất một sản phẩm để mua hàng!");
            return;
        }
        if (!userId) {
            message.error("Lỗi: Không tìm thấy User ID.");
            navigate("/login");
            return;
        }

        const orderData = {
            userId: userId,
            items: selectedItems.map(item => ({
                productId: item.productId,
                variant: item.variant,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: totalAmount,
            paymentMethod: paymentMethodType,
            paymentStatus: "Pending",
        };

        setOrderDataForPayment(orderData);

        if (paymentMethodType === 'Cash on Delivery') {
            createOrderApiCall(orderData);
        } else if (paymentMethodType === 'VNPAY') {
            handleVnpayPayment(orderData);
        } else {
            setIsPaymentModalVisible(true);
        }
    };

    const createOrderApiCall = async (orderPayload) => {
        setIsCheckingOut(true);
        try {
            console.log("Order data being sent:", orderPayload);
            const response = await apiInstance.createOrder(orderPayload);
            if (response.data && (response.data.success || response.status < 300)) {
                message.success("Đặt hàng thành công!");
                fetchCartItemsWithNames();
                navigate("/checkout");
            } else {
                 message.error(response.data?.message || "Đặt hàng thất bại.");
            }
        } catch (error) {
            console.error("Lỗi tạo đơn hàng:", error);
            message.error("Đặt hàng thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleRefresh = () => {
        fetchCartItemsWithNames();
    };

    const columns = [
        {
            key: 'selection',
            width: 50,
            render: (_, record) => (
                <Checkbox 
                    checked={record.selected} 
                    onChange={() => handleToggleSelect(record.key)}
                />
            ),
        },
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (_, record) => (
                <Space>
                    <Image 
                        src={record.image} 
                        alt={record.productName} 
                        width={60} 
                        height={60} 
                        className={styles.productImage} 
                        preview={false}
                        fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    />
                    <div>
                        <Link to={`/product/${record.productId}`} style={{ color: 'inherit', fontWeight: 500 }}>{record.productName}</Link>
                        <br/>
                        <Text type="secondary">Phân loại: {record.variant?.color || 'N/A'}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Đơn giá',
            key: 'unitPrice',
            align: 'right',
            render: (_, record) => {
                 const discountedPrice = record.price * (100 - (record.variant?.sale || 0)) / 100;
                 return (
                    <span>
                        {formatPrice(discountedPrice)}
                        {record.variant?.sale > 0 && (
                            <Text delete type="secondary" style={{ marginLeft: 5, fontSize: '0.85em' }}>
                                {formatPrice(record.price)}
                            </Text>
                        )}
                    </span>
                 )
            }
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={record.maxQuantity}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.key, value)}
                    size="small"
                    className={styles.quantityInput}
                    disabled={isUpdating}
                />
            )
        },
         {
            title: 'Thành tiền',
            key: 'totalItemPrice',
            align: 'right',
            render: (_, record) => {
                const itemPrice = record.price * (100 - (record.variant?.sale || 0)) / 100;
                return <Text strong>{formatPrice(itemPrice * record.quantity)}</Text>;
            }
        },
        {
            title: 'Xóa',
            key: 'action',
            align: 'center',
            width: 60,
            render: (_, record) => (
                 <Tooltip title="Xóa khỏi giỏ">
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleRemoveItem(record)}
                        className={styles.deleteButton}
                        disabled={isUpdating}
                    />
                 </Tooltip>
            )
        }
    ];

    const handleVnpayPayment = async (orderData) => {
        setIsCheckingOut(true);
        try {
            const response = await apiInstance.createPayment({
                amount: orderData.totalAmount,
            });
            if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                message.error("Không lấy được link thanh toán VNPAY.");
            }
        } catch (error) {
            message.error("Thanh toán VNPAY thất bại.");
            console.error(error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Layout className={styles.cartPageContainer}>
            <Content className={styles.cartContent}>
                {loading ? (
                    <div className={styles.loadingContainer}><Spin size="large"/></div>
                ) : cartItems.length === 0 ? (
                    <div className={styles.emptyCartContainer}>
                       <ShoppingCartOutlined className={styles.emptyCartIcon} />
                       <Title level={4}>Giỏ hàng của bạn đang trống</Title>
                       <Paragraph type="secondary">Hãy khám phá và thêm sản phẩm yêu thích vào giỏ nhé!</Paragraph>
                       <Button type="primary" size="large" href="/">Tiếp tục mua sắm</Button>
                    </div>
                ) : (
                    <>
                        <Card className={styles.cartItemsCard}>
                             <Table
                                columns={columns}
                                dataSource={cartItems}
                                pagination={false}
                                className={styles.cartTable}
                                rowKey="key"
                                locale={{ emptyText: 'Không có sản phẩm nào trong giỏ hàng' }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                padding: '10px 52px 10px 10px',
                                borderTop: '1px solid #f0f0f0',
                                fontSize: 16
                            }}>
                                <span style={{ fontWeight: 500, marginRight: 8 }}>Tổng tiền:</span>
                                <span style={{ fontWeight: 700, color: '#1677ff', fontSize: 18 }}>{formatPrice(totalAmount)}</span>
                            </div>
                        </Card>
                        
                        <Card className={styles.summaryCard}>
                            <div className={styles.summaryContent}>
                                <div className={styles.summaryActions}>
                                    <Checkbox 
                                        onChange={handleSelectAll} 
                                        checked={isAllSelected}
                                        indeterminate={selectedItems.length > 0 && selectedItems.length < cartItems.length}
                                    >
                                        Chọn tất cả ({cartItems.length})
                                    </Checkbox>
                                    <Button 
                                        danger 
                                        type="text" 
                                        onClick={handleDeleteSelected}
                                        disabled={selectedItems.length === 0 || isUpdating}
                                    >
                                        Xóa ({selectedItems.length})
                                    </Button>
                                </div>
                                <Space align="center" size="large">
                                    <Text>Tổng thanh toán ({selectedItems.length} sản phẩm):</Text>
                                    <Text className={styles.totalAmountText}>{formatPrice(totalAmount)}</Text>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        className={styles.checkoutButton}
                                        onClick={() => handleProceedToCheckout('PayPal')}
                                        disabled={selectedItems.length === 0 || isCheckingOut}
                                        loading={isCheckingOut && orderDataForPayment?.paymentMethod === 'PayPal'}
                                        icon={<CreditCardOutlined />}
                                    >
                                        Thanh toán Online
                                    </Button>
                                     <Button 
                                        type="default"
                                        size="large" 
                                        className={styles.checkoutButton}
                                        onClick={() => handleProceedToCheckout('Cash on Delivery')}
                                        disabled={selectedItems.length === 0 || isCheckingOut}
                                        loading={isCheckingOut && orderDataForPayment?.paymentMethod === 'Cash on Delivery'}
                                        icon={<DollarCircleOutlined />}
                                    >
                                        Thanh toán khi nhận hàng
                                    </Button>
                                    {/* <Button 
                                        type="primary" 
                                        size="large" 
                                        className={styles.checkoutButton}
                                        onClick={() => handleProceedToCheckout('VNPAY')}
                                        disabled={selectedItems.length === 0 || isCheckingOut}
                                        loading={isCheckingOut && orderDataForPayment?.paymentMethod === 'VNPAY'}
                                        icon={<CreditCardOutlined />}
                                    >
                                        Thanh toán VNPAY
                                    </Button> */}
                                </Space>
                            </div>
                        </Card>
                    </>
                )}
                 <Modal
                    title="Thanh toán Online"
                    open={isPaymentModalVisible}
                    onCancel={() => setIsPaymentModalVisible(false)}
                    footer={null}
                    destroyOnClose
                    width={600}
                    className={styles.paymentModal}
                 >
                    {orderDataForPayment && (
                        <Payment 
                            orderData={orderDataForPayment}
                            onPaymentSuccess={() => {
                                createOrderApiCall(orderDataForPayment);
                                setIsPaymentModalVisible(false);
                            }}
                            onPaymentError={(errMsg) => {
                                message.error(errMsg || "Thanh toán thất bại.");
                                setIsPaymentModalVisible(false);
                            }}
                            onClose={() => setIsPaymentModalVisible(false)}
                        />
                    )}
                 </Modal>

            </Content>
        </Layout>
    );
}