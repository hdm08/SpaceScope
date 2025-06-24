import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../context/firebase"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Event Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto bg-transparent  p-6 rounded-lg shadow-md">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
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

          <div className="text-right text-sm">
            <a href="#" className="text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-transparent text-white border border-white p-3 rounded hover:bg-blue-700 hover:text-white transition"
          >
            Login
          </button>
        </form>

        <p className="text-white text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
};

export default Login;