// 필요한 모듈과 컴포넌트를 가져옵니다.
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Popcal from './Popcal';
import Sidebar from '../components/Sidebar';
import '../css/MycalPage.css';
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';

// MycalPage 컴포넌트를 정의합니다.
function MycalPage() {
  // useAuth 훅을 사용하여 사용자 정보를 가져옵니다.
  const { user } = useAuth();

  // useState 훅을 사용하여 상태를 정의합니다.
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 창 열림 여부
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트
  const [events, setEvents] = useState([]); // 이벤트 목록
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 열림 여부
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 내비게이션 기능을 가져옵니다.

  // 컴포넌트가 마운트될 때 이벤트를 가져오는 함수입니다.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`https://moviely.duckdns.org/mypage/calendar?userId=${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.error('Failed to fetch events:', responseText);
          throw new Error('Failed to fetch events');
        }

        const responseData = await response.json();
        console.log('responseData:', responseData);

        // 서버에서 반환된 이벤트 데이터를 처리합니다.
        const fetchedEvents = Array.isArray(responseData) ? responseData : [responseData];
        const eventsData = fetchedEvents.map((event) => {
          const watchDate = event.watchDate; // watchDate로 수정
          if (!watchDate) {
            console.error('Invalid or missing date:', watchDate);
            return null; // 날짜가 없거나 유효하지 않은 경우 null 반환
          }

          const dateObject = new Date(watchDate);
          if (isNaN(dateObject.getTime())) {
            console.error('Invalid date format:', watchDate);
            return null; // 잘못된 날짜 포맷인 경우 null 반환
          }

          return {
            id: event.calendarId, // calendarId로 수정
            title: event.movieTitle, // movieTitle로 수정
            start: dateObject.toISOString(), // ISO 형식으로 변환
            allDay: true,
            extendedProps: {
              movie_content: event.movieContent, // movieContent로 수정
            },
          };
        }).filter(event => event !== null); // null 값 제거

        setEvents(eventsData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEvents();
  }, [user.id]); // user.id가 변경될 때마다 이벤트를 다시 불러옵니다.

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleDateClick = ({ dateStr }) => {
    setSelectedDate(dateStr);
    setSelectedEvent(null);
    setIsPopupOpen(true);
  };

  const handleRecordButtonClick = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedEvent(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveMovieData = (eventDetails) => {
    if (!eventDetails.title) {
      alert('영화 제목을 입력해주세요.');
      return;
    }

    const updatedEvents = selectedEvent
      ? events.map(event => event.id === selectedEvent.id ? eventDetails : event)
      : [...events, eventDetails];

    setEvents(updatedEvents);
    setIsPopupOpen(false);
  };

  const handleEventClick = async ({ event }) => {
    try {
      const response = await fetch(`https://moviely.duckdns.org/mypage/calendar/${event.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to fetch event:', responseText);
        throw new Error('Failed to fetch event');
      }

      const responseData = await response.json();
      setSelectedDate(responseData.watchDate); // watchDate로 수정
      setSelectedEvent({
        id: responseData.calendarId, // calendarId로 수정
        title: responseData.movieTitle, // movieTitle로 수정
        start: new Date(responseData.watchDate).toISOString(), // watchDate로 수정
        movie_content: responseData.movieContent, // movieContent로 수정
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      alert('삭제할 이벤트가 없습니다.');
      return;
    }

    try {
      const response = await fetch(`https://moviely.duckdns.org/mypage/calendar/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to delete event:', responseText);
        throw new Error('Failed to delete event');
      }

      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('이벤트를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mycalPage">
      <header className="pageHeader">
        <Link to="/recommendations">
          <img src={logoImage} alt="Logo" className="myPageLogo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="wish-searchIcon"
          />
        </Link>
        <button className="wish-sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div
          className={`overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={closeSidebar}
        />
      </header>
      <div className="myPageTitle">마이페이지</div>
      <div className="navButtons">
        <Link to="/my/watched" className="navButton">이미 본 영화</Link>
        <Link to="/my/wishlist" className="navButton">보고싶은 영화</Link>
        <Link to="/my/calendar" className="navButton active">MOVIELY 캘린더</Link>
      </div>
      <button onClick={handleRecordButtonClick} className="recordButton">
        영화 관람 기록하기
      </button>
      <div className="calendar-container">
        <FullCalendar
          key={events.length}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          height="470px"
        />
      </div>
      {isPopupOpen && (
        <Popcal
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveMovieData}
          onDelete={handleDeleteEvent}
          initialData={selectedEvent}
          userId={user.id}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default MycalPage;
