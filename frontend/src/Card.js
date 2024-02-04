import React from 'react';
import './Card.css';

const Card = ({ data, swipeDirection }) => {
  const cardClasses = `card ${swipeDirection}`;
  const interests = data?.interests || [];
  const age = data?.age || 'Unknown';
  const location = data?.strengths || 'Unknown'; // Assuming "strengths" represent location

  return (
    <div className={cardClasses} style={{ backgroundColor: data.color }}>
      <div className="video-container">
        <iframe
          width="100%"
          height="100%"
          src={data.videoUrl}
          title="YouTube video player"
          allowfullscreen
          frameBorder="0"
        ></iframe>
      </div>
      <div className="text-content">
        <h2>{data.username}</h2>
        <div className="details">
          <div className="detail-item">
            <strong>Age:</strong> {age}
          </div>
          <div className="detail-item">
            <strong>Location:</strong> {location}
          </div>
        </div>
        <div className="interests">
          <h3>Interests:</h3>
          <div className="interests-list">
            {interests.map((interest, index) => (
              <div key={index} className="interest-item">
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;