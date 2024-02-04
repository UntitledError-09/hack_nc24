import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Button, Autocomplete, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './ProfilePopup.css';

const interestsList = [
  'Art', 'Music', 'Sports', 'Travel', 'Reading', 'Cooking', 'Fitness', 'Photography', 'Movies', 'Fashion',
  'Technology', 'Gaming', 'Writing', 'Dancing', 'Nature', 'History', 'Science', 'Food', 'Health', 'Education',
  'Animals', 'Crafts', 'Shopping', 'Cars', 'Politics', 'Finance'
];

const ProfilePopup = ({ open, onClose, onSave }) => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    age: 0,
    strengths: [''],
    interests: []
  });

  useEffect(() => {
    // Fetch user data from the API and filter to find the logged-in user
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-all-users');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        const sessionUsername = sessionStorage.getItem('username');
        const userData = data.users.find(user => user.username === sessionUsername);
        setUserProfile(userData || {});
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData(); // Call the fetchUserData function when the component mounts
  }, []); 

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/update-user/${userProfile.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userProfile)
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      onSave(userProfile);
      onClose();
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    window.location.reload(); // Refresh the page
  };

  return (
    <Dialog open={open} onClose={onClose} className="profile-popup">
      <DialogTitle className="profile-popup__title">
        Edit Profile
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="profile-popup__content">
        <TextField label="Display Name" value={userProfile?.username} fullWidth disabled className="profile-popup__input" />
        <TextField label="Age" type='number' value={userProfile?.age} onChange={(e) => setUserProfile(prevProfile => ({ ...prevProfile, age: e.target.value }))} fullWidth className="profile-popup__input" />
        <TextField label="Location" value={userProfile?.strengths?.[0]} onChange={(e) => setUserProfile(prevProfile => ({ ...prevProfile, strengths: [e.target.value] }))} fullWidth className="profile-popup__input" />
        <Autocomplete
          multiple
          options={interestsList}
          value={userProfile.interests}
          onChange={(event, newValue) => setUserProfile(prevProfile => ({ ...prevProfile, interests: newValue }))}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Interests"
              placeholder="Select Interests"
              className="profile-popup__input"
              fullWidth
            />
          )}
        />
        <div className="profile-popup__actions">
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            style={{
              padding: '8px 16px', // Adjust padding as needed
              marginLeft: '5px',
              backgroundColor: 'grey', // Change color to grey
              color: 'white', // Change text color to white
              border: 'none', // Remove border
              borderRadius: '4px', // Add border radius
              cursor: 'pointer', // Change cursor to pointer on hover
            }}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePopup;