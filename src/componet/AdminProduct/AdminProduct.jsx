import React, { useEffect, useRef, useState } from "react";
// Import các component cần thiết từ Ant Design
import { 
    Button, Modal, Space, Table, message, Input, 
    Typography, Tooltip, Tag, Avatar as AntAvatar, Image 
} from "antd"; 
// Import các icon cần thiết
import {
  PlusCircleFilled, 
  DeleteFilled,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
  EyeOutlined, 
  SyncOutlined,
  FilterOutlined, 
  AppstoreAddOutlined 
} from "@ant-design/icons";
// Import thư viện highlight text
import Highlighter from 'react-highlight-words';
// Import các component con (Modal Content)
import AddProduct from "./AddProduct";
import ProductDetails from "./ProductDetails";
import EditProduct from "./EditProduct";
// Import service gọi API
import apiService from "../../api/api";
// Import CSS Module (Yêu cầu có file AdminProduct.module.css)
import styles from "./AdminProduct.module.css"; 

// Destructure component từ Typography và Modal
const { Title, Text } = Typography;
const { confirm } = Modal;

// Component chính AdminProduct
const AdminProduct = () => {
  // State quản lý
  const [refreshKey, setRefreshKey] = useState(0); // Key để trigger refresh
  const [products, setProducts] = useState([]);   // Danh sách sản phẩm
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [modalContent, setModalContent] = useState(null); // Nội dung component trong modal
  const [modalTitle, setModalTitle] = useState(""); // Tiêu đề modal
  const [modalWidth, setModalWidth] = useState("60vw"); // Độ rộng modal
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng và nút

  const [pageSize, setPageSize] = useState(() => {
    // Lấy từ localStorage nếu có, không thì mặc định 20
    return Number(localStorage.getItem('adminProductPageSize')) || 20;
  });

  // useEffect để fetch dữ liệu khi component mount hoặc refreshKey thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getAllProducts();
        console.log("API Response Products:", response.data.products); // DEBUG: Kiểm tra dữ liệu
        const rawData = response.data.products || [];
        if (Array.isArray(rawData)) {
          // Lọc bỏ phần tử rỗng, undefined hoặc không có _id
          const validProducts = rawData.filter(p => p && p._id);
          setProducts(validProducts.map(p => ({ ...p, key: p._id })));
        } else {
          console.error("Dữ liệu sản phẩm không phải mảng:", rawData);
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        message.error('Không thể lấy dữ liệu sản phẩm.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]); // Phụ thuộc vào refreshKey

  // Hàm trigger refresh
  const handleRefresh = (showSuccess = false) => { 
    setRefreshKey(prevKey => prevKey + 1);
    if (showSuccess) {
        // message.success("Dữ liệu đã được làm mới!");
    }
  };

  // State và ref cho chức năng tìm kiếm trong bảng
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  // Hàm xử lý tìm kiếm
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || ''); 
    setSearchedColumn(dataIndex);
  };

  // Hàm xử lý reset bộ lọc tìm kiếm
  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters && clearFilters();
    confirm();
    setSearchText('');
    setSearchedColumn(''); 
  };

  // Hàm tạo cấu hình tìm kiếm cho một cột
  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${title.toLowerCase()}`}
          value={selectedKeys ? selectedKeys[0] : ''} 
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small" style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button onClick={() => handleReset(clearFilters, confirm, dataIndex)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={close}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
        const recordValue = record[dataIndex];
        const textToFilter = typeof recordValue === 'object' && recordValue !== null 
                             ? recordValue.name 
                             : recordValue;
        return textToFilter ? textToFilter.toString().toLowerCase().includes((value || '').toLowerCase()) : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
        const textToRender = typeof text === 'object' && text !== null ? text.name : text;
        return searchedColumn === dataIndex ? (
            <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={textToRender ? textToRender.toString() : ''}
            />
        ) : (
            textToRender 
        );
    },
  });

  // Hàm xử lý xóa sản phẩm
  const handleDeleteProduct = async (productId, productName) => {
    try {
      setLoading(true);
      await apiService.deleteProduct(productId);
      message.success(`Đã xóa sản phẩm: ${productName}`);
      handleRefresh(false); 
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      message.error(`Xóa sản phẩm "${productName}" thất bại.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm hiển thị modal xác nhận xóa
  const showDeleteConfirm = (product) => {
    confirm({
      title: `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: <Text>Hành động này sẽ xóa vĩnh viễn sản phẩm <Text strong>{product.name}</Text> (Mã: {product._id}).</Text>,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        handleDeleteProduct(product._id, product.name);
      },
    });
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent(null); 
    setModalTitle("");
    setModalWidth("60vw"); 
  };

  // Hàm mở modal chỉnh sửa
  const handleOpenEditModal = (productToEdit) => {
      setModalTitle(`Chỉnh Sửa Sản Phẩm`); 
      setModalWidth("70vw"); 
      setModalContent(
        <EditProduct
          product={productToEdit}
          closeModal={closeModal}
          onProductUpdated={() => { 
            closeModal();
            handleRefresh(); 
            message.success("Sản phẩm đã được cập nhật!");
          }}
        />
      );
      setIsModalVisible(true);
  };

  // Hàm mở modal thêm sản phẩm
  const openAddProductModal = () => {
    setModalTitle("Thêm Sản Phẩm Mới");
    setModalWidth("70vw"); 
    setModalContent(
      <AddProduct
        closeModal={closeModal}
        onProductAdded={() => { 
          closeModal();
          handleRefresh(); 
          message.success("Sản phẩm mới đã được thêm!");
        }}
      />
    );
    setIsModalVisible(true);
  };

  // Hàm mở modal xem chi tiết sản phẩm
  const openProductDetailsModal = (product) => {
    setModalTitle(`Chi Tiết Sản Phẩm`);
    setModalWidth("80vw"); 
    setModalContent(
      <ProductDetails
        product={product}
        closeModal={closeModal}
        onEditClick={(productToEdit) => { 
          closeModal(); 
          setTimeout(() => handleOpenEditModal(productToEdit), 100);
        }}
      />
    );
    setIsModalVisible(true);
  };
  
  // Hàm tính tổng số lượng tồn kho
  const getSoLuong = (record) => {
    if (record && Array.isArray(record.variants)) {
      return record.variants.reduce((acc, variant) => acc + (variant.quantity || 0), 0);
    }
    return 0;
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return "N/A";
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  const handleTableChange = (pagination) => {
    setPageSize(pagination.pageSize);
    localStorage.setItem('adminProductPageSize', pagination.pageSize);
  };

  // Định nghĩa các cột cho bảng Ant Design
  const columns = [
    {
      title: "SP",
      dataIndex: "variants",
      key: "variantsImage",
      width: 80,
      align: 'center',
      render: (variants, record) => { 
          const imageUrl = variants && variants.length > 0 ? variants[0].image : undefined;
            return (
            <Image
                src={imageUrl}
                alt={record.name}
                width={48}
                height={48}
                style={{ cursor: 'pointer', objectFit: 'cover', border: '1px solid #f0f0f0', borderRadius: '4px' }}
                onClick={(e) => { e.stopPropagation(); openProductDetailsModal(record); }}
                preview={false}
                fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            />
            );
        }
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', 'Tên Sản Phẩm'),
      render: (text, record) => (
        <a onClick={(e) => { e.stopPropagation(); openProductDetailsModal(record); }}>{text}</a>
      )
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.category.localeCompare(b.category),
      ...getColumnSearchProps('category', 'Loại'),
      filters: [...new Set(products.map(p => p.category).filter(Boolean))].sort().map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category?.indexOf(value) === 0,
      render: (category) => category ? <Tag color="blue">{category}</Tag> : null
    },
    { 
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      width: 120, 
      align: 'center',
      sorter: (a, b) => (a.brand?.name || '').localeCompare(b.brand?.name || ''),
      filters: [...new Set(products.map(p => p.brand?.name).filter(Boolean))].sort().map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record.brand?.name === value,
      render: (brand) => { 
          if (brand?.image) {
            return (
                <Tooltip title={brand.name}>
                <Image
                    src={brand.image}
                    alt={brand.name || 'brand'}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                    preview={false}
                    fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                />
                </Tooltip>
            );
            } else if (brand?.name) {
                return <Text type="secondary" style={{fontSize: '0.9em'}}>{brand.name}</Text>
            }
            return <Tag>N/A</Tag>; 
        },
       ...getColumnSearchProps('brand', 'Thương hiệu'), 
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      width: 130,
      align: 'right',
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "SL Tồn",
      key: "soLuong",
      width: 100,
      align: 'center',
      render: (_, record) => getSoLuong(record),
      sorter: (a, b) => getSoLuong(a) - getSoLuong(b),
    },
    {
      title: "Đ.Giá",
      dataIndex: "rating",
      key: "rating",
      width: 90,
      align: 'center',
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
      render: (rating) => rating ? <Tag color="gold">{`${rating.toFixed(1)} ★`}</Tag> : <Tag>N/A</Tag>
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
           <Tooltip title="Sửa sản phẩm">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1890ff' }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditModal(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="text"
              danger
              icon={<DeleteFilled />}
              onClick={(e) => {
                e.stopPropagation();
                showDeleteConfirm(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Lấy className từ CSS Module hoặc trả về chuỗi rỗng
  const containerClass = styles?.adminProductContainer || '';
  const headerActionsClass = styles?.headerActions || '';
  const pageTitleClass = styles?.pageTitle || '';
  const addProductButtonClass = styles?.addProductButton || '';
  const productTableClass = styles?.productTable || '';
  const productModalClass = styles?.productModal || '';

  return (
    <div className={containerClass} style={!containerClass ? { padding: 20, backgroundColor: '#fff', borderRadius: 8 } : {}}>
      {/* Header với Tiêu đề và các nút */}
      <div className={headerActionsClass} style={!headerActionsClass ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } : {}}>
        <Title level={4} className={pageTitleClass} style={!pageTitleClass ? { margin: 0, fontSize: 22, fontWeight: 600 } : {}}>Quản Lý Sản Phẩm</Title>
        <Space>
            <Tooltip title="Làm mới danh sách">
                <Button icon={<SyncOutlined />} onClick={() => handleRefresh()} loading={loading}>
                Làm mới
                </Button>
            </Tooltip>
            <Button type="primary" icon={<AppstoreAddOutlined />} onClick={openAddProductModal} className={addProductButtonClass}>
            Thêm sản phẩm
            </Button>
        </Space>
      </div>

      {/* Modal chung */}
      <Modal
        title={<Title level={5} style={{margin:0, padding: '10px 0'}}>{modalTitle}</Title>}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={modalWidth}
        destroyOnClose
        maskClosable={false}
        className={productModalClass}
        centered
        bodyStyle={{padding: '20px 24px'}}
      >
        {modalContent}
      </Modal>

      {/* Container cho bảng */}
      <div className={productTableClass}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="key"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
            pageSize: pageSize,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => openProductDetailsModal(record),
          })}
          size="middle"
        />
      </div>
    </div>
  );
};

export default AdminProduct;