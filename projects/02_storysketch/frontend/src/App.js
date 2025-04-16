import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import StoryCreationPage from './pages/StoryCreationPage';
import StoryLibraryPage from './pages/StoryLibraryPage';
import StoryViewPage from './pages/StoryViewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Import components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="stories" element={<ProtectedRoute />}>
            <Route index element={<StoryLibraryPage />} />
            <Route path="create" element={<StoryCreationPage />} />
            <Route path=":storyId" element={<StoryViewPage />} />
          </Route>
          
          <Route path="profile" element={<ProtectedRoute />}>
            <Route index element={<ProfilePage />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
