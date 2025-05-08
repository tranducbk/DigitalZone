import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ItemforList.css'
import ProductRating from '../ProductRating/ProductRating.js';
import { useCart } from '../CartContext/CartContext';

function ItemforList({ id, name, image, price, sale, rating }) {
  const formatPrice = (price) => {
    let priceString = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return priceString.replace(/\s/g, '');
  }
  const discountPrice = price * (1 - sale/100);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleGoDetail = (e) => {
    // Nếu click vào nút thì không chuyển trang
    if (e.target.closest('.item-list-button')) return;
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };

  return (
    <div className="item-list" onClick={handleGoDetail} style={{ cursor: 'pointer' }}>
      <div className="item-list-container">
        {sale && <div className="item-list-sale">-{sale}%</div>}
        <img className="item-list-image" src={image} alt={name} />
      </div>
      <div className="item-list-info">
        <h3 className="item-list-name">{name}</h3>
        <div className="item-list-box-price">
          <p className="item-list-price-new">{formatPrice(discountPrice)}</p>
          <p className="item-list-price-old">{formatPrice(price)}</p>
        </div>
        <div className="item-list-promotions">
          <div className="item-list-promotion">
            <p className="item-list-coupon-price">
              Ưu đãi trả góp 0% lãi suất - 0% phí chuyển đổi
            </p>
          </div>
        </div>
        <div className="item-list-rating">
          <ProductRating rating={rating} />
        </div>
        <button className="item-list-button" onClick={handleAddToCart}>Thêm vào giỏ</button>
      </div>
    </div>
  )
}

export default ItemforList