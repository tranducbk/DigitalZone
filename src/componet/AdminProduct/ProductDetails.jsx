import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Image,
  Radio,
  Rate,
  Row,
  Typography,
  Descriptions, // Sử dụng Descriptions để hiển thị thông tin
  Tag,          // Sử dụng Tag cho một số thông tin
  Divider,      // Sử dụng Divider để phân tách
  Spin,         // Thêm Spin khi tải
  Space,        // Sử dụng Space cho các nút
  Tooltip,      // Thêm Tooltip
} from "antd";
import { EditOutlined, InfoCircleOutlined, BarcodeOutlined, AppstoreOutlined, TagOutlined, ShoppingCartOutlined, PercentageOutlined, DollarCircleOutlined, StockOutlined, UnorderedListOutlined, ProfileOutlined, EyeOutlined } from "@ant-design/icons"; // Thêm nhiều icons hơn
import EditProduct from "./EditProduct"; // Giả sử component này tồn tại

const { Title, Text, Paragraph } = Typography;

// Giữ lại hàm formatPrice
const formatPrice = (price) => {
  if (typeof price !== 'number') return "N/A";
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Giữ lại hàm getSoLuong
const getSoLuongTong = (products) => { // Đổi tên để tránh nhầm lẫn
  return products.variants?.reduce(
    (total, variant) => total + (variant.quantity || 0), 0) || 0;
};

const ProductDetails = ({ product, closeModal, onEditClick }) => { // Đổi tên props cho rõ ràng
  // Sử dụng `product` thay vì `products` cho một sản phẩm đơn lẻ

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    // Chọn variant đầu tiên làm mặc định khi component mount hoặc product thay đổi
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);


  if (!product) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Spin tip="Đang tải chi tiết sản phẩm..." size="large" />
      </div>
    );
  }

  const { name, rating, _id, category, brand, description, specifications, price: basePrice, variants } = product;

  const variantOptions = variants?.map((variant) => ({
    label: variant.color,
    value: variant._id, // Sử dụng _id của variant làm value
    image: variant.image,
    sale: variant.sale || 0,
    quantity: variant.quantity || 0,
  })) || [];

  const handleVariantChange = (e) => {
    const newSelectedVariant = variantOptions.find(option => option.value === e.target.value);
    if (newSelectedVariant) {
      setSelectedVariant(newSelectedVariant);
      setLoadingImage(true); // Set loading khi đổi ảnh
    }
  };
  
  // Tính toán giá sau khi giảm
  const currentPrice = selectedVariant ? basePrice * (1 - (selectedVariant.sale / 100)) : basePrice;

  // Logic hiển thị tổng số đánh giá (cần dữ liệu đầy đủ từ product)
  const totalReviews = (product.star1 || 0) + (product.star2 || 0) + (product.star3 || 0) + (product.star4 || 0) + (product.star5 || 0);

  const openEditModal = () => {
    if (typeof onEditClick === 'function') {
      onEditClick(product);
    } else {
      console.error("onEditClick không được truyền từ AdminProduct.");
    }
  };


  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Row gutter={[32, 24]}> {/* Tăng gutter cho khoảng cách */}
        {/* Cột Ảnh Sản Phẩm */}
        <Col xs={24} md={10}>
          {selectedVariant && (
            <Image
              src={selectedVariant.image}
              alt={name}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
              }}
              preview={{
                mask: <EyeOutlined style={{ fontSize: 24 }} />,
              }}
              onLoad={() => setLoadingImage(false)}
            />
          )}
           {loadingImage && selectedVariant && <div style={{height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spin /></div>}
          {variantOptions.length > 1 && (
            <Radio.Group
              onChange={handleVariantChange}
              value={selectedVariant?.value}
              style={{ marginTop: "16px", display: 'flex', flexWrap: 'wrap', gap: '8px' }}
              optionType="button"
              buttonStyle="solid"
            >
              {variantOptions.map((option) => (
                <Tooltip key={option.value} title={option.label}>
                    <Radio.Button
                    value={option.value}
                    style={{
                        // backgroundColor: option.label.toLowerCase(), // Cẩn thận với tên màu CSS
                        // minWidth: '40px', // Đảm bảo nút có độ rộng tối thiểu
                        // height: '40px',
                        // display: 'flex',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // padding: '0 8px',
                        // borderColor: option.label.toLowerCase(),
                        // Dùng ảnh thumbnail nhỏ nếu có
                    }}
                    >
                    {option.label}
                    {/* Hoặc hiển thị ảnh nhỏ của variant nếu có */}
                    {/* <Image src={option.image} width={20} height={20} preview={false}/> */}
                    </Radio.Button>
                </Tooltip>
              ))}
            </Radio.Group>
          )}
        </Col>

        {/* Cột Thông Tin Chi Tiết */}
        <Col xs={24} md={14}>
          <Title level={3} style={{ marginBottom: "8px" }}>{name}</Title>
          
          <Space align="center" style={{ marginBottom: "16px" }}>
            {rating && (
              <>
                <Text strong style={{ color: "#faad14", fontSize: "16px" }}>{rating.toFixed(1)}</Text>
                <Rate allowHalf value={rating} disabled style={{ fontSize: 16, color: "#faad14" }} />
                <Divider type="vertical" />
              </>
            )}
            {totalReviews > 0 && (
                <Text type="secondary">{totalReviews} Đánh giá</Text>
            )}
            {/* <Divider type="vertical" /> */}
            {/* <Text type="secondary">Đã bán: {product.soldCount || 0}</Text> */}
          </Space>

          {selectedVariant && (
             <div style={{ backgroundColor: "#fafafa", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                <Row align="middle" gutter={16}>
                    <Col>
                        <Text delete type="secondary" style={{ fontSize: "16px" }}>
                            {formatPrice(basePrice)}
                        </Text>
                    </Col>
                    <Col>
                        <Text strong style={{ color: "#d0011b", fontSize: "24px" }}>
                            {formatPrice(currentPrice)}
                        </Text>
                    </Col>
                    {selectedVariant.sale > 0 && (
                    <Col>
                        <Tag color="volcano" style={{ fontSize: "14px", padding: "4px 8px" }}>
                        GIẢM {selectedVariant.sale}%
                        </Tag>
                    </Col>
                    )}
                </Row>
                <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                    Số lượng tồn kho (màu {selectedVariant.label}): <Text strong>{selectedVariant.quantity}</Text>
                </Text>
            </div>
          )}


          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label={<><BarcodeOutlined /> Mã SP</>} span={1}>
              <Text copyable>{_id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<><AppstoreOutlined /> Loại</>} span={1}><Tag color="blue">{category}</Tag></Descriptions.Item>
            <Descriptions.Item label={<><TagOutlined /> Thương hiệu</>} span={1}><Tag color="cyan">{brand?.name || "N/A"}</Tag></Descriptions.Item>
            <Descriptions.Item label={<><ShoppingCartOutlined /> Tổng SL tồn</>} span={1}>{getSoLuongTong(product)}</Descriptions.Item>
          </Descriptions>
          
          <Divider />

          {description && description.length > 0 && (
            <>
              <Title level={5} style={{ marginTop: "16px" }}><InfoCircleOutlined /> Mô tả sản phẩm</Title>
              <Paragraph style={{ paddingLeft: "10px", whiteSpace: "pre-line", maxHeight: 200, overflowY: 'auto' }}>
                {typeof description === 'string' ? description : description.join("\n")}
              </Paragraph>
            </>
          )}

          {specifications && specifications.length > 0 && (
            <>
              <Title level={5} style={{ marginTop: "16px" }}><ProfileOutlined /> Thông số kỹ thuật</Title>
              <Paragraph style={{ paddingLeft: "10px", whiteSpace: "pre-line", maxHeight: 200, overflowY: 'auto' }}>
                {typeof specifications === 'string' ? specifications : specifications.join("\n")}
              </Paragraph>
            </>
          )}
        </Col>
      </Row>

      <Divider />

      <Row justify="end" style={{ marginTop: "24px" }}>
        <Space>
            <Button onClick={closeModal}>Đóng</Button>
            <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={openEditModal}
            >
            Chỉnh sửa sản phẩm
            </Button>
        </Space>
      </Row>
    </div>
  );
};

export default ProductDetails;