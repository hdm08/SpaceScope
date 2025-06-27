import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../context/firebase";
import { useNavigate } from "react-router-dom"; 

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
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-transparent text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Hamburger */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
              alt="NASA Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
          </Link>
          {/* Hamburger Button for Mobile */}
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
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:flex md:space-x-4 absolute md:static top-16 left-0 right-0 bg-transparent md:bg-transparent p-4 md:p-0 flex-col md:flex-row items-center md:items-stretch z-10`}
        >
          <li>
            <Link to="/" className="block py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to={`/archive/${year}/${month}`}
              className="block py-2 hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Archive
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="block py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>
              Favorites
            </Link>
          </li>
          <li>
            <Link to="/mars_weather" className="block py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>
              Mars
            </Link>
          </li>
          <li>
            <Link to="/search" className="block py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>
              Search
            </Link>
          </li>
          <li>
            <Link to="/neo" className="block py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>
              Neo
            </Link>
          </li>
          <li>
            <Link to="/NasaAgent" className="block py-2 hover:underline" onClick={() => setIsMenuOpen(false)}>
              SKAI
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
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
      </div>
    </nav>
  );
};

export default Navbar;