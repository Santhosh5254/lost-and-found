import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Lost & Found Hub
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
            Home
          </Link>
          <Link
            to="/create-item"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Post an Item
          </Link>

          {user ? (
            <>
              {/* Link to Admin Dashboard if user is admin */}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  Admin
                </Link>
              )}
              <span className="text-gray-300 font-medium">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-200">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;