import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Mvbanner.css';
import Popcho from '../pages/Popcho';

import watchaLogo from '../watcha.png';
import netflixLogo from '../netflix.png';
import disneyPlusLogo from '../disneyplus.png';
import wavveLogo from '../wavve.png';

const flatrateLogos = {
  'disney plus': disneyPlusLogo,
  'netflix': netflixLogo,
  'watcha': watchaLogo,
  'wavve': wavveLogo
};

const MvBanner = ({ title, poster, flatrate, movieId, userId }) => {
  const [rating, setRating] = useState(0); // 기본 값은 0
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 서버에서 별점을 가져오는 부분
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`https://moviely.duckdns.org/ratings/${movieId}?user_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setRating(data.rating || 0); // 서버에서 받은 별점이 없을 경우 0으로 설정
        } else {
          console.error('Failed to fetch rating');
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    if (userId && movieId) {
      fetchRating(); // 유저 ID와 영화 ID가 있을 때만 별점 가져오기
    }
  }, [userId, movieId]);

  // 별점 클릭 핸들러
  const handleStarClick = async (index) => {
    const newRating = index + 1;
    setRating(newRating);

    const ratingData = {
      user_id: userId,
      movie_id: movieId,
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
          console.log('Rating submitted successfully!');
        } else {
          console.error('Rating submission failed:', jsonResponse);
          console.log('Rating submission failed:', jsonResponse.message || 'Unknown error');
        }
      } catch (e) {
        console.error('JSON parsing error:', responseData);
        console.log('Failed to submit rating: Invalid JSON response.');
      }

    } catch (error) {
      console.error('Error:', error);
      console.log('Failed to submit rating.');
    }
  };

  // 추가 버튼 클릭 핸들러
  const handleAddClick = () => {
    setShowModal(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 모달 저장 핸들러
  const handleSaveModal = async (option) => {
    if (!userId || !movieId) {
        console.log('User ID or Movie ID is null:', { userId, movieId });
        return;
    }

    const listData = {
        user_id: userId,
        movie_id: movieId
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
            console.log('List updated successfully!');
        } else {
            console.error('List update failed:', responseData);
            console.log('List update failed:', responseData.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Failed to update list.');
    }

    setShowModal(false);
  };

  // 포스터 클릭 핸들러
  const handlePosterClick = () => {
    navigate(`/movie/${movieId}`);
  };

  console.log('Flatrate data:', flatrate);
  console.log('User ID:', userId);
  console.log('Movie ID:', movieId);

  const validFlatrate = Array.isArray(flatrate) ? flatrate.map(service => service.trim().toLowerCase()).filter(Boolean) : [];

  const posterUrl = poster ? `https://image.tmdb.org/t/p/w500${poster}` : 'https://via.placeholder.com/154x231?text=No+Image';

  console.log('Poster URL:', posterUrl);

  validFlatrate.forEach(service => {
    console.log(`Service: ${service}, URL: ${flatrateLogos[service]}`);
  });

  return (
    <div className="movie-banner">
      <img
        src={posterUrl}
        alt={title}
        className="movie-poster-banner"
        onClick={handlePosterClick}
        onError={(e) => e.target.src = 'https://via.placeholder.com/154x231?text=No+Image'}
      />
      <div className="movie-info">
        <div className="movie-title">{title}</div>
        <div className="flatrate-logos">
          {validFlatrate.map((service) => (
            <img
              key={service}
              src={flatrateLogos[service]}
              alt={`${service} 로고`}
              className="flatrate-logo"
              onError={(e) => e.target.src = 'https://via.placeholder.com/18x18?text=No+Logo'}
            />
          ))}
        </div>
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
        <button onClick={handleAddClick} className="add-button">+</button>
      </div>
      {showModal && <Popcho onClose={handleCloseModal} onSave={handleSaveModal} />}
    </div>
  );
};

export default MvBanner;
