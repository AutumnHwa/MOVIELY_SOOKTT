import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import '../css/LogSignPage.css';
import logoImage from '../logo.png';
import { useAuth } from '../context/AuthContext';

function LogSignPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    console.log("Google Login Success, credential:", credential);

    try {
      const res = await fetch('https://moviely.duckdns.org/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });
      const data = await res.json();

      console.log("Backend response data:", data);

      if (data.jwtToken) {
        login(data.jwtToken, data.user);
        if (data.isNewUser) {
          navigate('/add');
        } else {
          navigate('/movie-select');
        }
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Backend redirection failed:', error);
      alert('백엔드 처리에 실패했습니다.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Login Failed:', error);
    alert('Google 로그인에 실패했습니다.');
  };

  return (
    <div className="logSignPage">
      <Link to="/" className="logSign-logo">
        <img src={logoImage} alt="Logo" />
      </Link>
      <div className="logSignBox">
        <h2>로그인 및 회원가입</h2>
        <p>소셜 로그인 및 회원가입으로<br />MOVIELY의 모든 서비스를 이용하실 수 있습니다.</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div>
    </div>
  );
}

export default LogSignPage;