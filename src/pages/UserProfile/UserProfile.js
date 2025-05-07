import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import apiService from '../../api/api';
import { Modal, Input, Button } from 'antd';
import SelectedAddress from '../../components/CustomSelected/selectedAddress'; // Import SelectedAddress
import addressData from '../RegisterAccount/address-data.json'

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [address, setAddress] = useState({});
    const [loginGoogle, setLoginGoogle] = useState();
    const [isCurrentPasswordConfirmed, setIsCurrentPasswordConfirmed] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
        diaChi: {
            city: '',
            district: '',
            ward: '',
        }
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.log('Bạn cần đăng nhập để truy cập dữ liệu!');
                    return;
                }
                const response = await apiService.getUserProfile();
                if (response.data) {
                    setUser(response.data.user);
                    console.log('User data:', response.data.user);
                    
                    setUpdatedUser({
                        userName: response.data.user.userName,
                        phoneNumber: response.data.user.phoneNumber,
                        email: response.data.user.email,
                        diaChi: response.data.user.diaChi,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user info', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    // console.log(showEditProfile);
    

    const handleConfirmCurrentPassword = async () => {
        try {
            const phoneNumber = localStorage.getItem("phoneNumber");
            const response = await apiService.loginUser({
                phoneNumber: phoneNumber,
                password: currentPassword
            });
            if (response.data.success) {
                setError('');
                setIsCurrentPasswordConfirmed(true);
            } else {
                setError('Mật khẩu cũ không đúng');
            }
        } catch (error) {
            setError('Mật khẩu cũ không đúng');
        }
    };

    const handleChangePassword = async () => {
        try {
            await apiService.changePassword(currentPassword, newPassword);
            setShowChangePassword(false);
            setIsCurrentPasswordConfirmed(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setError('Đổi mật khẩu thất bại');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            console.log("khi cap nhat ", updatedUser);
            console.log("khi cap nhat ", user);
            await apiService.updateUserProfile(user._id, updatedUser);
            setUser({ ...user, ...updatedUser });
            // setUser({
            //     ...user,
            //     ...updatedUser,
            //     diaChi: { ...user.diaChi, ...updatedUser.diaChi },
            // });
            console.log('Cập nhật thông tin thành công', user);
            
            setShowEditProfile(false);
        } catch (error) {
            console.error('Cập nhật thông tin thất bại', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Bạn chưa đăng nhập!</div>;
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile-title">
                <h1>Thông tin người dùng</h1>
            </div>
            <div className="user-profile">
                <p><strong>Tên người dùng: </strong> {user.userName}</p>
                <p>
                    <strong>Liên hệ: </strong> 
                    {user.phoneNumber ? user.phoneNumber : user.email ? user.email : 'Chưa cập nhật'}
                </p>
                <p>
                    <strong>Địa chỉ: </strong>
                    {user.diaChi &&
                    (user.diaChi.ward === "Phường/xã" ||
                    user.diaChi.district === "Quận/huyện" ||
                    user.diaChi.city === "Tỉnh/Thành phố")
                        ? "Hãy cập nhật địa chỉ"
                        : `${user.diaChi.ward}, ${user.diaChi.district}, ${user.diaChi.city}`}
                </p>
                {/* <p><strong>Địa chỉ: </strong>{user.diaChi ? `${user.diaChi.ward}, ${user.diaChi.district}, ${user.diaChi.city}` : 'Chưa cập nhật'}</p> */}
                <div className="user-profile-buttons">
                    <Button type="primary" onClick={() => setShowEditProfile(true)}>Chỉnh sửa thông tin</Button>
                    {/* <Button type="default" onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</Button> */}
                    {!user.email && (
                        <Button type="default" onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</Button>
                    )}
                </div>
            </div>

            <Modal
                title="Chỉnh sửa thông tin"
                visible={showEditProfile}
                onCancel={() => setShowEditProfile(false)}
                footer={null}
            >
                <label htmlFor="userName">Tên người dùng</label>
                <Input
                    value={updatedUser.userName}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, userName: e.target.value })}
                    placeholder="Tên người dùng"
                    showChangePassword={showChangePassword}
                />
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <Input
                    value={updatedUser.phoneNumber}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, phoneNumber: e.target.value })}
                    placeholder="Số điện thoại"
                />
                <SelectedAddress
                    address={updatedUser.diaChi}
                    setAddress={(newAddress) => setUpdatedUser({ ...updatedUser, diaChi: newAddress })}
                    addressData={addressData}
                />
                <Button type="primary" onClick={handleUpdateProfile}>Lưu thay đổi</Button>
            </Modal>

            <Modal
                title="Đổi mật khẩu"
                visible={showChangePassword}
                onCancel={() => setShowChangePassword(false)}
                footer={null}
            >
                {!isCurrentPasswordConfirmed ? (
                    <>
                        <Input.Password
                            placeholder="Xác nhận mật khẩu cũ"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Button type="primary" onClick={handleConfirmCurrentPassword}>Xác nhận</Button>
                        {error && <p>{error}</p>}
                    </>
                ) : (
                    <>
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button type="primary" onClick={handleChangePassword}>Xác nhận</Button>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default UserProfile;
