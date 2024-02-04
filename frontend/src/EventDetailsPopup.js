import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EventDetailsPopup = ({ open, onClose, event }) => {
  if (!event) {
    return null; // Return null if event is null or undefined
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Event Details
        <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">{event.name}</Typography>
        <Typography>Location: {event.location}</Typography>
        <Typography>{event.details}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsPopup;