import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import MvBanner from './MvBanner';
import Popcho from './Popcho'; // Popcho 모달 컴포넌트 임포트
import '../css/AnniRecom.css';
import '../css/Popcho.css'; // Popcho 스타일 임포트
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';
import ani_1 from '../ani_1.png';
import ani_2 from '../ani_2.png';
import ani_3 from '../ani_3.png';
import ani_4 from '../ani_4.png';
import ani_5 from '../ani_5.png';
import ani_6 from '../ani_6.png';
import ani_7 from '../ani_7.png';
import ani_8 from '../ani_8.png';
import ani_9 from '../ani_9.png';
import ani_10 from '../ani_10.png';

const AnniRecom = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const [selectedMovie, setSelectedMovie] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://moviely.duckdns.org/api/anniversary?page=0&size=150', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        console.log("Fetched data: ", data.content); // 데이터 확인을 위한 콘솔 로그 추가
        setAllMovies(data.content || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  const handleBannerClick = (category) => {
    setSelectedCategory(category);
    const filteredMovies = allMovies.filter(movie => {
      console.log(`Filtering: '${movie.anniversary_name}' === '${category}'`);
      return movie.anniversary_name === category;
    });
    console.log(`Movies filtered by ${category}: `, filteredMovies); // 필터링된 데이터 확인을 위한 콘솔 로그 추가
    setMovies(filteredMovies);
  };

  const handleAddClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = (option) => {
    console.log(`저장할 옵션: ${option}`);
    setShowModal(false);
  };

  const categories = [
    { title: '연인과 함께하는 달콤살벌한 하루', description: '발렌타인데이 추천 영화', anniversaryName: '발렌타인데이', imageUrl: ani_1, className: 'banner-1' },
    { title: "Happy women's Day", description: '여성의 날 추천 영화', anniversaryName: '여성의날', imageUrl: ani_2, className: 'banner-2' },
    { title: '과학 그리고 현실 그 사이...', description: '과학의 날 추천 영화', anniversaryName: '과학의날', imageUrl: ani_3, className: 'banner-3' },
    { title: '오늘은 어린이날 우리들 세상', description: '어린이날 추천 영화', anniversaryName: '어린이날', imageUrl: ani_4, className: 'banner-4' },
    { title: '우리의 지구는 오직 하나 뿐입니다', description: '환경의 날 추천 영화', anniversaryName: '환경의날', imageUrl: ani_5, className: 'banner-5' },
    { title: '우리는 결코 당신을 잊지 않겠습니다', description: '현충일 추천 영화', anniversaryName: '현충일', imageUrl: ani_6, className: 'banner-6' },
    { title: '우리 민족 대명절, 풍성한 한가위!', description: '추석 추천 영화', anniversaryName: '추석', imageUrl: ani_7, className: 'banner-7' },
    { title: 'Trick Or Treat!', description: '할로윈데이 추천 영화', anniversaryName: '할러윈', imageUrl: ani_8, className: 'banner-8' },
    { title: 'All I want for Christmas is...', description: '크리스마스 추천 영화', anniversaryName: '크리스마스', imageUrl: ani_9, className: 'banner-9' },
    { title: '까치까치 설날 말고 우리우리 설날', description: '설날 추천 영화', anniversaryName: '설날', imageUrl: ani_10, className: 'banner-10' },
  ];

  return (
    <div className="AnniRecom">
      <header className="pageHeader">
      <Link to="/recommendations" className="recomlogo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon icon={faSearch} size="2x" className="recom-searchIcon" />
        </Link>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="greetingText">
        {user ? `${user.name}님, 기념일에 볼 영화도 MOVIELY가 골라드립니다!` : '기념일에 볼 영화도 MOVIELY가 골라드립니다!'}
      </div>
      <div className="banners">
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <div className={`banner ${category.className}`} onClick={() => handleBannerClick(category.anniversaryName)}>
              <div className="banner-text">
                <div>{category.title}</div>
                <div>
                  <strong>{category.description}</strong>
                </div>
              </div>
              <img src={category.imageUrl} alt={category.title} className="banner-image" />
            </div>
            {selectedCategory === category.anniversaryName && (
              <div className="moviesContainer">
                {loading ? (
                  <div>영화를 불러오는 중입니다...</div>
                ) : (
                  <div className="movies">
                    <Swiper spaceBetween={4} slidesPerView={3.5} navigation modules={[Navigation]} className="movieSwiper">
                      {movies.length > 0 ? (
                        movies.map((movie, index) => (
                          <SwiperSlide key={index}>
                            <MvBanner
                              title={movie.title}
                              poster={movie.poster_path}
                              flatrate={movie.flatrate ? movie.flatrate.split(', ') : []}
                              movieId={movie.movie_id}
                              userId={user?.id}
                              onAddClick={(e) => handleAddClick(movie)}
                            />
                          </SwiperSlide>
                        ))
                      ) : (
                        <div>해당 카테고리에 대한 영화가 없습니다.</div>
                      )}
                    </Swiper>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {showModal && <Popcho onClose={handleCloseModal} onSave={handleSaveModal} />}
    </div>
  );
};

export default AnniRecom;
