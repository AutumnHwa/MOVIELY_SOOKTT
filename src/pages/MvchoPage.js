import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import MvBanner from './MvBanner';
import '../css/MvchoPage.css';
import logoImage from '../logo.png';
import watchaLogo from '../watcha.png';
import netflixLogo from '../netflix.png';
import disneyPlusLogo from '../disneyplus.png';
import wavveLogo from '../wavve.png';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function MvchoPage() {
  const { authToken, user, logout } = useAuth();
  const navigate = useNavigate();
  const genreMapping = useMemo(() => ({
    '장르 전체': 'All',
    '액션': '28',
    '모험': '12',
    '애니메이션': '16',
    '코미디': '35',
    '범죄': '80',
    '다큐멘터리': '99',
    '드라마': '18',
    '가족': '10751',
    '판타지': '14',
    '역사': '36',
    '공포': '27',
    '음악': '10402',
    '미스터리': '9648',
    '로맨스': '10749',
    'SF': '878',
    'TV 영화': '10770',
    '스릴러': '53',
    '전쟁': '10752',
    '서부': '37'
  }), []);

  const platformMapping = useMemo(() => ({
    '전체': 'All',
    '넷플릭스': 'Netflix',
    '디즈니플러스': 'Disney Plus',
    '왓챠': 'Watcha',
    '웨이브': 'Wavve'
  }), []);

  const platforms = useMemo(() => [
    { name: '전체', logo: null },
    { name: '넷플릭스', logo: netflixLogo },
    { name: '디즈니플러스', logo: disneyPlusLogo },
    { name: '왓챠', logo: watchaLogo },
    { name: '웨이브', logo: wavveLogo }
  ], []);

  const genres = useMemo(() => Object.keys(genreMapping), [genreMapping]);
  const [selectedGenre, setSelectedGenre] = useState('장르 전체');
  const [selectedPlatform, setSelectedPlatform] = useState('전체');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const url = `https://moviely.duckdns.org/api/movies?size=500&sort=release_date,desc&release_date.gte=2000-01-01`;

      const response = await fetch(url, { mode: 'cors' });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.content) {
        const processedData = data.content.map(movie => ({
          ...movie,
          flatrate: movie.flatrate ? movie.flatrate.split(', ').map(f => f.trim().toLowerCase()) : [],
          genre: movie.genre ? movie.genre.split(', ') : []
        })).sort((a, b) => b.popularity - a.popularity); // 파퓰러리티 높은 순으로 정렬

        setMovies(processedData);
        setFilteredMovies(processedData); // 처음 500개만 설정
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filterMovies = useCallback(() => {
    let filtered = [...movies];

    if (selectedPlatform !== '전체') {
      const selectedPlatformInEnglish = platformMapping[selectedPlatform].toLowerCase();
      filtered = filtered.filter(movie => movie.flatrate.includes(selectedPlatformInEnglish));
    }

    if (selectedGenre !== '장르 전체') {
      filtered = filtered.filter(movie => movie.genre.includes(genreMapping[selectedGenre]));
    }

    return filtered;
  }, [movies, selectedPlatform, selectedGenre, genreMapping, platformMapping]);

  useEffect(() => {
    setFilteredMovies(filterMovies());
  }, [filterMovies]);

  const banners = filteredMovies.map((movie, index) => (
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

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setShowGenres(false);
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatforms(false);
  };

  const platformLogos = {
    '넷플릭스': netflixLogo,
    '디즈니플러스': disneyPlusLogo,
    '왓챠': watchaLogo,
    '웨이브': wavveLogo
  };

  return (
    <div className="MvchoPage">
      <header className="pageHeader">
        <Link to="/" className="chologo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <FontAwesomeIcon
          icon={faSearch}
          size="2x"
          className="srch-searchIcon"
          onClick={() => navigate('/movie-search')}
        />
        <button className="srch-sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div
          className={`overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        />
      </header>
      <div className="mainText">재미있게 봤거나 눈길이 가는 영화들을 평가해주세요.</div>
      <div className="subText">찜한 영화들을 바탕으로 MOVIELY가 취향저격 영화들을 추천해 드려요.</div>
      <div className="stickyTop">
        <Link to="/recommendations">
          <button className="recommendButton">영화 추천 받기 &gt;</button>
        </Link>
        <div className="MvchoDropdownContainer">
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowGenres(!showGenres)} className="MvchoGenreButton">장르 선택 ▼</button>
            {showGenres && (
              <div className="MvchoGenreDropdown">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className="MvchoFilter"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowPlatforms(!showPlatforms)} className="MvchoPlatformButton">플랫폼 선택 ▼</button>
            {showPlatforms && (
              <div className="MvchoPlatformDropdown">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handlePlatformClick(platform.name)}
                    className="MvchoFilter"
                  >
                    {platform.logo && <img src={platform.logo} alt={platform.name} className="platformLogo"/>}
                    {platform.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bannerGrid">
        {loading ? <div className="loading">로딩 중...</div> : (banners.length > 0 ? banners : <div className="noMovies">선택하신 필터에 맞는 영화가 없습니다.</div>)}
      </div>
    </div>
  );
}

export default MvchoPage;
