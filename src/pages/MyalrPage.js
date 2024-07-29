import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/MyalrPage.css';
import logoImage from '../logo.png';
import MvBanner from './MvBanner';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function MyalrPage() {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const fetchWatchedMovies = useCallback(async () => {
    setLoading(true);
    try {
      const url = `https://moviely.duckdns.org/mypage/watchedList?userId=${user?.id}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched movies:", data); // 데이터 확인을 위한 콘솔 로그 추가

      if (data) {
        const processedData = data.map(movie => ({
          ...movie,
          flatrate: movie.flatrate ? movie.flatrate.split(', ').map(f => f.trim().toLowerCase()) : [],
        }));

        setMovies(processedData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching watched movies:', error);
      setLoading(false);
    }
  }, [authToken, user]);

  useEffect(() => {
    if (user) {
      fetchWatchedMovies();
    }
  }, [fetchWatchedMovies, user]);

  const banners = movies.map((movie, index) => (
    <MvBanner
      title={movie.title}
      poster={posterUrl}
      flatrate={movie.flatrate ? movie.flatrate.split(', ').map(platform => platform.toLowerCase()) : []}
      userId={user ? user.id : null}
      movieId={movie.id || movie.movie_id} // 이 부분 수정
      />
  ));

  return (
    <div className="myalrPage">
      <header className="pageHeader">
        <Link to="/recommendations">
          <img src={logoImage} alt="Logo" className="myPageLogo" />
        </Link>
        <FontAwesomeIcon
          icon={faSearch}
          size="2x"
          className="arl-searchIcon"
          onClick={() => navigate('/movie-search')}
        />
        <button className="arl-sidebar-toggle" onClick={toggleSidebar}>
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
      <div className="bannerGrid">
        {loading ? <div className="loading">로딩 중...</div> : 
          banners.length > 0 ? banners : <div className="noMovies">본 영화가 없습니다.</div>
        }
      </div>
    </div>
  );
}

export default MyalrPage;
