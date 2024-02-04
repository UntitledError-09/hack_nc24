import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { IconButton } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

const videos = [
  'https://www.youtube.com/embed/HsZnJs9I2wY?autoplay=1&loop=1&playlist=HsZnJs9I2wY',
  'https://www.youtube.com/embed/ilLy-GtlDas?autoplay=1&loop=1&playlist=ilLy-GtlDas',
  'https://www.youtube.com/embed/wYNwSUblUSA?autoplay=1&loop=1&playlist=wYNwSUblUSA',
  'https://www.youtube.com/embed/NA4jbh7NScQ?autoplay=1&loop=1&playlist=NA4jbh7NScQ',
  'https://www.youtube.com/embed/mLuqTIYapks?autoplay=1&loop=1&playlist=mLuqTIYapks',
];

const MainContainer = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [visitedPersons, setVisitedPersons] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [personsData, setPersonsData] = useState([]);

  const cardRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usernameInSession = sessionStorage.getItem('username');
        const response = await fetch(`http://127.0.0.1:5000/get-recommendations/${usernameInSession}`);
        const data = await response.json();
        // Append YouTube video to each person's data
        const personsDataWithVideos = data.similar_users.map((person, index) => ({
          ...person,
          videoUrl: videos[index % videos.length], // Use modulo operator to cycle through the videos array
        }));
        // Filter out the user with the username stored in the session
        setPersonsData(personsDataWithVideos.filter(person => person.username !== usernameInSession));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSwipe = (direction) => {
    const nextIndex = currentCardIndex + direction;
    if (nextIndex >= 0 && nextIndex < personsData.length) {
      setCurrentCardIndex(nextIndex);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleNotInterested();
      } else if (event.key === 'ArrowRight') {
        handleInterested();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visitedPersons, handleSwipe]);

  const handleInterested = () => {
    if (currentCardIndex === personsData.length - 1) {
      // Last card reached, no more persons to show
      alert('No more persons to show.');
      return;
    }
    setVisitedPersons([...visitedPersons, personsData[currentCardIndex]]);
    handleSwipe(1); // Move to the next card
    setSwipeDirection('swipe-right');
    setTimeout(() => {
      setSwipeDirection(null);
    }, 100);
  };

  const handleNotInterested = () => {
    if (currentCardIndex === personsData.length - 1) {
      // Last card reached, no more persons to show
      alert('No more persons to show.');
      return;
    }
    handleSwipe(1); // Move to the next card
    setSwipeDirection('swipe-left');
    setTimeout(() => {
      setSwipeDirection(null);
    }, 100);
  };

  return (
    <div className="main-container" style={{ position: 'relative', minHeight: '100vh' }}>
      {personsData.length > 0 ? (
        <Card data={personsData[currentCardIndex]} swipeDirection={swipeDirection} />
      ) : (
        <div className="dummy-card">
          <h2>No more persons to show.</h2>
        </div>
      )}
      <div style={{ position: 'absolute', top: '5vh', left: '50%', transform: 'translateX(-50%)', zIndex: '999' }}>
        <IconButton onClick={handleNotInterested}>
          <ThumbDown fontSize="large" />
        </IconButton>
        <IconButton onClick={handleInterested}>
          <ThumbUp fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};

export default MainContainer;