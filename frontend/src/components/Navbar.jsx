import React from 'react';
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

  return (
    <nav className="bg-transparent text-white p-4 flex items-center justify-between">
      <div className="container mx-auto flex items-center space-x-4">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg"
            alt="NASA Logo"
            className="h-12 w-12"
          />
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="block py-2 hover:underline">Home</Link>
          </li>
          <li>
            <Link to={`/archive/${year}/${month}`} className="block py-2 hover:underline">Archive</Link>
          </li>
          <li>
            <Link to="/favorites" className="block py-2 hover:underline">Favorites</Link>
          </li>
          <li>
            <Link to="/mars_weather" className="block py-2 hover:underline">Mars</Link>
          </li>
          <li>
            <Link to="/search" className="block py-2 hover:underline">Search</Link>
          </li>
          <li>
            <Link to="/neo" className="block py-2 hover:underline">Neo</Link>
          </li>
          <li>
            <Link to="/NasaAgent" className="block py-2 hover:underline">SKAI</Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-2">
        {!user ? (
          <>
            <Link to="/login">
              <button className="block py-2 px-3 text-sm border border-white rounded hover:bg-white hover:text-black transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="block py-2 px-3 text-sm border border-white rounded hover:bg-white hover:text-black transition">
                SignUp
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="block py-2 px-3  text-sm border border-white rounded hover:bg-white hover:text-black transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
