import React from 'react';
import authService from '../../services/authService';
import './Header.css';

const Header = () => {
  const user = authService.getCurrentUser();

  return (
    <header className="main-header">
      <div className="header-brand">
        <h1 className="logo">RecipeBox</h1>
        <nav className="header-nav">
          <a href="/feed" className="active">Feed</a>
          <a href="/discover">Discover</a>
        </nav>
      </div>

      <div className="header-tools">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search recipes..." />
        </div>
        <div className="header-actions">
          <button className="icon-btn profile-btn">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="header-avatar" />
            ) : (
              <img src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=d67e2c&color=fff`} alt="Profile" className="header-avatar" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
