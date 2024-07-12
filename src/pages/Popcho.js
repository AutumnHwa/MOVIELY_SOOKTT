import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../css/Popcho.css';

function Popcho({ onClose, onSave }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSaveClick = () => {
    onSave(selectedOption);
  };

  return ReactDOM.createPortal(
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="modalHeader">마이페이지에 저장하기</div>
        <div className="radioGroup">
          <div className="radioOption">
            <input
              type="radio"
              id="option1"
              name="options"
              value="option1"
              checked={selectedOption === 'option1'}
              onChange={handleOptionChange}
            />
            <label htmlFor="option1" className="radioLabel">보고싶은 영화</label>
          </div>
          <div className="radioOption">
            <input
              type="radio"
              id="option2"
              name="options"
              value="option2"
              checked={selectedOption === 'option2'}
              onChange={handleOptionChange}
            />
            <label htmlFor="option2" className="radioLabel">이미 본 영화</label>
          </div>
        </div>
        <div className="modalButtons">
          <button onClick={onClose} className="closeButton">닫기</button>
          <button onClick={handleSaveClick} className="saveButton">저장</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Popcho;
