import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import Search from "../Search";
import MenuBar from "../MenuBar/MenuBar";
import logo from '../Assets/DigitalZone.png';
import { AuthContext } from "../AuthContext/AuthContext";
import { useCart } from '../CartContext/CartContext';
import { Layout, Button, Dropdown, Menu, Badge, Avatar, Popover, message } from 'antd';
import { MenuOutlined, ShoppingOutlined, ShoppingCartOutlined, UserOutlined, BellOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = () => {
    const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [isNotificationRead, setIsNotificationRead] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState('');
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const role = localStorage.getItem('role');
    const isAdmin = role === 'admin';
    useEffect(() => {
        const role = localStorage.getItem("role");
    }, [navigate]);
    const isLoggedIn = !!user;
    const handleLogout = () => {
        logout();
        message.success("Đăng xuất thành công!");
        navigate('/');
    };
    const handleNotificationClick = () => {
        setIsNotificationRead(true);
        message.info("Chức năng thông báo đang được phát triển.");
    };
    const userMenu = (
        <Menu className={styles.userDropdownMenu}>
            <Menu.Item key="profile" icon={<ProfileOutlined />} onClick={() => navigate('/profile')}>
                Thông tin tài khoản
            </Menu.Item>
            <Menu.Item key="orders" icon={<ShoppingCartOutlined />} onClick={() => navigate('/checkout')}>
                Lịch sử đơn hàng
            </Menu.Item>
            {isAdmin && (
                <Menu.Item key="admin" icon={<UserOutlined />} onClick={() => navigate('/admin')}>
                    Quản trị
                </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} danger>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );
    const menuBarContent = (
        <MenuBar onClose={() => setIsCategoryMenuVisible(false)} />
    );
    return (
        <AntHeader className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.leftSection}>
                    <Link to="/" className={styles.logoLink}>
                        <img src={logo} alt="DigitalZone" className={styles.logoImage} />
                    </Link>
                    <Popover
                        content={menuBarContent}
                        trigger="click"
                        open={isCategoryMenuVisible}
                        onOpenChange={setIsCategoryMenuVisible}
                        placement="bottomLeft"
                        overlayClassName={styles.menuBarPopover}
                        arrow={false}
                    >
                        <Button icon={<MenuOutlined />} className={styles.categoryMenuButton}>
                            Danh mục
                        </Button>
                    </Popover>
                </div>
                <div className={styles.centerSection}>
                    <Search />
                </div>
                <div className={styles.rightSection}>
                    <Link to="/checkout" className={styles.actionButton}>
                        <ShoppingOutlined />
                        <span className={styles.actionText}>Đơn hàng</span>
                    </Link>
                    <Link to="/cart" className={styles.actionButton}>
                        <Badge count={cartItems.length}>
                            <ShoppingCartOutlined style={{ color: '#fff' }} />
                        </Badge>
                        <span className={styles.actionText}>Giỏ hàng</span>
                    </Link>
                    {isLoggedIn && (
                        <Badge dot={!isNotificationRead} size="small" offset={[-2, 5]}> 
                            <Button 
                                icon={<BellOutlined />} 
                                className={styles.actionButton} 
                                onClick={handleNotificationClick}
                                type="text"
                                shape="circle"
                            />
                        </Badge>
                    )}
                    {isLoggedIn ? (
                        <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
                            <Button className={styles.actionButton} type="text">
                                <Avatar 
                                    icon={<UserOutlined />} 
                                    size="large" 
                                    style={{ marginRight: 8, background: '#e6f4ff', color: '#1890ff' }}
                                />
                                <span className={styles.actionText}>{user?.userName || user?.email || 'Tài khoản'}</span>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button className={styles.actionButton} type="text" onClick={() => navigate('/login')}>
                            <UserOutlined />
                            <span className={styles.actionText}>Đăng nhập</span>
                        </Button>
                    )}
                </div>
            </div>
        </AntHeader>
    );
};

export default Header;