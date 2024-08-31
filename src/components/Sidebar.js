import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useAuth } from '../context/AuthContext';
import '../css/Sidebar.css'; // 사이드바 스타일을 위한 CSS 파일
import logoImage from '../logo.png';

function Sidebar({ isOpen, onClose }) {
  const { authToken, logout } = useAuth();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleAuthButtonClick = () => {
    if (authToken) {
      logout();
    } else {
      onClose(); // 사이드바를 닫고 로그인 페이지로 이동
      navigate('/log-sign');
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <img src={logoImage} alt="Logo" className="sidebar-logo" />
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <button className="auth-button" onClick={handleAuthButtonClick}>
          {authToken ? '로그아웃' : '로그인'}
        </button>
        <ul>
          <li><Link to="/recommendations" onClick={onClose}>취향저격 영화 추천</Link></li>
          <li><Link to="/platform-recommendations" onClick={onClose}>맞춤 플랫폼 추천</Link></li>
          <li><Link to="/anniversary-recommendations" onClick={onClose}>기념일별 영화 추천</Link></li>
          <li><Link to="/my/wishlist" onClick={onClose}>마이페이지</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
