import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Payment.module.css';  // Import the module CSS
import QR from '../Assets/myQR.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function formatPrice(price) {
  let priceString = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return priceString.replace(/\s/g, '');
}

const Payment = ({ totalMoney, onPayment, onClose }) => {
  return (
    <div className={styles.paymentPopupContainer}>
      <div className={styles.paymentPopup}>
        <div className={styles.popupContent}>
          <button className={styles.buttonClose} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button> 
          <img src={QR} alt="QR Code"/>
          <p>Vui lòng Chuyển khoản số tiền {formatPrice(totalMoney)} </p>
          <div className={styles.popupBox}>
            <Link to="/checkout">
              <button className={styles.buttonPopup} onClick={() => {onPayment(); onClose();}}>Xác nhận thanh toán</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;