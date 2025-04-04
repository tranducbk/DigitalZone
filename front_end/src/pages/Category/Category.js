import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Item from '../../components/Item/Item';
import './Category.css'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.js';
import apiService from '../../api/api.js';
 
function Category(props) {
  const [maxIndex, setMaxIndex] = useState(15); // Số lượng sản phẩm hiển thị mỗi lần
  const { brandName } = useParams(); // Lấy tham số 'brandName' từ URL
  const [brandList, setBrandList] = useState([]); // Danh sách các thương hiệu trong danh mục
  const [productBrand, setProductBrand] = useState(''); // Thương hiệu hiện tại được chọn
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm đã được lọc
  const [activeFilter, setActiveFilter] = useState(null); // Bộ lọc đang được áp dụng (giá, đánh giá, ...)
  const [products, setProducts] = useState([]); // Tất cả sản phẩm
  const { category } = props; // Danh mục hiện tại
  const [priceRangeFilter, setPriceRangeFilter] = useState(''); // Bộ lọc phạm vi giá
  const [ratingFilter, setRatingFilter] = useState(''); // Bộ lọc đánh giá
  const [brandImages, setBrandImages] = useState({}); // Ảnh của các thương hiệu

  // Lấy ảnh của thương hiệu từ API
  async function getBrandImage(brandName) {
    try {
      const response = await apiService.getProducts(); // Gọi API để lấy sản phẩm
      const product = response.data.products.find(product => product.brand.name.toLowerCase().trim() === brandName.toLowerCase().trim());
      if (product) {
        return product.brand.image; // Trả về ảnh thương hiệu nếu tìm thấy
      }
    } catch (error) {
      console.error('Error fetching brand image:', error); // Log lỗi nếu không thể lấy ảnh
      return null; // Trả về null nếu không tìm thấy ảnh
    }
  }

  // Lấy hình ảnh của các thương hiệu
  useEffect(() => {
    const fetchBrandImages = async () => {
      const images = {};
      for (const brand of brandList) {
        const image = await getBrandImage(brand); // Gọi hàm getBrandImage để lấy ảnh thương hiệu
        images[brand] = image || '/path/to/default-image.png'; // Đặt hình mặc định nếu không có
      }
      setBrandImages(images); // Lưu lại ảnh thương hiệu vào state
    };
    fetchBrandImages();
  }, [brandList]); // Chạy lại khi brandList thay đổi

  // Lấy tất cả sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts(); // Gọi API lấy sản phẩm
        const products = response.data.products || [];
        setProducts(products); // Lưu các sản phẩm vào state
      } catch (error) {
        console.error('Error fetching products:', error); // Nếu có lỗi trong việc lấy sản phẩm, log lỗi
      }
    };
    fetchProducts();
  }, []); // Chỉ chạy một lần khi component được render

  // Reset các bộ lọc khi thay đổi danh mục hoặc thương hiệu
  useEffect(() => {
    setProductBrand('');
    setActiveFilter(null);
    setPriceRangeFilter('');
    setRatingFilter('');
    setFilteredProducts([]);
  }, [category, brandName]); // Chạy lại khi category hoặc brandName thay đổi

  // Cuộn lên đầu trang khi thay đổi category
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn trang lên đầu
  }, [category]); // Chạy lại khi category thay đổi

  // Các hàm xử lý bộ lọc giá, đánh giá và thương hiệu
  const handlePriceRangeFilter = (range) => {
    setPriceRangeFilter(range); // Cập nhật bộ lọc phạm vi giá
  };

  const handleRatingFilter = (rating) => {
    setRatingFilter(rating); // Cập nhật bộ lọc đánh giá
  };

  const handleBrandFilter = (brand) => {
    setProductBrand(brand); // Cập nhật thương hiệu được chọn
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter); // Cập nhật bộ lọc đang áp dụng
  };

  const filterByPriceRange = (minPrice, maxPrice) => {
    setActiveFilter({ type: 'price', min: minPrice, max: maxPrice }); // Cập nhật bộ lọc giá theo khoảng
  };

  // Hàm xử lý khi nhấn vào các tiêu chí sắp xếp
  const handleSortClick = (sortType) => {
    setActiveFilter({ type: 'sort', value: sortType }); // Cập nhật bộ lọc sắp xếp
  };


  // Lọc và sắp xếp sản phẩm khi danh sách sản phẩm hoặc bộ lọc thay đổi
  useEffect(() => {
    // Tìm sản phẩm theo danh mục
    let filteredByCategory = products.filter(
      (product) => product.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
  
    // Lọc theo thương hiệu nếu có
    if (brandName) {
      filteredByCategory = filteredByCategory.filter(
        (item) => item.brand.name.toLowerCase() === brandName.toLowerCase()
      );
      setProductBrand(brandName); // Cập nhật thương hiệu hiện tại
    }
  
    setFilteredProducts(filteredByCategory); // Lưu lại các sản phẩm đã lọc vào state
  
    // Cập nhật danh sách thương hiệu từ sản phẩm đã lọc
    const brands = Array.from(
      new Set(filteredByCategory.map((product) => product.brand.name.toLowerCase()))  // Đảm bảo mỗi thương hiệu chỉ xuất hiện 1 lần
    ).map((brand) => brand.charAt(0).toUpperCase() + brand.slice(1)); 
    setBrandList(brands); // Cập nhật danh sách thương hiệu
  }, [products, category, brandName]); // Chạy lại khi products, category, hoặc brandName thay đổi

  // Lọc sản phẩm theo các bộ lọc đã chọn (giá, đánh giá, ...)
  useEffect(() => {
    let filteredProducts = products.filter(
      (product) => product.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
  
    // Lọc theo thương hiệu nếu có
    if (productBrand) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand.name.toLowerCase() === productBrand.toLowerCase()
      );
    }
  
    // Lọc theo phạm vi giá nếu có
    if (activeFilter && activeFilter.type === 'price' && activeFilter.min !== undefined && activeFilter.max !== undefined) {
      filteredProducts = filteredProducts.filter((product) => {
        const discountedPrice = product.price * (1 - product.variants[0].sale / 100);
        return discountedPrice >= activeFilter.min && discountedPrice <= activeFilter.max;
      });
    }
  
    // Sắp xếp theo các tiêu chí đã chọn (giá, khuyến mãi, đánh giá...)
    if (activeFilter && activeFilter.type === 'sort') {
      switch (activeFilter.value) {
        case 'highToLow':
          filteredProducts.sort((a, b) => b.price * (1 - b.sale / 100) - a.price * (1 - a.sale / 100));
          break;
        case 'lowToHigh':
          filteredProducts.sort((a, b) => a.price * (1 - a.sale / 100) - b.price * (1 - b.sale / 100));
          break;
        case 'hotDeals':
          filteredProducts.sort((a, b) => b.sale - a.sale);
          break;
        case 'highRating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }
  
    setFilteredProducts(filteredProducts); // Cập nhật danh sách sản phẩm đã lọc
  }, [products, productBrand, category, activeFilter]); // Chạy lại khi products, productBrand, category, hoặc activeFilter thay đổi
  
  return (
    <div className='category-container'>
      {/* Breadcrumbs giúp người dùng điều hướng */}
      <Breadcrumbs category={props.category} brand={brandName} />
      
      <div className="clear"></div>

      {/* Bộ lọc thương hiệu */}
      <div className="block-filter-brand">
        <div className="filter-brands-title">Chọn theo thương hiệu</div>
        <div className="list-brand">
          {brandList.map((brand, index) => (
            <Link
              key={index}
              to={`/${props.category.toLowerCase()}/${brand.toLowerCase()}`}
              className={`list-brand-item ${brand.toLowerCase() === productBrand.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleBrandFilter(brand)}
            >
              <div
                className={`brand-img-container ${brand.toLowerCase() === productBrand.toLowerCase() ? 'active-brand-container' : ''}`}
              >
                <img
                  src={brandImages[brand] || '/path/to/default-image.png'}
                  alt={brand}
                  className="brand-img"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bộ lọc sắp xếp */}
      <div className="block-filter-sort">
        <div className="filter-sort__title">Sắp xếp theo</div>
        <div className="filter-sort__list-filter">
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.value === 'highToLow' ? 'active' : ''}`}
            onClick={() => handleSortClick('highToLow')}
          >
            Giá Cao - Thấp
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.value === 'lowToHigh' ? 'active' : ''}`}
            onClick={() => handleSortClick('lowToHigh')}
          >
            Giá Thấp - Cao
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.value === 'hotDeals' ? 'active' : ''}`}
            onClick={() => handleSortClick('hotDeals')}
          >
            Khuyến mãi HOT
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.value === 'highRating' ? 'active' : ''}`}
            onClick={() => handleSortClick('highRating')}
          >
            Đánh giá cao
          </a>
        </div>
      </div>

      {/* Bộ lọc giá */}
      <div className="block-filter-sort">
        <div className="criteria-sort__title">Chọn theo tiêu chí</div>
        <div className="criteria-sort__list-filter">
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.min === 1 && activeFilter.max === 5000000 ? 'active' : ''}`}
            onClick={() => filterByPriceRange(1, 5000000)}
          >
            Dưới 5 triệu
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.min === 5000000 && activeFilter.max === 10000000 ? 'active' : ''}`}
            onClick={() => filterByPriceRange(5000000, 10000000)}
          >
            5 - 10 triệu
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.min === 10000000 && activeFilter.max === 20000000 ? 'active' : ''}`}
            onClick={() => filterByPriceRange(10000000, 20000000)}
          >
            10 - 20 triệu
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.min === 20000000 && activeFilter.max === 30000000 ? 'active' : ''}`}
            onClick={() => filterByPriceRange(20000000, 30000000)}
          >
            20 - 30 triệu
          </a>
          <a
            className={`btn-filter button__sort ${activeFilter && activeFilter.min === 30000000 && activeFilter.max === 1000000000 ? 'active' : ''}`}
            onClick={() => filterByPriceRange(30000000, 1000000000)}
          >
            Trên 30 triệu
          </a>
        </div>
      </div>

      {/* Hiển thị sản phẩm đã lọc */}
      <div className="block-filter-indexSort">
        <div className="filter-indexSort-title">
          <p>
            {filteredProducts.length > 0 ? (
              <span>
                Hiển thị 1-{(maxIndex < filteredProducts.length) ? maxIndex : filteredProducts.length} trên tổng số {filteredProducts.length} sản phẩm
              </span>
            ) : (
              <span>Không có sản phẩm nào phù hợp với lựa chọn của bạn</span>
            )}
          </p>
        </div>

        <div className="block-products-filter">
          {filteredProducts.slice(0, Math.min(maxIndex, filteredProducts.length)).map((product, index) => {
            return (
              <Item
                key={index}
                id={product._id}
                name={product.name}
                image={product.variants[0].image}
                sale={product.variants[0].sale}
                price={product.price}
                rating={product.rating}
              />
            );
          })}
        </div>

        {(maxIndex < filteredProducts.length) &&
          <div onClick={() => setMaxIndex(prev => prev + 10)} className="category-loadmore">
            Xem thêm {filteredProducts.length - maxIndex} sản phẩm
          </div>
        }
      </div>
    </div>
  )
}
 
export default Category;
