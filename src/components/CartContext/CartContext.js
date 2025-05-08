import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../../api/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await apiService.getCart(userId);
                    setCartItems(response.data.cart || []);
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            }
            setLoading(false);
        };
        fetchCartItems();
    }, []);

    const addToCart = async (product, quantity) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return { success: false, message: 'Vui lòng đăng nhập' };
        try {
            const response = await apiService.addToCart(userId, product._id, quantity);
            setCartItems(response.data.cart);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Thêm vào giỏ hàng thất bại'
            };
        }
    };

    const removeFromCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        try {
            const response = await apiService.removeFromCart(userId, productId);
            setCartItems(response.data.cart);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        try {
            const response = await apiService.updateCartItem(userId, productId, quantity);
            setCartItems(response.data.cart);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const clearCart = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        try {
            await apiService.clearCart(userId);
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
