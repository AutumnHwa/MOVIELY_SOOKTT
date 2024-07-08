import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트를 import 합니다.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/PlatRecom.css'; // 새로운 CSS 파일 import
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';

const PlatRecom = () => {
  const { user } = useAuth(); 
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 관리

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="PlatRecom">
      <header className="pageHeader">
        <Link to="/" className="recomlogo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="recom-searchIcon"
          />
        </Link>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="greetingText">
        {user ? `${user.name}님에게 딱 맞는 플랫폼을 골라보세요` : '플랫폼을 골라보세요'}
      </div>
      <div className="content">
        <h1>Platform Recommendations</h1>
        {/* 여기에 추가적인 컴포넌트 내용 작성 */}
      </div>
    </div>
  );
};

export default PlatRecom;
