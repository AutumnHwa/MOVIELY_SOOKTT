import React, { useEffect, useState, useCallback } from 'react';
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

  const fetchWishlistMovies = useCallback(async () => {
    setLoading(true);
    try {
      const wishlistUrl = `https://moviely.duckdns.org/mypage/wishList?userId=${user?.id}`;

      const wishlistResponse = await fetch(wishlistUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!wishlistResponse.ok) {
        throw new Error(`HTTP error! status: ${wishlistResponse.status}`);
      }

      const wishlistData = await wishlistResponse.json();
      console.log("Fetched wishlist:", wishlistData); // 데이터 확인을 위한 콘솔 로그 추가

      const movieDetails = await Promise.all(
        wishlistData.map(async (wishMovie) => {
          const movieDetailsUrl = `https://moviely.duckdns.org/api/movies/${wishMovie.movie_id}`;
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
            ...wishMovie,
            ...movieDetailsData,
            flatrate: movieDetailsData.flatrate ? movieDetailsData.flatrate.split(', ').map(f => f.trim().toLowerCase()) : [],
          };
        })
      );

      setMovies(movieDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist movies:', error);
      setLoading(false);
    }
  }, [authToken, user]);

  useEffect(() => {
    if (user) {
      fetchWishlistMovies();
    }
  }, [fetchWishlistMovies, user]);

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
          banners.length > 0 ? banners : <div className="noMovies">보고싶은 영화가 없습니다.</div>
        }
      </div>
    </div>
  );
}

export default MywishPage;
