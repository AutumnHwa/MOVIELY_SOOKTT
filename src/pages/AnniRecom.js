import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
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
import moviesCSV from '../movie.csv';

import ani_1 from '../ani_1.png';

const AnniRecom = () => {
  const { user } = useAuth(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const [selectedMovie, setSelectedMovie] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    Papa.parse(moviesCSV, {
      download: true,
      header: true,
      complete: (result) => {
        setAllMovies(result.data);
      },
    });
  }, []);

  const handleBannerClick = (category, index) => {
    const filteredMovies = allMovies.slice(0, 20); // 예시로 처음 20개 영화를 사용
    setMovies(filteredMovies);
    setSelectedCategory(category);
    setBannerIndex(index);
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
    { title: '연인과 함께하는 달콤살벌한 하루', description: '발렌타인데이 추천 영화', imageUrl: ani_1 },
    { title: "Happy women's Day", description: '여성의 날 추천 영화', },
    { title: '과학이 미래다.', description: '과학의 날 추천 영화',  },
    { title: '오늘은 어린이날 우리들 세상', description: '어린이날 추천 영화',  },
    { title: '우리의 지구는 오직 하나 뿐입니다', description: '환경의 날 추천 영화',  },
    { title: '우리는 결코 당신을 잊지 않겠습니다', description: '현충일 추천 영화', },
    { title: '우리 민족 대명절, 풍성한 한가위!', description: '추석 추천 영화',  },
    { title: 'Trick Or Treat!', description: '할로윈데이 추천 영화',  },
    { title: 'All I want for Christmas is...', description: '크리스마스 추천 영화',  },
    { title: '까치까치 설날 말고 우리우리 설날', description: '설날 추천 영화', },
  ];

  return (
    <div className="AnniRecom">
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
        {user ? `${user.name}님, 기념일에 볼 영화도 MOVIELY가 골라드립니다!` : '기념일에 볼 영화도 MOVIELY가 골라드립니다!'}
      </div>
      <div className="banners">
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <div
              className="banner"
              onClick={() => handleBannerClick(category.title, index)}
            >
              <div className="banner-text">
                <div>{category.title}</div>
                <div><strong>{category.description}</strong></div>
              </div>
              <img src={category.imageUrl} alt={category.title} className="banner-image" />
            </div>
            {selectedCategory && bannerIndex === index && (
              <div className="moviesContainer">
                <div className="movies">
                  <Swiper
                    spaceBetween={4}
                    slidesPerView={3.5}
                    navigation
                    modules={[Navigation]}
                    className="movieSwiper"
                  >
                    {movies.length > 0 ? (
                      movies.map((movie, index) => (
                        <SwiperSlide key={index}>
                          <MvBanner
                            title={movie.title}
                            poster={movie.poster_path}
                            flatrate={movie.flatrate ? movie.flatrate.split(', ') : []}
                            movieId={movie.id || movie.movie_id}
                            userId={user?.id}
                            onAddClick={(e) => handleAddClick(movie)}
                          />
                        </SwiperSlide>
                      ))
                    ) : (
                      <div>영화를 불러오는 중입니다...</div>
                    )}
                  </Swiper>
                </div>
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
