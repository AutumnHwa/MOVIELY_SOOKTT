import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/MywishPage.css';
import logoImage from '../logo.png';
import MvBanner from './MvBanner';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function MywishPage() {
  const { authToken, user } = useAuth(); 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      try {
        // 새로운 API URL로 변경
        const response = await fetch(`https://moviely.duckdns.org/mypage/wishList?userId=${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json', // 필요에 따라 추가
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist movies:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlistMovies();
    }
  }, [authToken, user]);

  return (
    <div className="mywishPage">
      <header className="pageHeader">
        <Link to="/recommendations">
          <img src={logoImage} alt="Logo" className="myPageLogo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="wish-searchIcon"
          />
        </Link>
        <button className="wish-sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div
          className={`overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        />
      </header>
      <div className="myPageTitle">마이페이지</div>
      <div className="navButtons">
        <Link to="/my/watched" className="navButton">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton active">보고싶은 영화</Link>
        <Link to="/my/calendar" className="navButton">MOVIELY 캘린더</Link>
      </div>
      <div className="bannerGrid">
        {loading ? <div className="loading">로딩 중...</div> : 
          movies.length > 0 ? (
            movies.map((movie, index) => (
              <MvBanner
                key={index}
                title={movie.title}
                poster={movie.poster_path}
                flatrate={movie.flatrate ? movie.flatrate.join(', ') : ''}
                movieId={movie.id || movie.movie_id}
                userId={user?.id}
              />
            ))
          ) : (
            <div className="noMovies">보고싶은 영화가 없습니다.</div>
          )}
      </div>
    </div>
  );
}

export default MywishPage;
