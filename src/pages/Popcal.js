import React, { useState, useEffect } from 'react';
import '../css/Popcal.css';

const Popcal = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [movieData, setMovieData] = useState({
    watch_date: '',
    movie_title: '',
    movie_content: '',
    user_id: '',
    created: '',
    created_by: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setMovieData({
        watch_date: initialData.start || '',
        movie_title: initialData.title || '',
        movie_content: initialData.movie_content || '',
        user_id: initialData.user_id || '',
        created: initialData.created || '',
        created_by: initialData.created_by || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(movieData);  // 영화 데이터를 onSave 콜백을 통해 저장
    onClose();  // 저장 후 팝업 닫기
  };

  const handleDelete = () => {
    if (initialData && initialData.id) {
      onDelete(initialData.id);  // 삭제할 이벤트 ID 전달
      onClose();  // 삭제 후 팝업 닫기
    } else {
      setErrorMessage('삭제할 이벤트가 없습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popcal-container">
      <div className="popcal">
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
