import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import MvBanner from './MvBanner';
import '../css/MyalrPage.css';
import logoImage from '../logo.png';
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
      const watchedListUrl = `https://moviely.duckdns.org/mypage/watchedList?userId=${user?.id}`;

      const watchedListResponse = await fetch(watchedListUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!watchedListResponse.ok) {
        throw new Error(`HTTP error! status: ${watchedListResponse.status}`);
      }

      const watchedListData = await watchedListResponse.json();
      console.log("Fetched watched list:", watchedListData); // 데이터 확인을 위한 콘솔 로그 추가

      const movieDetails = await Promise.all(
        watchedListData.map(async (watchedMovie) => {
          const movieDetailsUrl = `https://moviely.duckdns.org/api/movies/${watchedMovie.movie_id}`;
          const movieDetailsResponse = await fetch(movieDetailsUrl, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!movieDetailsResponse.ok) {
            throw new Error(`HTTP error! status: ${movieDetailsResponse.status}`);
          }

          const movieDetailsData = await movieDetailsResponse.json();
          console.log("Fetched movie details:", movieDetailsData); // 데이터 확인을 위한 콘솔 로그 추가

          return {
            ...watchedMovie,
            ...movieDetailsData,
          };
        })
      );

      setMovies(movieDetails);
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
      key={index}
      title={movie.title}
      poster={movie.poster_path}
      flatrate={movie.flatrate}
      rating={Math.round(movie.vote_average / 2)}
      movieId={movie.id || movie.movie_id}
      userId={user?.id}
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
