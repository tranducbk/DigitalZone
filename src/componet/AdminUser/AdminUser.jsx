import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Space, Table, message, Input, Typography, Tooltip, Tag, Avatar as AntAvatar, Form } from "antd"; // Thêm Typography, Tooltip, Tag, AntAvatar, Form
import {
  DeleteFilled,
  EditOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
  UserOutlined, // Icon cho tiêu đề và Avatar
  SyncOutlined, // Icon cho nút refresh
  EnvironmentOutlined, // Icon cho địa chỉ
  PhoneOutlined // Icon cho số điện thoại
} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import apiService from "../../api/api";
import styles from "./AdminUser.module.css"; // Import CSS Module
import SelectedAddress from "../../components/CustomSelected/selectedAddress";
import addressData from './address-data.json'

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const AdminUser = () => {
  const [users, setUsers] = useState([]); // Khởi tạo là mảng rỗng
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State để trigger refresh
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingAddress, setEditingAddress] = useState({ city: '', district: '', ward: '' });
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(() => {
    return Number(localStorage.getItem('adminUserPageSize')) || 10;
  });

  const defaultAddress = { city: 'Tỉnh/Thành phố', district: 'Quận/huyện', ward: 'Phường/xã' };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Không cần lấy token ở đây nếu apiService đã cấu hình interceptor
        const response = await apiService.getAllUsers();
        const usersData = response.data.users || []; // Đảm bảo là mảng

        const updatedUsers = usersData.map((user, index) => {
          let formattedAddress = 'Chưa cập nhật';
          if (user.diaChi && user.diaChi.ward && user.diaChi.district && user.diaChi.city &&
              user.diaChi.ward !== "Phường/xã" && user.diaChi.district !== "Quận/huyện" && user.diaChi.city !== "Tỉnh/Thành phố") {
             formattedAddress = `${user.diaChi.ward}, ${user.diaChi.district}, ${user.diaChi.city}`;
          }
          
          return {
            ...user,
            key: user._id, // Thêm key cho Table
            stt: index + 1,
            diaChiFormatted: formattedAddress, // Tạo trường mới đã format
          };
        });
        setUsers(updatedUsers);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        message.error('Không thể lấy dữ liệu người dùng.');
        setUsers([]); // Set về mảng rỗng nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]); // Refresh khi key thay đổi

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters && clearFilters();
    confirm();
    setSearchText('');
    setSearchedColumn('');
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div className={styles.filterDropdown} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${title.toLowerCase()}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button onClick={() => handleReset(clearFilters, confirm, dataIndex)} size="small">
            Reset
          </Button>
          <Button type="link" size="small" onClick={close}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleDeleteUser = async (userId, userName) => {
    try {
      setLoading(true); // Hiển thị loading khi xóa
      await apiService.deleteUser(userId);
      message.success(`Đã xóa người dùng: ${userName} (ID: ${userId})`);
      handleRefresh(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      message.error(`Xóa người dùng "${userName}" thất bại.`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (user) => {
    confirm({
      title: `Bạn có chắc muốn xóa người dùng "${user.userName}"?`,
      icon: <ExclamationCircleFilled />,
      content: <Text>Hành động này không thể hoàn tác. ID: <Text code>{user._id}</Text></Text>,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk() {
        handleDeleteUser(user._id, user.userName);
      },
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      diaChi: user.diaChi
    });
    const diaChi = user.diaChi || defaultAddress;
    setEditingAddress({
      city: diaChi.city || defaultAddress.city,
      district: diaChi.district || defaultAddress.district,
      ward: diaChi.ward || defaultAddress.ward
    });
    setIsModalVisible(true);
  };

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);
      const submitData = { ...values, diaChi: editingAddress };
      await apiService.updateUser(editingUser._id, submitData);
      message.success('Cập nhật thông tin người dùng thành công');
      setIsModalVisible(false);
      handleRefresh();
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      message.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPageSize(pagination.pageSize);
    localStorage.setItem('adminUserPageSize', pagination.pageSize);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      align: 'center',
    },
    {
      title: "Avatar",
      dataIndex: "avatar", // Giả sử user có trường avatar là URL ảnh
      key: "avatar",
      width: 80,
      align: 'center',
      render: (avatarUrl, record) => (
        <AntAvatar src={avatarUrl} icon={<UserOutlined />} size="large">
           {/* Fallback nếu không có avatarUrl */}
           {!avatarUrl ? record.userName?.charAt(0).toUpperCase() : null}
        </AntAvatar>
      )
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      ...getColumnSearchProps('userName', 'Tên Người Dùng'),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      ...getColumnSearchProps('email', 'Email'),
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
      ...getColumnSearchProps('phoneNumber', 'Số Điện Thoại'),
       render: (text) => text ? <Space><PhoneOutlined /> {text}</Space> : <Text type="secondary">N/A</Text>
    },
    {
      title: "Địa Chỉ",
      dataIndex: "diaChiFormatted", // Sử dụng trường đã format
      key: "diaChiFormatted",
      ellipsis: true, // Cho phép cắt bớt nếu quá dài
      width: '30%',
      ...getColumnSearchProps('diaChiFormatted', 'Địa Chỉ'), // Tìm kiếm trên địa chỉ đã format
      render: (text) => text !== 'Chưa cập nhật' 
            ? <Space><EnvironmentOutlined /> {text}</Space> 
            : <Tag>Chưa cập nhật</Tag>
    },
    // { // Ví dụ thêm cột trạng thái (nếu có)
    //   title: "Trạng thái",
    //   dataIndex: "status", // Giả sử có trường status: 'active', 'inactive'
    //   key: "status",
    //   width: 120,
    //   align: 'center',
    //   filters: [
    //     { text: 'Active', value: 'active' },
    //     { text: 'Inactive', value: 'inactive' },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    //   render: (status) => (
    //     <Tag color={status === 'active' ? 'green' : 'red'}>
    //       {status ? status.toUpperCase() : 'N/A'}
    //     </Tag>
    //   ),
    // },
    {
      title: "Hành Động",
      key: "actions",
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1890ff' }} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa người dùng">
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
  
  // Sử dụng class từ CSS module nếu có, nếu không dùng style inline cơ bản
  const containerClass = styles && styles.adminUserContainer ? styles.adminUserContainer : '';
  const headerActionsClass = styles && styles.headerActions ? styles.headerActions : '';
  const pageTitleClass = styles && styles.pageTitle ? styles.pageTitle : '';
  const pageTitleIconClass = styles && styles.pageTitleIcon ? styles.pageTitleIcon : '';
  const userTableClass = styles && styles.userTable ? styles.userTable : '';

  return (
    <div className={containerClass} style={!containerClass ? { padding: 20, backgroundColor: '#fff', borderRadius: 8 } : {}}>
      <div className={headerActionsClass} style={!headerActionsClass ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 } : {}}>
        <Title level={4} className={pageTitleClass} style={!pageTitleClass ? { margin: 0, display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 600 } : {}}>
            <UserOutlined className={pageTitleIconClass} style={!pageTitleIconClass ? { marginRight: 10, color: '#1890ff', fontSize: 24 } : {}}/>
            Quản Lý Người Dùng
        </Title>
        <Space>
          <Tooltip title="Làm mới danh sách">
            <Button icon={<SyncOutlined />} onClick={handleRefresh} loading={loading}>
              Làm mới
            </Button>
          </Tooltip>
          {/* Có thể thêm nút "Thêm người dùng" ở đây nếu cần */}
          {/* <Button type="primary" icon={<UserAddOutlined />}>Thêm người dùng</Button> */}
        </Space>
      </div>

      <div className={userTableClass}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="key"
          loading={loading}
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: ['5', '10', '20', '50'],
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
            style: { marginTop: "20px", textAlign: 'right' },
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
          sticky
        />
      </div>

      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        className={styles.editUserModal}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateUser}
          initialValues={editingUser}
        >
          <Form.Item
            name="userName"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input 
              disabled={editingUser?.email?.includes('@gmail.com') || editingUser?.email?.includes('@google.com')}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            required
          >
            <div className="admin-user-address-block">
              <SelectedAddress
                address={editingAddress}
                setAddress={setEditingAddress}
                addressData={addressData}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default AdminUser;