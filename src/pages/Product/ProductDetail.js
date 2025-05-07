// components/ProductDetail.js
import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";
import apiService from "../../api/api";
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.js';
import RecommendedProducts from '../../components/RecommendedProducts/RecommendedProducts.js'
import all_products from '../../components/Assets/all_product';
import DescriptionProduct from '../../components/DescriptionProduct/DescriptionProduct';
import CommentAndRating from '../../components/CommentAndRating/CommentAndRating';
import LoginPopup from '../../components/LoginPopup/LoginPopup.js';

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  //  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user') !== null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const isFirstRender = useRef(true);

    
    useEffect(() => { 
        window.scrollTo(0, 0);  
    }, [productId]);


    const handleLogin = () => {
    // Xử lý đăng nhập ở đây
    // localStorage.setItem('isLoggedIn', 'true');
    // setIsLoggedIn(true);
    setIsPopupOpen(false); // Đóng popup khi đăng nhập thành công
    };

    const openPopup = () => {
    setIsPopupOpen(true);
    };

    const closePopup = () => {
    setIsPopupOpen(false);
    };

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await apiService.getProductById(productId);
                setProduct(response.data.product); 
                console.log('Fetching product with ID:', product);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (error) {
        return <p>Lỗi: {error}</p>;
    } 

    if (!product) {
        return <p>Sản phẩm không tồn tại.</p>;
    }
    return (
        <div className='product-container'>
            <Breadcrumbs product={product} category={product.category} />
            {product && <ProductDisplay product={product} />}
            <DescriptionProduct product={product} />
            <RecommendedProducts category={product.category} productId={product._id} />
            <div ref={popupRef}></div>
            <CommentAndRating onOpenPopup={openPopup} product={product} />
            {isPopupOpen  && (
            <div>
            <LoginPopup onLogin={handleLogin} onClose={closePopup} />
            </div>
            )}
        </div>
    );
}
