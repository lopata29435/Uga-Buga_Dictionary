import React from 'react';

const ProfileSection = ({ name, subtitle }) => {
  const imgSrc = `${import.meta.env.BASE_URL}profile.jpg`;
  return (
    <div className="profile-section">
      <img
        src={imgSrc}
        alt="Главный Вахтанг"
        className="profile-image"
      />
      <h2 className="profile-name">{name || "Главный Вахтанг"}</h2>
      {subtitle && <p className="profile-subtitle">{subtitle}</p>}
    </div>
  );
};

export default ProfileSection;
