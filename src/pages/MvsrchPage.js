import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import MvBanner from './MvBanner';
import '../css/MvsrchPage.css';
import logoImage from '../logo.png';
import watchaLogo from '../watcha.png';
import netflixLogo from '../netflix.png';
import disneyPlusLogo from '../disneyplus.png';
import wavveLogo from '../wavve.png';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function MvsrchPage() {
  const { user } = useAuth(); // useAuth 훅 사용
  console.log('Logged in user:', user); // user 객체를 콘솔에 출력
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('Fetching movies...');
        const response = await fetch('https://moviely.duckdns.org/api/movies?size=1000', { mode: 'cors' });
        console.log('API 요청 성공:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API 응답 데이터:', data);

        if (data && data.content) {
          const processedData = data.content.map(movie => ({
            ...movie,
            flatrate: movie.flatrate ? movie.flatrate.split(', ').map(platform => platform.toLowerCase()) : [],
            genre: movie.genre ? movie.genre.split(', ') : [],
            id: movie.id // 여기에서 id를 추가합니다.
          }));
          setMovies(processedData);
          setFilteredMovies(processedData);
          setLoading(false);
          console.log('Processed Data:', processedData);
        } else {
          console.error('Unexpected response format:', data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filterMovies = useCallback(() => {
    let filtered = [...movies];

    if (selectedPlatform !== '전체') {
      const selectedPlatformInEnglish = platformMapping[selectedPlatform].toLowerCase();
      console.log(`Selected Platform in English: ${selectedPlatformInEnglish}`);
      filtered = filtered.filter(movie => {
        console.log(`Movie Platforms: ${movie.flatrate}`);
        return movie.flatrate.includes(selectedPlatformInEnglish);
      });
    }

    if (selectedGenre !== '장르 전체') {
      filtered = filtered.filter(movie => movie.genre.includes(genreMapping[selectedGenre]));
    }

    if (searchTerm) {
      const terms = searchTerm.split(' ').filter(term => term);
      const regex = new RegExp(terms.join('|'), 'i');
      filtered = filtered.filter(movie => regex.test(movie.title));
    }

    return filtered;
  }, [movies, selectedPlatform, selectedGenre, searchTerm, genreMapping, platformMapping]);

  useEffect(() => {
    setFilteredMovies(filterMovies());
  }, [filterMovies]);

  const handleSearchClick = () => {
    setFilteredMovies(filterMovies());
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setShowGenres(false);
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    setShowPlatforms(false);
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
    <div className="MvsrchPage">
      <header className="pageHeader">
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
        <Link to="/" className="srchlogo">
          <img src={logoImage} alt="Logo" />
        </Link>
      </header>
      <div className="searchContainer">
        <div className="dropdownContainer">
          <button onClick={() => setShowPlatforms(!showPlatforms)} className="platformButton">플랫폼ㅤㅤㅤ▼</button>
          {showPlatforms && (
            <div className="platformDropdown">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformClick(platform.name)}
                  className="filter"
                >
                  {platform.logo && <img src={platform.logo} alt={platform.name} className="logoIcon"/>}
                  {platform.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="dropdownContainer">
          <button onClick={() => setShowGenres(!showGenres)} className="genreButton">장르ㅤㅤㅤㅤ▼</button>
          {showGenres && (
            <div className="genreDropdown">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className="filter"
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          className="searchInput"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()} 
        />
        <button className="searchButton" onClick={handleSearchClick}>검색</button>
      </div>
      <div className="resultText" style={{ marginTop: '20px' }}>
        <span dangerouslySetInnerHTML={{ __html: resultText }} />
      </div>
      <div className="movieResults" style={{ marginTop: '30px' }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredMovies.length > 0 ? (
            <div className="movieGrid">
              {filteredMovies.map((movie, index) => (
                <MvBanner
                  key={index}
                  title={movie.title}
                  poster={movie.poster_path}
                  flatrate={movie.flatrate}
                  rating={Math.round(movie.vote_average / 2)}
                  movieId={movie.id}
                  userId={user?.id} // userId를 useAuth 훅을 통해 가져와 전달
                />
              ))}
            </div>
          ) : (
            <div className="noMovies">검색 결과가 없습니다.</div>
          )
        )}
      </div>
    </div>
  );
}

export default MvsrchPage;
