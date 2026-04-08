import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuItems = [
    { name: 'Feed', icon: '🏠', path: '/feed' },
    { name: 'Discover', icon: '🧭', path: '/discover' },
    { name: 'My Recipes', icon: '📖', path: '/my-recipes' },
    { name: 'Create', icon: '➕', path: '/create' },
  ];

  const handleDeleteAccount = async () => {
    try {
      if (user && user.token) {
        await authService.deleteAccount(user.token);
        setShowDeleteConfirm(false);
        navigate('/register');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Could not delete account. Please try again.');
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>

      <div className="sidebar-profile">
        <div className="profile-info">
          <h4>{isCollapsed ? (user?.username?.charAt(0) || 'R') : (user?.username || 'RecipeBox')}</h4>
          {!isCollapsed && <p>Digital Alchemist</p>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            title={item.name}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-text">{item.name}</span>}
          </NavLink>
        ))}

        <button 
          className={`nav-item ${isSettingsOpen ? 'active' : ''}`}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          title="Settings"
        >
          <span className="nav-icon">⚙️</span>
          {!isCollapsed && <span className="nav-text">Settings</span>}
        </button>

        {isSettingsOpen && !isCollapsed && (
          <div className="settings-panel">
            <div className="settings-section">
              <h5>ACCOUNT</h5>
              <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </nav>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you absolutely sure?</h3>
            <p>This will permanently delete your curated cookbooks and experiments. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleDeleteAccount}>Yes, Delete My Kitchen</button>
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        <button className="btn btn-premium">
          {isCollapsed ? '⭐' : 'Go Premium'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
