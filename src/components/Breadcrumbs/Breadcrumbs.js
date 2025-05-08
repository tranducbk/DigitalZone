import React from 'react'
import { Link } from 'react-router-dom';
import './Breadcrumbs.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';

function Breadcrumbs({ product, category, brand }) {
  // Chuyển đổi category thành dạng URL-friendly
  const getCategoryPath = (category) => {
    switch(category) {
      case 'Điện thoại':
        return 'điện-thoại';
      case 'Bàn Phím':
        return 'bàn-phím';
      case 'Laptop':
        return 'laptop';
      case 'TV':
        return 'tivi';
      case 'Chuột':
        return 'chuột';
      case 'Phụ Kiện':
        return 'phụ-kiện';
      case 'Tai Nghe':
        return 'tai-nghe';
      default:
        return category.toLowerCase().replace(/\s+/g, '-');
    }
  };

  const categoryPath = getCategoryPath(category);

  return (
    <div className='breadcrumbs'>
      <div className="breadcrumbs-container">
        <div className="breadcrumbs-blocks">
          <div className="breadcrumbs-block">
            <FontAwesomeIcon icon={faHouse} className='home-icon' />
            <Link to={'/'}>Trang chủ</Link>
          </div>
          <div className="breadcrumbs-block">
            <FontAwesomeIcon icon={faChevronRight} />
            <Link to={`/${categoryPath}`}>{category}</Link>
          </div>
          {brand && (
            <div className="breadcrumbs-block">
              <FontAwesomeIcon icon={faChevronRight} />
              <Link to={`/${categoryPath}/${encodeURIComponent(brand)}`}>
                {brand}
              </Link>
            </div>
          )}
          {product && (
            <div className="breadcrumbs-block">
              <FontAwesomeIcon icon={faChevronRight} />
              <Link to={`/product/${product.id}`}>
                {product.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Breadcrumbs;
