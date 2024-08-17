// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LogSignPage from './pages/LogSignPage';
import AddPage from './pages/AddPage';
import MvchoPage from './pages/MvchoPage';
import RecomPage from './pages/RecomPage';
import MvdetailPage from './pages/MvdetailPage';
import MyalrPage from './pages/MyalrPage';
import MywishPage from './pages/MywishPage';
import MycalPage from './pages/MycalPage';
import MvsrchPage from './pages/MvsrchPage';
import PlatRecom from './pages/PlatRecom';
import AnniRecom from './pages/AnniRecom';
import Footer from './components/Footer';  // Footer 컴포넌트를 import
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '13094654813-nqglekemv1iff66rsq4luqftbfgv51hi.apps.googleusercontent.com';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/log-sign" element={<LogSignPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/movie-select" element={<MvchoPage />} />
              <Route path="/recommendations" element={<RecomPage />} />
              <Route path="/movie/:id" element={<MvdetailPage />} />
              <Route path="/my/watched" element={<MyalrPage />} />
              <Route path="/my/wishlist" element={<MywishPage />} />
              <Route path="/my/calendar" element={<MycalPage />} />
              <Route path="/movie-search" element={<MvsrchPage />} />
              <Route path="/platform-recommendations" element={<PlatRecom />} />
              <Route path="/anniversary-recommendations" element={<AnniRecom />} />
            </Routes>
            <Footer /> {/* Footer 컴포넌트를 추가 */}
          </div>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
