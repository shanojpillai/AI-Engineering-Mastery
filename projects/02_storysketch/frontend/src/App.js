import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import StoryLibraryPage from './pages/StoryLibraryPage';
import StoryViewPage from './pages/StoryViewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Import components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import StoryWizard from './components/StoryWizard/StoryWizard';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes with layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="stories" element={<StoryLibraryPage />} />
                  <Route path="stories/create" element={<StoryWizard />} />
                  <Route path="stories/:storyId" element={<StoryViewPage />} />
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Auth routes without layout */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
