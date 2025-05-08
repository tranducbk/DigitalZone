import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Spin, AutoComplete, Typography, message, Button } from 'antd'; // Thêm Button vào import
import { SearchOutlined } from '@ant-design/icons';
import styles from './Search.module.css';
import ItemSearch from "../ItemSearch/ItemSearch";
import apiService from "../../api/api";
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const { Text } = Typography;

const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
};

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Thêm hiệu ứng khóa cuộn body khi dropdown hiện
    useEffect(() => {
        if (isDropdownVisible && searchValue.length > 0) {
            document.body.classList.add('noScroll');
        } else {
            document.body.classList.remove('noScroll');
        }
        return () => {
            document.body.classList.remove('noScroll');
        };
    }, [isDropdownVisible, searchValue]);

    const fetchProducts = async (query) => {
        if (!query.trim()) {
            setOptions([]);
            setIsDropdownVisible(false);
            return;
        }
        setLoading(true);
        try {
            const response = await apiService.getProducts();
            const products = response.data.products || [];

            const filteredResults = products.filter((product) => {
              const name = removeVietnameseTones(product.name.toLowerCase());
              const search = removeVietnameseTones(query.toLowerCase());
              return name.includes(search);
            });

            const formattedOptions = filteredResults.map(item => ({
                key: item._id,
                value: item.name,
                label: (
                    <div onClick={() => handleSelect(item._id)}>
                        <ItemSearch
                            id={item._id}
                            name={item.name}
                            image={item.variants && item.variants.length > 0 ? item.variants[0].image : null}
                            sale={item.variants && item.variants.length > 0 ? item.variants[0].sale : 0}
                            price={item.price}
                            noResult={false}
                        />
                    </div>
                ),
            }));
            
            if (formattedOptions.length === 0) {
                 setOptions([{ 
                     key: 'no-result', 
                     value: query,
                     label: <div style={{ padding: '10px', textAlign: 'center', color: '#888' }}>Không tìm thấy kết quả nào.</div>,
                     disabled: true
                 }]);
            } else {
                setOptions(formattedOptions);
            }
            setIsDropdownVisible(true);

        } catch (error) {
            console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            message.error("Có lỗi xảy ra khi tìm kiếm.");
            setOptions([]);
            setIsDropdownVisible(false);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), []); 

    const handleSearchChange = (value) => {
        setSearchValue(value);
        if (value) {
            debouncedFetchProducts(value);
        } else {
            setOptions([]);
            setIsDropdownVisible(false);
            debouncedFetchProducts.cancel(); 
        }
    };

    const handleSelect = (productId) => {
        setSearchValue('');
        setOptions([]);
        setIsDropdownVisible(false);
        navigate(`/product/${productId}`);
    };
    
    const handleSearchSubmit = (value) => {
        if(value.trim()){
            console.log("Perform full search page navigation for:", value);
             setIsDropdownVisible(false);
             debouncedFetchProducts.cancel();
        }
    }

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div ref={searchRef} className={styles.searchContainer}>
            {/* Overlay mờ khi dropdown hiện */}
            {isDropdownVisible && searchValue.length > 0 && (
                <div className={styles.searchOverlay} onClick={() => setIsDropdownVisible(false)} />
            )}
            <AutoComplete
                dropdownClassName={styles.searchResultsDropdown}
                options={options}
                style={{ width: '100%', maxWidth: 500 }}
                onSearch={handleSearchChange}
                open={isDropdownVisible && searchValue.length > 0}
                value={searchValue}
            >
                <Input.Search
                    placeholder="Tìm kiếm sản phẩm..."
                    enterButton={<Button icon={<SearchOutlined />} type="primary" />}
                    loading={loading}
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onSearch={handleSearchSubmit}
                    allowClear
                    size="middle"
                    onFocus={() => {if(options.length > 0) setIsDropdownVisible(true)}}
                />
            </AutoComplete>
        </div>
    );
}

export default Search;