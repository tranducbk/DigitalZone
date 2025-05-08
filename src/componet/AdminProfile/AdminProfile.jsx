import React, { useEffect, useState } from "react";
import {
  Button, Modal, Input, message, Spin, Card, Form, Descriptions, // Thêm Form, Descriptions
  Space, Typography // Thêm Space, Typography
} from "antd";
import {
  UserOutlined, PhoneOutlined, HomeOutlined, EditOutlined, KeyOutlined, MailOutlined,
  SolutionOutlined, // Icon cho thông tin cá nhân
  LockOutlined, // Icon cho mật khẩu
  SaveOutlined // Icon cho nút lưu
} from "@ant-design/icons";
import SelectedAddress from "../../components/CustomSelected/selectedAddress"; // Đảm bảo đường dẫn đúng
import addressData from "../../pages/RegisterAccount/address-data.json"; // Đảm bảo đường dẫn đúng
import apiService from "../../api/api"; // Đảm bảo đường dẫn đúng
import "./AdminProfile.css"; // Import CSS

const { Title, Text } = Typography;

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const [updateForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Giữ lại state `updatedAdminData` để dễ dàng quản lý giá trị địa chỉ từ SelectedAddress
  const [updatedAdminData, setUpdatedAdminData] = useState({
    userName: '', email: '', phoneNumber: '',
    diaChi: { city: '', district: '', ward: '' }
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Token nên được quản lý bởi apiService hoặc interceptor
        const response = await apiService.getAdminProfile();
        if (response.data && response.data.admin) {
          const adminData = response.data.admin;
          setAdmin(adminData);
          // Set giá trị ban đầu cho form và state
          const initialData = {
            userName: adminData.userName || '',
            email: adminData.email || '',
            phoneNumber: adminData.phoneNumber || '',
            diaChi: adminData.diaChi || { city: '', district: '', ward: '' },
          };
          setUpdatedAdminData(initialData);
          updateForm.setFieldsValue(initialData);
        } else {
          message.error("Không tìm thấy dữ liệu Admin.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin Admin:", error);
        message.error(error.response?.data?.message || "Không thể lấy thông tin Admin.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [updateForm]);

  const showUpdateModal = () => {
    if (admin) { // Đảm bảo admin có dữ liệu trước khi set form
      const currentData = {
        userName: admin.userName || '',
        email: admin.email || '',
        phoneNumber: admin.phoneNumber || '',
        diaChi: admin.diaChi || { city: '', district: '', ward: '' },
      };
      setUpdatedAdminData(currentData); // Cập nhật state cho SelectedAddress
      updateForm.setFieldsValue(currentData); // Set giá trị cho Antd Form
    }
    setIsUpdateModalVisible(true);
  };

  const showPasswordModal = () => {
    passwordForm.resetFields();
    setIsPasswordModalVisible(true);
  };

  const handleCancelUpdate = () => setIsUpdateModalVisible(false);
  const handleCancelPassword = () => setIsPasswordModalVisible(false);

  const handleUpdateAdmin = async () => {
    try {
      const values = await updateForm.validateFields(); // Lấy giá trị đã validate từ form
      setLoading(true);
      
      // Kết hợp giá trị từ form và diaChi từ state (vì SelectedAddress cập nhật state riêng)
      const dataToSubmit = {
        ...values,
        diaChi: updatedAdminData.diaChi,
      };
      console.log("Dữ liệu gửi đi để cập nhật:", dataToSubmit);
      await apiService.updateAdminProfile(dataToSubmit);

      setAdmin(prev => ({ ...prev, ...dataToSubmit })); // Cập nhật state admin cục bộ
      message.success("Cập nhật thông tin thành công!");
      setIsUpdateModalVisible(false);
    } catch (errorInfo) {
      if (errorInfo.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        console.error("Lỗi cập nhật thông tin:", errorInfo);
        message.error(errorInfo.response?.data?.message || "Cập nhật thông tin thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);
      // API thường chỉ cần currentPassword và newPassword
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const response = await apiService.changeAdminPassword(payload);
      message.success(response.data.message || "Đổi mật khẩu thành công!");
      setIsPasswordModalVisible(false);
    } catch (errorInfo) {
      if (errorInfo.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        console.error("Lỗi đổi mật khẩu:", errorInfo);
        message.error(errorInfo.response?.data?.message || "Đổi mật khẩu thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !admin) {
    return (
      <div className="fullPageSpin">
        <Spin size="large" tip="Đang tải dữ liệu Admin..." />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="adminProfileContainer" style={{ textAlign: 'center', alignItems: 'center' }}>
        <Title level={3} type="secondary">Không có thông tin Admin để hiển thị.</Title>
        <Text type="secondary">Vui lòng thử lại hoặc liên hệ hỗ trợ.</Text>
      </div>
    );
  }

  const displayAddress = admin.diaChi && (admin.diaChi.ward || admin.diaChi.district || admin.diaChi.city)
    ? `${admin.diaChi.ward || ''}${admin.diaChi.ward && admin.diaChi.district ? ', ' : ''}${admin.diaChi.district || ''}${ (admin.diaChi.district || admin.diaChi.ward) && admin.diaChi.city ? ', ' : ''}${admin.diaChi.city || ''}`.trim().replace(/^,|,$/g, '') // Xóa dấu phẩy thừa
    : "Chưa cập nhật";


  return (
    <div className="adminProfileContainer">
      <div className="profileCardWrapper">
        <Card
          title={
            <div className="cardTitle">
              <SolutionOutlined className="cardTitleIcon" /> Thông tin Tài khoản Admin
            </div>
          }
          extra={
            <Space className="cardExtraButtons">
              <Button icon={<EditOutlined />} onClick={showUpdateModal} type="primary">
                Sửa thông tin
              </Button>
              <Button icon={<LockOutlined />} onClick={showPasswordModal} type="default" danger>
                Đổi mật khẩu
              </Button>
            </Space>
          }
          className="profileCard"
          bordered={false} // Bỏ viền Card cho nhẹ nhàng hơn
          loading={loading && !!admin} // Spin trên Card khi đang thực hiện action
        >
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label={<><UserOutlined /> Tên Admin</>}>
              <Text strong>{admin.userName || "N/A"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {admin.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
              {admin.phoneNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label={<><HomeOutlined /> Địa chỉ</>}>
              {displayAddress}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Modal Cập nhật thông tin */}
      <Modal
        title={
          <div className="modalTitle">
            <EditOutlined className="modalTitleIcon" /> Cập nhật thông tin
          </div>
        }
        visible={isUpdateModalVisible}
        onOk={handleUpdateAdmin}
        onCancel={handleCancelUpdate}
        confirmLoading={loading && isUpdateModalVisible} // Chỉ loading khi modal này active
        destroyOnClose
        okText={<><SaveOutlined /> Lưu thay đổi</>}
        cancelText="Hủy bỏ"
        width={600}
        maskClosable={false}
      >
        <Form form={updateForm} layout="vertical" initialValues={updatedAdminData}>
          <Form.Item
            name="userName" label="Tên Admin" className="formItem"
            rules={[{ required: true, message: "Tên Admin không được để trống!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên Admin" />
          </Form.Item>
          <Form.Item
            name="email" label="Email" className="formItem"
            rules={[
                { required: true, message: "Email không được để trống!" },
                { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập địa chỉ email" />
          </Form.Item>
          <Form.Item
            name="phoneNumber" label="Số điện thoại" className="formItem"
            rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Địa chỉ chi tiết" className="formItem">
            <div className="addressSelectorContainer">
              <SelectedAddress
                address={updatedAdminData.diaChi} // Giá trị từ state để SelectedAddress render
                setAddress={(newAddress) => {
                  // Cập nhật state `updatedAdminData` để re-render SelectedAddress
                  // và để có giá trị mới nhất khi submit
                  setUpdatedAdminData(prev => ({ ...prev, diaChi: newAddress }));
                  // Không cần thiết setFieldsValue cho 'diaChi' nếu nó không phải là một field của Antd Form
                }}
                addressData={addressData}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal
        title={
          <div className="modalTitle">
            <LockOutlined className="modalTitleIcon" /> Đổi mật khẩu
          </div>
        }
        visible={isPasswordModalVisible}
        onOk={handlePasswordChange}
        onCancel={handleCancelPassword}
        confirmLoading={loading && isPasswordModalVisible} // Chỉ loading khi modal này active
        destroyOnClose
        okText={<><SaveOutlined /> Đổi mật khẩu</>}
        cancelText="Hủy bỏ"
        maskClosable={false}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="currentPassword" label="Mật khẩu hiện tại" className="formItem"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            name="newPassword" label="Mật khẩu mới" className="formItem"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu mới cần ít nhất 6 ký tự." },
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu mới (ít nhất 6 ký tự)" />
          </Form.Item>
          <Form.Item
            name="confirmPassword" label="Xác nhận mật khẩu mới" className="formItem"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;