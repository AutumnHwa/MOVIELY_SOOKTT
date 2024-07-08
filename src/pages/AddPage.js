import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/AddPage.css';
import logoImage from '../logo.png';

function AddPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const handleAddInfo = async (e) => {
    e.preventDefault();

    if (!age) {
      alert("나이를 입력해주세요.");
      return;
    }

    const addInfoData = {
      gender: gender,
      age: parseInt(age, 10) || 0
    };

    console.log("Add Info Data: ", JSON.stringify(addInfoData));

    try {
      const response = await fetch('https://moviely.duckdns.org/update-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addInfoData),
      });

      if (response.ok) {
        navigate('/movie-select');
      } else {
        const errorData = await response.json();
        console.error('정보 입력 실패:', errorData);
        alert('정보 입력 실패: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버와의 연결에 문제가 발생했습니다.');
    }
  };

  const ageOptions = [];
  for (let i = 15; i <= 100; i++) {
    ageOptions.push(<option key={i} value={i}>{i}</option>);
  }

  return (
    <div className="addPage">
      <Link to="/" className="add-logo">
        <img src={logoImage} alt="Logo" />
      </Link>
      <div className="addBox">
        <h2>추가 정보 입력</h2>
        <p>보다 정확한 맞춤 영화 추천 서비스를 위해<br />나이와 성별을 입력해주세요.</p>
        <form onSubmit={handleAddInfo}>
          <div className="inputGroup">
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              className="genderSelect"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>성별을 선택해주세요</option>
              <option value="female">여성</option>
              <option value="male">남성</option>
            </select>
          </div>
          <div className="inputGroup">
            <label htmlFor="age">나이</label>
            <select
              id="age"
              name="age"
              className="ageSelect"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            >
              <option value="" disabled>나이를 선택해주세요</option>
              {ageOptions}
            </select>
          </div>
          <button type="submit" className="addButton">입력하기</button>
        </form>
      </div>
    </div>
  );
}

export default AddPage;
