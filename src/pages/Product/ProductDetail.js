// components/ProductDetail.js
import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import apiService from "../../api/api";
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.js';
import RecommendedProducts from '../../components/RecommendedProducts/RecommendedProducts.js'
import all_products from '../../components/Assets/all_product';
import DescriptionProduct from '../../components/DescriptionProduct/DescriptionProduct';
import CommentAndRating from '../../components/CommentAndRating/CommentAndRating';
import LoginPopup from '../../components/LoginPopup/LoginPopup.js';
import { useCart } from '../../components/CartContext/CartContext';

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const { addToCart } = useCart();

    
    useEffect(() => { 
        window.scrollTo(0, 0);  
    }, [productId]);


    const handleLogin = () => {
    setIsPopupOpen(false);
    };

    const openPopup = () => {
    setIsPopupOpen(true);
    };

    const closePopup = () => {
    setIsPopupOpen(false);
    };

    const handleBuyNow = async (productData) => {
        if (!productData?.variants?.[0] || productData.variants[0].quantity <= 0) {
            alert('Sản phẩm đã hết hàng!');
            return;
        }
        try {
            await addToCart(productData, 1);
            localStorage.setItem('cartNeedsUpdate', 'true');
            window.location.href = '/cart';
        } catch (error) {
            console.error('Lỗi khi mua hàng:', error);
        }
    };

    useEffect(() => {
        async function fetchProduct() {
            try {
                console.log('Fetching product with ID:', productId);
                const response = await apiService.getProductById(productId);
                if (response.data && response.data.product) {
                    setProduct(response.data.product);
                    console.log('Product fetched successfully:', response.data.product);
                } else {
                    throw new Error('Không tìm thấy thông tin sản phẩm');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        if (productId) {
            fetchProduct();
        } else {
            setError('Không tìm thấy ID sản phẩm');
            setLoading(false);
        }
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
            {product && <ProductDisplay 
                product={{
                    ...product,
                    rating: product.rating || 0,
                    star1: product.star1 || 0,
                    star2: product.star2 || 0,
                    star3: product.star3 || 0,
                    star4: product.star4 || 0,
                    star5: product.star5 || 0
                }} 
                onBuyNow={handleBuyNow} 
                isOutOfStock={product.variants?.[0]?.quantity === 0}
            />}
            <DescriptionProduct product={product} />
            <RecommendedProducts category={product.category} productId={product._id} />
            <div ref={popupRef}></div>
            <CommentAndRating 
                product={product} 
                onOpenPopup={openPopup} 
            />
            {isPopupOpen  && (
            <div>
            <LoginPopup onLogin={handleLogin} onClose={closePopup} />
            </div>
            )}
        </div>
    );
}
