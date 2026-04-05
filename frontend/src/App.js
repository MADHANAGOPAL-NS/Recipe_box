import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateRecipe from './pages/CreateRecipe';
import FeedPage from './pages/FeedPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideSidebar = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className={`app-container ${hideSidebar ? 'no-sidebar' : ''}`}>
      {!hideSidebar && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
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