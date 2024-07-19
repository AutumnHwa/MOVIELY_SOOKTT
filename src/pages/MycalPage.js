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
      try {
        const response = await fetch(`https://moviely.duckdns.org/mypage/calendar/${user.id}`, {
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
        const fetchedEvents = responseData.map(event => ({
          id: event.id,
          title: event.movie_title,
          start: event.watch_date,
          allDay: true,
          extendedProps: {
            movie_content: event.movie_content
          }
        }));

        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEvents();
  }, [user.id]);

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

  const handleEventClick = ({ event }) => {
    setSelectedDate(event.startStr);
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      movie_content: event.extendedProps.movie_content
    });
    setIsPopupOpen(true);
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
          'Content-Type': 'application/json'
        }
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

  return (
    <div className="mycalPage">
      <header className="pageHeader">
        <Link to="/">
          <img src={logoImage} alt="Logo" className="myPageLogo" />
        </Link>
        <Link to="/movie-search" className="searchIconContainer">
          <FontAwesomeIcon
            icon={faSearch}
            size="2x"
            className="my-searchIcon"
          />
        </Link>
        <button className="my-sidebar-toggle" onClick={toggleSidebar}>
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
