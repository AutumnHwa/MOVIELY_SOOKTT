import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
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
    { title: '기념일 1 - 설명 1', description: '기념일 1 - 설명 2' },
    { title: '기념일 2 - 설명 1', description: '기념일 2 - 설명 2' },
    { title: '기념일 3 - 설명 1', description: '기념일 3 - 설명 2' },
    { title: '기념일 4 - 설명 1', description: '기념일 4 - 설명 2' },
    { title: '기념일 5 - 설명 1', description: '기념일 5 - 설명 2' },
    { title: '기념일 6 - 설명 1', description: '기념일 6 - 설명 2' },
    { title: '기념일 7 - 설명 1', description: '기념일 7 - 설명 2' },
    { title: '기념일 8 - 설명 1', description: '기념일 8 - 설명 2' },
    { title: '기념일 9 - 설명 1', description: '기념일 9 - 설명 2' },
    { title: '기념일 10 - 설명 1', description: '기념일 10 - 설명 2' },
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
              <div>{category.title}</div>
              <div><strong>{category.description}</strong></div>
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
