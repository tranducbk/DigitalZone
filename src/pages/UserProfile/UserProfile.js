import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Card, Descriptions, Space, Spin, message, Typography, Tag } from 'antd'; // Import components của Antd
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, EditOutlined, KeyOutlined, SaveOutlined, CloseOutlined, SolutionOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons'; // Import icons
import styles from './UserProfile.module.css'; // Import CSS Module
import apiService from '../../api/api';
import SelectedAddress from '../../components/CustomSelected/selectedAddress'; 
import addressData from '../RegisterAccount/address-data.json';

const { Title, Text } = Typography;

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [isConfirmingPassword, setIsConfirmingPassword] = useState(true); // Step 1: Confirm current pw
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [editForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    // State riêng cho địa chỉ trong form sửa, đồng bộ với SelectedAddress
    const [editAddress, setEditAddress] = useState({ city: '', district: '', ward: '' });

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoading(true);
            try {
                const response = await apiService.getUserProfile();
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    // Set giá trị ban đầu cho địa chỉ sửa
                    setEditAddress(response.data.user.diaChi || { city: '', district: '', ward: '' });
                } else {
                    message.error("Không thể tải thông tin người dùng.");
                }
            } catch (error) {
                console.error('Lỗi tải thông tin người dùng', error);
                message.error('Lỗi tải thông tin người dùng.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    // Mở modal sửa và set giá trị ban đầu cho form
    const showEditModal = () => {
        if (user) {
            editForm.setFieldsValue({
                userName: user.userName || '',
                phoneNumber: user.phoneNumber || '',
                email: user.email || '',
                // Không cần set diaChi ở đây vì quản lý bằng state editAddress
            });
            setEditAddress(user.diaChi || { city: '', district: '', ward: '' }); // Reset state địa chỉ
            setIsEditModalVisible(true);
        }
    };

    // Mở modal đổi mật khẩu
    const showPasswordModal = () => {
        setIsConfirmingPassword(true); // Bắt đầu ở bước xác nhận mk cũ
        setCurrentPassword('');        // Reset các trường
        passwordForm.resetFields(['newPassword', 'confirmNewPassword']); // Reset các field của Antd Form
        setConfirmError('');           // Reset lỗi
        setIsPasswordModalVisible(true);
    };

    // Đóng các modal
    const handleCancelEdit = () => setIsEditModalVisible(false);
    const handleCancelPassword = () => setIsPasswordModalVisible(false);

    // Xử lý xác nhận mật khẩu cũ
    const handleConfirmCurrentPassword = async () => {
        setConfirmError(''); // Clear lỗi cũ
        if (!currentPassword) {
            setConfirmError('Vui lòng nhập mật khẩu hiện tại.');
            return;
        }
        setPasswordLoading(true);
        try {
            const phoneNumber = user?.phoneNumber; // Lấy sđt từ state user
            if (!phoneNumber) throw new Error("Không tìm thấy số điện thoại người dùng.");

            // Gọi API login để xác thực (hoặc API check password riêng nếu có)
            await apiService.loginUser({ phoneNumber, password: currentPassword });
            setIsConfirmingPassword(false); // Chuyển sang bước nhập mật khẩu mới
        } catch (error) {
            console.error("Lỗi xác nhận mật khẩu:", error);
            setConfirmError(error.response?.data?.message || 'Mật khẩu hiện tại không đúng.');
        } finally {
            setPasswordLoading(false);
        }
    };

    // Xử lý submit form đổi mật khẩu mới
    const handlePasswordFormSubmit = async (values) => {
        setPasswordLoading(true);
        try {
            // API changePassword chỉ cần current và new
            await apiService.changePassword(currentPassword, values.newPassword);
            message.success('Đổi mật khẩu thành công!');
            handleCancelPassword(); // Đóng modal
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);
            message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setPasswordLoading(false);
        }
    };

    // Xử lý submit form cập nhật thông tin
    const handleUpdateFormSubmit = async (values) => {
        try {
            const dataToUpdate = {
                ...values, // Lấy userName, phoneNumber, email từ form values
                diaChi: editAddress, // Lấy địa chỉ từ state đã cập nhật
            };
            const response = await apiService.updateUserProfile(user._id, dataToUpdate);
            setUser(response.data.user); // Cập nhật state user với dữ liệu mới từ API
            message.success('Cập nhật thông tin thành công!');
            handleCancelEdit(); // Đóng modal
        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại.');
        }
    };

    // --- Render ---
    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" /></div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Text type="secondary">Không thể tải thông tin người dùng hoặc bạn chưa đăng nhập.</Text></div>;
    }
    
    const displayAddress = user.diaChi && (user.diaChi.ward || user.diaChi.district || user.diaChi.city) && user.diaChi.ward !== "Phường/xã"
    ? `${user.diaChi.ward || ''}${user.diaChi.ward && user.diaChi.district ? ', ' : ''}${user.diaChi.district || ''}${ (user.diaChi.district || user.diaChi.ward) && user.diaChi.city ? ', ' : ''}${user.diaChi.city || ''}`.trim().replace(/^,|,$/g, '')
    : <Tag>Chưa cập nhật</Tag>;


    return (
        <div className={styles.userProfileContainer}>
            <Card
                title={
                    <div className={styles.cardTitle}>
                       <SolutionOutlined className={styles.cardTitleIcon} /> Thông tin Tài khoản
                    </div>
                }
                extra={
                    <Space className={styles.cardExtraButtons}>
                        <Button icon={<EditOutlined />} onClick={showEditModal}>Sửa thông tin</Button>
                        {/* Chỉ hiện nút Đổi MK nếu user không phải login qua Google (không có email) */}
                        {!user.email?.endsWith('@google.com') && // Ví dụ kiểm tra đuôi email
                          <Button icon={<LockOutlined />} onClick={showPasswordModal} type="dashed">Đổi mật khẩu</Button>
                        }
                    </Space>
                }
                className={styles.profileCard}
                bordered={false}
            >
                <Descriptions bordered column={1} size="middle" className={styles.profileDescriptions}>
                    <Descriptions.Item label={<><UserOutlined /> Tên người dùng</>}>
                        <Text strong>{user.userName || <Tag>Chưa cập nhật</Tag>}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                        {user.email || <Tag>Chưa cập nhật</Tag>}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                        {user.phoneNumber || <Tag>Chưa cập nhật</Tag>}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><HomeOutlined /> Địa chỉ</>}>
                        <span className={styles.addressText}>
                            {(user.diaChi && (user.diaChi.ward || user.diaChi.district || user.diaChi.city) && user.diaChi.ward !== "Phường/xã")
                              ? `${user.diaChi.ward || ''}${user.diaChi.ward && user.diaChi.district ? ', ' : ''}${user.diaChi.district || ''}${ (user.diaChi.district || user.diaChi.ward) && user.diaChi.city ? ', ' : ''}${user.diaChi.city || ''}`.trim().replace(/^,|,$/g, '')
                              : <Tag>Chưa cập nhật</Tag>
                            }
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* --- Modal Chỉnh sửa thông tin --- */}
            <Modal
                title={
                    <div className={styles.modalTitle}>
                        <EditOutlined className={styles.modalTitleIcon}/> Chỉnh sửa thông tin
                    </div>
                }
                open={isEditModalVisible} // Prop mới là 'open'
                onCancel={handleCancelEdit}
                footer={null} // Sử dụng footer tùy chỉnh bên trong Form
                destroyOnClose // Reset form khi đóng
                maskClosable={false}
                width={800}
                className={styles.editProfileModal}
            >
                <Form form={editForm} layout="vertical" onFinish={handleUpdateFormSubmit}>
                    <Form.Item
                        name="userName" label="Tên người dùng"
                        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        className={styles.formItem}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Tên hiển thị"/>
                    </Form.Item>
                     <Form.Item
                        name="phoneNumber" label="Số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                         className={styles.formItem}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        name="email" label="Email"
                        rules={[{ type: 'email', message: 'Email không hợp lệ!'}]} // Email không bắt buộc
                         className={styles.formItem}
                    >
                        <Input 
                            prefix={<MailOutlined />} 
                            placeholder="Địa chỉ email (nếu có)" 
                            disabled={user.email?.includes('@gmail.com') || user.email?.includes('@google.com')}
                        /> 
                    </Form.Item>

                    {/* Phần chọn địa chỉ */}
                    <div className={styles.addressSelectorContainer}>
                         <SelectedAddress
                            address={editAddress} // Giá trị hiện tại
                            setAddress={setEditAddress} // Hàm cập nhật state địa chỉ
                            addressData={addressData}
                         />
                    </div>

                    <div className={styles.modalFooter}>
                        <Space>
                            <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>Hủy</Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu thay đổi</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* --- Modal Đổi mật khẩu --- */}
            <Modal
                title={
                     <div className={styles.modalTitle}>
                        <LockOutlined className={styles.modalTitleIcon}/> Đổi mật khẩu
                    </div>
                }
                open={isPasswordModalVisible}
                onCancel={handleCancelPassword}
                footer={null} // Footer tùy chỉnh
                destroyOnClose
                maskClosable={false}
                width={450}
            >
                {isConfirmingPassword ? (
                    // Bước 1: Xác nhận mật khẩu cũ
                    <Form layout="vertical" onFinish={handleConfirmCurrentPassword}>
                        <Form.Item
                            label="Xác nhận mật khẩu hiện tại"
                            required
                            validateStatus={confirmError ? 'error' : ''}
                            help={confirmError || ''}
                             className={styles.formItem}
                        >
                            <Input.Password
                                prefix={<KeyOutlined />}
                                placeholder="Nhập mật khẩu hiện tại"
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    if (confirmError) setConfirmError(''); // Xóa lỗi khi người dùng nhập lại
                                }}
                            />
                        </Form.Item>
                        <div className={styles.modalFooter}>
                             <Space>
                                <Button onClick={handleCancelPassword} icon={<CloseOutlined />}>Hủy</Button>
                                <Button type="primary" htmlType="submit" loading={passwordLoading} icon={<CheckCircleOutlined />}>Xác nhận</Button>
                            </Space>
                        </div>
                    </Form>
                ) : (
                    // Bước 2: Nhập mật khẩu mới
                    <Form form={passwordForm} layout="vertical" onFinish={handlePasswordFormSubmit}>
                        <Form.Item
                            name="newPassword" label="Mật khẩu mới"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                { min: 6, message: "Mật khẩu cần ít nhất 6 ký tự." }
                            ]}
                             className={styles.formItem}
                        >
                            <Input.Password prefix={<KeyOutlined />} placeholder="Ít nhất 6 ký tự"/>
                        </Form.Item>
                         <Form.Item
                            name="confirmNewPassword" label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                             className={styles.formItem}
                        >
                            <Input.Password prefix={<KeyOutlined />} placeholder="Nhập lại mật khẩu mới"/>
                        </Form.Item>
                         <div className={styles.modalFooter}>
                             <Space>
                                <Button onClick={handleCancelPassword} icon={<CloseOutlined />}>Hủy</Button>
                                <Button type="primary" htmlType="submit" loading={passwordLoading} icon={<SaveOutlined />}>Đổi mật khẩu</Button>
                            </Space>
                        </div>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default UserProfile;