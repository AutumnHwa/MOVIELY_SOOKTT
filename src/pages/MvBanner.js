import React, { useState } from 'react';
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
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
    if (!userId || !movieId) {
      setMessage('User ID and Movie ID must not be null');
      console.log('User ID or Movie ID is null:', { userId, movieId });
      return;
    }

    const listData = new URLSearchParams({
      user_id: userId,
      movie_id: movieId
    });

    try {
      let url = '';
      if (option === 'option1') {
        url = 'https://moviely.duckdns.org/mypage/wishList';
      } else if (option === 'option2') {
        url = 'https://moviely.duckdns.org/mypage/watchedList';
      }

      console.log('Sending data to URL:', url);
      console.log('Data being sent:', listData.toString());

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: listData.toString(),
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

  const handlePosterClick = () => {
    navigate(`/movie/${movieId}`);
  };

  console.log('Flatrate data:', flatrate);

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
        className="movie-poster"
        style={{ width: '154px', height: '231px' }}
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
      {message && (
        <div className="popupContainer">
          <div className="popupContent">
            <p>{message}</p>
            <button onClick={() => setMessage('')}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MvBanner;
