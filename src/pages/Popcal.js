import React, { useState, useEffect } from 'react';
import '../css/Popcal.css';

const Popcal = ({ isOpen, onClose, onSave, onDelete, initialData, userId }) => {
  const [movieData, setMovieData] = useState({
    watch_date: '',
    movie_title: '',
    movie_content: '',
    created_at: '',
    created_by: userId || '' // 사용자 ID 설정
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setMovieData({
        watch_date: initialData.start || '',
        movie_title: initialData.title || '',
        movie_content: initialData.movie_content || '',
        created_at: initialData.created_at || '',
        created_by: initialData.created_by || userId
      });
    }
  }, [initialData, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    if (!movieData.movie_title) {
      alert('영화 제목을 입력해주세요.');
      return;
    }

    const eventDetails = {
      id: initialData ? initialData.id : Date.now().toString(),
      title: movieData.movie_title,
      start: movieData.watch_date,
      allDay: true,
      extendedProps: {
        movie_content: movieData.movie_content,
        created_at: movieData.created_at || new Date().toISOString(),
        created_by: movieData.created_by
      }
    };

    try {
      const response = await fetch('https://moviely.duckdns.org/mypage/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          watch_date: movieData.watch_date,
          movie_title: movieData.movie_title,
          movie_content: movieData.movie_content,
          created_at: movieData.created_at || new Date().toISOString(),
          created_by: movieData.created_by
        })
      });

      console.log('Request sent to URL:', 'https://moviely.duckdns.org/mypage/calendar');
      console.log('Request payload:', {
        user_id: userId,
        watch_date: movieData.watch_date,
        movie_title: movieData.movie_title,
        movie_content: movieData.movie_content,
        created_at: movieData.created_at || new Date().toISOString(),
        created_by: movieData.created_by
      });

      if (!response.ok) {
        console.log('Response status:', response.status);
        throw new Error('Failed to save movie data');
      }

      const responseData = await response.json();
      console.log('Response from server:', responseData);

      onSave(eventDetails);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('영화 데이터를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = () => {
    if (initialData && initialData.id) {
      onDelete(initialData.id);
      onClose();
    } else {
      setErrorMessage('삭제할 이벤트가 없습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popcal-container">
      <div className="popcal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>영화 관람 기록하기</h2>
        <label htmlFor="watch_date">관람 일자</label>
        <input
          id="watch_date"
          type="date"
          name="watch_date"
          value={movieData.watch_date}
          onChange={handleInputChange}
        />
        <label htmlFor="movie_title">영화 제목</label>
        <input
          id="movie_title"
          type="text"
          name="movie_title"
          placeholder="영화 제목"
          value={movieData.movie_title}
          onChange={handleInputChange}
        />
        <label htmlFor="movie_content">감상 기록</label>
        <textarea
          id="movie_content"
          name="movie_content"
          placeholder="감상 기록"
          value={movieData.movie_content}
          onChange={handleInputChange}
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="popcal-buttons">
          <button onClick={handleDelete}>삭제하기</button>
          <button onClick={handleSave}>저장하기</button>
        </div>
      </div>
    </div>
  );
};

export default Popcal;
