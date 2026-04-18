import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateRecipe from './pages/CreateRecipe';
import FeedPage from './pages/FeedPage';
import DiscoverPage from './pages/DiscoverPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CookbookPage from './pages/CookbookPage';
import PlannerPage from './pages/PlannerPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const location = useLocation();
  const hideSidebar = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname) || location.pathname.startsWith('/reset-password');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`app-container ${hideSidebar ? 'no-sidebar' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {!hideSidebar && <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/cookbook" element={<CookbookPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;