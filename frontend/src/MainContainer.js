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
        const response = await fetch(`/get-recommendations/${usernameInSession}`);
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

  // const handleInterested = async () => {
  //   if (currentCardIndex === personsData.length - 1) {
  //     // Last card reached, no more persons to show
  //     alert('No more persons to show.');
  //     return;
  //   }
  //   // Add the current user's username to the pending_invites of the user whose card is swiped right
  //   const currentUser = sessionStorage.getItem('username');
  //   const userData = JSON.parse(sessionStorage.getItem('userData'));
  //   const userToInvite = personsData[currentCardIndex].username;
  //   const updatedUserData = userData.map(user => {
  //     if (user.username === userToInvite) {
  //       return {
  //         ...user,
  //         pending_invites: [...user.pending_invites, currentUser]
  //       };
  //     }
  //     return user;
  //   });
  //   sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
  //   console.log(JSON.parse(sessionStorage.getItem('userData')));
    
  //   setVisitedPersons([...visitedPersons, personsData[currentCardIndex]]);
  //   handleSwipe(1); // Move to the next card
  //   setSwipeDirection('swipe-right');
  //   setTimeout(() => {
  //     setSwipeDirection(null);
  //   }, 100);
  // };

  const handleInterested = async () => {
    if (currentCardIndex === personsData.length - 1) {
      // Last card reached, no more persons to show
      alert('No more persons to show.');
      return;
    }
  
    const currentUser = sessionStorage.getItem('username');
    const userToInvite = personsData[currentCardIndex].username;
  
    // Add the current user to the pending_invites list of the user whose card is swiped right
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const updatedUserData = userData.map(user => {
      if (user.username === userToInvite) {
        user.pending_invites.push(currentUser);
      }
      return user;
    });
  
    // Update the entire user profile of the user whose card is swiped right
    const userProfileToUpdate = updatedUserData.find(user => user.username === userToInvite);
    try {
      await fetch(`/update-user/${userToInvite}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userProfileToUpdate)
      });
  
      // Move to the next card and set swipe direction
    setVisitedPersons([...visitedPersons, personsData[currentCardIndex]]);
    handleSwipe(1); // Move to the next card
    setSwipeDirection('swipe-right');
      setTimeout(() => {
        setSwipeDirection(null);
      }, 100);
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      return;
    }
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