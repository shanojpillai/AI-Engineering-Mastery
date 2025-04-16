import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <span className="logo-text">StorySketch</span>
              </Link>
            </div>
            
            <nav className="main-nav">
              <ul className="nav-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link to="/stories">My Stories</Link>
                    </li>
                    <li>
                      <Link to="/stories/create">Create Story</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/about">About</Link>
                </li>
              </ul>
            </nav>
            
            <div className="auth-actions">
              {isAuthenticated ? (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                  </div>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <Link to="/stories" className="dropdown-item">
                      My Stories
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">StorySketch</span>
              <p className="footer-tagline">
                Creating engaging social stories for K-12 learners
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-section">
                <h3>Product</h3>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>Resources</h3>
                <ul>
                  <li><Link to="/docs">Documentation</Link></li>
                  <li><Link to="/examples">Example Stories</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h3>Legal</h3>
                <ul>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} StorySketch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
