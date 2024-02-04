import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, List, ListItem, ListItemButton, ListItemText, Divider, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import './Sidebar.css'; // Import the CSS file for styling
import ChatDialog from './ChatDialog'; // Import the ChatDialog component
import EventDetailsPopup from './EventDetailsPopup'; // Import the EventDetailsPopup component
import ProfilePopup from './ProfilePopup'; // Import the ProfilePopup component

const Sidebar = () => {
  const [openChat, setOpenChat] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [openEventDetails, setOpenEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [selectedList, setSelectedList] = useState('invites'); // 'matches' or 'invites'

  useEffect(() => {
    // Fetch user data from the API and filter to find the logged-in user
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-all-users');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        const loggedInUser = data.users.find(user => user.username === sessionStorage.getItem('username'));
        if (loggedInUser) {
          setUserProfile(loggedInUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData(); // Call the fetchUserData function when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once
  console.log(userProfile)

  const people = selectedList === 'matches' ? userProfile?.matched_users || [] : userProfile?.pending_invites || [];
  const events = [
    { name: 'Emancipation Proclamation Day', location: 'United States', details: 'Commemorating the issuance of the Emancipation Proclamation by President Abraham Lincoln.' },
    { name: 'National Freedom Day', location: 'United States', details: 'Celebrating the signing of the 13th Amendment to the United States Constitution.' },
    { name: 'Black History Month Kickoff Event', location: 'Various Locations', details: 'Official launch event for Black History Month celebrations.' },
    { name: 'Civil Rights Act Anniversary', location: 'United States', details: 'Observing the anniversary of the Civil Rights Act of 1964.' },
    { name: 'Tuskegee Airmen Tribute Ceremony', location: 'Washington D.C.', details: 'Honoring the achievements of the Tuskegee Airmen during World War II.' },
    { name: 'Black History Week Lecture Series', location: 'Local Communities', details: 'Educational lectures on African American history and culture.' },
    { name: 'Harlem Renaissance Art Exhibition', location: 'New York City', details: 'Showcasing artwork from the Harlem Renaissance era.' },
    { name: 'Underground Railroad Tour', location: 'Various Locations', details: 'Guided tour of historical sites related to the Underground Railroad.' },
    { name: 'Civil Rights Movement Symposium', location: 'Atlanta, Georgia', details: 'Panel discussions and presentations on the Civil Rights Movement.' },
    { name: 'Juneteenth Celebration', location: 'United States', details: 'Commemorating the end of slavery in the United States.' }
  ];

  const handleChatOpen = (person) => {
    setSelectedPerson(person);
    setOpenChat(true);
  };

  const handleChatClose = () => {
    setOpenChat(false);
    setSelectedPerson(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenEventDetails(true);
  };

  const handleEventDetailsClose = () => {
    setOpenEventDetails(false);
    setSelectedEvent(null);
  };

  const handleSaveProfile = (newProfile) => {
    setUserProfile(newProfile);
  };

  return (
    <div className="sidebar">
      <div className="profile-buttons">
        <Button variant="contained" color="primary" onClick={() => setOpenProfilePopup(true)}>Profile</Button>
      </div>
      <Divider />
      <Card className="scrollable-card">
        <CardContent>
          <p>Friends</p>
          <div className="scrollable-content">
            <List>
              {people.map((person, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleChatOpen(person)}>
                    <ListItemText primary={person} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        </CardContent>
      </Card>
      <Card className="scrollable-card">
        <CardContent>
          <TextField
            placeholder="Search events..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="scrollable-content">
            <List>
              {events.map((event, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleEventClick(event)}>
                    <ListItemText primary={`${event.name} - ${event.location}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        </CardContent>
      </Card>
      <ChatDialog open={openChat} onClose={handleChatClose} person={selectedPerson} />
      <EventDetailsPopup open={openEventDetails} onClose={handleEventDetailsClose} event={selectedEvent} />
      <ProfilePopup open={openProfilePopup} onClose={() => setOpenProfilePopup(false)} onSave={handleSaveProfile} />
    </div>
  );
};

export default Sidebar;