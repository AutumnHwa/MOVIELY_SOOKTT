import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import MvBanner from './MvBanner';
import Sidebar from '../components/Sidebar'; // Sidebar 컴포넌트를 import 합니다.
import '../css/RecomPage.css';
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext'; // AuthContext import

const genreMapping = {
  '28': '액션',
  '12': '모험',
  '16': '애니메이션',
  '35': '코미디',
  '80': '범죄',
  '99': '다큐멘터리',
  '18': '드라마',
  '10751': '가족',
  '14': '판타지',
  '36': '역사',
  '27': '공포',
  '10402': '음악',
  '9648': '미스터리',
  '10749': '로맨스',
  '878': 'SF',
  '10770': 'TV 영화',
  '53': '스릴러',
  '10752': '전쟁',
  '37': '서부'
};

function RecomPage() {
  const { authToken, user } = useAuth(); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [randomMovies, setRandomMovies] = useState([]);
  const [topMovie, setTopMovie] = useState(null);
  const [movieItems, setMovieItems] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [loadingRandomMovies, setLoadingRandomMovies] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태 관리

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!authToken || !user) {
        setLoadingRecommendations(false);
        return;
      }

      try {
        console.log('Fetching recommendations...'); // API 호출 시작 로그 추가
        const response = await fetch('https://moviely.duckdns.org/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched recommendations:', data);

        if (data.length > 0) {
          setTopMovie(data[0]);
          setMovieItems(data.slice(1, 6));
        }
        setLoadingRecommendations(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        setLoadingRecommendations(false);
      }
    };

    const fetchRandomMovies = async () => {
      try {
        console.log('Fetching random movies...'); // API 호출 시작 로그 추가
        const response = await fetch('https://moviely.duckdns.org/api/movies');
        if (!response.ok) {
          throw new Error(`Failed to fetch random movies: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched random movies:', data);
        const moviesArray = data.content; // 데이터의 content 배열에 접근
        setRandomMovies(shuffleArray(moviesArray).slice(0, 10));
        setLoadingRandomMovies(false);
      } catch (error) {
        console.error('Error fetching random movies:', error.message);
        setLoadingRandomMovies(false);
      }
    };

    fetchRecommendations();
    fetchRandomMovies();
  }, [authToken, user]);

  const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSearchClick = () => {
    navigate('/movie-search', { state: { searchTerm } });
  };

  return (
    <div className="RecomPage">
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
      <div className="greetingText">{user ? `${user.name}님을 위한 취향저격 영화를 찾아봤어요.` : '취향저격 영화를 찾아봤어요.'}</div>
      <div className="tabContent">
        <div className="topMovieAndListContainer">
          <div className="topMovieContainer">
            {loadingRecommendations ? (
              <div>Fetching recommendations...</div>
            ) : (
              topMovie ? (
                <div className="topMovie">
                  <MvBanner
                    title={topMovie.title}
                    poster={topMovie.poster_path}
                    flatrate={Array.isArray(topMovie.flatrate) ? topMovie.flatrate.join(', ') : topMovie.flatrate}
                    userId={user ? user.id : null} // 사용자 ID 전달
                    movieId={topMovie.movie_id} // 영화 ID 전달
                  />
                </div>
              ) : (
                <div>No recommendations found.</div>
              )
            )}
          </div>
          <div className="movieListContainer">
            {loadingRecommendations ? (
              <div>Fetching recommendations...</div>
            ) : (
              movieItems.length > 0 ? (
                movieItems.map((movie, index) => {
                  const genreList = movie.genre ? movie.genre.split(',').map(g => genreMapping[g.trim()]).filter(Boolean) : [];
                  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/70x105?text=No+Image';
                  console.log('Movie Data:', movie); // Movie 데이터 로그 출력
                  return (
                    <div key={index} className="movieItem">
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="moviePoster"
                      />
                      <div className="movieDetails">
                        <div className="movieTitle">{movie.title}</div>
                        <div className="movieReleaseDate">{new Date(movie.release_date).toLocaleDateString()}</div>
                        <div className="movieGenre">{genreList.length ? genreList.join(', ') : 'No Genre'}</div>
                        <div className="movieOverview">{movie.overview}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No recommendations found.</div>
              )
            )}
          </div>
        </div>
        <div className="randomMoviesContainer">
          {loadingRandomMovies ? (
            <div>Fetching random movies...</div>
          ) : (
            <Swiper
              spaceBetween={0}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
            >
              {randomMovies.map((movie, index) => {
                const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/70x105?text=No+Image';
                return (
                  <SwiperSlide key={index}>
                    <div style={{ transform: 'scale(0.8)' }}>
                      <MvBanner
                        title={movie.title}
                        poster={posterUrl}
                        flatrate={Array.isArray(movie.flatrate) ? movie.flatrate.join(', ') : movie.flatrate}
                        userId={user ? user.id : null} // 사용자 ID 전달
                        movieId={movie.movie_id} // 영화 ID 전달
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecomPage;
