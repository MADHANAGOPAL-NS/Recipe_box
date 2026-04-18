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
    { name: 'Cookbook', icon: '🔖', path: '/cookbook' },
    { name: 'Planner', icon: '📅', path: '/planner' },
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // On mobile, the sidebar is hidden unless isCollapsed is FALSE (we'll reverse the logic for mobile: false = hidden, true = open)
  // To keep it simple, we use a new state for mobile.
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 fixed top-0 left-0 w-full z-40 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            className="text-2xl text-gray-600 focus:outline-none"
            onClick={() => setIsMobileOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-xl font-black text-gray-900">
            Recipe<span className="text-[#d67e2c]">Box</span>
          </h1>
        </div>
        
        <button className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <img src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=d67e2c&color=fff`} alt="Profile" className="w-full h-full object-cover" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <button className="hamburger-btn hidden md:flex" onClick={toggleSidebar}>
            {isCollapsed ? '☰' : '✕'}
          </button>
          <button className="hamburger-btn md:hidden" onClick={() => setIsMobileOpen(false)}>
            ✕
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-info">
            <h4>{isCollapsed ? (user?.username?.charAt(0).toUpperCase() || 'R') : (user?.username || 'RecipeBox')}</h4>
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
              onClick={() => setIsMobileOpen(false)}
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

          <button
            className="nav-item mt-auto text-red-500"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="nav-icon">🚪</span>
            {!isCollapsed && <span className="nav-text text-red-500">Logout</span>}
          </button>
        </nav>

        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-box p-6 md:p-10 mx-4">
              <h3 className="text-xl md:text-2xl font-bold mb-4">Are you absolutely sure?</h3>
              <p className="text-sm md:text-base text-gray-500 mb-6">This will permanently delete your curated cookbooks and experiments. This action cannot be undone.</p>
              <div className="flex flex-col md:flex-row gap-4">
                <button className="confirm-btn flex-1 bg-red-500 text-white rounded-xl py-3 font-bold" onClick={handleDeleteAccount}>Yes, Delete My Kitchen</button>
                <button className="cancel-btn flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-bold" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}


      </aside>
    </>
  );
};

export default Sidebar;
