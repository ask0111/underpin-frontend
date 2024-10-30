import { useState } from "react";
import bcrypt from "bcryptjs";
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Cookies.set("token", data.token, { secure: true, sameSite: "strict" });
        setSuccess("Login successful!");
        setError("");
        window.location.href = "/";
      } else {
        setError(data.message || "Login failed. Please try again.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <p className="text-sm text-center text-gray-600">
          Not a member? <a href="/register" className="text-purple-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
