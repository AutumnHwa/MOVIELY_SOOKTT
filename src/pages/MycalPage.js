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

function MycalPage() {
  const { user } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = user.id;

      try {
        const response = await fetch('https://moviely.duckdns.org/mypage/calendar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.error('Failed to fetch events:', responseText);
          throw new Error('Failed to fetch events');
        }

        const responseData = await response.json();
        console.log('Full responseData:', responseData); // 서버에서 받은 원본 데이터를 출력

        const fetchedEvents = responseData.filter(event => event.user_id === userId);

        fetchedEvents.forEach(event => {
          console.log('Processing event:', event);  // 개별 이벤트 로그
          console.log('calendar_id:', event.calendar_id);  // calendar_id가 존재하는지 확인
        });

        const eventsData = fetchedEvents.map(event => ({
          id: event.calendar_id,  // calendar_id를 id로 사용
          title: event.movie_title,
          start: new Date(event.watch_date).toISOString(), // 날짜를 ISO 형식으로 변환
          allDay: true,
          extendedProps: {
            movie_content: event.movie_content
          }
        }));

        console.log('Processed eventsData:', eventsData); // 처리된 이벤트 데이터를 출력
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error); // 이벤트 가져오기 실패 시 오류 로그
      }
    };

    fetchEvents();
  }, [user]);

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
    console.log('Event object:', event); // event 객체 전체를 출력하여 확인

    if (!event || !event.id) {
      console.error('Event ID is undefined. Skipping fetch request.');
      return;
    }

    try {
      const url = `https://moviely.duckdns.org/mypage/calendar/${event.id}`;
      console.log(`Request URL: ${url}`); // URL을 출력하여 확인

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to fetch event:', responseText);
        throw new Error('Failed to fetch event');
      }

      const responseData = await response.json();
      console.log('Fetched event data:', responseData); // 개별 이벤트 데이터 로그
      setSelectedDate(responseData.watch_date);
      setSelectedEvent({
        id: responseData.calendar_id,
        title: responseData.movie_title,
        start: new Date(responseData.watch_date).toISOString(),
        movie_content: responseData.movie_content
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error fetching event details:', error); // 이벤트 가져오기 실패 시 오류 로그
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const id = Number(eventId);

    if (!id) {
      alert('삭제할 이벤트가 없습니다.');
      return;
    }

    try {
      const response = await fetch(`https://moviely.duckdns.org/mypage/calendar/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to delete event:', responseText);
        throw new Error('Failed to delete event');
      }

      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
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
