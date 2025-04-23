import React, { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import ChatPopup from '../../components/ChatPopup/ChatPopup.jsx';
import Popular from '../../components/Popular/Popular.jsx';
import SlideBanner from '../../components/SlideBanner/SlideBanner.js';
import Banner from '../../components/Banner/Banner.jsx';
import './home.css';

function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleClick = () => {
    // Khi mở chat, bạn có thể lấy userId từ backend hoặc localStorage
    const currentUserId = localStorage.getItem('userID') || 'defaultUserId'; // Lấy userId
    setUserId(currentUserId);
    setIsChatOpen(true);
    console.log(userId)
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="home">
      <Banner />
      <Popular category={"Điện thoại"} />
      <Popular category={"Laptop"} />
      <Popular category={"Tai nghe"} />
      <Popular category={"Bàn phím"} />
      <Popular category={"Phụ kiện"} />
      <Popular category={"Chuột"} />
      <Popular category={"TV"} />

      {/* Hiển thị icon chat nếu popup chưa mở */}
      {!isChatOpen && (
        <div className="chat-icon" onClick={handleClick}>
          <FaCommentDots size={40} color="#007bff" />
        </div>
      )}

      {/* Hiển thị popup trong Home */}
      {isChatOpen && (
        <div className="chat-popup-container">
          {/* <ChatPopup onClose={handleClose}  userId={userId}/> */}
        </div>
      )}
    </div>
  );
}

export default Home;
