import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Item.css'
import ProductRating from '../ProductRating/ProductRating.js';

function Item({ id, name, image, price, sale, rating, hideAddToCart }) {
  const navigate = useNavigate();
  const formatPrice = (price) => {
    let priceString = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return priceString.replace(/\s/g, '');
  }
  const discountPrice = price * (1 - sale/100);

  // Hàm xử lý chuyển trang khi click vào card (trừ nút Thêm vào giỏ)
  const handleCardClick = (e) => {
    // Nếu click vào nút Thêm vào giỏ thì không chuyển trang
    if (e.target.closest('.item-card-button')) return;
    navigate(`/product/${id}`);
  };

  return (
    <div className="item-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="item-card-container">
        {sale && <div className="item-card-sale">-{sale}%</div>}
        <img className="item-card-image" src={image} alt={name} />
      </div>
      <div className="item-card-info">
        <h3 className="item-card-name">{name}</h3>
        <div className="item-card-box-price">
          <p className="item-card-price-new">{formatPrice(discountPrice)}</p>
          <p className="item-card-price-old">{formatPrice(price)}</p>
        </div>
        <div className="item-card-promotions">
          <div className="item-card-promotion">
            <p className="item-card-coupon-price">
              Ưu đãi trả góp 0% lãi suất - 0% phí chuyển đổi
            </p>
          </div>
        </div>
        <div className="item-card-rating">
          <ProductRating rating={rating} />
        </div>
        {!hideAddToCart && (
          <button className="item-card-button">Thêm vào giỏ</button>
        )}
      </div>
    </div>
  )
}

export default Item