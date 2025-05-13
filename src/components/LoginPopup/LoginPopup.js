import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPopup.module.css';  // Import the module CSS
import computer from '../Assets/computer.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const LoginPopup = ({ onLogin, onClose }) => {
  return (
    <div className={styles.loginPopupContainer}>
      <div className={styles.loginPopup}>
        <button className={styles.buttonClose} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className={styles.popupContent}>
          <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: 48, color: "#dd2476", marginBottom: 8 }} />
          <p>Vui lòng đăng nhập để thực hiện chức năng này!</p>
          <div className={styles.popupBox}>
            <img src={computer} alt="Computer"/>
            <Link to="/login">
              <button className={styles.buttonPopup} onClick={() => { onLogin(); onClose(); }}>
                Đăng nhập ngay
              </button>
            </Link>
          </div>
          <div style={{ marginTop: 10, color: "#888", fontSize: 15 }}>
            Bạn chưa có tài khoản? <Link to="/register" style={{ color: "#dd2476", fontWeight: 500 }}>Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
