import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSocket } from "../config/SocketContext";



const AdminDashboard = ({playerId}) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    count: 0,
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const socket = useSocket();

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.sort((a, b) => b.clickCount - a.clickCount));
      console.log(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on('userUpdated', ({users}) => {
        setUsers(users.sort((a, b) => b.clickCount - a.clickCount));
    });

    return () => {
        socket.off('userUpdated');
    };
}, [socket]);

  
  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.password) {
      try {
        // Make POST request to backend API to add the new user
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newUser), // Convert user data to JSON
          }
        );

        if (response.ok) {
          const data = await response.json(); // Parse the JSON response
          alert("User added successfully!");
          fetchUsers()
          setNewUser({ name: "", email: "", password: "" });
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || "Failed to add user. Please try again."
          );
        }
      } catch (err) {
        console.error("Error adding user:", err);
        setError("Failed to add user. Please try again.");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      count: user.count,
      password: "",
    });
  };

  const handleUpdateUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        // Make PUT request to update user data
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${editingUser._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newUser),
          }
        );

        if (response.ok) {
          const data = await response.json();
          fetchUsers();
          alert("User updated successfully!");
          setEditingUser(null); // Reset editing state
          setNewUser({ name: "", email: "", count: 0, password: "" }); // Reset the form
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || "Failed to update user. Please try again."
          );
        }
      } catch (err) {
        console.error("Error updating user:", err);
        setError("Failed to update user. Please try again.");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
            fetchUsers();
          alert("User deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(`Failed to delete user: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("An error occurred while deleting the user.");
      }
    }
  };

  const handleToggleBlockUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/block`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        fetchUsers();
      } else {
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
      alert("An error occurred while toggling the user block status.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border rounded p-2 mr-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border rounded p-2 mr-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border rounded p-2 mr-2"
          />
          <button
            onClick={editingUser ? handleUpdateUser : handleAddUser}
            className="bg-blue-500 text-white rounded p-2"
          >
            {editingUser ? "Update User" : "Add User"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-center">Name</th>
              <th className="py-3 px-4 text-center">Email</th>
              <th className="py-3 px-4 text-center">Click Count</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-center">{user.name}</td>
                <td className="py-3 px-4 text-center">{user.email}</td>
                <td className="py-3 px-4 text-center">{user.clickCount}</td>
                <td className="py-3 px-4 text-center flex justify-between">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white rounded px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleBlockUser(user._id)}
                    className={`${
                      user.isBlocked ? "bg-green-500" : "bg-red-500"
                    } text-white rounded px-2 py-1 mr-2`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white rounded px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
