import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContainer from './MainContainer';
import LoginSignup from './LoginSignup';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Initial state is login
  const [userProfile, setUserProfile] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <>
          <Sidebar onLogout={handleLogout} />
          <MainContainer />
        </>
      ) : (
        <LoginSignup
          isLogin={isLogin} // Pass the isLogin state
          setIsLogin={setIsLogin} // Pass the setIsLogin function
          setIsLoggedIn={setIsLoggedIn} // Pass the setIsLoggedIn function
        />
      )}
    </div>
  );
};

export default App;