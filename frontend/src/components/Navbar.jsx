import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../context/firebase';

const Navbar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNeoDropdownOpen, setIsNeoDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const neoDropdownRef = useRef(null);

  const neoViews = [
    { id: 'timeline', label: 'Asteroid Timeline', path: '/neo/timeline' },
    { id: 'map', label: 'Asteroids Map', path: '/neo/map' },
    { id: 'scatter', label: 'Asteroids Plot', path: '/neo/scatter' },
    { id: 'stats', label: 'Asteroids Stats', path: '/neo/stats' },
    { id: 'historic', label: 'Asteroid Approaches', path: '/neo/historic' },
    { id: 'dashboard', label: 'Asteroid Explorer', path: '/neo/dashboard' },
  ];

  const toggleNeoDropdown = () => {
    setIsNeoDropdownOpen(!isNeoDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (neoDropdownRef.current && !neoDropdownRef.current.contains(event.target)) {
        setIsNeoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black text-white px-4 py-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-white no-underline">
          NASA
        </NavLink>

        {/* Hamburger Button */}
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
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent z-50`}>
          <ul className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 md:p-0">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/archive/${year}/${month}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                Archive
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mars_weather"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                Mars Weather
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                Search
              </NavLink>
            </li>
            <li className="relative" ref={neoDropdownRef}>
              <button
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                  isNeoDropdownOpen || neoViews.some(view => window.location.pathname === view.path)
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-gray-700'
                }`}
                onClick={toggleNeoDropdown}
                aria-haspopup="true"
                aria-expanded={isNeoDropdownOpen}
              >
                Neo
              </button>
              {isNeoDropdownOpen && (
                <ul className="md:absolute md:top-full md:left-0 mt-2 w-full md:w-64 bg-black bg-opacity-90 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto py-2 space-y-1">
                  {neoViews.map((view) => (
                    <li key={view.id}>
                      <NavLink
                        to={view.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                            isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                          }`
                        }
                        onClick={() => {
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
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-150 ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-700'
                  }`
                }
              >
                SKAI
              </NavLink>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-2 p-4 md:p-0">
            {!user ? (
              <>
                <Link to="/login">
                  <button className="w-full md:w-auto px-3 py-2 text-sm border border-white rounded-md text-white hover:bg-white hover:text-black transition-all duration-150">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full md:w-auto px-3 py-2 text-sm border border-white rounded-md text-white hover:bg-white hover:text-black transition-all duration-150">
                    SignUp
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full md:w-auto px-3 py-2 text-sm border border-white rounded-md text-white hover:bg-white hover:text-black transition-all duration-150"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;