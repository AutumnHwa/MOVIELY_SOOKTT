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
import Sidebar from '../components/Sidebar';
import '../css/RecomPage.css';
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';

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

const anniversaryDates = {
  '환경의날': '06-05',
  '현충일': '06-06',
  '할로윈': '10-31',
  '크리스마스': '12-25',
  '추석': '09-24', // 예시 날짜
  '여성의날': '03-08',
  '설날': '02-10', // 예시 날짜
  '발렌타인데이': '02-14',
  '과학의날': '04-21'
};

const getClosestAnniversary = () => {
  const today = new Date();
  const dates = Object.entries(anniversaryDates).map(([name, date]) => {
    const [month, day] = date.split('-');
    const anniversaryDate = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));

    // 오늘 날짜가 기념일 날짜를 지나면 내년으로 설정
    if (anniversaryDate < today) {
      anniversaryDate.setFullYear(today.getFullYear() + 1);
    }

    return { name, date: anniversaryDate };
  });

  // 가장 가까운 기념일을 찾는 로직
  dates.sort((a, b) => a.date - b.date);
  
  console.log("Next closest anniversary: ", dates[0].name);  // 디버깅용 로그
  return dates[0].name;
};

function RecomPage() {
  const { authToken, user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [anniversaryMovies, setAnniversaryMovies] = useState([]);
  const [loadingAnniversaryMovies, setLoadingAnniversaryMovies] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [closestAnniversary, setClosestAnniversary] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchAnniversaryMovies = async () => {
      try {
        const response = await fetch('https://moviely.duckdns.org/api/anniversary?page=0&size=150', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch anniversary movies: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("All anniversary movies: ", data.content);  // 전체 데이터 로그

        const closestAnniv = getClosestAnniversary();
        setClosestAnniversary(closestAnniv);
        
        const filteredMovies = data.content.filter(movie => movie.anniversary_name === closestAnniv);
        console.log("Filtered Halloween movies: ", filteredMovies);  // 할로윈 영화 로그
        
        setAnniversaryMovies(filteredMovies);
        setLoadingAnniversaryMovies(false);
      } catch (error) {
        console.error('Error fetching anniversary movies:', error.message);
        setLoadingAnniversaryMovies(false);
      }
    };

    fetchAnniversaryMovies();
  }, [authToken, user]);

  const handlePosterClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="RecomPage">
      <header className="pageHeader">
        <Link to="/recommendations" className="recomlogo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="recom-searchIcon"
          />
        </Link>
        <button className="recom-sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="tabContent">
        <div className="greetingText-recom">{user ? `${user.name}님을 위한 취향저격 영화를 찾아봤어요.` : '취향저격 영화를 찾아봤어요.'}</div>
        <div className="anniversaryMoviesContainer">
          {loadingAnniversaryMovies ? (
            <div>Fetching anniversary movies...</div>
          ) : (
            <Swiper
              spaceBetween={0}
              slidesPerView={2}
              slidesPerGroup={1}
              navigation
              modules={[Navigation, Pagination]}
              loop={anniversaryMovies.length > 1}  // 슬라이드가 2개 이상일 때만 루프 활성화
              className="movieSwiper"
            >
              {anniversaryMovies.length > 0 ? (
                anniversaryMovies.map((movie, index) => {
                  const posterUrl = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/70x105?text=No+Image';
                  return (
                    <SwiperSlide key={index}>
                      <div style={{ transform: 'scale(0.8)' }}>
                        <MvBanner
                          title={movie.title}
                          poster={posterUrl}
                          flatrate={movie.flatrate ? movie.flatrate.split(', ').map(platform => platform.toLowerCase()) : []}
                          movieId={movie.id || movie.movie_id}
                          onPosterClick={() => handlePosterClick(movie.id || movie.movie_id)}
                        />
                      </div>
                    </SwiperSlide>
                  );
                })
              ) : (
                <div>No movies found for {closestAnniversary}.</div>
              )}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecomPage;
