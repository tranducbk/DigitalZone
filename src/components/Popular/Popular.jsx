import React, { useEffect, useRef, useState } from 'react';
import './Popular.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Item from '../Item/Item';
import apiService from '../../api/api.js';

function Popular({ category }) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [data_product, setDataProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getProducts();
        const products = response.data.products;
        const filteredProducts = products.filter((product) => product.category.toLowerCase().trim() === category.toLowerCase().trim());

        setDataProducts(filteredProducts);

        switch (category) {
          case 'Điện thoại':
            setTitle('ĐIỆN THOẠI');
            break;
          case 'Laptop':
            setTitle('LAPTOP');
            break;
          case 'Tai nghe':
            setTitle('TAI NGHE');
            break;
          case 'Bàn phím':
            setTitle('BÀN PHÍM');
            break;
          case 'Chuột':
            setTitle('CHUỘT');
            break;
          case 'Phụ kiện':
            setTitle('PHỤ KIỆN');
            break;
          case 'TV':
            setTitle('TI VI');
            break;
          default:
            setTitle('');
            break;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [category]);
  
  useEffect(() => {
    const handleOffset = () => {
      if (elementRef.current) {
        const slideWidth = elementRef.current.offsetWidth;
        const itemWidth = slideWidth / 5;
        setWidth(itemWidth);
        setMaxIndex(data_product.length - 5);
      }
    };

    handleOffset();

    window.addEventListener('resize', handleOffset);

    return () => window.removeEventListener('resize', handleOffset);
  }, [index, width, data_product.length]);

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setOffset(offset + width);
    }
  };

  const handleNext = () => {
    if (index < maxIndex) {
      setIndex(index + 1);
      setOffset(offset - width);
    }
  };

  useEffect(() => {
    if (index === 0) {
      setOffset(0);
    }
  }, [maxIndex, index]);

  return (
    <>
      {data_product.length > 0 && (
        <div className='popular'>
          <div className="product-list-title">
            <Link className='title'>
              <h2>{title} - HOT DEAL</h2>
            </Link>
          </div>
          <div className="product-list">
            <div className="product-list-swiper">
              <div className="swiper-container">
                <div 
                  ref={elementRef}
                  className="swiper-wrapper"
                  style={{ 
                    transform: `translateX(${offset}px)`,
                    transitionDuration: '300ms'
                  }}
                >
                  {data_product.map((item, index) => (
                    <div key={index} className="swiper-slide">
                      <Item 
                        key={index} 
                        id={item._id}
                        name={item.name} 
                        image={item.variants[0].image}
                        price={item.price} 
                        sale={item.variants[0].sale} 
                        rating={item.rating}
                        hideAddToCart={true}
                      />
                    </div>
                  ))}
                </div>
                <div 
                  onClick={handlePrev} 
                  className="swiper-button-prev"
                  style={index === 0 ? {display: 'none'} : {}}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                <div 
                  onClick={handleNext} 
                  className="swiper-button-next"
                  style={index >= maxIndex ? {display: 'none'} : {}}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Popular;