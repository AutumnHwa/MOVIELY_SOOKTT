// Cal.js
import React from "react";
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';

class Cal extends React.Component {
    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
    }

    // 다음 주로 이동하는 버튼의 이벤트 핸들러
    handleClickNextButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.next();
    };

    // 주 단위로 보기 변경하는 버튼의 이벤트 핸들러
    weekChangeButton = () => {
        const calendarInstance = this.calendarRef.current.getInstance();
        calendarInstance.changeView('week', true);
    }

    // 날짜 이름 클릭 이벤트 핸들러
    handleClickDayname = (ev) => {
        console.group('onClickDayname');
        console.log(ev.date);
        console.groupEnd();
    };

    // 스케줄 생성 전 이벤트 핸들러
    beforeCreateSchedule = (ev) => {
        console.group('onbeforeCreateSchedule');
        console.log(ev);
        console.groupEnd();
    }

    render() {
        const selectedView = 'month'; // 기본 보기 설정
        
        return (
            <>
                <button onClick={this.weekChangeButton}>주 보기</button>
                <Calendar
                    ref={this.calendarRef}
                    onClickDayname={this.handleClickDayname}
                    onBeforeCreateSchedule={this.beforeCreateSchedule}
                    height="900px"
                    calendars={[
                        // 여기에 캘린더 설정을 추가할 수 있습니다.
                    ]}
                    disableDblClick={true}
                    disableClick={false}
                    isReadOnly={false} // 읽기 전용 설정
                    schedules={[
                        // 여기에 스케줄 설정을 추가할 수 있습니다.
                    ]}
                    scheduleView // 스케줄 보기 활성화
                    taskView // 태스크 보기 활성화
                    template={{
                        // 여기에 템플릿 설정을 추가할 수 있습니다.
                    }}
                    theme='' // 테마 설정
                    timezones={[
                        // 여기에 타임존 설정을 추가할 수 있습니다.
                    ]}
                    useDetailPopup
                    useCreationPopup
                    view={selectedView} // 기본 보기 설정
                    week={{
                        daynames: ['일', '월', '화', '수', '목', '금', '토'],
                        showTimezoneCollapseButton: true,
                        timezonesCollapsed: true
                    }}
                    month={{
                        daynames: ['일', '월', '화', '수', '목', '금', '토']
                    }}
                />
                <button onClick={this.handleClickNextButton}>다음</button>
            </>
        );
    }
}

export default Cal;
