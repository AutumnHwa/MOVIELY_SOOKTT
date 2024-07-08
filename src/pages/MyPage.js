import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/MyPage.css'; // 마이페이지 CSS
import logoImage from '../logo.png'; // 로고 이미지

function MyPage() {
  return (
    <div className="myPage">
      <img src={logoImage} alt="Logo" style={{ width: '150px' }} />
      <h1 className="pageTitle">마이페이지</h1>
      <div className="navigation">
        <Link to="watched" className="navButton">이미 본 영화</Link>
        <Link to="wishlist" className="navButton">보고싶은 영화</Link>
        <Link to="calendar" className="navButton">MOVIELY 캘린더</Link>
      </div>
      <Outlet />
    </div>
  );
}

export default MyPage;
