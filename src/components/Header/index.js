import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Search from "../Search";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faCircleUser, faList, faTruckField } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react/headless';
import MenuBar from "../MenuBar/MenuBar";
import 'tippy.js/dist/tippy.css';
import logo from '../Assets/DigitalZone.png'
import { AuthContext } from "../AuthContext/AuthContext";
import { faBell, faComment } from '@fortawesome/free-solid-svg-icons';
// import useSignalR from "../useSignalR/useSignalR";


function Header() {
    useEffect(() => {
        const role = localStorage.getItem("role");
        if(role === "admin") window.location.href = "/admin";
      });
    const [isMenu, setIsMenu] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const [isRead, setIsRead] = useState(true); 

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;

    const handleLogout = () => {
        logout();
        window.location.replace('/');
        localStorage.removeItem('phoneNumber'); // Xóa thông tin người dùng
        localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
        localStorage.removeItem('authToken');
        localStorage.removeItem('userID')
    };

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const showMessage = (msg) => {
        setMessage(msg);
        setVisible(false); 
        setIsRead(false);
      };
    //   useSignalR(showMessage, '');
    const handleNewMessage = () => {
    //khi có thông báo mới thì setIsRead(false) để hiện dấu chấm đỏ
    setIsRead(true);
    if(message !== ''){
        setVisible(!visible);
    }
  };

    return (
        <div className="header">
            <div className="menu">
                <div className="logo">
                <Link to="/"><img src={logo} alt="DigitalZone" /></Link> 
                </div>
                
                <HeadlessTippy
                    visible={isMenu}
                    interactive
                    placement="bottom-end"
                    onClickOutside={() => setIsMenu(false)} 
                    delay={[0, 700]}
                    render={(attrs) => (
                        <div className="menuBar" tabIndex="-1" {...attrs}>    
                            <MenuBar />         
                        </div>
                    )}
                >
                    <div className="menu-list1" onClick={() => setIsMenu(!isMenu)}>
                        <div className='my-icon'>
                            <FontAwesomeIcon icon={faList} />  
                        </div>
                        <div className="box-content">
                            <span className="title-y">DANH MỤC</span>
                        </div>
                    </div>
                </HeadlessTippy>
                
                <div className="menu-list">
                    <Search />
                </div>
                <Link to="/checkout" className="about-delivery-tracking" >
                    <div className="box-icon">
                        <div className='my-icon'>
                            <FontAwesomeIcon icon={faTruckField} className='fa-h-24px' />
                        </div>
                    </div>
                    <div className="box-content">
                        <p className="title-y">
                        Đơn hàng
                        </p>
                    </div>
                </Link>
                <div className="menu-list">
                    <div className="shop-cart">
                        <Link to="/cart" className="shop-cart">
                            <div className="box-icon">
                                <div className='my-icon'>
                                    <FontAwesomeIcon icon={faBagShopping} className='fa-h-24px' />
                                </div>
                            </div>
                            <div className="box-content">
                                <p className="title-y">
                                    Giỏ hàng
                                </p>
                                <span className="count"></span>
                            </div>        
                        </Link>
                    </div>
                </div>
                
                <div>
                    {isLoggedIn ? (
                        <div style={{ backgroundColor: '#d70018' }} className="box-user">
                        <div className="box-icon">
                            <Link to='/profile' style={{ display: 'inline-block' }}>
                            <div className="my-icon">
                                <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: '23px' }} className='avatar' />
                            </div>
                            </Link>
                        </div>
                        <div className="notification-icon" style={{ backgroundColor: '0065b3' }}>
                            <Tippy
                            interactive={true}
                            visible={visible}
                            placement="bottom"
                            onClickOutside={() => setVisible(false)}
                            render={attrs => (
                                <div className="tooltip-noti" {...attrs}>
                                {message}
                                </div>
                            )}
                            >
                            <button onClick={handleNewMessage} className="notification-icon">
                                <FontAwesomeIcon icon={faBell} style={{ fontSize: '23px' }} className='icon-noti' />
                                {!isRead && <FontAwesomeIcon icon={faComment} className="unread-dot" />}
                            </button>
                            </Tippy>
                        </div>
                        </div>
                    ) : null}
                    </div>

                <div>
                    {isLoggedIn ? (
                        <div className="login-btn" onClick={handleLogout}>
                            <div className="header-item about-member">
                                <div className="box-content">
                                    <span className="title-y">Đăng xuất</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to='/login' style={{ textDecoration: 'none' }}>
                            <div className="login-btn">
                                <div className="header-item about-member">
                                    <div className="box-content">
                                        <span className="title-y" style={{ textDecoration: 'none'}}>Đăng nhập</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
