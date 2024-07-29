import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/MyalrPage.css';
import logoImage from '../logo.png';
import MvBanner from './MvBanner';
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트 임포트
import { useAuth } from '../context/AuthContext';

function MyalrPage() {
  const { authToken, user } = useAuth(); 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 추가
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        const response = await fetch(`https://moviely.duckdns.org/api/watched?userId=${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watched movies:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchWatchedMovies();
    }
  }, [authToken, user]);

  return (
    <div className="myalrPage">
      <header className="pageHeader">
        <Link to="/recommendations">
          <img src={logoImage} alt="Logo" className="myPageLogo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="my-searchIcon"
          />
        </Link>
        <button className="my-sidebar-toggle" onClick={toggleSidebar}>
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
        <Link to="/my/watched" className="navButton active">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton">보고싶은 영화</Link>
        <Link to="/my/calendar" className="navButton">MOVIELY 캘린더</Link>
      </div>
      <div className="movieGrid">
        {loading ? <div className="loading">로딩 중...</div> : 
          movies.length > 0 ? (
            movies.map((movie, index) => (
              <MvBanner
                key={index}
                title={movie.title}
                poster={movie.poster_path}
                flatrate={movie.flatrate.join(', ')}
                movieId={movie.id || movie.movie_id}
                userId={user?.id}
              />
            ))
          ) : (
            <div className="noMovies">본 영화가 없습니다.</div>
          )}
      </div>
    </div>
  );
}

export default MyalrPage;
