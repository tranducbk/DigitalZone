import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  ProductOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  DashboardOutlined,
  CodeSandboxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Badge, Button, Menu, Layout, Typography, Avatar, Tooltip as AntTooltip, Dropdown, Space } from "antd";
import AdminUser from "../../componet/AdminUser/AdminUser";
import AdminProduct from "../../componet/AdminProduct/AdminProduct";
import boxImage from "./box.png";
import AdminOrder from "../../componet/AdminOrder/AdminOrder";
import AdminProfile from "../../componet/AdminProfile/AdminProfile";
import styles from "./AdminPage.module.css";
import { io } from "socket.io-client";
import UserMessageTooltip from "./Tooltip ";
import CustomModal from './CustomModal';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const logout = () => {
  console.log("User logged out");
  localStorage.clear();
  window.location.href = "/";
};

const menuItems = [
  { key: 'products', icon: <ProductOutlined />, label: 'Sản phẩm' },
  { key: 'users', icon: <UserOutlined />, label: 'Người dùng' },
  { key: 'orders', icon: <CodeSandboxOutlined />, label: 'Đơn hàng' },
  { key: 'profile', icon: <InfoCircleOutlined />, label: 'Thông tin' },
];

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserMessageTooltipVisible, setUserMessageTooltipVisible] = useState(false);
  const [isRead, setIsRead] = useState(true);
  const [keySelected, setKeySelected] = useState("products");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [socket, setSocket] = useState(null);
  const adminName = JSON.parse(localStorage.getItem('user'))?.userName || 'Admin';

  const SIDER_WIDTH = 220;
  const SIDER_COLLAPSED_WIDTH = 80;

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      console.warn("Access denied. Redirecting...");
      return;
    }

    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);

    newSocket.on("receive_message", (data) => {
      console.log("Received new message:", data);
      setIsRead(false);
      setUsers((prevUsers) => {
        const userExists = prevUsers.find(user => user.id === data.userId);
        if (userExists) {
          return prevUsers.map(user =>
            user.id === data.userId ? { ...user, mes: data.message, timestamp: Date.now() } : user
          ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        return [{ id: data.userId, mes: data.message, timestamp: Date.now() }, ...prevUsers]
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      });
    });

    return () => {
      newSocket.off("receive_message");
      newSocket.disconnect();
    };
  }, []);

  const handleBellClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX - (250 - rect.width / 2),
    });
    setUserMessageTooltipVisible((prevVisible) => !prevVisible);
    if (!isUserMessageTooltipVisible) {
        setIsRead(true);
    }
  };

  const handleUserClickInTooltip = (user) => {
    setSelectedUser(user);
    setUserMessageTooltipVisible(false);
    setChatModalVisible(true);
  };

  const handleMenuClick = ({ key }) => {
    setKeySelected(key);
    if(isUserMessageTooltipVisible) setUserMessageTooltipVisible(false);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const renderPage = (key) => {
    switch (key) {
      case "users": return <AdminUser />;
      case "products": return <AdminProduct />;
      case "orders": return <AdminOrder />;
      case "profile": return <AdminProfile />;
      default: return <AdminProduct />;
    }
  };

  const userDropdownItems = [
    {
      key: 'viewProfile',
      label: 'Xem hồ sơ',
      icon: <UserOutlined />,
      onClick: () => handleMenuClick({ key: 'profile' }),
    },
    {
      key: 'goHome',
      label: 'Về trang người dùng',
      icon: <HomeOutlined />,
      onClick: () => window.location.href = '/',
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Layout className={styles.adminLayout}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={SIDER_WIDTH}
        className={styles.sider}
      >
        <div className={`${styles.siderLogo} ${collapsed ? styles.siderLogoCollapsed : ''}`}>
          {collapsed ? <DashboardOutlined /> : 'Admin Panel'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[keySelected]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Sider>
      <Layout
        className={styles.siteLayout}
      >
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className={styles.collapseButton}
            />
            <Title level={3} className={styles.headerTitle}>
              {menuItems.find(item => item.key === keySelected)?.label || 'Admin Dashboard'}
            </Title>
          </div>

          <div className={styles.headerRight}>
            <AntTooltip title={isRead ? "Không có tin nhắn mới" : "Có tin nhắn mới"} placement="bottom">
              <Badge dot={!isRead} offset={[-3, 3]}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<BellOutlined className={styles.headerIcon} />}
                  onClick={handleBellClick}
                />
              </Badge>
            </AntTooltip>

            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow trigger={['click']}>
                <Space>
                  <Avatar className={styles.avatar} icon={<UserOutlined />} />
                  <span style={{ color: '#fff', fontWeight: 500 }}>{adminName}</span>
                </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.contentArea}>
          {renderPage(keySelected)}
        </Content>
      </Layout>

      {isUserMessageTooltipVisible && (
        <UserMessageTooltip
          visible={isUserMessageTooltipVisible}
          position={tooltipPosition}
          onClose={() => setUserMessageTooltipVisible(false)}
          content={
            <div className={styles.tooltipContent}>
              <h4>Người dùng nhắn tin:</h4>
              {users.length > 0 ? (
                <ul>
                  {users.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleUserClickInTooltip(user)}
                    >
                      <div className={styles.userId}>ID: {user.id}</div>
                      <div className={styles.messagePreview}>Tin nhắn: {user.mes}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noMessages}>Không có tin nhắn mới.</p>
              )}
            </div>
          }
        />
      )}

      {isChatModalVisible && selectedUser && socket && (
        <CustomModal
          isVisible={isChatModalVisible}
          onClose={() => {
            setChatModalVisible(false);
            setSelectedUser(null);
          }}
          selectedUser={selectedUser}
          socket={socket}
        />
      )}
    </Layout>
  );
};

export default Admin;