import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';
import logoImage from '../logo.png';

function LandingPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://moviely.duckdns.org/api/movies?size=1000', { mode: 'cors' }); // HTTPS로 변경
        const data = await response.json();
        if (data && data.content) {
          setMovies(data.content);
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const getRandomMovies = (movies, num) => {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const randomMovies = getRandomMovies(movies, 3);

  return (
    <div className="container">
      <Link to="/">
        <img src={logoImage} alt="Logo" className="logo" />
      </Link>
      <h1 className="heading">오늘 뭘 볼지 모르겠다고요?<br />내 취향에 꼭 맞는 OTT 컨텐츠를 찾아보세요!</h1>
      <div className="buttonContainer">
        <Link to="/log-sign" className="button">로그인 및 회원가입</Link>
      </div>
      <div className="movie-posters">
        {randomMovies.map((movie, index) => (
          <img
            key={movie.movie_id}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={`poster poster-${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
