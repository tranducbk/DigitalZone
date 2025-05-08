import React, { useState, useEffect, useRef } from "react";
import { Select, Space, Form, Row, Col, Typography } from "antd"; // Import Select, Space, Form, Row, Col, Typography
// import styles from './selectedAddress.module.css'// Tạo file CSS Module nếu cần tùy chỉnh thêm

const { Option } = Select;
const { Text } = Typography;

export default function SelectedAddress({ address, setAddress, addressData }) {
  // State lưu trữ ID đã chọn
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");

  // State lưu trữ danh sách lựa chọn cho dropdowns
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const prevIds = useRef({ city: '', district: '', ward: '' });

  // Load danh sách thành phố và set giá trị ban đầu từ prop 'address' (chứa tên)
  useEffect(() => {
    setCities(addressData || []); // Load cities từ prop
    if (address && addressData) {
      // Tìm ID dựa trên tên từ prop 'address'
      const initialCity = addressData.find(c => c.Name === address.city);
      if (initialCity) {
        setSelectedCityId(initialCity.Id); // Set ID thành phố ban đầu
        setDistricts(initialCity.Districts || []); // Load quận/huyện tương ứng

        const initialDistrict = initialCity.Districts.find(d => d.Name === address.district);
        if (initialDistrict) {
          setSelectedDistrictId(initialDistrict.Id); // Set ID quận/huyện ban đầu
          setWards(initialDistrict.Wards || []); // Load phường/xã tương ứng

          const initialWard = initialDistrict.Wards.find(w => w.Name === address.ward);
          if (initialWard) {
            setSelectedWardId(initialWard.Id); // Set ID phường/xã ban đầu
          } else {
              setSelectedWardId(""); // Reset nếu ward không khớp
          }
        } else {
            setSelectedDistrictId(""); // Reset nếu district không khớp
            setSelectedWardId("");
            setWards([]);
        }
      } else {
          // Reset nếu city không khớp
          setSelectedCityId("");
          setSelectedDistrictId("");
          setSelectedWardId("");
          setDistricts([]);
          setWards([]);
      }
    } else {
         // Reset nếu không có address prop ban đầu
          setSelectedCityId("");
          setSelectedDistrictId("");
          setSelectedWardId("");
          setDistricts([]);
          setWards([]);
    }
  }, [address, addressData]); // Chạy lại khi address hoặc addressData thay đổi

  // Xử lý khi chọn Tỉnh/Thành phố
  const handleCityChange = (cityId) => {
    setSelectedCityId(cityId);
    const city = cities.find(c => c.Id === cityId);
    setDistricts(city ? city.Districts || [] : []);
    setWards([]); // Reset phường/xã
    setSelectedDistrictId(""); // Reset ID quận/huyện đã chọn
    setSelectedWardId("");   // Reset ID phường/xã đã chọn
    // Gọi setAddress với giá trị rỗng hoặc chỉ city name nếu cần cập nhật ngay lập tức
    // setAddress({ city: city?.Name || '', district: '', ward: '' });
  };

  // Xử lý khi chọn Quận/Huyện
  const handleDistrictChange = (districtId) => {
    setSelectedDistrictId(districtId);
    const city = cities.find(c => c.Id === selectedCityId); // Phải tìm lại city object
    const district = city?.Districts.find(d => d.Id === districtId);
    setWards(district ? district.Wards || [] : []);
    setSelectedWardId(""); // Reset ID phường/xã đã chọn
  };

  // Xử lý khi chọn Phường/Xã
  const handleWardChange = (wardId) => {
    setSelectedWardId(wardId);
  };

  // useEffect để gọi setAddress khi cả 3 cấp đều được chọn và có sự thay đổi ID
  useEffect(() => {
    if (
      selectedCityId &&
      selectedDistrictId &&
      selectedWardId &&
      (
        prevIds.current.city !== selectedCityId ||
        prevIds.current.district !== selectedDistrictId ||
        prevIds.current.ward !== selectedWardId
      )
    ) {
      const cityName = cities.find(c => c.Id === selectedCityId)?.Name || '';
      const districtName = districts.find(d => d.Id === selectedDistrictId)?.Name || '';
      const wardName = wards.find(w => w.Id === selectedWardId)?.Name || '';
      setAddress({ city: cityName, district: districtName, ward: wardName });
      prevIds.current = {
        city: selectedCityId,
        district: selectedDistrictId,
        ward: selectedWardId
      };
    }
  }, [selectedCityId, selectedDistrictId, selectedWardId, cities, districts, wards, setAddress]);

  // Filter option cho phép tìm kiếm không dấu
  const filterOption = (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    option.children.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(input.toLowerCase()) >= 0;

  return (
    // Sử dụng Form.Item nếu component này nằm trong Antd Form để có label và validation
    // Nếu không, dùng div hoặc Space như dưới đây
    <div>
      {/* Có thể thêm label ở đây hoặc trong Form.Item của component cha */}
      {/* <Text style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Địa chỉ:</Text> */}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Row gutter={10}> {/* Sử dụng Row và Col để các Select nằm ngang */}
          <Col xs={24} sm={8}> {/* Chia cột responsive */}
            <Select
              showSearch // Cho phép tìm kiếm
              style={{ width: '100%' }}
              placeholder="Tỉnh/Thành phố"
              value={selectedCityId || undefined} // Hiển thị placeholder nếu chưa chọn
              onChange={handleCityChange}
              filterOption={filterOption} // Áp dụng filter tìm kiếm
              size="large" // Kích thước lớn hơn
              allowClear // Cho phép xóa lựa chọn
              disabled={cities.length === 0} // Disable nếu chưa load xong
            >
              {cities.map(city => (
                <Option key={city.Id} value={city.Id}>{city.Name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Quận/Huyện"
              value={selectedDistrictId || undefined}
              onChange={handleDistrictChange}
              disabled={!selectedCityId || districts.length === 0} // Disable khi chưa chọn TP hoặc chưa có data
              filterOption={filterOption}
              size="large"
              allowClear
            >
              {districts.map(district => (
                <Option key={district.Id} value={district.Id}>{district.Name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Phường/Xã"
              value={selectedWardId || undefined}
              onChange={handleWardChange}
              disabled={!selectedDistrictId || wards.length === 0} // Disable khi chưa chọn QH hoặc chưa có data
              filterOption={filterOption}
              size="large"
              allowClear
            >
              {wards.map(ward => (
                <Option key={ward.Id} value={ward.Id}>{ward.Name}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Space>
       {/* Có thể thêm Form.Item.ErrorList ở đây nếu dùng trong Form */}
    </div>
  );
}