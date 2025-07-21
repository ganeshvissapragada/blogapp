import React from 'react';
import { Home, BookOpen, User, Download, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../hooks/usePWA';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { isInstallable, installApp, requestNotificationPermission } = usePWA();

  const handleInstallClick = async () => {
    await installApp();
    const granted = await requestNotificationPermission();
    if (granted) {
      console.log('Notifications enabled');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              BlogSphere
            </button>
            
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'home'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => onNavigate('blogs')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'blogs'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen size={18} />
                <span>Blogs</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-all duration-200 animate-pulse"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
            
            {user && (
              <button
                onClick={() => requestNotificationPermission()}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
                title="Enable Notifications"
              >
                <Bell size={18} />
              </button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('my-blogs')}
                  className="flex items-center space-x-2"
                >
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                    />
                  )}
                  <span className="text-white hidden sm:inline">{user.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                <User size={18} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;