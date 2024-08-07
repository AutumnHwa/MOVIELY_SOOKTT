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
  const { user } = useAuth();
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
    '넷플릭스': 'netflix',
    '디즈니플러스': 'disney plus',
    '왓챠': 'watcha',
    '웨이브': 'wavve'
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
      const genre = selectedGenre !== '장르 전체' ? genreMapping[selectedGenre] : '';
      const platform = selectedPlatform !== '전체' ? platformMapping[selectedPlatform] : '';
      const url = new URL('https://moviely.duckdns.org/api/movies');
      const params = { size: 2000, sort: 'popularity,desc', 'release_date.gte': '2000-01-01' };

      if (genre) params.genre = genre;
      if (platform) params.platform = platform;

      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const response = await fetch(url, { mode: 'cors' });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched movies:", data.content); // 데이터 확인을 위한 콘솔 로그 추가

      if (data && data.content) {
        const processedData = data.content.map(movie => {
          const genres = movie.genre ? movie.genre.split(', ').map(g => g.trim()) : [];
          console.log(`Movie: ${movie.title}, Release Date: ${movie.release_date}, Genres: ${genres}`); // 각 영화의 파퓰러리티와 장르 확인을 위한 콘솔 로그 추가
          return {
            ...movie,
            flatrate: movie.flatrate ? movie.flatrate.split(', ').map(f => f.trim().toLowerCase()) : [],
            genre: genres
          };
        });

        setMovies(processedData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  }, [selectedGenre, selectedPlatform, genreMapping, platformMapping]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setShowGenres(false);
    fetchMovies();
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatforms(false);
    fetchMovies();
  };

  let resultText = '';
  if (selectedPlatform !== '전체') {
    resultText += `플랫폼 : <span style="color: yellow;">${selectedPlatform}</span>`;
  }
  if (selectedGenre !== '장르 전체') {
    if (resultText) {
      resultText += ', ';
    }
    resultText += `장르 : <span style="color: yellow;">${selectedGenre}</span>`;
  }
  if (resultText) {
    resultText += ' 검색 결과입니다.';
  }

  return (
    <div className="MvchoPage">
      <header className="pageHeader">
        <Link to="/recommendations" className="chologo">
          <img src={logoImage} alt="Logo" />
        </Link>
        <FontAwesomeIcon
          icon={faSearch}
          size="2x"
          className="cho-searchIcon"
          onClick={() => navigate('/movie-search')}
        />
        <button className="cho-sidebar-toggle" onClick={toggleSidebar}>
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
        {loading ? <div className="loading">로딩 중...</div> : (movies.length > 0 ? (
          movies.map((movie, index) => (
            <MvBanner
              key={index}
              title={movie.title}
              poster={movie.poster_path}
              flatrate={movie.flatrate}
              rating={Math.round(movie.vote_average / 2)}
              movieId={movie.id || movie.movie_id}
              userId={user?.id}
            />
          ))
        ) : (
          <div className="noMovies">검색 결과가 없습니다.</div>
        ))}
      </div>
    </div>
  );
}

export default MvchoPage;
