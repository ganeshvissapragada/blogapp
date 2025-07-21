import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import BlogList from './components/BlogList';
import Auth from './components/Auth';
import InstallPrompt from './components/InstallPrompt';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Update document title and meta tags
    const updateMeta = () => {
      const titles: Record<string, string> = {
        home: 'BlogSphere - Dark Glass PWA',
        blogs: 'Blogs - BlogSphere',
        login: 'Login - BlogSphere'
      };
      
      document.title = titles[currentPage] || 'BlogSphere';
      
      // Update theme color for PWA
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#6366f1');
      }
    };

    updateMeta();
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'blogs':
        return <BlogList />;
      case 'login':
        return <Auth onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <BlogProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
          {renderCurrentPage()}
          <InstallPrompt />
        </div>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;