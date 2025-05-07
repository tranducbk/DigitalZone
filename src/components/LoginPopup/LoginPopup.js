import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPopup.module.css';  // Import the module CSS
import computer from '../Assets/computer.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const LoginPopup = ({ onLogin, onClose }) => {
  return (
    <div className={styles.loginPopupContainer}>
      <div className={styles.loginPopup}>
        <div className={styles.popupContent}>
          <button className={styles.buttonClose} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button> 
          
          <p>Vui lòng đăng nhập để thực hiện chức năng này!</p>
          <div className={styles.popupBox}>
            <img src={computer} alt="Computer"/>
            <Link to="/login">
              <button className={styles.buttonPopup} onClick={() => { onLogin(); onClose(); }}>Đăng nhập</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
