import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import HomePage from "./pages/HomePage"; // Example protected route
import AdminDashboard from "./pages/Admin";
import { PrivateAdminRoute, PrivateRoute } from "./config/privateRoutes";
import { SocketProvider } from "./config/SocketContext";

function App() {
  return (
    <SocketProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
        <Route
          path="/admin"
          element={<PrivateAdminRoute element={<AdminDashboard />} />}
        />
      </Routes>
    </Router>
    </SocketProvider>
  );
}

export default App;
