import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../context/firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Event Handler
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Common className for all NavLinks
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-white text-black px-2 py-1 rounded' // Active: white background, black text
      : 'text-white hover:bg-gray-700 hover:text-white px-2 py-1 rounded'; // Inactive: white text, hover effect

  return (
    <nav className="bg-transparent text-white p-4 flex items-center justify-between">
      {/* Left Section: Logo and Menu */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <NavLink to="/" end>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
            alt="NASA Logo"
            className="h-12 w-12"
          />
        </NavLink>

        {/* Hamburger Menu Button (Visible on Small Screens) */}
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

        {/* Navigation Links */}
        <ul
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-black bg-opacity-50 md:bg-transparent p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-4 z-10`}
        >
          <li>
            <NavLink
              to="/"
              end // Exact match for home
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/archive/${year}/${month}`}
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Archive
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mars_weather"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Mars
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/neo"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Neo
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/NasaAgent"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              SKAI
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right Section: Auth Buttons */}
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
    </nav>
  );
};

export default Navbar;