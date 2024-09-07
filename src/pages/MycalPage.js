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

  // 이벤트를 가져오는 함수 (기존 fetchEvents 함수)
  // 이벤트 저장/삭제 후에도 재실행되도록 하여 상태를 갱신
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
      const fetchedEvents = responseData.filter(event => event.user_id === userId);

      const eventsData = fetchedEvents.map(event => ({
        id: event.calendar_id,
        title: event.movie_title,
        start: new Date(event.watch_date).toISOString(),
        allDay: true,
        extendedProps: {
          movie_content: event.movie_content,
          created_at: event.created_at,
          created_by: event.created_by,
        }
      }));

      setEvents(eventsData); // 상태에 이벤트 데이터 저장
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // 페이지가 처음 로드될 때 이벤트 목록을 불러오는 useEffect
  useEffect(() => {
    fetchEvents(); // 컴포넌트 마운트 시 이벤트 데이터를 불러옴
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // 달력에서 날짜를 클릭했을 때 팝업을 열기 위한 함수
  const handleDateClick = ({ dateStr }) => {
    setSelectedDate(dateStr); // 클릭한 날짜를 상태로 저장
    setSelectedEvent(null); // 새 이벤트이므로 선택된 이벤트는 없음
    setIsPopupOpen(true); // 팝업 열기
  };

  // '영화 관람 기록하기' 버튼을 클릭했을 때 실행되는 함수
  const handleRecordButtonClick = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]); // 오늘 날짜로 기본값 설정
    setSelectedEvent(null); // 새 이벤트이므로 선택된 이벤트는 없음
    setIsPopupOpen(true); // 팝업 열기
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // 팝업 닫기
  };

  // 영화 데이터를 저장했을 때 호출되는 함수
  // 기존 상태를 업데이트하고, 새로고침 없이 이벤트 목록을 갱신
  const handleSaveMovieData = async (eventDetails) => {
    const updatedEvents = selectedEvent
      ? events.map(event => (event.id === selectedEvent.id ? eventDetails : event))
      : [...events, eventDetails];

    setEvents(updatedEvents); // 상태에 이벤트 추가 또는 수정
    setIsPopupOpen(false); // 팝업 닫기
    await fetchEvents(); // 저장 후 이벤트 목록을 다시 불러와 갱신 (새로고침 없이 반영)
  };

  // 달력에서 이벤트를 클릭했을 때 이벤트 세부 정보를 가져오고 팝업을 여는 함수
  const handleEventClick = async ({ event }) => {
    if (!event || !event.id) {
      console.error('Event ID is undefined. Skipping fetch request.');
      return;
    }

    try {
      const response = await fetch(`https://moviely.duckdns.org/mypage/calendar/${event.id}`, {
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
      setSelectedDate(responseData.watch_date); // 선택한 이벤트의 날짜 저장
      setSelectedEvent({
        id: responseData.calendar_id,
        title: responseData.movie_title,
        start: new Date(responseData.watch_date).toISOString(),
        movie_content: responseData.movie_content,
        created_at: responseData.created_at,
        created_by: responseData.created_by,
      });
      setIsPopupOpen(true); // 팝업 열기
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  // 이벤트를 삭제할 때 호출되는 함수
  // 삭제 후 상태를 즉시 업데이트하고 새로고침 없이 삭제 반영
  const handleDeleteEvent = async (eventId) => {
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
      setEvents(updatedEvents); // 상태에서 삭제된 이벤트 제거
      setIsPopupOpen(false); // 팝업 닫기
      await fetchEvents(); // 삭제 후 이벤트 목록을 다시 불러와 갱신
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('이벤트를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  // 유저 정보가 없을 경우 로딩 상태를 표시
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
          <FontAwesomeIcon icon={faSearch} size="2x" className="wish-searchIcon" />
        </Link>
        <button className="wish-sidebar-toggle" onClick={toggleSidebar}>☰</button>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div className={`overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar} />
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
          key={events.length} // 이벤트가 업데이트될 때마다 달력을 재렌더링하도록 설정
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick} // 날짜 클릭 시 호출
          eventClick={handleEventClick} // 이벤트 클릭 시 호출
          events={events} // 상태에 저장된 이벤트 목록
          height="470px"
        />
      </div>
      {isPopupOpen && (
        <Popcal
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveMovieData} // 저장 시 호출
          onDelete={handleDeleteEvent} // 삭제 시 호출
          initialData={selectedEvent} // 선택된 이벤트의 데이터를 팝업에 전달
          userId={user.id}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default MycalPage;
