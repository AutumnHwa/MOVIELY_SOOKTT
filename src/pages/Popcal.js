import React, { useState, useEffect } from 'react';
import '../css/Popcal.css';

const Popcal = ({ isOpen, onClose, onSave, onDelete, initialData, userId, selectedDate }) => {
  const [movieData, setMovieData] = useState({
    watch_date: '',
    movie_title: '',
    movie_content: '',
    created_at: '',
    created_by: userId || ''
  });

  // 선택된 이벤트(initialData)가 있으면 팝업에 기존 데이터를 로드하고,
  // 없으면 새로운 이벤트 데이터를 생성하기 위해 빈 값으로 설정
  useEffect(() => {
    if (initialData) {
      // 기존 이벤트가 있는 경우, 이를 상태에 설정하여 팝업에 보여줌
      setMovieData({
        watch_date: initialData.start ? new Date(initialData.start).toISOString().split('T')[0] : '',
        movie_title: initialData.title || '',
        movie_content: initialData.movie_content || '', // 기존 데이터에서 감상 기록을 가져옴
        created_at: initialData.created_at || '',
        created_by: initialData.created_by || userId
      });
    } else {
      // 새로운 이벤트를 추가하는 경우, 선택된 날짜를 기본으로 설정
      setMovieData(prevData => ({
        ...prevData,
        watch_date: selectedDate || ''
      }));
    }
  }, [initialData, selectedDate, userId]);

  // 입력 필드 값이 변경되면 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prevData => ({ ...prevData, [name]: value }));
  };

  // 영화 데이터를 캘린더에 추가하는 함수 (저장 기능)
  const addCalendarEvent = async () => {
    if (!movieData.movie_title) {
      alert('영화 제목을 입력해주세요.');
      return;
    }

    const eventDetails = {
      id: initialData ? initialData.id : Date.now().toString(), // 새로운 이벤트는 ID를 생성
      title: movieData.movie_title,
      start: new Date(movieData.watch_date).toISOString(), // 날짜를 ISO 형식으로 저장
      allDay: true,
      extendedProps: {
        movie_content: movieData.movie_content, // 감상 기록 포함
        created_at: movieData.created_at || new Date().toISOString(),
        created_by: movieData.created_by
      }
    };

    const calendarEvent = {
      calendar_id: eventDetails.id,
      user_id: userId,
      watch_date: eventDetails.start,
      movie_title: eventDetails.title,
      movie_content: eventDetails.extendedProps.movie_content, // 감상 기록 서버에 전송
      created_at: eventDetails.extendedProps.created_at,
      created_by: eventDetails.extendedProps.created_by
    };

    try {
      // 서버에 POST 요청을 보내 이벤트 저장
      const response = await fetch('https://moviely.duckdns.org/mypage/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calendarEvent)
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to save movie data:', responseText);
        throw new Error('Failed to save movie data');
      }

      // 저장 후 부모 컴포넌트에서 이벤트 목록을 갱신하도록 콜백 호출
      onSave(eventDetails);
      onClose(); // 팝업 닫기
    } catch (error) {
      console.error('Error:', error);
      alert('영화 데이터를 저장하는 중 오류가 발생했습니다.');
    }
  };

  // 이벤트 삭제를 처리하는 함수
  const handleDelete = async () => {
    if (initialData && initialData.id) {
      try {
        // 삭제 요청을 부모 컴포넌트에 전달하고 이벤트를 삭제
        await onDelete(initialData.id);
        onClose(); // 팝업 닫기
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('이벤트를 삭제하는 중 오류가 발생했습니다.');
      }
    }
  };

  // 팝업이 열려 있지 않으면 컴포넌트를 렌더링하지 않음
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
          onChange={handleInputChange} // 관람 일자를 변경할 때 상태 업데이트
        />
        <label htmlFor="movie_title">영화 제목</label>
        <input
          id="movie_title"
          type="text"
          name="movie_title"
          placeholder="영화 제목"
          value={movieData.movie_title}
          onChange={handleInputChange} // 영화 제목 변경 시 상태 업데이트
        />
        <label htmlFor="movie_content">감상 기록</label>
        <textarea
          id="movie_content"
          name="movie_content"
          placeholder="감상 기록"
          value={movieData.movie_content} // 감상 기록을 입력할 수 있게 변경
          onChange={handleInputChange}
        />
        <div className="popcal-buttons">
          <button onClick={handleDelete}>삭제하기</button> {/* 삭제 버튼 */}
          <button onClick={addCalendarEvent}>저장하기</button> {/* 저장 버튼 */}
        </div>
      </div>
    </div>
  );
};

export default Popcal;
