import React, { useState, useEffect, useContext } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Đảm bảo đường dẫn đúng
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Divider, Typography, message, Spin, Card } from 'antd'; // Import Antd components
import { LockOutlined, PhoneOutlined, GoogleOutlined, LoginOutlined } from '@ant-design/icons'; // Import Antd icons
import styles from './Login.module.css'; // Import CSS Module
import apiService from '../../api/api'; // Đảm bảo đường dẫn đúng
import { AuthContext } from "../../components/AuthContext/AuthContext"; // Đảm bảo đường dẫn đúng

const { Title, Text, Link: AntLink } = Typography; // Link từ Antd nếu muốn

const LoginPage = () => {
    const [form] = Form.useForm(); // Sử dụng Antd Form instance
    const [loading, setLoading] = useState(false); // State loading cho nút submit
    const [googleLoading, setGoogleLoading] = useState(false); // State loading cho nút Google
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        // Kiểm tra nếu đã đăng nhập thì chuyển hướng
        const token = localStorage.getItem('authToken');
        if(token) {
            const role = localStorage.getItem('role');
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [navigate]);

    // Regex validate số điện thoại Việt Nam
    const validatePhoneNumber = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập số điện thoại!'));
        }
        if (!/^(0)[3|5|7|8|9][0-9]{8}$/.test(value)) {
            return Promise.reject(new Error('Số điện thoại không hợp lệ!'));
        }
        return Promise.resolve();
    };

    // Xử lý đăng nhập bằng Google
    const handleLoginGoogle = async () => {
        setGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const response = await apiService.loginGoogle({
                email: user.email,
                userName: user.displayName,
            });
            
            if (response.data && response.data.success) {
                // Lưu thông tin đăng nhập (sử dụng hàm login từ context)
                login(response.data.role, response.data.token, response.data.user);
                message.success('Đăng nhập bằng Google thành công!');
                if (response.data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                message.error(response.data.message || 'Đăng nhập Google thất bại!');
            }
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
            message.error('Có lỗi xảy ra khi đăng nhập bằng Google.');
        } finally {
            setGoogleLoading(false);
        }
    };

    // Xử lý submit form đăng nhập thường
    const onFinish = async (values) => {
        setLoading(true);
        try {
            console.log('Gửi request đăng nhập với data:', values);
            const response = await apiService.loginUser({
                phoneNumber: values.phonenumber,
                password: values.password,
            });
            console.log('Response từ server:', response);

            if (response.data && response.data.success) {
                // Tạo user object từ response data
                const userData = {
                    id: response.data.userID,
                    userName: response.data.userName,
                    phoneNumber: response.data.phoneNumber,
                    role: response.data.role
                };
                
                // Lưu thông tin đăng nhập
                login(response.data.role, response.data.token, userData);
                console.log('Token sau khi đăng nhập:', response.data.token);
                console.log('User data sau khi đăng nhập:', userData);
                
                message.success('Đăng nhập thành công!');
                
                if (response.data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                message.error(response.data.message || 'Đăng nhập thất bại!');
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            // Hiển thị lỗi cụ thể từ backend nếu có
            if (error.response && error.response.data && error.response.data.message) {
                 if (error.response.data.message === "User not found") {
                     form.setFields([{ name: 'phonenumber', errors: ['Số điện thoại chưa được đăng ký!'] }]);
                 } else if (error.response.data.message === "Sai mật khẩu! Vui lòng thử lại") {
                     form.setFields([{ name: 'password', errors: ['Mật khẩu không chính xác!'] }]);
                 } else {
                     message.error(error.response.data.message); // Lỗi chung khác
                 }
            } else {
                message.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div className={styles.loginPageContainer}>
            <Card className={styles.loginCard}>
                <Title level={3} className={styles.loginTitle}>
                    Chào mừng quay lại DigitalZone!
                </Title>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical" // Label nằm trên input
                    className={styles.loginForm}
                    requiredMark={false} // Bỏ dấu * màu đỏ bắt buộc
                >
                    <Form.Item
                        label="Số điện thoại"
                        name="phonenumber"
                        rules={[{ validator: validatePhoneNumber }]} // Sử dụng validator tùy chỉnh
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large"/>
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large"/>
                    </Form.Item>

                    <Form.Item>
                        <AntLink className={styles.forgotPassword} href="/forgot-password"> {/* Sử dụng Link của Antd hoặc react-router-dom */}
                            Quên mật khẩu?
                        </AntLink>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={styles.submitButton} loading={loading} size="large">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                     <Form.Item>
                        <Button 
                            icon={<GoogleOutlined className={styles.googleIcon}/>} 
                            onClick={handleLoginGoogle} 
                            className={styles.googleButton} 
                            loading={googleLoading}
                            size="large"
                        >
                           Đăng nhập bằng Google
                        </Button>
                    </Form.Item>

                    <div className={styles.signupLink}>
                        Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;