import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Import Antd components
import { 
    Layout, Row, Col, Card, Typography, Button, Checkbox, 
    InputNumber, Table, message, Spin, Empty, Space, 
    Divider, Tooltip, Modal, Image // Thêm Image vào import
} from 'antd';
import { 
    DeleteOutlined, ShoppingCartOutlined, ArrowLeftOutlined, 
    DollarCircleOutlined, CreditCardOutlined, // Thêm icons
    ExclamationCircleFilled, CheckCircleOutlined, StopOutlined
} from '@ant-design/icons';
import apiInstance from "../../api/api"; // Đảm bảo đường dẫn đúng
import styles from './CartPage.module.css'; // Đổi tên file CSS và import
import { MdDelete } from "react-icons/md"; // Có thể bỏ nếu dùng DeleteOutlined
import Payment from "../../components/Payment/Payment"; // Import Payment component

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true); // Loading ban đầu
    const [isUpdating, setIsUpdating] = useState(false); // Loading khi update số lượng/xóa
    const [isCheckingOut, setIsCheckingOut] = useState(false); // Loading khi đặt hàng
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // State cho modal Payment
    const [orderDataForPayment, setOrderDataForPayment] = useState(null); // Data đơn hàng cho modal Payment

    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("userId");

    // --- Hàm Format Giá ---
    const formatPrice = (price) => {
        const num = Number(price);
        if (isNaN(num) || num === null || num === undefined) return '0₫';
        return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    // --- Fetch Cart Items ---
    const fetchCartItemsWithNames = async () => {
        setLoading(true);
        try {
            const response = await apiInstance.getCart();
            const cartData = response.data.cart || { items: [] }; // Đảm bảo có object cart
            const itemsFromApi = cartData.items || [];

            const itemsWithDetails = await Promise.all(
                itemsFromApi.map(async (item) => {
                    try {
                        const productResponse = await apiInstance.getProductById(item.productId);
                        return {
                            ...item,
                            key: item._id || `${item.productId}-${item.variant?.color}`, // Key cho table
                            productName: productResponse.data.product.name,
                            price: productResponse.data.product.price, // Giá gốc
                            image: item.variant?.image || productResponse.data.product.images?.[0], // Ưu tiên ảnh variant
                            maxQuantity: item.variant?.quantity || 0, // Số lượng tồn kho của variant
                            selected: true, // Mặc định chọn tất cả ban đầu
                        };
                    } catch (prodError) {
                        console.error(`Lỗi lấy chi tiết SP ${item.productId}:`, prodError);
                        return { ...item, key: item._id, productName: 'Sản phẩm lỗi', price: 0, image: null, maxQuantity: 0, selected: false }; // Xử lý SP lỗi
                    }
                })
            );
            setCartItems(itemsWithDetails);
        } catch (error) {
            console.error("Lỗi tải giỏ hàng:", error);
            setCartItems([]); // Đặt lại giỏ hàng nếu lỗi
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
            // Chỉ reload 1 lần, sau đó xóa state để tránh lặp lại
            navigate(location.pathname, { replace: true, state: {} });
            window.location.reload();
        }
        // eslint-disable-next-line
    }, [location.state]);

    // --- Xử lý Checkbox ---
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

    // --- Xử lý Số lượng ---
    const handleQuantityChange = async (itemId, newQuantity) => {
        const itemToUpdate = cartItems.find(item => item.key === itemId);
        if (!itemToUpdate) return;

        // Giới hạn số lượng không vượt quá tồn kho
        const quantity = Math.max(1, Math.min(newQuantity, itemToUpdate.maxQuantity));
        
        if (quantity !== newQuantity) {
            message.warning(`Số lượng tồn kho của sản phẩm này là ${itemToUpdate.maxQuantity}.`);
        }

        // Cập nhật state ngay lập tức để phản hồi nhanh
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.key === itemId ? { ...item, quantity: quantity } : item
            )
        );

        // Gọi API (debounce nếu cần)
        setIsUpdating(true); // Có thể hiển thị loading cho dòng đó
        try {
            await apiInstance.updateCartQuantity(itemToUpdate.productId, itemToUpdate.variant.color, quantity);
            // Fetch lại giỏ hàng để đảm bảo đồng bộ nếu cần, hoặc chỉ cập nhật state
            // fetchCartItemsWithNames(); 
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
            message.error("Cập nhật số lượng thất bại.");
            // Rollback state nếu API lỗi
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.key === itemId ? { ...item, quantity: itemToUpdate.quantity } : item // Quay lại số lượng cũ
                )
            );
        } finally {
            setIsUpdating(false);
        }
    };

    // --- Xử lý Xóa ---
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
                    // Gọi API xóa nhiều lần hoặc API xóa hàng loạt nếu có
                    await Promise.all(selectedItems.map(item => 
                        apiInstance.removeProductFromCart(item.productId, item.variant.color)
                    ));
                    message.success(`Đã xóa ${selectedItems.length} sản phẩm.`);
                    fetchCartItemsWithNames(); // Tải lại giỏ hàng
                } catch (error) {
                     console.error("Lỗi xóa sản phẩm đã chọn:", error);
                     message.error("Xóa sản phẩm thất bại.");
                } finally {
                     setIsUpdating(false);
                }
            }
        });
    }

    // --- Tính tổng tiền ---
    const totalAmount = useMemo(() => {
        return selectedItems.reduce((total, item) => {
            const itemPrice = item.price * (100 - (item.variant?.sale || 0)) / 100;
            return total + (itemPrice * item.quantity);
        }, 0);
    }, [selectedItems]);

    // --- Xử lý Đặt hàng ---
    const handleProceedToCheckout = (paymentMethodType = "PayPal") => { // Mặc định là PayPal
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

        setOrderDataForPayment(orderData); // Lưu data để dùng nếu thanh toán online

        if (paymentMethodType === 'Cash on Delivery') {
            createOrderApiCall(orderData); // Gọi API tạo đơn hàng COD
        } else {
            setIsPaymentModalVisible(true); // Mở modal thanh toán online
        }
    };

    // Hàm gọi API tạo đơn hàng
    const createOrderApiCall = async (orderPayload) => {
        setIsCheckingOut(true);
        try {
            console.log("Order data being sent:", orderPayload);
            const response = await apiInstance.createOrder(orderPayload);
            if (response.data && (response.data.success || response.status < 300)) {
                message.success("Đặt hàng thành công!");
                // Không cần gọi API xóa từng sản phẩm nữa
                fetchCartItemsWithNames(); // Tải lại giỏ hàng sau khi đặt hàng
                navigate("/checkout"); // Chuyển đến trang lịch sử đơn hàng
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

    // Thêm hàm handleRefresh
    const handleRefresh = () => {
        fetchCartItemsWithNames();
    };

    // --- Định nghĩa Columns cho Table ---
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
                    max={record.maxQuantity} // Giới hạn bởi số lượng tồn kho
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.key, value)}
                    size="small"
                    className={styles.quantityInput}
                    disabled={isUpdating} // Disable khi đang cập nhật
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
                        disabled={isUpdating} // Disable khi đang cập nhật
                    />
                 </Tooltip>
            )
        }
    ];

    // --- Render chính ---
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
                            {/* Dòng tổng tiền */}
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
                        
                        {/* Thanh tổng kết và thanh toán */}
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
                                     {/* // Tách nút thanh toán ra */}
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        className={styles.checkoutButton}
                                        onClick={() => handleProceedToCheckout('PayPal')} // Mặc định mở PayPal
                                        disabled={selectedItems.length === 0 || isCheckingOut}
                                        loading={isCheckingOut && orderDataForPayment?.paymentMethod === 'PayPal'}
                                        icon={<CreditCardOutlined />}
                                    >
                                        Thanh toán Online
                                    </Button>
                                     <Button 
                                        type="default" // Nút COD kiểu khác
                                        size="large" 
                                        className={styles.checkoutButton}
                                        onClick={() => handleProceedToCheckout('Cash on Delivery')}
                                        disabled={selectedItems.length === 0 || isCheckingOut}
                                        loading={isCheckingOut && orderDataForPayment?.paymentMethod === 'Cash on Delivery'}
                                        icon={<DollarCircleOutlined />}
                                    >
                                        Thanh toán khi nhận hàng
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </>
                )}
                {/* Modal Payment */}
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
                                createOrderApiCall(orderDataForPayment); // Gọi API tạo đơn hàng khi xác nhận thanh toán online
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