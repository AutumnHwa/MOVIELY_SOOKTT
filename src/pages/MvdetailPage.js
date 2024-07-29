import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import moviesCSV from '../movie.csv';
import watchaLogo from '../watcha.png';
import netflixLogo from '../netflix.png';
import disneyPlusLogo from '../disneyplus.png';
import wavveLogo from '../wavve.png';
import detailLogoImage from '../logo.png';
import Popcho from '../pages/Popcho';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/MvdetailPage.css';
import { useAuth } from '../context/AuthContext';

const flatrateLogos = {
  'disney plus': disneyPlusLogo,
  'netflix': netflixLogo,
  'watcha': watchaLogo,
  'wavve': wavveLogo,
};

const flatrateUrls = {
  'disney plus': 'https://www.disneyplus.com',
  'netflix': 'https://www.netflix.com',
  'watcha': 'https://www.watcha.com',
  'wavve': 'https://www.wavve.com',
};

const flatrateNames = {
  'disney plus': '디즈니 플러스',
  'netflix': '넷플릭스',
  'watcha': '왓챠',
  'wavve': '웨이브',
};

const flatratePrices = {
  'disney plus': '최저가 9900원  >',
  'netflix': '최저가 5500원  >',
  'watcha': '최저가 7900원  >',
  'wavve': '최저가 7900원  >',
};

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

const MvdetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        const foundMovie = result.data.find(movie => parseInt(movie.movie_id, 10) === parseInt(id, 10));
        if (foundMovie) {
          foundMovie.genre = foundMovie.genre.split(',').map(genreId => genreMapping[genreId.trim()] || genreId.trim()).join(', ');
          setMovie(foundMovie);
        }
        setLoading(false);
      },
    });
  }, [id]);

  const handleStarClick = async (index) => {
    const newRating = index + 1;
    setRating(newRating);

    const ratingData = {
      user_id: user.id,
      movie_id: movie.movie_id,
      rating: parseFloat(newRating)
    };

    try {
      const response = await fetch('https://moviely.duckdns.org/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      const responseData = await response.text();

      try {
        const jsonResponse = JSON.parse(responseData);
        if (response.ok) {
          setMessage('Rating submitted successfully!');
          console.log('Rating submitted successfully!');
        } else {
          console.error('Rating submission failed:', jsonResponse);
          setMessage('Failed to submit rating: ' + (jsonResponse.message || 'Unknown error'));
          console.log('Rating submission failed:', jsonResponse.message || 'Unknown error');
        }
      } catch (e) {
        console.error('JSON parsing error:', responseData);
        setMessage('Failed to submit rating: Invalid JSON response.');
        console.log('Failed to submit rating: Invalid JSON response.');
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to submit rating.');
      console.log('Error:', error);
    }

    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = async (option) => {
    if (!user.id || !movie.movie_id) {
        setMessage('User ID and Movie ID must not be null');
        console.log('User ID or Movie ID is null:', { userId: user.id, movie_id: movie.movie_id });
        return;
    }

    const listData = {
        user_id: user.id,
        movie_id: movie.movie_id
    };

    console.log('Data being sent:', JSON.stringify(listData)); // 디버그용 로그 추가

    try {
        let url = '';
        if (option === 'option1') {
            url = 'https://moviely.duckdns.org/mypage/wishList';
        } else if (option === 'option2') {
            url = 'https://moviely.duckdns.org/mypage/watchedList';
        }

        console.log('Sending data to URL:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData),
        });

        const responseData = await response.json();
        console.log('Response from server:', responseData);

        if (response.ok) {
            setMessage('List updated successfully!');
            console.log('List updated successfully!');
        } else {
            console.error('List update failed:', responseData);
            setMessage('Failed to update list: ' + (responseData.message || 'Unknown error'));
            console.log('List update failed:', responseData.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to update list.');
        console.log('Error:', error);
    }

    setShowModal(false);
    setTimeout(() => {
        setMessage('');
    }, 3000);
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>;
  }

  if (!movie) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Movie not found</div>;
  }

  const validFlatrate = typeof movie.flatrate === 'string' ? movie.flatrate.split(', ').map(service => service.trim().toLowerCase()).filter(Boolean) : [];

  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/154x231?text=No+Image';

  return (
    <div className="movie-detail-page">
      <header className="pageHeader">
        <Link to="/" className="detail-logo">
          <img src={detailLogoImage} alt="Logo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="detail-searchIcon"
          />
        </Link>
        <button className="detail-sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div
          className={`overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        />
      </header>
      <div className="movie-info-container">
        <div className="left-column">
          <h1 className="detail-movie-title">{movie.title}</h1>
          <div className="detail-rating-and-add">
            <div className="movie-rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${rating > index ? 'filled' : ''}`}
                  onClick={() => handleStarClick(index)}
                >
                  ★
                </span>
              ))}
            </div>
            <button onClick={handleAddClick} className="detail-add-button">+</button>
          </div>
          <p className="movie-details">개봉일 : {movie.release_date}</p>
          <p className="movie-details">장르: {movie.genre}</p>
          <p className="movie-details">국가: {movie.production_countries}</p>
          <p className="movie-runtime">상영시간: {movie.run_time}분</p>
          <p className="movie-cast">출연진: {movie.cast}</p>
        </div>
        <div className="right-column">
          <img src={posterUrl} alt={movie.title} className="movie-poster" />
        </div>
      </div>
      <hr className="custom-hr" />
      <div className="movie-description">
        <h2 className='overview'>개요</h2>
        <p className='fulloverview'>{movie.overview}</p>
      </div>
      <hr className="custom-hr" />
      <div className="ott-buttons-container">
        <h2 className="ott-title">바로가기</h2>
        {validFlatrate.map((platform, index) => (
          <button
            key={index}
            className="ott-button"
            onClick={() => window.open(flatrateUrls[platform], '_blank')}
          >
            <img src={flatrateLogos[platform]} alt={platform} className="ott-logo" />
            <span>{flatrateNames[platform]}</span>
            <span className="price">{flatratePrices[platform]}</span>
          </button>
        ))}
      </div>
      {showModal && <Popcho onClose={handleCloseModal} onSave={handleSaveModal} />}
      {message && <div className="popupContainer">
        <div className="popupContent">
          <p>{message}</p>
          <button onClick={() => setMessage('')}>닫기</button>
        </div>
      </div>}
    </div>
  );
};

export default MvdetailPage;
