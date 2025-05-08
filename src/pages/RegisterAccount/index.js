import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Đảm bảo đường dẫn đúng
import addressData from './address-data.json'; // Đảm bảo đường dẫn đúng
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Typography, message, Spin, Row, Col, Space, Divider } from 'antd'; // Import Antd components
import { UserOutlined, PhoneOutlined, HomeOutlined, LockOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons'; // Import icons
import styles from "./RegisterAccount.module.css"; // Import CSS Module đã cập nhật
import apiService from "../../api/api";

const { Title, Text, Link: AntLink } = Typography;
const { Option } = Select;

export default function RegisterPage() {
    const [form] = Form.useForm(); // Antd Form instance
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for submit

    // State cho address dropdowns
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // Load danh sách thành phố ban đầu
    useEffect(() => {
        setCities(addressData.map(city => ({ id: city.Id, name: city.Name })));
    }, []);

    // Xử lý khi chọn Tỉnh/Thành phố
    const handleCityChange = (cityId) => {
        const selectedCityData = addressData.find(city => city.Id === cityId);
        setDistricts(selectedCityData ? selectedCityData.Districts.map(d => ({ id: d.Id, name: d.Name })) : []);
        setWards([]); // Reset phường/xã
        form.setFieldsValue({ district: undefined, ward: undefined }); // Reset giá trị form
        setSelectedCity(cityId);
        setSelectedDistrict(null);
    };

    // Xử lý khi chọn Quận/Huyện
    const handleDistrictChange = (districtId) => {
        if (selectedCity) {
            const selectedCityData = addressData.find(city => city.Id === selectedCity);
            const selectedDistrictData = selectedCityData?.Districts.find(d => d.Id === districtId);
            setWards(selectedDistrictData ? selectedDistrictData.Wards.map(w => ({ id: w.Id, name: w.Name })) : []);
            form.setFieldsValue({ ward: undefined }); // Reset giá trị form
            setSelectedDistrict(districtId);
        }
    };

    // Validator cho số điện thoại
    const validatePhoneNumber = (_, value) => {
        if (!value) return Promise.reject(new Error('Vui lòng nhập số điện thoại!'));
        if (!/^(0)[3|5|7|8|9][0-9]{8}$/.test(value)) return Promise.reject(new Error('Số điện thoại không hợp lệ!'));
        return Promise.resolve();
    };

    // Xử lý submit form đăng ký
    const onFinish = async (values) => {
        setLoading(true);
        setSuccessMessage(""); // Clear success message cũ
        try {
            // Lấy tên từ ID đã chọn
            const cityName = cities.find(c => c.id === values.city)?.name;
            const districtName = districts.find(d => d.id === values.district)?.name;
            const wardName = wards.find(w => w.id === values.ward)?.name;

            if (!cityName || !districtName || !wardName) {
                 message.error('Vui lòng chọn đầy đủ địa chỉ!');
                 setLoading(false);
                 return;
            }

            const newUser = {
                userName: values.username,
                phoneNumber: values.phonenumber,
                email: "", // Có thể thêm field email nếu cần
                password: values.password,
                diaChi: {
                    city: cityName,
                    district: districtName,
                    ward: wardName,
                }
            };

            console.log('Registering user data:', newUser);
            
            const response = await apiService.registerUser(newUser);

            console.log('API Response:', response); // Log response để debug

            if (response.data && (response.data.success || response.status === 201 || response.status === 200)) { // Kiểm tra các trạng thái thành công có thể có
                setSuccessMessage("Đăng ký thành công! Đang chuyển hướng...");
                message.success("Đăng ký thành công!"); // Hiển thị message Antd
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Hiển thị lỗi cụ thể từ API nếu có
                 if (response.data && response.data.message === "Người dùng đã tồn tại!") {
                     form.setFields([{ name: 'phonenumber', errors: ['Số điện thoại đã được sử dụng!'] }]);
                 } else {
                    message.error(response.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
                 }
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            // Hiển thị lỗi cụ thể từ response nếu có
             if (error.response && error.response.data && error.response.data.message === "Người dùng đã tồn tại!") {
                form.setFields([{ name: 'phonenumber', errors: ['Số điện thoại đã được sử dụng!'] }]);
             } else {
                 message.error('Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
             }
        } finally {
            setLoading(false);
        }
    };

     const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // TODO: Implement handleLoginGoogle if needed on register page

    return (
        <div className={styles.registerPageContainer}>
            <div className={styles.registerFormContainer}>
                <Title level={3} className={styles.registerTitle}>
                    Tạo tài khoản <span className={styles.appName}>DigitalZone</span>
                </Title>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    className={styles.registerForm}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Số điện thoại"
                        name="phonenumber"
                        rules={[{ validator: validatePhoneNumber }]}
                        hasFeedback
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large"/>
                    </Form.Item>

                    <Form.Item
                        label="Tên người dùng"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Tên bạn muốn hiển thị" size="large"/>
                    </Form.Item>

                     <Form.Item
                        label="Địa chỉ"
                        required // Đánh dấu là bắt buộc ở label
                        style={{ marginBottom: 0 }} // Giảm margin dưới của label chung
                     >
                        {/* Đặt các Select trong một Row để dễ quản lý */}
                        <Space direction="vertical" style={{width: '100%'}}> 
                             <Row gutter={10} className={styles.addressSelectGroup}>
                                <Col span={8}>
                                    <Form.Item 
                                        name="city" 
                                        noStyle 
                                        rules={[{ required: true, message: 'Chọn Tỉnh/TP!' }]}
                                    >
                                        <Select placeholder="Tỉnh/Thành phố" onChange={handleCityChange} size="large" showSearch filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                            {cities.map(city => <Option key={city.id} value={city.id}>{city.name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item 
                                        name="district" 
                                        noStyle 
                                        rules={[{ required: true, message: 'Chọn Quận/Huyện!' }]}
                                    >
                                        <Select placeholder="Quận/Huyện" onChange={handleDistrictChange} disabled={!selectedCity} size="large" showSearch filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                            {districts.map(district => <Option key={district.id} value={district.id}>{district.name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                     <Form.Item 
                                        name="ward" 
                                        noStyle 
                                        rules={[{ required: true, message: 'Chọn Phường/Xã!' }]}
                                    >
                                        <Select placeholder="Phường/Xã" disabled={!selectedDistrict} size="large" showSearch filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                            {wards.map(ward => <Option key={ward.id} value={ward.id}>{ward.name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                             {/* Hiển thị lỗi chung cho địa chỉ nếu cần */}
                             {/* <Form.ErrorList errors={form.getFieldError('city') || form.getFieldError('district') || form.getFieldError('ward')} /> */}
                         </Space>
                    </Form.Item>


                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: "Mật khẩu cần ít nhất 6 ký tự." }
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Ít nhất 6 ký tự" size="large"/>
                    </Form.Item>

                     <Form.Item
                        label="Xác nhận mật khẩu"
                        name="rePassword"
                        dependencies={['password']} // Phụ thuộc vào trường password
                        hasFeedback
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({ // Validator tùy chỉnh
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large"/>
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={styles.submitButtonPrimary} loading={loading} size="large">
                            Tạo tài khoản
                        </Button>
                    </Form.Item>
                    
                     {/* Hiển thị thông báo thành công */}
                    {successMessage && <div className={styles.successMessage}><CheckCircleOutlined /> {successMessage}</div>}

                    <Divider />

                    <div className={styles.loginLink}>
                        Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay!</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}