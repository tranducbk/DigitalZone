import React, { useState, useEffect } from "react";

export default function SelectedAddress({ address, setAddress, addressData }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  useEffect(() => {
    setCityOptions(addressData);
    if (address) {
      setSelectedCity(address.city);
      const city = addressData.find(c => c.Name === address.city);
      if (city) {
        setDistrictOptions(city.Districts);
        setSelectedDistrict(address.district);
        const district = city.Districts.find(d => d.Name === address.district);
        if (district) {
          setWardOptions(district.Wards);
          setSelectedWard(address.ward);
        }
      }
    }
  }, [addressData]);

  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
    const city = addressData.find(c => c.Name === cityName);
    setDistrictOptions(city ? city.Districts : []);
    setWardOptions([]);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    setSelectedDistrict(districtName);
    const city = addressData.find(c => c.Name === selectedCity);
    const district = city.Districts.find(d => d.Name === districtName);
    setWardOptions(district ? district.Wards : []);
    setSelectedWard('');
  };

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };


  useEffect(() => {
    if (selectedCity && selectedDistrict && selectedWard) {
      setAddress({
        city: selectedCity,
        district: selectedDistrict,
        ward: selectedWard,
      });
    }
    
    if (selectedCity == "Tỉnh/Thành phố" || selectedDistrict == "Quận/huyện" || selectedWard == "Phường/xã") {
        alert = "Hãy chọn địa chỉ!";

        console.log(selectedDistrict);
        
    }
  }, [selectedCity, selectedDistrict, selectedWard]);

  return (
    <div className="input-container">
      <label htmlFor="address">Địa chỉ:</label>
      <div className="select-container">
        <select
          className="form-select"
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option value="">Tỉnh/Thành phố</option>
          {cityOptions.map(city => (
            <option key={city.Id} value={city.Name}>{city.Name}</option>
          ))}
        </select>
        <select
          className="form-select"
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
        >
          <option value="">Quận/huyện</option>
          {districtOptions.map(district => (
            <option key={district.Id} value={district.Name}>{district.Name}</option>
          ))}
        </select>
        <select
          className="form-select"
          id="ward"
          value={selectedWard}
          onChange={handleWardChange}
        >
          <option value="">Phường/xã</option>
          {wardOptions.map(ward => (
            <option key={ward.Id} value={ward.Name}>{ward.Name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
