import React, { useState, useEffect } from "react";
import {
  Button, Modal, Space, Table, message, Typography, Tooltip, Tag,
  Row, Col, Divider, Dropdown, Menu, Descriptions,
  Image, Avatar as AntAvatar,
  Spin, Card
} from "antd";
import {
  EditOutlined, ExclamationCircleFilled, UserOutlined, PhoneOutlined,
  HomeOutlined, CalendarOutlined, CreditCardOutlined, CarOutlined,
  CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined,
  DollarCircleOutlined, InfoCircleOutlined, ProfileOutlined, MailOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import apiService from "../../api/api";
import styles from "./AdminOrder.module.css";

const { Title, Text, Paragraph } = Typography;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return "N/A";
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const DeliveryStatusTag = ({ status }) => {
  let color = 'default';
  let icon = <QuestionCircleOutlined />;
  
  switch (status) {
    case 'Processing':
      color = 'processing';
      icon = <SyncOutlined spin />;
      break;
    case 'Shipped':
      color = 'warning';
      icon = <CarOutlined />;
      break;
    case 'Delivered':
      color = 'success';
      icon = <CheckCircleOutlined />;
      break;
    case 'Cancelled':
      color = 'error';
      icon = <CloseCircleOutlined />;
      break;
    default:
      break;
  }

  return (
    <Tag color={color} icon={icon}>
      {status || 'Unknown'}
    </Tag>
  );
};

const PaymentStatusTag = ({ status }) => {
  let color = 'default';
  let icon = <QuestionCircleOutlined />;
  
  switch (status) {
    case 'Pending':
      color = 'processing';
      icon = <SyncOutlined spin />;
      break;
    case 'Paid':
      color = 'success';
      icon = <CheckCircleOutlined />;
      break;
    case 'Failed':
      color = 'error';
      icon = <CloseCircleOutlined />;
      break;
    default:
      break;
  }

  return (
    <Tag color={color} icon={icon}>
      {status || 'Unknown'}
    </Tag>
  );
};

const OrderDetails = ({ order, handleRefresh }) => {
  const [currentOrderStatus, setCurrentOrderStatus] = useState(order?.orderStatus);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [newStatusToConfirm, setNewStatusToConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userId, items, createdAt, paymentMethod, paymentStatus, totalAmount, _id: orderId } = order || {};
  const user = (userId && typeof userId === 'object') ? userId : {};
  const userName = user.userName || 'N/A';
  const userEmail = user.email || 'N/A';
  const userPhone = user.phoneNumber || 'N/A';
  const userAddress = user.diaChi && (user.diaChi.ward || user.diaChi.district || user.diaChi.city)
    ? `${user.diaChi.ward || ''}${user.diaChi.ward && user.diaChi.district ? ', ' : ''}${user.diaChi.district || ''}${ (user.diaChi.district || user.diaChi.ward) && user.diaChi.city ? ', ' : ''}${user.diaChi.city || ''}`.trim().replace(/^,|,$/g, '')
    : 'Chưa cập nhật';

  useEffect(() => {
    setCurrentOrderStatus(order?.orderStatus);
  }, [order?.orderStatus]);

  const itemColumns = [
    {
      title: "Sản phẩm",
      dataIndex: ["productId", "name"],
      key: "productName",
      width: '40%',
      render: (name, record) => (
        <Space>
          <Image 
            src={record.variant?.image || record.productId?.images?.[0]}
            width={50} 
            height={50} 
            style={{objectFit: 'cover', borderRadius: 4}} 
            preview={false}
            fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
          />
          <Text>{name || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: ["variant", "color"],
      key: "variantColor",
       render: (color) => color ? <Tag>{color}</Tag> : <Text type="secondary">-</Text>,
    },
     {
      title: "Đơn giá",
      key: "price",
      align: 'right',
      render: (_, record) => {
        const basePrice = record.productId?.price || 0;
        const sale = record.variant?.sale || 0;
        const discountedPrice = basePrice * (1 - sale / 100);
        return formatCurrency(discountedPrice);
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: 'center',
       render: (qty) => qty || 0,
    },
    {
      title: "Thành tiền",
      key: "total",
      align: 'right',
      render: (_, record) => {
        const basePrice = record.productId?.price || 0;
        const sale = record.variant?.sale || 0;
        const quantity = record.quantity || 0;
        const discountedPrice = basePrice * (1 - sale / 100);
        const total = discountedPrice * quantity;
        return <Text strong>{formatCurrency(total)}</Text>;
      },
    },
  ];

  const showConfirmModal = (status) => {
    setNewStatusToConfirm(status);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmOk = async () => {
    if (!newStatusToConfirm) return;
    setLoading(true);
    try {
      const response = await apiService.updateOrderAdmin(orderId, newStatusToConfirm);
      if (response.data && response.data.order) {
        message.success("Trạng thái đơn hàng đã được cập nhật");
        setCurrentOrderStatus(response.data.order.orderStatus);
        handleRefresh();
      } else {
         message.error(response.data?.message || "Cập nhật thất bại, không nhận được dữ liệu mới.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      message.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setLoading(false);
      setIsConfirmModalVisible(false);
      setNewStatusToConfirm(null);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
    setNewStatusToConfirm(null);
  };

  const statusMenu = (
    <Menu onClick={({ key }) => showConfirmModal(key)}>
      <Menu.Item key="Processing">Processing</Menu.Item>
      <Menu.Item key="Shipped">Shipped</Menu.Item>
      <Menu.Item key="Delivered">Delivered</Menu.Item>
      <Menu.Item key="Cancelled" danger>Cancelled</Menu.Item>
    </Menu>
  );

  if (!order) {
    return <div style={{padding: 24, textAlign: 'center'}}><Spin/></div>;
  }

  return (
    <Card bordered={false} className={styles.orderDetailsCard}>
      <Descriptions title="Thông tin đơn hàng" bordered size="small" column={2} className={`${styles.orderDetailsDescriptions} AdminOrder_orderDetailsDescriptions__0vQLL`}>
        <Descriptions.Item label={<><InfoCircleOutlined /> Mã Đơn Hàng</>} span={1}>
          <Text copyable={{text: orderId}}>{orderId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<><CalendarOutlined /> Ngày Đặt</>} span={1}>{formatDate(createdAt)}</Descriptions.Item>
        <Descriptions.Item label={<><CreditCardOutlined /> Thanh toán</>} span={1}>{paymentMethod || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label={<><CheckCircleOutlined /> Trạng thái TT</>} span={1}>
            <PaymentStatusTag status={paymentStatus} />
        </Descriptions.Item>
         <Descriptions.Item label={<><CarOutlined /> Trạng thái GH</>} span={1}>
            <DeliveryStatusTag status={currentOrderStatus} />
        </Descriptions.Item>
         <Descriptions.Item label={<><DollarCircleOutlined /> Tổng tiền</>} span={1}>
            <Text strong color="red">{formatCurrency(totalAmount)}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider/>

      <Descriptions 
        title="Thông tin khách hàng" 
        bordered 
        size="small" 
        column={1}
        className={`${styles.orderDetailsDescriptions} AdminOrder_orderDetailsDescriptions__0vQLL`}
      >
         <Descriptions.Item labelStyle={{ width: 180 }} label={<><UserOutlined /> Tên Khách Hàng</>}>
            {userName}
         </Descriptions.Item>
         {userEmail && (
             <Descriptions.Item label={<><MailOutlined /> Email</>}>
                 {userEmail}
            </Descriptions.Item>
         )}
         <Descriptions.Item label={<><PhoneOutlined /> Số Điện Thoại</>}>
             {userPhone}
         </Descriptions.Item>
         <Descriptions.Item label={<><HomeOutlined /> Địa Chỉ Giao Hàng</>}>
             {userAddress}
         </Descriptions.Item>
       </Descriptions>

      <Divider/>

      <Title level={5} style={{marginBottom: 10}}><ProfileOutlined /> Chi tiết sản phẩm</Title>
      <Table
        dataSource={items || []}
        columns={itemColumns}
        rowKey={(item) => item._id || item.productId?._id + item.variant?.color}
        size="small"
        className={styles.orderItemsTable}
        pagination={false}
        summary={(pageData) => {
            let sum = 0;
            pageData.forEach((item) => {
              const basePrice = item.productId?.price || 0;
              const sale = item.variant?.sale || 0;
              const quantity = item.quantity || 0;
              const discountedPrice = basePrice * (1 - sale / 100);
              sum += discountedPrice * quantity;
            });
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>Tổng tiền hàng:</Text></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right"><Text strong>{formatCurrency(sum)}</Text></Table.Summary.Cell>
              </Table.Summary.Row>
            );
        }}
      />

        <div className={styles.statusUpdateSection}>
            <Row gutter={16} justify="space-between">
                <Col>
                    <Text strong>Trạng thái giao hàng hiện tại:</Text> <DeliveryStatusTag status={currentOrderStatus} />
                </Col>
                <Col>
                     <Dropdown overlay={statusMenu} trigger={['click']}>
                        <Button icon={<EditOutlined />} type="primary">
                            Cập nhật trạng thái
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
        </div>

      <Modal
        title="Xác nhận thay đổi trạng thái"
        open={isConfirmModalVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={loading}
        centered
      >
        <Space align="start">
            <ExclamationCircleFilled style={{ color: '#faad14', fontSize: 22, paddingTop: 5 }} />
            <p>Bạn có chắc chắn muốn thay đổi trạng thái giao hàng thành <Text strong>"{newStatusToConfirm}"</Text>?</p>
        </Space>
      </Modal>
    </Card>
  );
};

export default OrderDetails;