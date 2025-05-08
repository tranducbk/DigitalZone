import React, { useState } from 'react';
import styles from './Payment.module.css';  // Import module CSS
import QR from '../Assets/myQR.jpg'; // Đảm bảo đường dẫn đúng
import { Typography } from 'antd'; // Import Antd components
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons'; // Import icons
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const { Text } = Typography;

// Hàm format giá giữ nguyên
const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num) || num === null || num === undefined) return '0₫';
    return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const Payment = ({ orderData, onPaymentSuccess, onPaymentError, onClose }) => { 
  const [loading, setLoading] = useState(false);
  const totalMoney = orderData?.totalAmount || 0; // Lấy tổng tiền từ orderData

  const handleConfirm = () => {
    setLoading(true);
    // Ở đây, bạn có thể gọi API để xác nhận thanh toán đã nhận
    // hoặc chỉ đơn giản là gọi callback báo thành công
    // Nếu cần tạo đơn hàng sau khi thanh toán thành công, logic đó nên nằm ở đây hoặc trong CartPage
    console.log("Xác nhận thanh toán cho đơn hàng:", orderData); 
    setTimeout(() => {
      setLoading(false);
      if (typeof onPaymentSuccess === 'function') {
        onPaymentSuccess(); 
      }
    }, 2000);
  };

  return (
    <div className={styles.paymentPopupContainer}>
      <div className={styles.paymentPopup}>
        {/* <button className={styles.buttonClose} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button> */}
        <div className={styles.paymentRow}>
          <div className={styles.qrCol}>
            <img src={QR} alt="QR Code" className={styles.qrCodeImage} />
          </div>
          <div className={styles.infoCol}>
            <h3 className={styles.paymentTitle}>Quét Mã QR Để Thanh Toán</h3>
            <p className={styles.paymentInstruction}>
              Vui lòng quét mã QR và chuyển khoản số tiền:
            </p>
            <div className={styles.paymentAmount}>{formatPrice(totalMoney)}</div>
            <div className={styles.popupBox}>
              <button className={styles.buttonPopup} onClick={handleConfirm} disabled={loading}>
                {loading ? 'Đang xác nhận...' : 'Xác nhận thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;