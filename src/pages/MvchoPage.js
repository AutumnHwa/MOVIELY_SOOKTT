import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MvBanner from './MvBanner';
import '../css/MvchoPage.css';
import logoImage from '../logo.png';
import netflixLogo from '../netflix.png';
import disneyPlusLogo from '../disneyplus.png';
import watchaLogo from '../watcha.png';
import wavveLogo from '../wavve.png';
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

  const genres = useMemo(() => Object.keys(genreMapping), [genreMapping]);
  const platforms = useMemo(() => Object.keys(platformMapping), [platformMapping]);

  const [selectedGenre, setSelectedGenre] = useState('장르 전체');
  const [selectedPlatform, setSelectedPlatform] = useState('전체');
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인
  const [showGenres, setShowGenres] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let url = `https://moviely.duckdns.org/api/movies?size=1000&sort=release_date,desc&release_date.gte=2000-01-01`;
      if (selectedGenre !== '장르 전체') {
        url += `&genre=${genreMapping[selectedGenre]}`;
      }
      if (selectedPlatform !== '전체') {
        url += `&platform=${platformMapping[selectedPlatform]}`;
      }

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

        setAllMovies(processedData);
        setMovies(processedData.slice(0, 500)); // 처음 500개만 설정
        setHasMore(processedData.length > 500);
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

  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      const newMovies = allMovies.slice(nextPage * 500, (nextPage + 1) * 500);
      setMovies(prevMovies => [...prevMovies, ...newMovies]);
      setPage(nextPage);
      setHasMore((nextPage + 1) * 500 < allMovies.length);
    }
  };

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

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setShowGenres(false);
    setMovies([]); // 장르 변경 시 영화 목록 초기화
    setPage(0); // 페이지 번호 초기화
    setHasMore(true); // 추가 데이터 여부 초기화
    fetchMovies(); // 새로운 장르로 데이터 다시 불러오기
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatforms(false);
    setMovies([]); // 플랫폼 변경 시 영화 목록 초기화
    setPage(0); // 페이지 번호 초기화
    setHasMore(true); // 추가 데이터 여부 초기화
    fetchMovies(); // 새로운 플랫폼으로 데이터 다시 불러오기
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
                    key={platform}
                    onClick={() => handlePlatformClick(platform)}
                    className="MvchoFilter"
                  >
                    {platform !== '전체' && <img src={platformLogos[platform]} alt={platform} className="platformLogo" />}
                    {platform}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bannerGrid">
        {banners}
      </div>
      {loading && <div className="loading">로딩 중...</div>}
      {hasMore && !loading && (
        <button onClick={loadMoreMovies} className="loadMoreButton">더 불러오기</button>
      )}
    </div>
  );
}

export default MvchoPage;
