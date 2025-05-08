import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Space, Table, message, Input, Typography, Tooltip, Tag } from "antd"; // Thêm Typography, Tooltip, Tag
import { 
    SearchOutlined, DeleteFilled, ExclamationCircleFilled, 
    ShoppingOutlined, // Icon cho tiêu đề
    EyeOutlined,      // Icon cho xem chi tiết
    SyncOutlined      // Icon cho refresh
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import OrderDetails from "./OrderDetails"; // Component chi tiết đơn hàng
import apiService from '../../api/api.js';
import styles from "./AdminOrder.module.css"; // Import CSS Module

const { Title, Text } = Typography;
const { confirm } = Modal;

// Giữ lại các hàm helper từ OrderDetails nếu cần dùng chung
const formatCurrency = (value) => {
  if (typeof value !== 'number') return "N/A";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} ${day}/${month}/${year}`; // Bỏ giây cho gọn
  } catch (e) {
    return "Invalid Date";
  }
};

// Component Tag cho Trạng thái Giao hàng
const DeliveryStatusTag = ({ status }) => {
  let color;
  switch (status) {
    case "Processing": color = "processing"; break; // Antd status colors
    case "Shipped": color = "processing"; break; // Hoặc 'blue'
    case "Delivered": color = "success"; break;
    case "Cancelled": color = "error"; break;
    default: color = "default";
  }
  return <Tag color={color}>{status || 'N/A'}</Tag>;
};

// Component Tag cho Trạng thái Thanh toán
const PaymentStatusTag = ({ status }) => {
  let color;
  switch (status) {
    case "Pending": color = "warning"; break;
    case "Completed": color = "success"; break;
    case "Failed": color = "error"; break;
    default: color = "default";
  }
  return <Tag color={color}>{status || 'N/A'}</Tag>;
};


const AdminOrder = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(() => {
    return Number(localStorage.getItem('adminOrderPageSize')) || 10;
  });

  const handleTableChange = (pagination) => {
    setPageSize(pagination.pageSize);
    localStorage.setItem('adminOrderPageSize', pagination.pageSize);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getAllOrders();
        const ordersData = response.data || []; // Lấy trực tiếp mảng đơn hàng
        
        const mappedOrders = ordersData.map((order, index) => ({
          ...order, // Giữ lại toàn bộ object order gốc
          key: order._id,
          stt: index + 1,
          userName: order.userId && typeof order.userId === 'object' ? (order.userId.userName || 'N/A') : 'N/A',
          email: order.userId && typeof order.userId === 'object' ? (order.userId.email || 'N/A') : 'N/A',
          phoneNumber: order.userId && typeof order.userId === 'object' ? (order.userId.phoneNumber || 'N/A') : 'N/A',
          ngayDatFormatted: formatDate(order.createdAt),
          totalAmountFormatted: formatCurrency(order.totalAmount),
          paymentStatus: order.paymentStatus || 'N/A',
          orderStatus: order.orderStatus || 'N/A',
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        message.error('Không thể lấy dữ liệu đơn hàng!');
        setOrders([]);
      } finally {
         setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);


  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Đóng modal chi tiết nếu đang mở khi refresh
    if(isModalVisible) closeModal();
  };

  const openOrderDetailsModal = (orderRecord) => {
    // record từ bảng chứa các trường đã map, ta cần object order gốc
    // const fullOrderData = orders.find(o => o._id === orderRecord._id); // Tìm lại data gốc nếu cần
    // Nếu bạn đã spread {...order} vào mappedOrders thì record chính là full data
    setSelectedOrder(orderRecord); // Lưu đơn hàng đang chọn
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // --- Chức năng tìm kiếm ---
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => { /* ... (Giữ nguyên) ... */ };
  const handleReset = (clearFilters, confirm, dataIndex) => { /* ... (Giữ nguyên) ... */ };
  const getColumnSearchProps = (dataIndex, title) => ({ /* ... (Giữ nguyên, có thể bỏ render Highlighter nếu không cần) ... */ });
  // --- Kết thúc tìm kiếm ---

  // --- Chức năng xóa ---
  const handleDeleteOrder = async (orderId, userName) => { /* ... (Giữ nguyên từ code của bạn, đổi tên hàm) ... */ 
    try {
        setLoading(true);
        await apiService.deleteOrder(orderId); // Giả sử có hàm deleteOrder
        message.success(`Đã xóa đơn hàng của: ${userName}`);
        handleRefresh(); // Refresh lại bảng
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        message.error(`Xóa đơn hàng thất bại.`);
    } finally {
        setLoading(false);
    }
  };
  const showDeleteConfirm = (order) => { /* ... (Giữ nguyên, sử dụng handleDeleteOrder) ... */ 
     confirm({
      title: `Bạn có chắc muốn xóa đơn hàng ${order._id}?`,
      icon: <ExclamationCircleFilled />,
      content: `Đơn hàng của khách hàng: ${order.userName || 'N/A'}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        handleDeleteOrder(order._id, order.userName);
      },
    });
  };
  // --- Kết thúc xóa ---

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: 'center',
    },
    {
      title: "Mã Đơn Hàng",
      dataIndex: "_id", // Dùng _id
      key: "_id",
      width: 180,
      ellipsis: true,
      ...getColumnSearchProps('_id', 'Mã Đơn Hàng'),
      render: (id) => <Text copyable={{ text: id }}>{id?.substring(id.length - 8)}...</Text> // Hiển thị 8 ký tự cuối và cho copy
    },
    {
      title: "Khách Hàng",
      dataIndex: "userName",
      key: "userName",
      ellipsis: true,
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      ...getColumnSearchProps('userName', 'Khách Hàng'),
      render: (text, record) => <span>{text} {record.email && record.email !== 'N/A' ? <span style={{color:'#888'}}>({record.email})</span> : null}</span>
    },
    {
      title: "Số ĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      align: 'center',
      render: (text) => text || 'N/A',
    },
    {
      title: "Ngày Đặt",
      dataIndex: "ngayDatFormatted", // Dùng trường đã format
      key: "ngayDatFormatted",
      width: 150,
      align: 'center',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sắp xếp theo ngày gốc
      render: (text) => <Text style={{whiteSpace: 'pre-line'}}>{text}</Text> // Hiển thị ngày giờ trên 2 dòng nếu cần
    },
    {
        title: "Tổng Tiền",
        dataIndex: "totalAmountFormatted", // Dùng trường đã format
        key: "totalAmountFormatted",
        width: 150,
        align: 'right',
        sorter: (a, b) => a.totalAmount - b.totalAmount,
        render: (text) => <Text strong>{text}</Text>
    },
    {
      title: "Thanh Toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 130,
      align: 'center',
      filters: [ // Ví dụ filter
        { text: 'Pending', value: 'Pending' },
        { text: 'Completed', value: 'Completed' },
        { text: 'Failed', value: 'Failed' },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
      render: (status) => <PaymentStatusTag status={status} />,
    },
    {
      title: "Giao Hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 130,
      align: 'center',
       filters: [
        { text: 'Processing', value: 'Processing' },
        { text: 'Shipped', value: 'Shipped' },
        { text: 'Delivered', value: 'Delivered' },
        { text: 'Cancelled', value: 'Cancelled' },
      ],
      onFilter: (value, record) => record.orderStatus === value,
      render: (status) => <DeliveryStatusTag status={status} />,
    },
     {
      title: "Hành Động",
      key: "action",
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
           <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: '#1890ff' }}/>}
              onClick={(e) => {
                e.stopPropagation();
                openOrderDetailsModal(record); // Mở modal chi tiết
              }}
            />
          </Tooltip>
          {/* <Tooltip title="Xóa đơn hàng">
            <Button // Nút xóa có thể để ở đây hoặc chỉ trong chi tiết
              type="text"
              danger
              icon={<DeleteFilled />}
              onClick={(e) => {
                e.stopPropagation();
                showDeleteConfirm(record);
              }}
            />
          </Tooltip> */}
        </Space>
      ),
    },
  ];
  
  const containerClass = styles?.adminOrderContainer || '';
  const headerActionsClass = styles?.headerActions || '';
  const pageTitleClass = styles?.pageTitle || '';
  const pageTitleIconClass = styles?.pageTitleIcon || '';
  const orderTableClass = styles?.orderTable || '';

  return (
    <div className={containerClass} style={!containerClass ? { padding: 20, backgroundColor: '#fff', borderRadius: 8 } : {}}>
       <div className={headerActionsClass} style={!headerActionsClass ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } : {}}>
        <Title level={4} className={pageTitleClass} style={!pageTitleClass ? { margin: 0, display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 600 } : {}}>
            <ShoppingOutlined className={pageTitleIconClass} style={!pageTitleIconClass ? { marginRight: 10, color: '#1890ff', fontSize: 24 } : {}}/>
            Quản Lý Đơn Hàng
        </Title>
        <Space>
          <Tooltip title="Làm mới danh sách">
            <Button icon={<SyncOutlined />} onClick={handleRefresh} loading={loading}>
              Làm mới
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* Modal hiển thị OrderDetails */}
      <Modal
        title={<Title level={5} style={{margin:0}}>Chi Tiết Đơn Hàng</Title>}
        open={isModalVisible}
        onCancel={closeModal}
        footer={[ // Thêm nút đóng vào footer
            <Button key="close" onClick={closeModal}>
                Đóng
            </Button>
        ]}
        width="75vw" // Tăng độ rộng modal chi tiết
        destroyOnClose // Hủy component khi đóng
        className={styles.orderDetailsModal} // Class cho modal
        bodyStyle={{padding: 0}} // Bỏ padding body mặc định
      >
        {selectedOrder && <OrderDetails order={selectedOrder} handleRefresh={handleRefresh} />}
      </Modal>

      <div className={orderTableClass}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="key"
          loading={loading}
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: ['5', '10', '20', '50'],
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
            style: { marginTop: "20px", textAlign: 'right' },
          }}
          onChange={handleTableChange}
          size="middle"
        />
      </div>
    </div>
  );
};

export default AdminOrder;