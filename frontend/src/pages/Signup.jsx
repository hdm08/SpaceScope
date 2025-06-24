import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../context/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Event Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! You will be redirected to the login page.");
      navigate("/login");
    } catch (error) {
      alert("Signup error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="bg-transparent p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Sign Up</h2>

        <form className="space-y-4" onSubmit={handleSignup} >
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-white text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-transparent text-white border p-3 rounded hover:bg-blue-700  hover:text-white  transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-white text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
};

export default Signup;