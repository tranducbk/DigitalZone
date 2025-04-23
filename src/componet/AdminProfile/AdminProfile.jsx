import React, { useEffect, useState } from "react";
import SelectedAddress from "../../components/CustomSelected/selectedAddress";
import addressData from "../../pages/RegisterAccount/address-data.json"
import { Button, Modal, Input, message, Spin, Card } from "antd";
import apiService from "../../api/api";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [updatedAdmin, setUpdatedAdmin] = useState({
          userName: '',
          email: '',
          phoneNumber: '',
          diaChi: {
              city: '',
              district: '',
              ward: '',
          }
      });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          message.error("Bạn cần phải đăng nhập!");
          return;
        }

        const response = await apiService.getAdminProfile()
        console.log("response when call api getAdminProfile: ", response.data)
        setAdmin(response.data.admin);
        setUpdatedAdmin({
          userName: response.data.admin.userName,
          phoneNumber: response.data.admin.phoneNumber,
          email: response.data.admin.email,
          diaChi: response.data.admin.diaChi,
        }); // Để sử dụng cho form cập nhật
      } catch (error) {
        console.error(error);
        message.error("Không thể lấy thông tin admin");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateAdmin = async () => {  
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        message.error("Bạn cần phải đăng nhập!");
        return;
      }
      
      
      console.log("updatedAdmin before req: ", updatedAdmin);
      await apiService.updateAdminProfile( updatedAdmin )

      // console.log(response.data)
      setAdmin((prev) => ({
        ...prev,
        ...updatedAdmin,
      }));// Cập nhật admin mới
      message.success("Cập nhật thông tin thành công!");
      setIsUpdateModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      message.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        message.error("Bạn cần phải đăng nhập!");
        return;
      }

      const response = await apiService.changeAdminPassword(passwords)

      message.success(response.data.message || "Đổi mật khẩu thành công!");
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handleCancelUpdate = () => {
    setIsUpdateModalVisible(false);
    setUpdatedAdmin(admin); // Reset dữ liệu nếu hủy
  };

  const handleCancelPassword = () => {
    setIsPasswordModalVisible(false);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChange = (field, value) => {
    setUpdatedAdmin((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ width: "100%", height:'100%' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Card
          title={
            <div style={{ fontWeight: "bold", fontSize: "24px" }}>
              {`Welcome Admin`}
            </div>
          }
          extra={
            <>
              <Button onClick={showUpdateModal} style={{ marginRight: "10px"}}>
                Cập nhật thông tin
              </Button> 
              <Button onClick={showPasswordModal}>Đổi mật khẩu</Button>
            </>
          }
          style={{ width: '70%', margin: "auto", height:'auto' }}
        >
          <p><strong>Tên:</strong> {admin?.userName || "Chưa có thông tin"}</p>
          <p><strong>Số điện thoại:</strong> {admin?.phoneNumber || "Chưa có thông tin"}</p>
          <p>
            <strong>Địa chỉ: </strong>
            { `${updatedAdmin.diaChi.ward}, ${updatedAdmin.diaChi.district}, ${updatedAdmin.diaChi.city}` }
          </p>
        </Card>
      )}

      {/* Modal Cập nhật thông tin */}
      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
            Cập nhật thông tin
          </div>
        }
        visible={isUpdateModalVisible}
        onOk={handleUpdateAdmin}
        onCancel={handleCancelUpdate}
        confirmLoading={loading}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Tên: </label>
          <Input
            value={updatedAdmin.userName || ""}
            onChange={(e) => handleChange("userName", e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Số điện thoại: </label>
          <Input
            value={updatedAdmin.phoneNumber || ""}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
        <SelectedAddress
          address={updatedAdmin.diaChi} // Truyền giá trị hiện tại của diaChi
          setAddress={(newAddress) =>
            setUpdatedAdmin((prev) => ({
              ...prev,
              diaChi: newAddress,
            }))
          }
          addressData={addressData}
        />
        </div>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
            Đổi mật khẩu
          </div>
        }
        className="change-password-modal"
        visible={isPasswordModalVisible}
        onOk={handlePasswordChange}
        onCancel={handleCancelPassword}
        confirmLoading={loading}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Mật khẩu hiện tại: </label>
          <Input.Password
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Mật khẩu mới: </label>
          <Input.Password
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Xác nhận mật khẩu mới: </label>
          <Input.Password
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminProfile;
