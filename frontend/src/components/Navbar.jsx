import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  return (
    <nav className="bg-transparent text-white p-4 flex items-center justify-between">
        {/* Left side - NASA Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
              alt="NASA Logo"
              className="h-12 w-12"
            />
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to={`/archive/${year}/${month}`} className="hover:underline">Archive</Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:underline">Favorites</Link>
            </li>
            <li>
              <Link to="/mars_weather" className="hover:underline">Mars</Link>
            </li>
            <li>
              <Link to="/search" className="hover:underline">Search</Link>
            </li>
            <li>
              <Link to="/neo" className="hover:underline">Neo</Link>
            </li>
          </ul>
        </div>

        {/* Right side - Profile Icon */}
        <div>
          <img
            src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg" // replace with actual profile image if you have
            alt="Profile"
            className="h-10 w-10 rounded-full cursor-pointer"
          />
        </div>
      </nav>
  );
};

export default Navbar;
