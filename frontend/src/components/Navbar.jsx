import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../context/firebase';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNeoDropdownOpen, setIsNeoDropdownOpen] = useState(false);

  const neoViews = [
    { id: 'timeline', label: 'Asteroid Timeline', path: '/neo/timeline' },
    { id: 'map', label: 'Asteroids Map', path: '/neo/map' },
    { id: 'scatter', label: 'Asteroids Plot', path: '/neo/scatter' },
    { id: 'stats', label: 'Asteroids Stats', path: '/neo/stats' },
    { id: 'historic', label: 'Asteroid Approaches', path: '/neo/historic' },
    { id: 'dashboard', label: 'Asteroid Explorer', path: '/neo/dashboard' },
  ];

  const toggleMenu = () => {
    console.log('Toggling Menu, Current State:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
    setIsNeoDropdownOpen(false);
  };

  const toggleNeoDropdown = () => {
    console.log('Toggling Neo Dropdown, Current State:', isNeoDropdownOpen);
    setIsNeoDropdownOpen(!isNeoDropdownOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-white text-black px-2 py-1 rounded'
      : 'text-white hover:bg-gray-700 hover:text-white px-2 rounded';

  const neoLinkClass = ({ isActive }) =>
    isActive
      ? 'bg-indigo-800 text-white px-3 py-2 rounded-md'
      : 'text-white hover:bg-indigo-500 px-3 py-2 rounded-md';

  return (
    <nav className="bg-black bg-opacity-50 text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center space-x-4">
        <NavLink to="/" end>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
            alt="NASA Logo"
            className="h-12 w-12"
          />
        </NavLink>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        <ul
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-black bg-opacity-80 md:bg-transparent p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-4 z-20`}
        >
          <li>
            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={() => {
                setIsMenuOpen(false);
                setIsNeoDropdownOpen(false);
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/archive/${year}/${month}`}
              className={linkClass}
              onClick={() => {
                setIsMenuOpen(false);
                setIsNeoDropdownOpen(false);
              }}
            >
              Archive
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={linkClass}
              onClick={() => {
                setIsMenuOpen(false);
                setIsNeoDropdownOpen(false);
              }}
            >
              Favorites
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mars_weather"
              className={linkClass}
              onClick={() => {
                setIsMenuOpen(false);
                setIsNeoDropdownOpen(false);
              }}
            >
              Mars
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={linkClass}
              onClick={() => {
                setIsMenuOpen(false);
                setIsNeoDropdownOpen(false);
              }}
            >
              Search
            </NavLink>
          </li>
          <li className="relative">
            <button
              className={linkClass({ isActive: isNeoDropdownOpen || neoViews.some(view => window.location.pathname === view.path) })}
              onClick={toggleNeoDropdown}
              aria-haspopup="true"
              aria-expanded={isNeoDropdownOpen}
            >
              Neo
            </button>
            {isNeoDropdownOpen && (
              <ul className="absolute top-full left-0 mt-2 w-full sm:w-48 md:w-64 bg-black bg-opacity-90 text-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto py-2 space-y-1">
                {neoViews.map((view) => (
                  <li key={view.id}>
                    <NavLink
                      to={view.path}
                      className={neoLinkClass}
                      onClick={() => {
                        console.log(`Navigating to: ${view.path}`);
                        setIsNeoDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      {view.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/NasaAgent"
              className={linkClass}
              onClick={() => {
                setIsMenuOpen(false);
                setIsNeoDropdownOpen(false);
              }}
            >
              SKAI
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-2">
        {!user ? (
          <>
            <Link to="/login">
              <button className="px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-black transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-black transition">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm border border-white rounded hover:bg-white hover:text-black transition"
          >
            Logout
          </button>
        )}
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => {
            setIsMenuOpen(false);
            setIsNeoDropdownOpen(false);
          }}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;